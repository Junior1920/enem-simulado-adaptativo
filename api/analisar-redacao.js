// Função serverless da Vercel. Fica em /api/, então a Vercel publica
// automaticamente em https://seu-dominio.vercel.app/api/analisar-redacao
//
// Configuração necessária na Vercel (Project Settings > Environment Variables):
//   OPENAI_API_KEY = sua chave, criada em https://platform.openai.com/api-keys
//   UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN = criadas ao conectar um
//   banco Upstash Redis na aba "Storage" do projeto na Vercel (usado só para
//   limitar quantas vezes o mesmo IP pode chamar essa função por hora).

const LIMITE_POR_HORA = 5;

async function checarLimite(ip) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  // Se o Redis não estiver configurado ainda, não bloqueia ninguém —
  // só não há proteção de limite até você configurar (ver README).
  if (!url || !token) {
    console.warn("Upstash Redis não configurado — rate limiting desativado.");
    return { limitado: false };
  }

  try {
    const chave = `ratelimit:analisar-redacao:${ip}`;
    const incrResp = await fetch(`${url}/incr/${encodeURIComponent(chave)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const incrData = await incrResp.json();
    const contagem = incrData.result;

    if (contagem === 1) {
      // primeira chamada dessa janela: define expiração de 1 hora
      await fetch(`${url}/expire/${encodeURIComponent(chave)}/3600`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    return { limitado: contagem > LIMITE_POR_HORA };
  } catch (e) {
    // Se o Redis falhar por qualquer motivo, não travamos o produto —
    // preferimos deixar passar a derrubar a experiência de quem pagou.
    console.warn("Falha ao checar rate limit, seguindo sem bloqueio:", e);
    return { limitado: false };
  }
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "método não permitido" });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket?.remoteAddress || "desconhecido";
  const { limitado } = await checarLimite(ip);
  if (limitado) {
    res.status(429).json({ error: "muitas tentativas — tente novamente em algumas horas" });
    return;
  }

  const { tema, texto } = req.body || {};

  if (!texto || typeof texto !== "string") {
    res.status(400).json({ error: "texto inválido" });
    return;
  }

  const nPalavras = texto.trim().split(/\s+/).filter(Boolean).length;

  if (nPalavras < 80) {
    res.status(400).json({ error: "texto muito curto para análise" });
    return;
  }

  // Limite máximo: uma redação real do Enem tem ~30 linhas (~500-600 palavras).
  // Qualquer coisa muito acima disso provavelmente é abuso, não uma redação de verdade.
  if (nPalavras > 1200 || texto.length > 8000) {
    res.status(400).json({ error: "texto muito longo para análise" });
    return;
  }

  if (tema && (typeof tema !== "string" || tema.length > 300)) {
    res.status(400).json({ error: "tema inválido" });
    return;
  }

  const prompt = `Você é um corretor de redações do Enem, especialista nas 5 competências oficiais.

Tema da redação: ${tema && tema.trim() ? tema.trim() : "(não informado)"}

Texto da redação:
"""
${texto.trim()}
"""

Avalie o texto nas 5 competências oficiais do Enem (cada uma de 0 a 200 pontos):
C1 - Domínio da modalidade escrita formal da língua portuguesa
C2 - Compreensão do tema e uso de repertório sociocultural produtivo
C3 - Organização e progressão coerente das ideias (argumentação)
C4 - Domínio dos mecanismos linguísticos de coesão
C5 - Proposta de intervenção que respeite os direitos humanos, contendo agente, ação, meio/modo e finalidade

Responda APENAS com um JSON válido, exatamente neste formato:
{"c1":numero,"c2":numero,"c3":numero,"c4":numero,"c5":numero,"remarks":{"c1":"1 frase de feedback específico e prático","c2":"1 frase","c3":"1 frase","c4":"1 frase","c5":"1 frase"}}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s

    const apiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        max_tokens: 700,
        response_format: { type: "json_object" },
        messages: [{ role: "user", content: prompt }],
      }),
    });
    clearTimeout(timeoutId);

    if (!apiResp.ok) {
      const errText = await apiResp.text();
      throw new Error("Erro da API OpenAI: " + errText);
    }

    const data = await apiResp.json();
    const rawText = data.choices?.[0]?.message?.content || "";
    const parsed = JSON.parse(rawText);

    const total = parsed.c1 + parsed.c2 + parsed.c3 + parsed.c4 + parsed.c5;
    res.status(200).json({ ...parsed, total, fonte: "ia" });
  } catch (err) {
    console.error("Falha na análise por IA:", err);
    res.status(500).json({ error: "falha ao gerar análise por IA" });
  }
};
