/* ============================================================
   Modo Enem — Diagnóstico Completo — lógica da aplicação
   ============================================================ */

/* ================= META DA ÁRVORE ADAPTATIVA (sem o texto das perguntas) ================= */
const NODE_META = {
  LC: {
    name: "Linguagens",
    start: "LC_Q1",
    nodes: {
      LC_Q1:  { tier:"medio",   next:{correct:"LC_Q2A", wrong:"LC_Q2B"} },
      LC_Q2A: { tier:"dificil", next:{correct:"LC_Q3A", wrong:"LC_Q3B"} },
      LC_Q2B: { tier:"facil",   next:{correct:"LC_Q3C", wrong:"LC_Q3D"} },
      LC_Q3A: { tier:"dificil", terminal:true },
      LC_Q3B: { tier:"medio",   terminal:true },
      LC_Q3C: { tier:"medio",   terminal:true },
      LC_Q3D: { tier:"facil",   terminal:true }
    }
  },
  MT: {
    name: "Matemática",
    start: "MT_Q1",
    nodes: {
      MT_Q1:  { tier:"medio",   next:{correct:"MT_Q2A", wrong:"MT_Q2B"} },
      MT_Q2A: { tier:"dificil", next:{correct:"MT_Q3A", wrong:"MT_Q3B"} },
      MT_Q2B: { tier:"facil",   next:{correct:"MT_Q3C", wrong:"MT_Q3D"} },
      MT_Q3A: { tier:"dificil", terminal:true },
      MT_Q3B: { tier:"medio",   terminal:true },
      MT_Q3C: { tier:"medio",   terminal:true },
      MT_Q3D: { tier:"facil",   terminal:true }
    }
  },
  CH: {
    name: "Ciências Humanas",
    start: "CH_Q1",
    nodes: {
      CH_Q1:  { tier:"medio",   next:{correct:"CH_Q2A", wrong:"CH_Q2B"} },
      CH_Q2A: { tier:"dificil", next:{correct:"CH_Q3A", wrong:"CH_Q3B"} },
      CH_Q2B: { tier:"facil",   next:{correct:"CH_Q3C", wrong:"CH_Q3D"} },
      CH_Q3A: { tier:"dificil", terminal:true },
      CH_Q3B: { tier:"medio",   terminal:true },
      CH_Q3C: { tier:"medio",   terminal:true },
      CH_Q3D: { tier:"facil",   terminal:true }
    }
  },
  CN: {
    name: "Ciências da Natureza",
    start: "CN_Q1",
    nodes: {
      CN_Q1:  { tier:"medio",   next:{correct:"CN_Q2A", wrong:"CN_Q2B"} },
      CN_Q2A: { tier:"dificil", next:{correct:"CN_Q3A", wrong:"CN_Q3B"} },
      CN_Q2B: { tier:"facil",   next:{correct:"CN_Q3C", wrong:"CN_Q3D"} },
      CN_Q3A: { tier:"dificil", terminal:true },
      CN_Q3B: { tier:"medio",   terminal:true },
      CN_Q3C: { tier:"medio",   terminal:true },
      CN_Q3D: { tier:"facil",   terminal:true }
    }
  }
};

