// Função serverless da Vercel. Fica em /api/, então a Vercel publica
// automaticamente em https://seu-dominio.vercel.app/api/analisar-redacao
//
// Configuração necessária na Vercel (Project Settings > Environment Variables):
//   OPENAI_API_KEY = sua chave, criada em https://platform.openai.com/api-keys

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "método não permitido" });
    return;
  }

  const { tema, texto } = req.body || {};

  if (!texto || texto.trim().split(/\s+/).filter(Boolean).length < 80) {
    res.status(400).json({ error: "texto muito curto para análise" });
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
    const apiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
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
