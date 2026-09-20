# Diagnóstico Completo — Modo Enem

Arquivos que precisam ficar **juntos, na mesma estrutura de pastas**:

```
enem-simulado-adaptativo/
├── index.html          → estrutura da página
├── styles.css          → toda a identidade visual
├── script.js           → toda a lógica (simulado, redação, boletim)
├── perguntas.json      → banco de questões (3 variações por pergunta)
└── api/
    └── analisar-redacao.js   → função serverless que chama a IA (opcional)
```

## Ativando a correção por IA (opcional, mas recomendado)

Sem configurar nada, a página já funciona sozinha usando um corretor por regras (conectivos,
estrutura, proposta de intervenção). Pra ligar a correção por IA de verdade:

1. Crie uma conta em https://console.anthropic.com e gere uma chave de API
2. Suba o projeto na Vercel (ver seção abaixo)
3. No painel do projeto na Vercel, vá em **Settings → Environment Variables**
4. Adicione uma variável: nome `ANTHROPIC_API_KEY`, valor = sua chave
5. Faça um novo deploy (a Vercel pede isso depois de adicionar uma variável nova)

A partir daí, toda redação enviada passa pela IA automaticamente. Se a chave não estiver
configurada, der erro, ou a Anthropic estiver fora do ar por algum motivo, a página cai
sozinha no corretor por regras — nunca quebra pro cliente.

**Custo estimado:** usando o modelo `claude-haiku-4-5` (o mais barato), cada redação
corrigida custa na faixa de R$0,02 a R$0,05 — tranquilamente coberto pelo seu ticket de
R$20-30.

## Como subir na Vercel (3 formas)

**Opção mais rápida — arrastar e soltar:**
1. Acesse https://vercel.com/new
2. Arraste a pasta inteira `enem-simulado-adaptativo` (os dois arquivos precisam ir juntos) para a área de upload
3. Clique em Deploy

**Via GitHub:**
1. Suba a pasta com os dois arquivos para um repositório novo
2. Em vercel.com/new, escolha "Import Git Repository"
3. Não precisa configurar build command nem output directory

**Via linha de comando:**
```
npm i -g vercel
cd enem-simulado-adaptativo
vercel
```

## Como funciona a análise da redação
É baseada em **regras/critérios do Enem**, rodando 100% no navegador (sem IA generativa, sem servidor):
- **C1** — conta marcas de informalidade (gírias, abreviações)
- **C2** — procura indícios de repertório (datas, %, referências, nomes próprios)
- **C3** — avalia o número de parágrafos (ideal: 4-5)
- **C4** — conta conectivos usados (portanto, além disso, etc.)
- **C5** — verifica se a conclusão tem os 4 elementos da proposta de intervenção (agente, ação, meio, finalidade)

Na copy de vendas, é mais honesto dizer "análise pelos critérios oficiais do Enem" do que "correção por IA".

## Editar ou expandir as perguntas
Abra `perguntas.json`. Cada pergunta tem uma chave (ex: `LC_Q1`) com uma lista de
variações — pode adicionar quantas quiser, o código sorteia uma aleatoriamente.
Cada variação precisa ter `text`, `options` (4 alternativas) e `correct` (índice
da resposta certa, começando em 0).

A lógica de ramificação (qual pergunta vem depois de acertar/errar) fica no
`index.html`, dentro do objeto `NODE_META` — não precisa mexer nisso pra só
adicionar perguntas novas.

## Se o perguntas.json não carregar
O `index.html` tem um banco de segurança embutido (`FALLBACK_BANK`) com 1
pergunta por nó — a página nunca quebra completamente, mesmo se o arquivo
externo falhar ao carregar.