/* Banco de segurança: usado só se perguntas.json não carregar por algum motivo */
const FALLBACK_BANK = {
  LC: {
    LC_Q1:[{text:"Em uma charge, um personagem observa um rio poluído e diz: \"Que sorte a nossa, água encanada de graça.\" O efeito de humor da fala decorre de:",options:["uma comparação direta entre dois rios distintos","uma ironia entre o discurso de sorte e a realidade da poluição","o uso de uma gíria regional pouco conhecida","uma citação literal de um provérbio popular"],correct:1}],
    LC_Q2A:[{text:"Um artigo de opinião defende que \"a linguagem não apenas descreve o mundo, mas também o constrói\". Essa afirmação se relaciona mais diretamente com a ideia de que:",options:["as palavras têm poder performativo, capaz de moldar percepções sociais","todo texto escrito é necessariamente mais confiável que a fala","a gramática normativa deve ser seguida sem exceções","a linguagem literária é superior à linguagem cotidiana"],correct:0}],
    LC_Q2B:[{text:"Na frase \"Ele chegou atrasado, mas ninguém notou\", a palavra \"mas\" estabelece uma relação de:",options:["adição","oposição","causa","tempo"],correct:1}],
    LC_Q3A:[{text:"Em uma resenha crítica, o autor escreve: \"o filme não convence, embora tente\". Essa construção concessiva serve para:",options:["reforçar sem ressalvas a opinião positiva do autor","reconhecer um esforço da obra e, ainda assim, manter uma avaliação negativa","negar qualquer intenção do diretor do filme","comparar o filme a outra obra do mesmo gênero"],correct:1}],
    LC_Q3B:[{text:"Em um texto publicitário, a frase \"Beba com moderação. Ou não beba nada\" usa como recurso principal:",options:["a rima","a gradação de sentido","a aliteração","a metáfora"],correct:1}],
    LC_Q3C:[{text:"A frase \"Se estudar, passa\" está na ordem direta. Reescrita como \"Passa, se estudar\", o sentido lógico da condição:",options:["muda completamente","permanece o mesmo","vira uma afirmação absoluta","deixa de ser uma condição"],correct:1}],
    LC_Q3D:[{text:"Na frase \"O livro, que estava na estante, caiu\", a oração entre vírgulas serve para:",options:["negar uma informação","acrescentar uma informação sobre o livro","fazer uma pergunta","expressar uma ordem"],correct:1}]
  },
  MT: {
    MT_Q1:[{text:"Uma loja aumenta um produto de R$ 80 em 15% e, no mês seguinte, dá um desconto de 15% sobre o novo preço. O preço final é:",options:["igual a R$ 80","maior que R$ 80","menor que R$ 80","impossível calcular sem mais dados"],correct:2}],
    MT_Q2A:[{text:"Uma urna tem 4 bolas vermelhas e 6 azuis. Retirando duas bolas sem reposição, a probabilidade de as duas serem vermelhas é:",options:["4/15","2/15","6/25","1/5"],correct:1}],
    MT_Q2B:[{text:"Se 3 operários fazem um muro em 8 dias, mantendo a mesma produtividade, 6 operários fariam o mesmo muro em:",options:["16 dias","4 dias","8 dias","2 dias"],correct:1}],
    MT_Q3A:[{text:"O gráfico de uma função f(x) = ax² + bx + c tem concavidade para baixo e duas raízes reais distintas. Pode-se concluir que:",options:["a > 0 e o discriminante é negativo","a < 0 e o discriminante é positivo","a < 0 e o discriminante é zero","a = 0 e a função não é quadrática"],correct:1}],
    MT_Q3B:[{text:"Em uma progressão aritmética, o 1º termo é 5 e a razão é 3. O 10º termo vale:",options:["32","35","30","38"],correct:0}],
    MT_Q3C:[{text:"Uma caixa d'água de 1000 litros está com 40% de sua capacidade. Quantos litros faltam para enchê-la?",options:["400 litros","600 litros","560 litros","500 litros"],correct:1}],
    MT_Q3D:[{text:"Metade de um número somado a 10 é igual a 20. Esse número é:",options:["10","15","20","30"],correct:2}]
  },
  CH: {
    CH_Q1:[{text:"Um geógrafo afirma que \"a cidade contemporânea segrega no espaço aquilo que a sociedade já segrega socialmente\". Essa frase sugere que a organização urbana:",options:["é resultado apenas de decisões técnicas de engenharia, sem relação com desigualdades sociais","reflete e reforça desigualdades sociais já existentes","elimina progressivamente as diferenças entre classes sociais","depende exclusivamente do relevo natural da região"],correct:1}],
    CH_Q2A:[{text:"Um sociólogo descreve que, em sociedades de consumo, \"compra-se não apenas o produto, mas o significado social que ele carrega\". Essa ideia dialoga com o conceito de:",options:["valor de uso exclusivamente material dos bens","valor simbólico atribuído às mercadorias pela sociedade","ausência total de influência cultural no consumo","igualdade de acesso a bens de consumo em qualquer classe social"],correct:1}],
    CH_Q2B:[{text:"O conjunto de regras que organiza a vida em sociedade e é imposto pelo Estado é conhecido como:",options:["cultura","direito","economia","religião"],correct:1}],
    CH_Q3A:[{text:"Um cientista social descreve que \"a globalização aproxima mercados, mas nem sempre aproxima culturas da mesma forma\". Essa afirmação sugere que a globalização:",options:["ocorre de forma homogênea em todas as dimensões da vida social","pode gerar integração econômica sem integração cultural equivalente","elimina completamente as identidades culturais locais","afeta apenas países de economia menos desenvolvida"],correct:1}],
    CH_Q3B:[{text:"O modelo econômico em que o Estado controla a maior parte dos meios de produção é chamado de:",options:["liberalismo","socialismo de Estado","livre mercado puro","economia informal"],correct:1}],
    CH_Q3C:[{text:"A diferença entre \"Estado\" e \"governo\" é que:",options:["são sinônimos e não há diferença","o Estado é permanente e o governo muda periodicamente","o governo é permanente e o Estado muda periodicamente","o Estado só existe em monarquias"],correct:1}],
    CH_Q3D:[{text:"O documento que reúne as principais leis de um país e organiza seu funcionamento político é a:",options:["Constituição","Declaração de renda","Ata notarial","Certidão pública"],correct:0}]
  },
  CN: {
    CN_Q1:[{text:"Durante a fotossíntese, uma planta consome CO2 e libera O2; durante a respiração celular, ela consome O2 e libera CO2. Isso mostra que, numa planta:",options:["apenas um dos dois processos ocorre por vez, nunca simultaneamente","os dois processos podem ocorrer ao mesmo tempo, com trocas gasosas em direções opostas","a respiração celular só ocorre à noite, exclusivamente","a fotossíntese elimina totalmente a necessidade de respiração celular"],correct:1}],
    CN_Q2A:[{text:"Em um cruzamento entre um indivíduo homozigoto dominante (AA) e um homozigoto recessivo (aa), toda a geração F1 será:",options:["homozigota recessiva (aa)","heterozigota (Aa)","homozigota dominante (AA)","uma mistura aleatória de genótipos"],correct:1}],
    CN_Q2B:[{text:"O gás liberado pelas plantas durante a fotossíntese, essencial para a respiração da maioria dos seres vivos, é o:",options:["gás carbônico","oxigênio","nitrogênio","hidrogênio"],correct:1}],
    CN_Q3A:[{text:"Populações de insetos resistentes a um inseticida se tornam mais comuns após gerações de uso do produto. Esse fenômeno é mais bem explicado pelo conceito de:",options:["mutação espontânea que ocorre igualmente em todos os indivíduos após a exposição","seleção natural, favorecendo indivíduos que já possuíam a característica de resistência","ausência de qualquer mudança genética na população","transmissão de características adquiridas durante a vida do inseto"],correct:1}],
    CN_Q3B:[{text:"O processo pelo qual as células obtêm energia a partir da quebra de moléculas de glicose, consumindo oxigênio, é chamado de:",options:["fotossíntese","respiração celular","fermentação alcoólica","osmose"],correct:1}],
    CN_Q3C:[{text:"A camada de gases que envolve a Terra e permite a respiração dos seres vivos é chamada de:",options:["hidrosfera","atmosfera","litosfera","estratosfera exclusivamente"],correct:1}],
    CN_Q3D:[{text:"O órgão do corpo humano responsável por bombear o sangue é o:",options:["pulmão","coração","fígado","rim"],correct:1}]
  }
};

const LEVELS = {
  dificil_correct: {label:"Avançado", range:[700,860], pct:82, tip:"Reforce interpretação de textos mais densos (artigos de opinião, textos filosóficos) — é onde as questões difíceis tendem a cobrar mais."},
  dificil_wrong:   {label:"Bom",      range:[600,700], pct:66, tip:"Você já domina o básico de Linguagens — foque em questões que pedem inferência, não só leitura literal."},
  medio_correct:   {label:"Bom",      range:[600,700], pct:66, tip:"Você já domina o básico de Linguagens — foque em questões que pedem inferência, não só leitura literal."},
  medio_wrong:     {label:"Regular",  range:[500,600], pct:52, tip:"Revise conectivos e relações lógicas entre frases (oposição, causa, condição) — várias questões de Linguagens dependem disso."},
  facil_correct:   {label:"Regular",  range:[500,600], pct:52, tip:"Revise conectivos e relações lógicas entre frases (oposição, causa, condição) — várias questões de Linguagens dependem disso."},
  facil_wrong:     {label:"Em desenvolvimento", range:[380,500], pct:36, tip:"Volte ao básico de interpretação: identifique separadamente o que o texto diz e o que ele sugere, antes de responder."}
};
const LEVELS_MT = {
  dificil_correct: {...LEVELS.dificil_correct, tip:"Você já vai bem em Matemática — treine questões que combinam mais de um conceito na mesma pergunta."},
  dificil_wrong:   {...LEVELS.dificil_wrong, tip:"Foque em probabilidade e funções — são os tópicos que mais aparecem nas questões de nível mais alto."},
  medio_correct:   {...LEVELS.medio_correct, tip:"Foque em probabilidade e funções — são os tópicos que mais aparecem nas questões de nível mais alto."},
  medio_wrong:     {...LEVELS.medio_wrong, tip:"Revise regra de três e porcentagem com calma — é a base de boa parte das questões de Matemática do Enem."},
  facil_correct:   {...LEVELS.facil_correct, tip:"Revise regra de três e porcentagem com calma — é a base de boa parte das questões de Matemática do Enem."},
  facil_wrong:     {...LEVELS.facil_wrong, tip:"Comece pelo básico: porcentagem e proporção. Sem essa base, o resto fica mais difícil de acompanhar."}
};
const LEVELS_CH = {
  dificil_correct: {...LEVELS.dificil_correct, tip:"Você já vai bem em Ciências Humanas — treine questões que cruzam conceitos de sociologia, filosofia e história no mesmo enunciado."},
  dificil_wrong:   {...LEVELS.dificil_wrong, tip:"Revise conceitos-chave de sociologia e filosofia (cidadania, ideologia, relativismo cultural) — aparecem bastante nas questões mais conceituais."},
  medio_correct:   {...LEVELS.medio_correct, tip:"Revise conceitos-chave de sociologia e filosofia (cidadania, ideologia, relativismo cultural) — aparecem bastante nas questões mais conceituais."},
  medio_wrong:     {...LEVELS.medio_wrong, tip:"Reforce conceitos básicos de política e economia (Estado, governo, globalização) antes de avançar pros temas mais abstratos."},
  facil_correct:   {...LEVELS.facil_correct, tip:"Reforce conceitos básicos de política e economia (Estado, governo, globalização) antes de avançar pros temas mais abstratos."},
  facil_wrong:     {...LEVELS.facil_wrong, tip:"Volte aos conceitos mais básicos de cidadania, Estado e sociedade — são a base pra entender o resto de Ciências Humanas."}
};
const LEVELS_CN = {
  dificil_correct: {...LEVELS.dificil_correct, tip:"Você já vai bem em Ciências da Natureza — treine questões que exigem aplicar mais de uma lei ou conceito ao mesmo tempo."},
  dificil_wrong:   {...LEVELS.dificil_wrong, tip:"Revise leis fundamentais de física e química (Newton, Ohm, reações) — são a base das questões mais difíceis dessa área."},
  medio_correct:   {...LEVELS.medio_correct, tip:"Revise leis fundamentais de física e química (Newton, Ohm, reações) — são a base das questões mais difíceis dessa área."},
  medio_wrong:     {...LEVELS.medio_wrong, tip:"Reforce processos básicos (respiração celular, mudanças de estado físico, ligações químicas) antes de avançar pros conceitos mais complexos."},
  facil_correct:   {...LEVELS.facil_correct, tip:"Reforce processos básicos (respiração celular, mudanças de estado físico, ligações químicas) antes de avançar pros conceitos mais complexos."},
  facil_wrong:     {...LEVELS.facil_wrong, tip:"Volte ao básico de biologia, física e química do dia a dia — é a base pra entender o resto de Ciências da Natureza."}
};

const LEVELS_BY_AREA = { LC: LEVELS, MT: LEVELS_MT, CH: LEVELS_CH, CN: LEVELS_CN };

let TREE = null;
let areaOrder = ["LC","MT","CH","CN"];
let areaIdx = 0;
let currentNodeKey = null;
let results = {};

const el = id => document.getElementById(id);

/* ---------- navegação entre telas + indicador de etapas ---------- */
const STEP_ORDER = ["quiz","redacao","boletim"];

function showScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  el(id).classList.add("active");
}

function setStep(stepName){
  const stepper = el("stepper");
  if(stepName === "cover"){
    stepper.classList.add("hidden");
    return;
  }
  stepper.classList.remove("hidden");
  const currentIdx = STEP_ORDER.indexOf(stepName);
  document.querySelectorAll(".step").forEach(stepEl=>{
    const idx = STEP_ORDER.indexOf(stepEl.dataset.step);
    stepEl.classList.remove("active","done");
    if(idx < currentIdx) stepEl.classList.add("done");
    else if(idx === currentIdx) stepEl.classList.add("active");
  });
}

function goTo(screenId, stepName){
  showScreen(screenId);
  setStep(stepName);
}

function diasAteProva(){
  const prova = new Date("2026-11-08T00:00:00");
  const hoje = new Date();
  const diff = Math.ceil((prova - hoje) / (1000*60*60*24));
  return diff > 0 ? diff : 0;
}

/* ---------- montagem da árvore a partir do banco de perguntas ---------- */
function buildTree(bank){
  const tree = {};
  Object.keys(NODE_META).forEach(areaKey=>{
    const areaMeta = NODE_META[areaKey];
    const nodes = {};
    Object.keys(areaMeta.nodes).forEach(nodeKey=>{
      const meta = areaMeta.nodes[nodeKey];
      const variants = (bank[areaKey] && bank[areaKey][nodeKey]) || FALLBACK_BANK[areaKey][nodeKey];
      const chosen = variants[Math.floor(Math.random()*variants.length)];
      nodes[nodeKey] = { tier:meta.tier, next:meta.next, terminal:meta.terminal,
        text:chosen.text, options:chosen.options, correct:chosen.correct };
    });
    tree[areaKey] = { name:areaMeta.name, start:areaMeta.start, nodes };
  });
  return tree;
}

async function carregarBanco(){
  let bank;
  try{
    const resp = await fetch("perguntas.json");
    if(!resp.ok) throw new Error("resposta não OK");
    bank = await resp.json();
  } catch(e){
    console.warn("Não foi possível carregar perguntas.json — usando banco de segurança.", e);
    bank = FALLBACK_BANK;
  }
  TREE = buildTree(bank);
  el("begin-btn").disabled = false;
  const d = diasAteProva();
  el("hint-text").textContent = d > 0
    ? `${d} dias até a prova · leva cerca de 12 minutos`
    : `leva cerca de 12 minutos`;
}
carregarBanco();

/* ---------- simulado ---------- */
function startQuiz(){
  areaIdx = 0;
  results = {};
  el("sheet-code").textContent = "Nº " + Math.floor(1000+Math.random()*9000);
  goTo("screen-quiz", "quiz");
  enterArea();
}

function enterArea(){
  const areaKey = areaOrder[areaIdx];
  const area = TREE[areaKey];
  currentNodeKey = area.start;
  el("area-label").textContent = area.name;
  renderNode();
}

function renderNode(){
  const areaKey = areaOrder[areaIdx];
  const node = TREE[areaKey].nodes[currentNodeKey];

  document.querySelectorAll(".tier-pip").forEach(p=>{
    p.classList.remove("active");
    if(p.dataset.tier === node.tier) p.classList.add("active");
  });

  el("question-text").textContent = node.text;
  const opts = el("options");
  opts.innerHTML = "";
  const letters = ["A","B","C","D"];
  node.options.forEach((optText, i)=>{
    const row = document.createElement("div");
    row.className = "opt";
    row.tabIndex = 0;
    row.setAttribute("role","radio");
    row.setAttribute("aria-checked","false");
    row.innerHTML = `<span class="bubble">${letters[i]}</span><span>${optText}</span>`;
    row.addEventListener("click", ()=>selectOption(i, node, row));
    row.addEventListener("keydown", (e)=>{
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        selectOption(i, node, row);
      }
    });
    opts.appendChild(row);
  });
  el("options").setAttribute("role","radiogroup");
  el("recalibrating").classList.remove("show");
}

function selectOption(i, node, row){
  if(row.classList.contains("disabled")) return;
  document.querySelectorAll(".opt").forEach(o=>{ o.classList.add("disabled"); o.tabIndex = -1; });
  const isCorrect = i === node.correct;
  row.classList.add(isCorrect ? "correct" : "wrong", "selected");
  row.setAttribute("aria-checked","true");
  if(!isCorrect){
    document.querySelectorAll(".opt")[node.correct].classList.add("correct");
  }
  el("recalibrating").classList.add("show");

  setTimeout(()=>{
    if(node.terminal){
      const key = node.tier + "_" + (isCorrect ? "correct" : "wrong");
      const areaKey = areaOrder[areaIdx];
      const table = LEVELS_BY_AREA[areaKey];
      results[areaKey] = table[key];
      areaIdx++;
      if(areaIdx < areaOrder.length){
        enterArea();
      } else {
        goTo("screen-redacao", "redacao");
      }
    } else {
      currentNodeKey = isCorrect ? node.next.correct : node.next.wrong;
      renderNode();
    }
  }, 900);
}

/* ================= REDAÇÃO — análise por critérios do Enem ================= */
const redInput = () => el("redacao-input");

redInput().addEventListener("input", () => {
  const words = redInput().value.trim().split(/\s+/).filter(Boolean);
  el("char-count").textContent = words.length + " palavras";
  el("analisar-btn").disabled = words.length < 80;
});

const CONECTIVOS = ["portanto","além disso","por outro lado","dessa forma","entretanto","contudo","uma vez que","à medida que","por conseguinte","nesse sentido","outrossim","dessa maneira","assim","logo","ademais","não obstante","posto que"];
const INFORMAIS = ["vc","pq","mto","naum","tá","né","cadê","qnd","blz","slc","tipo assim","daí que"];
const AGENTES = ["governo","poder público","estado","escola","escolas","mídia","sociedade","famílias","ongs","ministério da educação","poder legislativo","universidades"];
const ACOES = ["deve","deveria","é necessário","precisa","cabe","promover","criar","implementar","incentivar","desenvolver","investir","ampliar","fiscalizar"];
const MEIOS = ["por meio de","através de","com o auxílio de","via ","utilizando","com a criação de","por intermédio de"];
const FINALIDADES = ["a fim de","para que","com o objetivo de","visando","de modo a","com o intuito de"];

function contarOcorrencias(texto, lista){
  const t = texto.toLowerCase();
  return lista.filter(termo => t.includes(termo)).length;
}

function remarkFor(score, altas, medias, baixas){
  if(score >= 150) return altas;
  if(score >= 90) return medias;
  return baixas;
}

/* Corretor por regras — usado como plano B se a IA não estiver disponível */
function analisarPorRegras(texto){
  const paragrafos = texto.split(/\n\s*\n/).map(p=>p.trim()).filter(p=>p.length>0);
  const palavras = texto.split(/\s+/).filter(Boolean);
  const nPalavras = palavras.length;

  const informais = contarOcorrencias(texto, INFORMAIS);
  let c1 = 200 - Math.min(160, informais*40);
  if(nPalavras < 150) c1 -= 20;
  c1 = Math.max(20, Math.min(200, c1));

  const temReferenciaExplicita = /\b(segundo|de acordo com|conforme)\b/i.test(texto);
  const temAno = /\b(19|20)\d{2}\b/.test(texto);
  const temPercentual = /\d+\s?%/.test(texto);
  const nomesProprios = (texto.match(/\b[A-ZÀ-Ú][a-zà-ú]+\s[A-ZÀ-Ú][a-zà-ú]+\b/g) || []).length;
  let indiciosC2 = [temReferenciaExplicita, temAno, temPercentual, nomesProprios>0].filter(Boolean).length;
  const c2 = Math.min(200, 60 + indiciosC2*35);

  const nPar = paragrafos.length;
  let c3;
  if(nPar===4 || nPar===5) c3 = 200;
  else if(nPar===3 || nPar===6) c3 = 150;
  else if(nPar===2 || nPar===7) c3 = 100;
  else c3 = 60;

  const conectivosUsados = CONECTIVOS.filter(c => texto.toLowerCase().includes(c));
  const c4 = Math.min(200, 60 + conectivosUsados.length*35);

  const conclusaoTexto = texto.slice(Math.floor(texto.length*0.65)).toLowerCase();
  const temAgente = AGENTES.some(a => conclusaoTexto.includes(a));
  const temAcao = ACOES.some(a => conclusaoTexto.includes(a));
  const temMeio = MEIOS.some(a => conclusaoTexto.includes(a));
  const temFinalidade = FINALIDADES.some(a => conclusaoTexto.includes(a));
  const elementosC5 = [temAgente, temAcao, temMeio, temFinalidade].filter(Boolean).length;
  const c5 = Math.round((elementosC5/4)*200);

  const total = c1+c2+c3+c4+c5;

  const remarks = {
    c1: remarkFor(c1, "Boa consistência gramatical.", "Alguns deslizes de norma culta — revise concordância e informalidades.", "Muitas marcas de informalidade — evite abreviações e gírias no texto."),
    c2: remarkFor(c2, "Bom uso de dados/referências pra sustentar o argumento.", "Poucos indícios de repertório concreto (dado, ano, referência) no texto.", "Faltou trazer um dado, ano ou referência concreta ligada ao tema."),
    c3: `${nPar} parágrafo(s) identificado(s) — ` + remarkFor(c3, "estrutura dentro do esperado (4-5 parágrafos).", "estrutura razoável, mas revise a divisão dos parágrafos.", "tente estruturar em 4 parágrafos: introdução, 2 de desenvolvimento e conclusão."),
    c4: conectivosUsados.length > 0
      ? `Conectivos identificados: ${conectivosUsados.slice(0,4).join(", ")}.`
      : "Nenhum conectivo formal identificado — tente usar 'além disso', 'por outro lado', 'dessa forma'.",
    c5: `Elementos encontrados na conclusão: ${elementosC5}/4 (agente, ação, meio e finalidade).` +
      (elementosC5 < 4 ? " Faltou: " + [!temAgente&&"agente", !temAcao&&"ação", !temMeio&&"meio/modo", !temFinalidade&&"finalidade"].filter(Boolean).join(", ") + "." : "")
  };

  return {c1,c2,c3,c4,c5,total,remarks,fonte:"regras"};
}

async function analisarViaIA(tema, texto){
  const resp = await fetch("/api/analisar-redacao", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({tema, texto})
  });
  if(!resp.ok) throw new Error("resposta não OK da função de IA");
  const data = await resp.json();
  if(data.error) throw new Error(data.error);
  return data;
}

async function analisarRedacao(){
  const tema = el("tema-input").value.trim();
  const texto = redInput().value.trim();
  const btn = el("analisar-btn");
  btn.disabled = true;
  const textoOriginalBtn = btn.textContent;
  btn.textContent = "Analisando…";

  let dados;
  try{
    dados = await analisarViaIA(tema, texto);
  } catch(e){
    console.warn("IA indisponível, usando corretor por regras.", e);
    dados = analisarPorRegras(texto);
  }

  btn.textContent = textoOriginalBtn;
  btn.disabled = false;
  renderBoletim(dados);
}

/* ---------- boletim final ---------- */
const SCORE_RING_CIRCUMFERENCE = 2 * Math.PI * 54;

function renderBoletim(r){
  const areasEl = el("results-areas");
  areasEl.innerHTML = "";
  areaOrder.forEach(areaKey=>{
    const area = TREE[areaKey];
    const res = results[areaKey];
    const pctOfScale = ((res.pct - 30) / (90-30)) * 100;
    const block = document.createElement("div");
    block.className = "area-block";
    block.innerHTML = `
      <div class="area-block-top">
        <span class="area-name">${area.name}</span>
        <span class="area-level">${res.label}</span>
      </div>
      <div class="scale"><div class="scale-fill" style="width:${pctOfScale}%"></div></div>
      <div class="scale-labels"><span>380</span><span>580</span><span>860</span></div>
      <p class="range-text">Faixa estimada: ${res.range[0]}–${res.range[1]} pontos</p>
    `;
    areasEl.appendChild(block);
  });

  el("redacao-total").textContent = r.total;
  el("redacao-fonte").textContent = r.fonte === "ia" ? "análise gerada por IA" : "análise por critérios automáticos";

  const ringFill = el("score-ring-fill");
  ringFill.style.strokeDasharray = SCORE_RING_CIRCUMFERENCE;
  ringFill.style.strokeDashoffset = SCORE_RING_CIRCUMFERENCE;
  requestAnimationFrame(()=>{
    ringFill.style.strokeDashoffset = SCORE_RING_CIRCUMFERENCE * (1 - r.total/1000);
  });

  const comps = [
    {name:"C1 · Domínio da norma culta", score:r.c1, remark:r.remarks.c1},
    {name:"C2 · Compreensão do tema", score:r.c2, remark:r.remarks.c2},
    {name:"C3 · Organização das ideias", score:r.c3, remark:r.remarks.c3},
    {name:"C4 · Coesão textual", score:r.c4, remark:r.remarks.c4},
    {name:"C5 · Proposta de intervenção", score:r.c5, remark:r.remarks.c5},
  ];
  const compsEl = el("results-competencias");
  compsEl.innerHTML = "";
  comps.forEach(c=>{
    const row = document.createElement("div");
    row.className = "comp-row";
    row.innerHTML = `
      <div class="comp-top"><span class="comp-name">${c.name}</span><span class="comp-score">${c.score}/200</span></div>
      <div class="scale"><div class="scale-fill" style="width:${(c.score/200)*100}%"></div></div>
      <div class="comp-remark">${c.remark}</div>
    `;
    compsEl.appendChild(row);
  });

  const compFraca = comps.reduce((min,c)=> c.score < min.score ? c : min, comps[0]);
  const tipsPorComp = {
    "C1 · Domínio da norma culta": "Releia seu texto em voz alta procurando gírias e abreviações — troque por versões formais.",
    "C2 · Compreensão do tema": "Escolha 1 dado, autor ou fato concreto e treine explicar em 1 frase por que ele tem a ver com o tema.",
    "C3 · Organização das ideias": "Escreva a próxima redação já dividindo em 4 blocos antes de começar: introdução, 2 argumentos, conclusão.",
    "C4 · Coesão textual": "Grife todo início de parágrafo e force o uso de um conectivo diferente em cada um.",
    "C5 · Proposta de intervenção": "Treine escrever a proposta com essa estrutura fixa: quem faz + o que faz + como faz + para quê."
  };
  const areaFracaKey = areaOrder.reduce((minKey, key) =>
    results[key].pct < results[minKey].pct ? key : minKey, areaOrder[0]);
  const areaFraca = results[areaFracaKey];
  const dias = diasAteProva();

  const planoItens = [
    tipsPorComp[compFraca.name],
    areaFraca.tip,
    dias > 0 ? `Faltam ${dias} dias — reserve pelo menos um deles só pra reescrever esta redação aplicando os pontos acima.` : "Reserve um tempo só pra reescrever esta redação aplicando os pontos acima."
  ];
  const planoEl = el("plano-acao");
  planoEl.innerHTML = "";
  planoItens.forEach((item, i)=>{
    const row = document.createElement("div");
    row.className = "plano-item";
    row.innerHTML = `<span class="plano-num">${i+1}.</span><span>${item}</span>`;
    planoEl.appendChild(row);
  });

  goTo("screen-boletim", "boletim");
}

function restart(){
  redInput().value = "";
  el("tema-input").value = "";
  el("char-count").textContent = "0 palavras";
  el("analisar-btn").disabled = true;
  goTo("screen-cover", "cover");
}
