import { useState, useEffect } from "react";
import {
  Search, Heart, Clock, Home, BookOpen, ArrowLeft, RefreshCw, Gift,
  Wallet, Truck, Package, Users,
  Star, Target, Sparkles, Check, ChevronRight, X, Store, Crown,
  Megaphone, UserMinus, UserPlus, Globe, Radio, LogOut, Mail, KeyRound,
  Lightbulb, AlertTriangle, TrendingUp, DollarSign, BarChart3,
  ChevronLeft, Plus, Shield, Calendar, Rocket, Send, MessageCircle, Shirt, Video
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const CATS = [
  { id: "giro", label: "Promoções e Giro de Estoque", icon: RefreshCw },
  { id: "brindes", label: "Brindes e Incentivos", icon: Gift },
  { id: "cashback", label: "Cashback e Fidelização", icon: Wallet },
  { id: "frete", label: "Fretes Estratégicos", icon: Truck },
  { id: "combos", label: "Combos e Ticket Médio", icon: Package },
  { id: "indicacao", label: "Indicação e Aquisição de Clientes", icon: Users },
  { id: "vip", label: "Experiências VIP", icon: Crown },
  { id: "diferenciais", label: "Diferenciais Permanentes", icon: Star },
  { id: "emocional", label: "Campanhas Emocionais", icon: Sparkles },
  { id: "datas", label: "Datas Comemorativas", icon: Calendar },
  { id: "lancamentos", label: "Lançamentos de Coleção", icon: Rocket },
  { id: "engajamento", label: "Engajamento (Stories)", icon: Target },
];

const CANAIS = [
  { label: "Stories", icon: Radio },
  { label: "Loja física", icon: Store },
  { label: "Grupo VIP", icon: Crown },
  { label: "Live de vendas", icon: Video },
  { label: "Status do WhatsApp", icon: Megaphone },
  { label: "Lista de transmissão", icon: Send },
  { label: "WhatsApp individual", icon: MessageCircle },
  { label: "Site", icon: Globe },
  { label: "Clientes inativos", icon: UserMinus },
  { label: "Clientes que ainda não compraram", icon: UserPlus },
];

const NICHOS = [
  "Geral", "Moda Feminina", "Moda Masculina", "Moda Fitness", "Acessórios",
  "Cosméticos / Skincare", "Chimarrão", "Moda Evangélica", "Moda Plus Size", "Infantil",
];

const NICHO_GRUPOS = [
  {
    label: "Moda", emoji: "👗", icon: Shirt,
    itens: [
      { valor: "Moda Feminina", label: "Moda Feminina" },
      { valor: "Moda Masculina", label: "Moda Masculina" },
      { valor: "Infantil", label: "Moda Infantil" },
      { valor: "Moda Fitness", label: "Moda Fitness" },
      { valor: "Moda Plus Size", label: "Moda Plus Size" },
      { valor: "Moda Evangélica", label: "Moda Evangélica" },
    ],
  },
  {
    label: "Beleza", emoji: "💄", icon: Sparkles,
    itens: [{ valor: "Cosméticos / Skincare", label: "Cosméticos / Skincare" }],
  },
  { label: "Chimarrão", emoji: "🧉", icon: null, itens: null, valorDireto: "Chimarrão" },
  { label: "Acessórios", emoji: "👜", icon: null, itens: null, valorDireto: "Acessórios" },
];

const KEYWORD_MAP = [
  { termos: ["girar estoque", "estoque parado", "produto parado", "produtos parados", "giro"], tipo: "cat", valor: "giro" },
  { termos: ["promoção", "promocao", "promo"], tipo: "cat", valor: "giro" },
  { termos: ["brinde", "brindes"], tipo: "cat", valor: "brindes" },
  { termos: ["fideliz", "cliente antigo", "clientes antigos", "reativar"], tipo: "cat", valor: "cashback" },
  { termos: ["cashback"], tipo: "cat", valor: "cashback" },
  { termos: ["frete"], tipo: "cat", valor: "frete" },
  { termos: ["ticket médio", "ticket medio", "aumentar ticket", "combo"], tipo: "cat", valor: "combos" },
  { termos: ["captação", "captacao", "cliente novo", "clientes novos", "novos clientes", "indicação", "indicacao"], tipo: "cat", valor: "indicacao" },
  { termos: ["vip", "experiência vip", "experiencia vip"], tipo: "cat", valor: "vip" },
  { termos: ["emocional", "autoestima"], tipo: "cat", valor: "emocional" },
  { termos: ["data comemorativa", "datas comemorativas"], tipo: "cat", valor: "datas" },
  { termos: ["lançamento", "lancamento", "nova coleção", "nova colecao"], tipo: "cat", valor: "lancamentos" },
  { termos: ["engajamento", "enquete", "jogo"], tipo: "cat", valor: "engajamento" },
  { termos: ["stories", "instagram", "reels"], tipo: "canal", valor: "Stories" },
  { termos: ["whatsapp individual", "whatsapp"], tipo: "canal", valor: "WhatsApp individual" },
  { termos: ["status"], tipo: "canal", valor: "Status do WhatsApp" },
  { termos: ["lista de transmissão", "lista de transmissao"], tipo: "canal", valor: "Lista de transmissão" },
  { termos: ["grupo vip"], tipo: "canal", valor: "Grupo VIP" },
  { termos: ["loja física", "loja fisica", "presencial"], tipo: "canal", valor: "Loja física" },
  { termos: ["site", "e-commerce", "ecommerce"], tipo: "canal", valor: "Site" },
];

function buscaInteligente(query) {
  const q = query.toLowerCase();
  const cats = new Set(); const canais = new Set();
  KEYWORD_MAP.forEach((k) => {
    if (k.termos.some((t) => q.includes(t))) {
      if (k.tipo === "cat") cats.add(k.valor);
      if (k.tipo === "canal") canais.add(k.valor);
    }
  });
  return { cats, canais };
}

const BUSCA_SUGESTOES = ["Girar estoque", "Stories", "Grupo VIP", "WhatsApp", "Fidelização", "Brindes", "Ticket médio", "Lançamento", "Datas comemorativas", "Clientes antigos", "Clientes novos"];

const CHART_CORES = ["#143F35", "#2F5C46", "#4E7A5E", "#4E9C7C", "#8FA88F", "#B7D9C9", "#0B2A23"];
const MESES_ABREV = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const MESES_COMPLETOS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const formatBRL = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

function labelRelativo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const hoje = new Date();
  const diffDias = Math.round((new Date(hoje.toDateString()) - new Date(d.toDateString())) / 86400000);
  if (diffDias === 0) return "Hoje";
  if (diffDias === 1) return "Ontem";
  return `Dia ${String(d.getDate()).padStart(2, "0")}`;
}

// --- Conexão com o Supabase (projeto CRMLOJISTA, tabelas com prefixo av_) ---
const SUPABASE_URL = "https://ihpfexmourrvixtsxhrt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_M7vZQ1VPi_7BP3HQAp-ngA_cMB22bEG";
const ADMIN_EMAIL = "jessicasandifdm@gmail.com";

async function supaSignUp(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || data.error || "Não foi possível criar a conta.");
  return data;
}

async function supaSignIn(email, password) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "E-mail ou senha incorretos.");
  return data;
}

function supaHeaders(accessToken) {
  return { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` };
}

async function supaInsert(table, accessToken, row) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
    method: "POST",
    headers: { ...supaHeaders(accessToken), Prefer: "return=representation" },
    body: JSON.stringify(row),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erro ao salvar.");
  return data;
}

async function supaSelect(table, accessToken, userId) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?user_id=eq.${userId}&select=*&order=criado_em.desc`, {
    headers: supaHeaders(accessToken),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erro ao carregar dados.");
  return data;
}

async function supaDelete(table, accessToken, id) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, { method: "DELETE", headers: supaHeaders(accessToken) });
  if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.message || "Erro ao excluir."); }
  return true;
}

async function supaSelectAll(table, accessToken) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=criado_em.desc`, {
    headers: supaHeaders(accessToken),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erro ao carregar dados.");
  return data;
}

async function supaDeleteWhere(table, accessToken, filters) {
  const qs = Object.entries(filters).map(([k, v]) => `${k}=eq.${v}`).join("&");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${qs}`, { method: "DELETE", headers: supaHeaders(accessToken) });
  if (!res.ok) { const data = await res.json().catch(() => ({})); throw new Error(data.message || "Erro ao excluir."); }
  return true;
}

const ESCALA_PADRAO = [
  { l: "Sempre", p: 4 }, { l: "Na maioria das vezes", p: 3 }, { l: "Às vezes", p: 2 }, { l: "Quase nunca", p: 1 },
];

const CONTEXTO_QS = [
  { id: "segmento", texto: "Qual é o segmento da sua loja?", opcoes: ["Moda Feminina", "Moda Masculina", "Infantil", "Calçados", "Acessórios", "Casa", "Outro"].map((l) => ({ l, p: null })) },
  { id: "tempo", texto: "Há quanto tempo sua loja existe?", opcoes: ["Menos de 1 ano", "1 a 3 anos", "3 a 5 anos", "Mais de 5 anos"].map((l) => ({ l, p: null })) },
  { id: "faturamento", texto: "Qual o faturamento médio mensal?", opcoes: ["Até R$20 mil", "R$20–50 mil", "R$50–100 mil", "Acima de R$100 mil"].map((l) => ({ l, p: null })) },
  { id: "equipe", texto: "Quantas pessoas trabalham na empresa?", opcoes: ["Só eu", "2–4", "5–10", "Mais de 10"].map((l) => ({ l, p: null })) },
  { id: "seguidores", texto: "Quantos seguidores possui?", opcoes: ["Até 2 mil", "2–5 mil", "5–10 mil", "10–30 mil", "Mais de 30 mil"].map((l) => ({ l, p: null })) },
];

const PILAR_POSICIONAMENTO = [
  { id: "P1", texto: "Hoje você sente que seu Instagram atrai o cliente certo?", opcoes: ESCALA_PADRAO },
  { id: "P2", texto: "Seu perfil deixa claro o que você vende, para quem vende e por que comprar da sua loja?", opcoes: [{ l: "Totalmente", p: 4 }, { l: "Em parte", p: 3 }, { l: "Pouco", p: 2 }, { l: "Não", p: 1 }] },
  { id: "P3", texto: "Você sente que atrai pessoas que realmente compram?", opcoes: [{ l: "Sim", p: 4 }, { l: "Frequentemente", p: 3 }, { l: "Poucas vezes", p: 2 }, { l: "Quase nunca", p: 1 }] },
  { id: "P4", texto: "Hoje novos clientes chegam à sua loja:", opcoes: [{ l: "Todos os dias", p: 4 }, { l: "Toda semana", p: 3 }, { l: "Algumas vezes no mês", p: 2 }, { l: "Quase nunca", p: 1 }] },
  { id: "P5", texto: "Hoje você depende de postar para conseguir vender?", opcoes: [{ l: "Não", p: 4 }, { l: "Um pouco", p: 3 }, { l: "Bastante", p: 2 }, { l: "Totalmente", p: 1 }] },
];

const PILAR_ESTRATEGIA = [
  { id: "E1", texto: "Você planeja suas campanhas com antecedência?", opcoes: ESCALA_PADRAO },
  { id: "E2", texto: "Você possui um calendário comercial organizado?", opcoes: ESCALA_PADRAO },
  { id: "E3", texto: "Você sabe quais ações trazem mais resultado?", opcoes: ESCALA_PADRAO },
  { id: "E4", texto: "Você acompanha indicadores da loja?", opcoes: ESCALA_PADRAO },
  { id: "E5", texto: "Sua loja possui uma estratégia definida para cada mês?", opcoes: ESCALA_PADRAO },
];

const PILAR_VENDAS = [
  { id: "V1", texto: "Sua equipe segue um processo de atendimento?", opcoes: ESCALA_PADRAO },
  { id: "V2", texto: "Você realiza ações de fidelização?", opcoes: ESCALA_PADRAO },
  { id: "V3", texto: "Você realiza ações para atrair novos clientes?", opcoes: ESCALA_PADRAO },
  { id: "V4", texto: "Você realiza ações para aumentar o ticket médio?", opcoes: ESCALA_PADRAO },
  { id: "V5", texto: "Você acompanha sua taxa de conversão?", opcoes: ESCALA_PADRAO },
  { id: "V6", texto: "Você possui um processo de pós-venda?", opcoes: ESCALA_PADRAO },
];

const DIAG_PERGUNTAS = [
  ...CONTEXTO_QS.map((q) => ({ ...q, pilar: null })),
  ...PILAR_POSICIONAMENTO.map((q) => ({ ...q, pilar: "Posicionamento" })),
  ...PILAR_ESTRATEGIA.map((q) => ({ ...q, pilar: "Estratégia" })),
  ...PILAR_VENDAS.map((q) => ({ ...q, pilar: "Vendas" })),
];

const TEXTO_PILAR_FORTE = {
  "Posicionamento": "Seu posicionamento já demonstra uma boa base. Sua comunicação transmite valor e atrai clientes com potencial de compra. Agora, o próximo passo é transformar essa percepção em uma estratégia comercial consistente.",
  "Estratégia": "Sua loja já possui uma boa capacidade de planejamento. Com pequenos ajustes na execução, existe um grande potencial para tornar as vendas mais previsíveis.",
  "Vendas": "Sua operação comercial já apresenta boas práticas de vendas. Fortalecer posicionamento e estratégia tende a potencializar ainda mais os resultados.",
};

const RECOMENDACAO_GARGALO = {
  "Posicionamento": "Antes de pensar em vender mais, fortaleça a forma como sua loja é percebida. Um posicionamento claro aumenta a qualidade dos clientes que chegam até você e melhora o resultado de todas as ações comerciais.",
  "Estratégia": "Sua maior oportunidade está na organização. Criar uma rotina comercial, planejar campanhas e acompanhar indicadores torna as vendas muito mais previsíveis.",
  "Vendas": "Sua prioridade deve ser aumentar a frequência das ações comerciais. Atrair novos clientes, estimular recompra, elevar o ticket médio e manter um processo de vendas estruturado são passos fundamentais para gerar resultados consistentes.",
};

function faixaPilar(nome, pontos) {
  if (nome === "Vendas") {
    if (pontos <= 12) return "Crítica";
    if (pontos <= 18) return "Em desenvolvimento";
    return "Consistente";
  }
  if (pontos <= 10) return "Crítico";
  if (pontos <= 15) return "Em desenvolvimento";
  return "Consistente";
}

function faixaGeral(indice) {
  if (indice <= 39) return "Operação no improviso";
  if (indice <= 59) return "Vendas instáveis";
  if (indice <= 79) return "Estrutura em construção";
  if (indice <= 90) return "Loja em crescimento previsível";
  return "Loja previsível";
}

function computeDiagnostico(respostas) {
  const soma = (ids) => ids.reduce((s, id) => s + (respostas[id]?.p || 0), 0);
  const pontosPos = soma(["P1", "P2", "P3", "P4", "P5"]);
  const pontosEst = soma(["E1", "E2", "E3", "E4", "E5"]);
  const pontosVendas = soma(["V1", "V2", "V3", "V4", "V5", "V6"]);
  const total = pontosPos + pontosEst + pontosVendas;
  const indice = Math.round((total / 64) * 100);

  const pilares = [
    { nome: "Posicionamento", pontos: pontosPos, max: 20 },
    { nome: "Estratégia", pontos: pontosEst, max: 20 },
    { nome: "Vendas", pontos: pontosVendas, max: 24 },
  ];
  const ordenado = [...pilares].sort((a, b) => a.pontos - b.pontos);
  const gargalo = ordenado[0].nome;
  const segundaPrioridade = ordenado[1].nome;
  const pontoForte = ordenado[2].nome;

  const alertas = [];
  const areas = new Set();
  if (respostas.P4?.l === "Quase nunca") { alertas.push({ titulo: "Aquisição de clientes em risco", texto: "Sua loja está com dificuldade para atrair novos clientes. Antes de aumentar as vendas, é importante fortalecer ações de alcance e geração de demanda." }); areas.add("Aquisição"); }
  if (respostas.P5?.l === "Totalmente") { alertas.push({ titulo: "Dependência do Instagram", texto: "Hoje suas vendas dependem muito da sua presença diária. Isso torna o faturamento pouco previsível e dificulta o crescimento." }); areas.add("Posicionamento"); }
  if (respostas.E2?.p === 1) { alertas.push({ titulo: "Falta de planejamento", texto: "Sua loja tende a reagir às oportunidades, em vez de construir campanhas com antecedência." }); areas.add("Planejamento"); }
  if (respostas.E4?.p === 1) { alertas.push({ titulo: "Gestão sem indicadores", texto: "Sem acompanhar indicadores, fica difícil identificar o que realmente gera resultado e tomar decisões mais estratégicas." }); areas.add("Planejamento"); }
  if (respostas.V2?.p === 1) { alertas.push({ titulo: "Baixa fidelização", texto: "Você pode estar deixando dinheiro na mesa ao não desenvolver ações para vender novamente aos clientes que já compraram." }); areas.add("Fidelização"); }
  if (respostas.V3?.p === 1) { alertas.push({ titulo: "Pouca geração de demanda", texto: "Sua loja realiza poucas ações para atrair novos clientes, o que pode limitar o crescimento do faturamento." }); areas.add("Aquisição"); }
  if (respostas.V4?.p === 1) { alertas.push({ titulo: "Ticket médio baixo", texto: "Sua loja pode estar perdendo oportunidades de aumentar o valor das vendas com ações simples de incremento de ticket." }); areas.add("Conversão"); }
  if (respostas.V6?.p === 1) { alertas.push({ titulo: "Ausência de pós-venda", texto: "Sem um processo de pós-venda, sua loja reduz as chances de recompra e indicação." }); areas.add("Fidelização"); }

  return {
    pontosPos, pontosEst, pontosVendas, total, indice,
    faixaIndice: faixaGeral(indice),
    pilares: pilares.map((p) => ({ ...p, faixa: faixaPilar(p.nome, p.pontos) })),
    pontoForte, gargalo, segundaPrioridade,
    alertas, areas: Array.from(areas),
    textoForte: TEXTO_PILAR_FORTE[pontoForte],
    recomendacao: RECOMENDACAO_GARGALO[gargalo],
  };
}

const catInfo = (id) => CATS.find((c) => c.id === id) || CATS[0];
const canalInfo = (label) => CANAIS.find((c) => c.label === label) || CANAIS[0];

const ACTIONS = [
  {
    id: "cabide-livre", nome: "Operação Cabide Livre", cat: "giro",
    nichos: ["Moda Feminina", "Moda Masculina", "Moda Fitness", "Moda Plus Size", "Infantil", "Moda Evangélica"],
    tipo: "Campanha de giro de estoque",
    sugestoesNomes: ["Limpa-Arara", "Semana da Renovação", "Giro Inteligente", "Última Chance", "Renovação de Estoque"],
    alternativaCanal: "Sem loja física? Essa campanha funciona igual só pelo Instagram — use Stories como canal principal, com Status do WhatsApp e Lista de transmissão como apoio. Sendo só online, estenda a duração pra 10 a 14 dias, já que o alcance orgânico é mais lento que o presencial.",
    como: "Acelera o giro de estoque, libera espaço na loja e transforma peças paradas em caixa para novas compras.",
    duracao: "7 a 10 dias",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories", "Status do WhatsApp", "Lista de transmissão", "WhatsApp individual"],
    objetivo: ["Giro de estoque", "Liberar caixa", "Abrir espaço para nova coleção"],
    quandoUsar: ["Troca de coleção", "Mudança de estação", "Estoque parado há mais de 60 dias", "Necessidade de gerar caixa", "Excesso de produtos acumulados"],
    quandoEvitar: ["Durante lançamento de coleção nova", "Quando existir outra campanha acontecendo ao mesmo tempo", "Em períodos onde a comunicação principal seja outra"],
    checklist: ["Separar as peças participantes", "Definir percentual de desconto (sugestão: 10%, 15%, 20% ou 30%, dependendo de quanto o estoque está parado)", "Criar tabela de preços", "Trocar etiquetas", "Identificar peças da campanha", "Organizar araras", "Preparar vitrine", "Atualizar identidade visual da campanha", "Produzir materiais gráficos", "Definir data de início e encerramento"],
    checklistExecucao: ["Atualizar vitrine", "Colocar comunicação visual", "Organizar peças", "Equipe preparada", "Registrar movimento"],
    planoDivulgacao: [
      { marco: "2 dias antes", itens: [
        "Reels: vídeo curto anunciando que algo especial começa em breve, mostrando rapidamente algumas peças sem revelar tudo",
        "Stories: bastidores da preparação (organizando araras, trocando etiquetas, caixas chegando, equipe preparando loja)",
        "WhatsApp para clientes: aviso em primeira mão de que a ação está chegando",
      ]},
      { marco: "1 dia antes", itens: [
        "Stories em sequência: 'Bastidores' → 'Falta apenas 1 dia' → 'Ative o lembrete porque amanhã começa'",
        "Grupo VIP: aviso de que as melhores oportunidades saem nas primeiras horas",
        "WhatsApp individual: lembrete pessoal para acompanhar os Stories",
      ]},
      { marco: "Dia 1 (abertura)", itens: [
        "Loja física: vitrine atualizada, comunicação visual, peças organizadas, equipe preparada",
        "Stories o dia todo: clientes comprando, antes e depois das araras, provador, sacolas saindo, peças acabando",
        "Status do WhatsApp: repostar os Stories",
      ]},
      { marco: "Dias seguintes", itens: ["Mostrar novidades e reposição quando existir", "Reforçar peças disponíveis e vendas acontecendo"] },
    ],
    modelosMensagens: [
      { canal: "WhatsApp (2 dias antes)", texto: "Estamos preparando uma ação muito especial que começa em poucos dias. Se você estava esperando uma oportunidade, fica de olho." },
      { canal: "Grupo VIP (1 dia antes)", texto: "Amanhã começa nossa ação especial. As melhores oportunidades costumam sair logo nas primeiras horas." },
      { canal: "WhatsApp individual (1 dia antes)", texto: "Passei para lembrar que amanhã começa nossa campanha. Se quiser garantir as melhores opções, acompanha nossos Stories amanhã cedo." },
    ],
    ideiasStories: ["Bastidores da preparação (araras, etiquetas, caixas chegando)", "'Falta apenas 1 dia'", "'Ative o lembrete porque amanhã começa'", "Durante a campanha: clientes comprando, antes/depois das araras, provador, sacolas saindo, peças acabando"],
    dicas: "Não concentre toda a comunicação apenas no desconto. Mostre oportunidade, movimento, quantidade limitada, sensação de loja cheia e urgência natural.",
    resultado: ["Giro acelerado", "Redução do estoque", "Liberação de caixa", "Espaço para nova coleção", "Aumento do fluxo na loja"],
    relacionadas: ["pague-2-leve-3", "comprou-ganhou-stories", "dia-do-frete-especial"],
  },
  {
    id: "comprou-ganhou-stories", nome: "Comprou, Ganhou Express (Stories)", cat: "brindes", nichos: ["Geral"],
    tipo: "Ação relâmpago de 1 dia",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Gera pico de vendas imediato através da escassez, usando os Stories como canal principal.",
    duracao: "1 dia",
    canalPrincipal: "Stories",
    canaisApoio: ["WhatsApp individual"],
    objetivo: ["Gerar pico de vendas imediato através da escassez"],
    quandoUsar: ["Dias de movimento mais fraco, para gerar picos de conversa e vendas rápidas"],
    quandoEvitar: ["Sem definir os benefícios e produtos com antecedência"],
    checklist: ["Escolher até 10 produtos", "Definir quantidade de brindes", "Fotografar os produtos", "Definir horário da abertura"],
    checklistExecucao: ["Publicar a sequência de Stories no horário definido", "Responder mensagens em tempo real", "Atualizar quantos brindes já foram resgatados"],
    planoDivulgacao: [
      { marco: "1 dia antes", itens: ["Story avisando que amanhã tem oportunidade exclusiva pra quem acompanha", "WhatsApp lembrando de acompanhar os Stories"] },
      { marco: "No dia", itens: ["Sequência de 6 Stories (ver Ideias de Stories abaixo)"] },
    ],
    modelosMensagens: [
      { canal: "Stories (véspera)", texto: "Amanhã vou liberar uma oportunidade para quem acompanha meus Stories. As primeiras clientes vão desbloquear um presente especial." },
      { canal: "WhatsApp (véspera)", texto: "Amanhã acompanha meus Stories porque vou liberar uma condição exclusiva." },
    ],
    ideiasStories: ["Story 1: Abertura", "Story 2: Explicação", "Story 3: Mostrar produtos", "Story 4: Mostrar o brinde", "Story 5: 'Restam apenas X brindes'", "Story 6: Última chamada"],
    dicas: "Esse playbook inteiro cabe em uma tela — a força está na sequência rápida de Stories, não em explicações longas.",
    resultado: ["Pico de conversas e vendas no mesmo dia", "Sensação de sorte e exclusividade para quem acompanhou"],
    relacionadas: ["comprou-ganhou-vip", "desbloqueie-brindes"],
  },
  {
    id: "comprou-ganhou-vip", nome: "Comprou, Ganhou Express (Grupo VIP)", cat: "brindes", nichos: ["Geral"],
    tipo: "Ação relâmpago exclusiva para o grupo",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Mesma mecânica do Comprou Ganhou Express, só que o canal principal passa a ser o Grupo VIP em vez dos Stories.",
    duracao: "1 dia",
    canalPrincipal: "Grupo VIP",
    canaisApoio: ["Stories"],
    objetivo: ["Gerar pico de vendas imediato através da escassez, de forma exclusiva para o grupo"],
    quandoUsar: ["Quando a loja quer fortalecer o Grupo VIP como canal de vendas"],
    quandoEvitar: ["Quando o grupo ainda é muito pequeno ou pouco engajado"],
    checklist: ["Escolher até 10 produtos", "Definir quantidade de brindes", "Fotografar os produtos", "Definir horário da abertura"],
    checklistExecucao: ["Publicar mensagem de abertura no grupo", "Postar produtos e atualizações durante o dia", "Fazer a última chamada e encerrar oficialmente"],
    planoDivulgacao: [
      { marco: "2 dias antes", itens: ["Stories convidando para entrar no grupo, com spoiler da condição exclusiva"] },
      { marco: "Dia da ação", itens: ["Mensagem de abertura ('Começou!')", "Publicar produtos e atualizar vendas durante o dia", "Mostrar peças encerrando e fazer a última chamada", "Encerrar oficialmente"] },
    ],
    modelosMensagens: [{ canal: "Grupo VIP (abertura)", texto: "Começou! Hoje é dia de condição exclusiva só pra quem está aqui no grupo." }],
    ideiasStories: ["Convite pro grupo com spoiler da condição exclusiva"],
    dicas: "Só muda o canal principal — o resto da estrutura continua igual ao Comprou Ganhou Express de Stories.",
    resultado: ["Crescimento do Grupo VIP", "Pico de vendas exclusivo", "Geração de senso de pertencimento"],
    relacionadas: ["comprou-ganhou-stories", "clube-secreto"],
  },
  {
    id: "desbloqueie-brindes", nome: "Desbloqueie Brindes", cat: "brindes", nichos: ["Geral"],
    tipo: "Campanha de incentivo (não é urgência)",
    sugestoesNomes: [], alternativaCanal: "Sem loja física? Troque o canal principal por Stories — a régua de faixas funciona igual em vendas por WhatsApp ou site.",
    como: "Aumenta o ticket médio através de faixas de valor que desbloqueiam brindes cada vez melhores — a lógica é de incentivo, não de urgência.",
    duracao: "Semana",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories", "WhatsApp individual"],
    objetivo: ["Aumentar ticket médio"],
    quandoUsar: ["Quando o objetivo é ticket médio, não volume de clientes novas"],
    quandoEvitar: ["Comunicar como se fosse urgência — a lógica aqui é incentivo, não corrida contra o tempo"],
    checklist: ["Definir as faixas de valor e os brindes de cada uma (ex: R$199 → Brinde 1, R$299 → Brinde 2, R$399 → Brinde 3, R$499 → Kit completo)", "Separar os brindes por faixa", "Treinar a equipe para oferecer a próxima faixa no fechamento"],
    checklistExecucao: ["Equipe comunica a régua de faixas no caixa", "Registrar quais brindes foram desbloqueados por cliente"],
    planoDivulgacao: [{ marco: "Durante a campanha", itens: ["Comunicar sempre como 'quanto mais você compra, mais vantagens desbloqueia' — nunca como corrida contra o tempo"] }],
    modelosMensagens: [],
    ideiasStories: ["Mostrar a régua de faixas de forma visual (tabela ou carrossel)"],
    dicas: "A comunicação muda completamente aqui: não fale 'corre que acaba', fale 'quanto mais você compra, mais vantagens desbloqueia'.",
    resultado: ["Ticket médio mais alto", "Clientes levando mais itens por atendimento"],
    relacionadas: ["comprou-ganhou-stories", "leve-mais-pague-menos"],
  },
  {
    id: "cashback-inteligente", nome: "Cashback Inteligente", cat: "cashback", nichos: ["Geral"],
    tipo: "Campanha de recorrência programada",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Em vez de dar desconto imediato, a loja entrega um crédito que pode ser usado numa próxima compra, aumentando a recorrência e reduzindo a dependência de promoções frequentes. Pode ser feita em loja física ou site.",
    duracao: "3 a 7 dias",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories", "Status do WhatsApp", "Lista de transmissão", "WhatsApp individual"],
    objetivo: ["Aumentar a recorrência de clientes", "Estimular uma segunda compra", "Fidelizar clientes", "Manter fluxo constante de vendas"],
    quandoUsar: ["Datas comemorativas", "Lançamento de coleção", "Aniversário da loja", "Campanhas sazonais", "Quando deseja aumentar o retorno dos clientes"],
    quandoEvitar: ["Liquidações muito agressivas", "Campanhas com descontos elevados", "Quando a margem não comporta oferecer crédito futuro"],
    checklist: ["Definir percentual ou valor fixo do cashback (ex: 5%, 10%, R$20, R$50)", "Definir prazo de utilização (recomendado 60 a 90 dias)", "Definir valor mínimo para utilização (ex: acima de R$200)", "Definir se é acumulativo ou não", "Definir se pode ser usado junto com outras promoções", "Criar regulamento", "Treinar equipe", "Criar identidade visual", "Preparar comunicação"],
    checklistExecucao: ["Registrar todos os créditos gerados por cliente", "Mostrar nos Stories o valor de cashback sendo gerado e a quantidade de clientes participando"],
    planoDivulgacao: [
      { marco: "2 dias antes", itens: ["Reels sobre a condição especial chegando", "Stories: bastidores, gerar curiosidade", "WhatsApp avisando a condição especial da semana"] },
      { marco: "1 dia antes", itens: ["Stories: contagem regressiva mostrando que será válido somente naquele período"] },
      { marco: "Durante a campanha", itens: ["Mostrar clientes comprando, o valor do cashback sendo gerado e a quantidade de clientes participando"] },
      { marco: "Pós-campanha (perto do vencimento)", itens: ["Enviar lembrete individual pra quem ainda não usou o crédito"] },
    ],
    modelosMensagens: [
      { canal: "WhatsApp (2 dias antes)", texto: "Essa semana teremos uma condição especial para quem comprar na loja. Depois te conto todos os detalhes." },
      { canal: "WhatsApp (lembrete de vencimento)", texto: "Oi! Passei para lembrar que você possui um cashback disponível para utilizar. Seu crédito é válido até ____. Se quiser, posso separar algumas opções para você." },
    ],
    ideiasStories: ["Bastidores gerando curiosidade", "Contagem regressiva na véspera", "Mostrar o valor do cashback sendo gerado em tempo real"],
    dicas: "O verdadeiro objetivo dessa campanha não é vender mais hoje — é criar um motivo para o cliente voltar.",
    resultado: ["Aumento da recorrência", "Redução do CAC", "Maior fidelização", "Mais clientes retornando"],
    relacionadas: ["cashback-relampago-vip", "cashback-permanente"],
  },
  {
    id: "cashback-relampago-vip", nome: "Cashback Relâmpago (Grupo VIP)", cat: "cashback", nichos: ["Geral"],
    tipo: "Ação relâmpago de exclusividade",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Gera vendas rápidas dentro do Grupo VIP oferecendo cashback por tempo limitado.",
    duracao: "1 dia",
    canalPrincipal: "Grupo VIP",
    canaisApoio: ["Stories"],
    objetivo: ["Gerar vendas rápidas utilizando exclusividade"],
    quandoUsar: ["Quando quer ativar o Grupo VIP com algo exclusivo e de curta duração"],
    quandoEvitar: ["Sem ter definido percentual, validade e horário com antecedência"],
    checklist: ["Definir percentual", "Definir validade", "Definir horário"],
    checklistExecucao: ["Publicar mensagem de abertura explicando percentual, validade e regras", "Atualizar vendas durante o dia", "Fazer a última chamada antes do encerramento"],
    planoDivulgacao: [
      { marco: "2 dias antes", itens: ["Stories anunciando a condição exclusiva do grupo"] },
      { marco: "1 dia antes", itens: ["Grupo: aviso de que amanhã quem comprar recebe cashback"] },
      { marco: "No dia", itens: ["Mensagem de abertura explicando percentual, validade e regras", "Atualizar vendas durante o dia", "Última chamada antes do encerramento"] },
    ],
    modelosMensagens: [{ canal: "Grupo VIP (véspera)", texto: "Amanhã quem comprar receberá cashback para utilizar na próxima compra." }],
    ideiasStories: ["Anúncio da condição exclusiva do grupo"],
    dicas: "Funciona melhor quando o grupo já tem um mínimo de engajamento — é uma ferramenta de ativação, não de captação.",
    resultado: ["Pico de vendas", "Crescimento do Grupo VIP", "Geração de recompra futura"],
    relacionadas: ["cashback-inteligente", "clube-secreto"],
  },
  {
    id: "cashback-permanente", nome: "Cashback Permanente (Programa de Fidelidade)", cat: "cashback", nichos: ["Geral"],
    tipo: "Programa permanente, não é campanha",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Um benefício contínuo da loja: toda compra gera um crédito para ser usado nas próximas compras. Não é campanha, é diferencial permanente da marca.",
    duracao: "Contínua",
    canalPrincipal: "Loja física",
    canaisApoio: ["Site", "Stories", "Status do WhatsApp", "WhatsApp individual"],
    objetivo: ["Transformar clientes ocasionais em clientes recorrentes"],
    quandoUsar: ["Como diferencial permanente da marca, não como campanha pontual"],
    quandoEvitar: ["Sem sistema de controle dos créditos — vira bagunça e gera atrito com a cliente"],
    checklist: ["Definir percentual", "Definir validade (60 a 90 dias)", "Definir valor mínimo", "Definir acúmulo ou não", "Definir utilização parcial ou total", "Criar regulamento", "Montar sistema de controle", "Treinar equipe", "Preparar comunicação na loja e no site"],
    checklistExecucao: ["Inserir o benefício em todos os pontos de contato: vitrine, balcão, sacolas, Stories, destaques, site, bio, WhatsApp", "Toda semana, consultar créditos próximos do vencimento e enviar mensagem personalizada"],
    planoDivulgacao: [{ marco: "Contínuo", itens: ["Comunicar o benefício em todos os pontos de contato da marca, o tempo todo"] }],
    modelosMensagens: [{ canal: "WhatsApp (crédito perto de vencer)", texto: "Você ainda possui um crédito disponível na loja e ele vence em breve. Se quiser aproveitar, posso te mostrar algumas novidades que chegaram." }],
    ideiasStories: [],
    dicas: "O cashback só gera resultado quando a cliente é lembrada de utilizá-lo. Não basta conceder o benefício — é essencial acompanhar e estimular o retorno antes do vencimento.",
    resultado: ["Aumento da frequência de compra", "Maior retenção de clientes", "Crescimento do ticket ao longo do tempo", "Fortalecimento da fidelização"],
    relacionadas: ["cashback-inteligente", "cliente-indica-ganha"],
  },
  {
    id: "frete-gratis-relampago", nome: "Frete Grátis Relâmpago", cat: "frete", nichos: ["Geral"],
    tipo: "Ação relâmpago de 1 dia",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Gera um pico de vendas oferecendo frete gratuito durante um período curto. O canal principal pode ser Stories ou Grupo VIP — escolha só um, pra não diluir a comunicação.",
    duracao: "1 dia",
    canalPrincipal: "Stories",
    canaisApoio: ["WhatsApp individual", "Status do WhatsApp"],
    objetivo: ["Gerar vendas rápidas", "Criar urgência", "Aumentar conversão", "Movimentar produtos específicos"],
    quandoUsar: ["Dias de menor movimento", "Estoque parado", "Meta de vendas do dia", "Ações relâmpago"],
    quandoEvitar: ["Sem definir horário de início e fim com clareza"],
    checklist: ["Definir regiões participantes", "Definir valor mínimo (opcional)", "Definir horário de início", "Definir horário de encerramento"],
    checklistExecucao: ["Publicar a sequência de Stories no horário combinado", "Lembrar durante o dia que o frete é gratuito"],
    planoDivulgacao: [
      { marco: "1 dia antes", itens: ["Stories anunciando a condição especial de amanhã"] },
      { marco: "No dia", itens: ["Sequência de 5 Stories (ver Ideias de Stories)"] },
    ],
    modelosMensagens: [],
    ideiasStories: ["Story 1: Anunciar", "Story 2: Explicar regras", "Story 3: Mostrar produtos", "Story 4: Lembrar que o frete é gratuito", "Story 5: Última chamada"],
    dicas: "Escolha só um canal principal — Stories ou Grupo VIP — pra não diluir a força da comunicação.",
    resultado: ["Pico de vendas", "Mais pedidos em um único dia"],
    relacionadas: ["frete-valor-minimo", "dia-do-frete-especial"],
  },
  {
    id: "frete-valor-minimo", nome: "Frete Grátis por Valor Mínimo", cat: "frete", nichos: ["Geral"],
    tipo: "Estratégia permanente ou campanha de ticket médio",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Oferece frete grátis apenas para compras acima de um valor definido, incentivando o cliente a completar a compra.",
    duracao: "Campanha de uma semana, mensal ou benefício permanente",
    canalPrincipal: "Site",
    canaisApoio: ["WhatsApp individual", "Stories"],
    objetivo: ["Aumentar o valor médio das compras"],
    quandoUsar: ["Quando o objetivo é subir o ticket médio no site ou nas vendas por WhatsApp"],
    quandoEvitar: ["Com o valor mínimo desalinhado do ticket médio real da loja"],
    checklist: ["Definir valor mínimo (ex: R$199, R$249, R$299)", "Definir regiões", "Calcular margem"],
    checklistExecucao: ["Comunicar o valor mínimo em todos os pontos de contato do checkout"],
    planoDivulgacao: [{ marco: "Contínuo", itens: ["Comunicar sempre com o valor específico: 'Compras acima de R$199 recebem frete gratuito' — nunca genérico"] }],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Sempre deixe o valor mínimo próximo do ticket médio desejado — isso é o que realmente empurra o cliente a completar a compra.",
    resultado: ["Ticket médio maior", "Mais produtos por pedido"],
    relacionadas: ["frete-fixo-inteligente", "leve-mais-pague-menos"],
  },
  {
    id: "frete-fixo-inteligente", nome: "Frete Fixo Inteligente", cat: "frete", nichos: ["Geral"],
    tipo: "Diferencial permanente",
    sugestoesNomes: [], alternativaCanal: null,
    como: "O cliente sempre sabe quanto vai pagar de frete, eliminando a objeção do frete caro.",
    duracao: "Permanente",
    canalPrincipal: "Site",
    canaisApoio: ["Stories", "WhatsApp individual"],
    objetivo: ["Eliminar a objeção do frete caro"],
    quandoUsar: ["Como diferencial fixo da loja"],
    quandoEvitar: ["Sem calcular se o valor fixo cobre a média de frete real"],
    checklist: ["Definir valor (ex: R$9,90, R$12,90, R$15,00)", "Definir regiões", "Informar as regras"],
    checklistExecucao: ["Comunicar em todos os pontos de contato: bio, destaques, site, catálogo, WhatsApp, Stories"],
    planoDivulgacao: [{ marco: "Contínuo", itens: ["Transformar em diferencial da marca: 'Frete fixo para toda a região. Sem surpresas no valor da entrega.'"] }],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Comunique como diferencial de confiança, não só como condição de frete.",
    resultado: ["Mais confiança", "Maior conversão"],
    relacionadas: ["frete-valor-minimo", "dia-do-frete-especial"],
  },
  {
    id: "dia-do-frete-especial", nome: "Dia do Frete Especial", cat: "frete", nichos: ["Geral"],
    tipo: "Campanha recorrente semanal",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Uma campanha recorrente em um dia fixo da semana, criando hábito de compra e concentrando vendas nos dias de menor movimento.",
    duracao: "Recorrente (ex: toda quarta-feira)",
    canalPrincipal: "Stories",
    canaisApoio: ["Loja física", "WhatsApp individual", "Status do WhatsApp"],
    objetivo: ["Concentrar vendas em dias de menor movimento"],
    quandoUsar: ["Pra criar um hábito de compra recorrente na semana"],
    quandoEvitar: ["Sem manter a recorrência — se pular semanas, o hábito não se forma"],
    checklist: ["Escolher o dia fixo da semana", "Definir a condição daquele dia (ex: Quarta do Frete Grátis, Sexta do Frete Fixo, Terça do Frete Popular)"],
    checklistExecucao: ["Segunda: anunciar que a campanha acontece na semana", "Terça: lembrete", "Quarta: abrir oficialmente e mostrar pedidos, embalagens e entregas"],
    planoDivulgacao: [
      { marco: "Segunda", itens: ["Anunciar que a campanha acontece na semana"] },
      { marco: "Terça", itens: ["Lembrete"] },
      { marco: "Quarta (dia da ação)", itens: ["Abrir oficialmente, mostrar pedidos, embalagens, entregas e fazer a última chamada"] },
    ],
    modelosMensagens: [],
    ideiasStories: ["Mostrar pedidos sendo embalados e saindo pra entrega"],
    dicas: "A força dessa estratégia está na repetição — o hábito só se forma se o dia for sempre o mesmo.",
    resultado: ["Criação de hábito de compra", "Aumento da recorrência", "Melhor distribuição das vendas durante a semana"],
    relacionadas: ["frete-gratis-relampago", "frete-fixo-inteligente"],
  },
  {
    id: "combo-inteligente", nome: "Combo Inteligente", cat: "combos", nichos: ["Geral"],
    tipo: "Estratégia permanente de ticket médio",
    sugestoesNomes: [], alternativaCanal: "Sem loja física? Troque o canal principal por Site ou Stories — o restante da estrutura continua igual.",
    como: "Reúne produtos complementares em uma única oferta fixa da loja, facilitando a decisão de compra e aumentando o ticket médio.",
    duracao: "Permanente",
    canalPrincipal: "Loja física",
    canaisApoio: ["Site", "Stories", "WhatsApp individual", "Status do WhatsApp"],
    objetivo: ["Aumentar ticket médio", "Vender mais peças por atendimento", "Facilitar a escolha do cliente", "Aumentar o giro de produtos complementares"],
    quandoUsar: ["Produtos que se complementam", "Peças básicas", "Itens com alta saída", "Kits para presentes"],
    quandoEvitar: ["Quando o mix de produtos não tem peças complementares claras"],
    checklist: ["Definir os produtos do combo", "Definir a economia oferecida", "Fotografar o combo", "Criar identidade visual", "Treinar a equipe pra oferecer o combo em todo atendimento"],
    checklistExecucao: ["Equipe oferece o combo ativamente em cada atendimento"],
    planoDivulgacao: [{ marco: "Contínuo", itens: ["Sempre mostrar quanto o cliente economiza ou o benefício de levar o kit completo"] }],
    modelosMensagens: [],
    ideiasStories: ["Mostrar o combo montado com o valor de economia em destaque"],
    dicas: "O cliente precisa enxergar a vantagem do conjunto — sempre mostre quanto ele economiza ou o benefício de levar o kit completo.",
    resultado: ["Ticket médio maior", "Mais peças por venda", "Atendimento mais consultivo"],
    relacionadas: ["leve-mais-pague-menos", "pague-2-leve-3"],
  },
  {
    id: "leve-mais-pague-menos", nome: "Leve Mais, Pague Menos", cat: "combos", nichos: ["Moda Feminina", "Moda Masculina"],
    tipo: "Campanha de ticket médio",
    sugestoesNomes: [], alternativaCanal: "Sem loja física? Troque o canal principal por Site ou Stories — a régua de quantidade funciona igual online.",
    como: "Incentiva o cliente a adicionar mais produtos ao carrinho em troca de um benefício progressivo (ex: leve 2 e ganhe 10%, leve 3 e ganhe 15%).",
    duracao: "3 a 7 dias",
    canalPrincipal: "Loja física",
    canaisApoio: ["Site", "Stories"],
    objetivo: ["Aumentar o volume de peças vendidas por compra"],
    quandoUsar: ["Produtos básicos e categorias onde o cliente costuma comprar mais de uma unidade"],
    quandoEvitar: ["Com uma régua de desconto complexa demais pra equipe explicar no caixa"],
    checklist: ["Definir as faixas de quantidade e desconto (ex: leve 2 → 10%, leve 3 → 15%, leve 4 → 20%)", "Treinar a equipe para explicar a régua no caixa"],
    checklistExecucao: ["Equipe reforça a régua no momento do fechamento"],
    planoDivulgacao: [{ marco: "Durante a campanha", itens: ["Reforçar a régua de quantidade em todos os canais de apoio"] }],
    modelosMensagens: [],
    ideiasStories: ["Mostrar a régua de forma visual (ex: 2 peças = 10%, 3 peças = 15%)"],
    dicas: "Funciona muito bem para produtos básicos e categorias onde o cliente costuma comprar mais de uma unidade.",
    resultado: ["Mais itens por pedido", "Giro de estoque", "Ticket médio maior"],
    relacionadas: ["combo-inteligente", "pague-2-leve-3"],
  },
  {
    id: "pague-2-leve-3", nome: "Pague 2, Leve 3", cat: "combos", nichos: ["Geral"],
    tipo: "Mecânica promocional clássica",
    sugestoesNomes: [], alternativaCanal: "Sem loja física? Troque o canal principal por Stories ou Grupo VIP — a mecânica continua a mesma.",
    como: "Na compra de 2 peças participantes, a terceira é por conta da loja — elimina estoque específico e aumenta o volume vendido.",
    duracao: "1 a 7 dias",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories", "Grupo VIP"],
    objetivo: ["Eliminar estoque específico e aumentar o volume vendido"],
    quandoUsar: ["Produtos com boa margem ou peças que precisam girar rapidamente"],
    quandoEvitar: ["Em produtos de margem apertada"],
    checklist: ["Definir quais produtos participam", "Definir as regras", "Organizar a exposição dos produtos participantes"],
    checklistExecucao: ["Comunicar no caixa e na vitrine: 'Na compra de 2 peças participantes, a terceira é por nossa conta.'"],
    planoDivulgacao: [{ marco: "Durante a campanha", itens: ["Reforçar a mecânica em todos os pontos de contato"] }],
    modelosMensagens: [],
    ideiasStories: ["Mostrar as peças participantes com a mecânica explicada"],
    dicas: "Utilize principalmente em produtos com boa margem ou peças que precisam girar rapidamente.",
    resultado: ["Redução de estoque", "Aumento do volume vendido", "Mais clientes levando três peças em vez de duas"],
    relacionadas: ["combo-inteligente", "cabide-livre"],
  },
  {
    id: "cliente-indica-ganha", nome: "Cliente Indica, Cliente Ganha", cat: "indicacao", nichos: ["Geral"],
    tipo: "Programa permanente de indicação",
    sugestoesNomes: [], alternativaCanal: "Sem loja física? O pós-venda pode acontecer inteiro por WhatsApp — o cartão ou QR code vai junto com a embalagem do envio.",
    como: "Após a compra, a cliente recebe um benefício para indicar uma amiga; quando a nova cliente compra pela primeira vez, ambas recebem uma recompensa.",
    duracao: "Permanente",
    canalPrincipal: "WhatsApp individual",
    canaisApoio: ["Loja física", "Status do WhatsApp"],
    objetivo: ["Captar novos clientes", "Reduzir custo de aquisição", "Incentivar recompra", "Fortalecer o relacionamento"],
    quandoUsar: ["Como programa contínuo de pós-venda"],
    quandoEvitar: ["Sem uma forma simples de rastrear quem indicou"],
    checklist: ["Definir a recompensa (cashback, crédito, brinde, cupom ou desconto na próxima compra)", "Criar cartão ou QR code para a indicação", "Definir o momento do pós-venda pra oferecer"],
    checklistExecucao: ["Oferecer no pós-venda de cada atendimento", "Registrar quem indicou e validar a recompensa quando a nova cliente comprar"],
    planoDivulgacao: [{ marco: "Pós-venda", itens: ["Apresentar o programa logo após a compra, com o cartão ou QR code dentro da sacola"] }],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "O momento do pós-venda é o gatilho mais forte pra apresentar o programa — a cliente está satisfeita e mais propensa a indicar.",
    resultado: ["Aquisição constante de novos clientes através da própria base"],
    relacionadas: ["convide-uma-amiga", "cashback-permanente"],
  },
  {
    id: "convide-uma-amiga", nome: "Convide uma Amiga", cat: "indicacao", nichos: ["Geral"],
    tipo: "Campanha de data específica",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Diferente do programa permanente, essa acontece em datas específicas (Dia do Amigo, Dia das Mães, aniversário da loja, Black Friday VIP).",
    duracao: "1 a 7 dias",
    canalPrincipal: "Stories",
    canaisApoio: ["Loja física"],
    objetivo: ["Gerar fluxo em um período específico"],
    quandoUsar: ["Datas específicas: Dia do Amigo, Dia das Mães, aniversário da loja, Black Friday VIP"],
    quandoEvitar: ["Fora de uma data ou motivo que justifique a campanha"],
    checklist: ["Escolher a data-motivo", "Definir o presente exclusivo pra quem trouxer uma amiga"],
    checklistExecucao: ["Divulgar na loja e nos Stories durante o período da campanha"],
    planoDivulgacao: [{ marco: "Durante a campanha", itens: ["Convidar a base a trazer uma amiga que ainda não conhece a loja, com presente exclusivo pras duas"] }],
    modelosMensagens: [{ canal: "Stories", texto: "Traga uma amiga que ainda não conhece nossa loja. Se as duas comprarem, ambas ganham um presente exclusivo." }],
    ideiasStories: [],
    dicas: "Amarre sempre a uma data ou motivo real — isso dá contexto e aumenta a adesão.",
    resultado: ["Aumento do fluxo", "Novas clientes"],
    relacionadas: ["cliente-indica-ganha"],
  },
  {
    id: "clube-presente", nome: "Clube Presente", cat: "indicacao", nichos: ["Infantil", "Geral"],
    tipo: "Programa de lista de presentes",
    sugestoesNomes: [], alternativaCanal: null,
    como: "A loja cria uma lista de presentes para o aniversariante; os convidados compram diretamente dessa lista. Excelente para lojas infantis, mas pode ser adaptado.",
    duracao: "Contínua, mês a mês por aniversariante",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories", "WhatsApp individual"],
    objetivo: ["Aumentar o ticket", "Captar novos clientes através da rede de convidados", "Fortalecer a marca"],
    quandoUsar: ["Para clientes com aniversário se aproximando (do filho ou dela mesma)"],
    quandoEvitar: ["Sem controle de quem já comprou cada item — gera presente repetido"],
    checklist: ["Montar a lista de presentes", "Fotografar os produtos", "Criar catálogo digital", "Gerar o link pra compartilhar"],
    checklistExecucao: ["Controlar as reservas pra não repetir presente", "Aplicar o incentivo pra mãe/aniversariante quando atingir um número de presentes vendidos (cashback, crédito, presente ou vale-compra)"],
    planoDivulgacao: [{ marco: "Um mês antes do aniversário", itens: ["Convidar a cliente a montar a lista", "Compartilhar o catálogo com a rede de convidados"] }],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Avisar a cliente com antecedência do aniversário aumenta a adesão à lista.",
    resultado: ["Aumento do ticket", "Novos clientes", "Fortalecimento da marca"],
    relacionadas: ["cliente-indica-ganha"],
  },
  {
    id: "closet-exclusivo", nome: "Closet Exclusivo", cat: "vip", nichos: ["Geral"],
    tipo: "Experiência VIP presencial",
    sugestoesNomes: [], alternativaCanal: null,
    como: "A loja fecha um horário exclusivo para poucas clientes conhecerem uma coleção antes do público, com experiência completa (espumante, café, doces, consultoria de looks, fotos, atendimento exclusivo).",
    duracao: "Evento de 2 a 3 horas",
    canalPrincipal: "WhatsApp individual",
    canaisApoio: ["Stories"],
    objetivo: ["Transformar clientes especiais em uma experiência exclusiva"],
    quandoUsar: ["Antes de um lançamento de coleção importante, pra recompensar as clientes de maior ticket"],
    quandoEvitar: ["Divulgando toda a experiência antes — isso tira a sensação de exclusividade"],
    checklist: ["Selecionar as clientes convidadas", "Organizar a experiência (espumante, café, doces)", "Preparar consultoria de looks", "Organizar o espaço pra fotos"],
    checklistExecucao: ["Receber as convidadas no horário exclusivo", "Registrar fotos do evento", "Fazer o atendimento consultivo personalizado"],
    planoDivulgacao: [{ marco: "Antes do evento", itens: ["Convite individual, sem divulgação pública", "Stories mostrando só bastidores, nunca a experiência completa"] }],
    modelosMensagens: [],
    ideiasStories: ["Bastidores da preparação do evento, sem revelar tudo"],
    dicas: "Nunca divulgue toda a experiência antes — a exclusividade é o que sustenta o valor percebido.",
    resultado: ["Maior ticket", "Maior fidelização", "Sensação de exclusividade"],
    relacionadas: ["preview-nova-colecao", "clube-secreto"],
  },
  {
    id: "preview-nova-colecao", nome: "Preview da Nova Coleção", cat: "lancamentos", nichos: ["Geral"],
    tipo: "Acesso antecipado VIP",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Clientes selecionadas compram antes da coleção chegar oficialmente ao público.",
    duracao: "Antes do lançamento oficial",
    canalPrincipal: "Grupo VIP",
    canaisApoio: ["WhatsApp individual"],
    objetivo: ["Dar acesso antecipado para clientes VIP"],
    quandoUsar: ["Antes de todo lançamento de coleção nova"],
    quandoEvitar: ["Sem ter um grupo ou lista VIP já organizada"],
    checklist: ["Selecionar as clientes VIP", "Separar as peças do preview"],
    checklistExecucao: ["Liberar o preview só pro grupo selecionado antes do lançamento público"],
    planoDivulgacao: [{ marco: "Antes do lançamento oficial", itens: ["Liberar o preview exclusivo pro Grupo VIP"] }],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Gera sensação de pertencimento real quando é praticado com consistência a cada lançamento.",
    resultado: ["Sensação de pertencimento", "Vendas antecipadas", "Geração de desejo"],
    relacionadas: ["closet-exclusivo", "clube-secreto"],
  },
  {
    id: "merecimento", nome: "Semana do Merecimento", cat: "emocional", nichos: ["Geral"],
    tipo: "Campanha emocional",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Ativa a compra por motivação pessoal (autocuidado, merecimento), sem depender de desconto agressivo. A mesma lógica funciona com outros temas: 'Dia de se Escolher', 'Projeto Autoestima', 'Semana da Mulher Real', 'Você Primeiro'.",
    duracao: "Semana",
    canalPrincipal: "Stories",
    canaisApoio: ["WhatsApp individual"],
    objetivo: ["Ativar a compra por motivação pessoal, sem depender de desconto agressivo"],
    quandoUsar: ["Semanas sem apelo comercial natural, quando a comunicação emocional pode carregar a campanha"],
    quandoEvitar: ["Sem conteúdo de conexão antes da oferta — a mensagem soa vazia"],
    checklist: ["Construir conteúdo de conexão antes de anunciar a condição", "Definir a condição especial da semana", "Revisar a linguagem: autocuidado e merecimento, não desconto"],
    checklistExecucao: ["Publicar o conteúdo de conexão antes da oferta", "Anunciar a condição com linguagem emocional"],
    planoDivulgacao: [
      { marco: "Antes da oferta", itens: ["Construir conteúdo de conexão com a audiência"] },
      { marco: "No lançamento da condição", itens: ["Comunicar com linguagem de autocuidado e merecimento"] },
    ],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Essas campanhas não vendem desconto — elas vendem significado. Funciona melhor quando vem depois de conteúdo que já construiu conexão com a audiência.",
    resultado: ["Ativação de compra por motivação pessoal", "Percepção de marca mais forte"],
    relacionadas: ["closet-exclusivo"],
  },
  {
    id: "estacionamento-conveniado", nome: "Estacionamento Conveniado", cat: "diferenciais", nichos: ["Geral"],
    tipo: "Diferencial permanente",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Elimina objeções relacionadas a deslocamento e conforto, oferecendo estacionamento gratuito, com desconto ou validação do ticket.",
    duracao: "Permanente",
    canalPrincipal: "Loja física",
    canaisApoio: ["Site"],
    objetivo: ["Eliminar objeções de deslocamento e conforto"],
    quandoUsar: ["Como diferencial permanente da loja"],
    quandoEvitar: [],
    checklist: ["Definir o benefício (gratuito, desconto ou validação do ticket)", "Fechar parceria com o estacionamento"],
    checklistExecucao: ["Comunicar na bio, destaques e vitrine"],
    planoDivulgacao: [],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Comunique isso como um diferencial de conforto, não como detalhe operacional perdido no meio de outras informações.",
    resultado: ["Mais conforto percebido", "Menos objeção de deslocamento"],
    relacionadas: ["ajuste-perfeito", "parcelamento-vip-diferencial"],
  },
  {
    id: "ajuste-perfeito", nome: "Ajuste Perfeito", cat: "diferenciais", nichos: ["Geral"],
    tipo: "Diferencial permanente (parceria com costureira)",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Aumenta a segurança na compra oferecendo pequenos ajustes gratuitos (barra, cintura) em compras acima de determinado valor.",
    duracao: "Permanente",
    canalPrincipal: "Loja física",
    canaisApoio: [],
    objetivo: ["Aumentar segurança na compra"],
    quandoUsar: ["Como diferencial permanente"],
    quandoEvitar: [],
    checklist: ["Fechar parceria com costureira", "Definir o valor mínimo de compra que dá direito ao ajuste"],
    checklistExecucao: ["Comunicar no momento da venda"],
    planoDivulgacao: [],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Esse diferencial reduz a insegurança de compra em peças que precisam de caimento.",
    resultado: ["Mais segurança na compra", "Menos trocas por caimento"],
    relacionadas: ["estacionamento-conveniado"],
  },
  {
    id: "parcelamento-vip-diferencial", nome: "Parcelamento VIP", cat: "diferenciais", nichos: ["Geral"],
    tipo: "Diferencial comercial permanente",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Facilita compras de maior valor com mais parcelas, entrada facilitada ou parcelamento exclusivo pra clientes VIP.",
    duracao: "Permanente",
    canalPrincipal: "Loja física",
    canaisApoio: ["Site"],
    objetivo: ["Facilitar compras de maior valor"],
    quandoUsar: ["Para peças de ticket mais alto"],
    quandoEvitar: ["Sem calcular o custo da taxa de parcelamento"],
    checklist: ["Calcular o custo do parcelamento estendido", "Definir quais clientes ou peças têm acesso"],
    checklistExecucao: ["Comunicar junto da peça específica, não de forma genérica"],
    planoDivulgacao: [],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Comunicar a condição junto da peça específica converte mais do que um anúncio genérico.",
    resultado: ["Aumento de conversão em peças de ticket mais alto"],
    relacionadas: ["estacionamento-conveniado", "ajuste-perfeito"],
  },
  {
    id: "clube-secreto", nome: "Clube Secreto — Portas Abertas", cat: "vip", nichos: ["Geral"],
    tipo: "Campanha para grupo fechado de WhatsApp",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Acesso a ofertas exclusivas dentro de um grupo fechado, construindo relacionamento direto e recorrente fora do Instagram.",
    duracao: "Semana",
    canalPrincipal: "Grupo VIP",
    canaisApoio: [],
    objetivo: ["Construir uma base de relacionamento direto e recorrente fora do Instagram"],
    quandoUsar: ["Quando a loja quer reduzir a dependência do alcance do Instagram para vender"],
    quandoEvitar: ["Sem rotina definida de conteúdo para o grupo — ele esvazia rápido"],
    checklist: ["Criar o grupo e definir a proposta de exclusividade", "Convidar as clientes mais engajadas primeiro", "Definir a rotina mínima de conteúdo (ofertas, prévias, novidades)"],
    checklistExecucao: ["Manter a rotina de conteúdo combinada", "Abrir ofertas exclusivas periodicamente dentro do grupo"],
    planoDivulgacao: [{ marco: "Contínuo", itens: ["Prévias de peças antes do lançamento oficial são o que mais engaja um grupo fechado"] }],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Abrir o grupo e deixar sem conteúdo por semanas faz a cliente silenciar e depois sair — mantenha a rotina combinada.",
    resultado: ["Canal direto de vendas com menos dependência do algoritmo"],
    relacionadas: ["closet-exclusivo", "preview-nova-colecao"],
  },
  {
    id: "story-batalha", nome: "Story Interativo — Batalha de Estilos", cat: "engajamento", nichos: ["Geral"],
    tipo: "Enquete de 4 opções",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Enquete com 4 fotos (looks, produtos ou modelos) perguntando qual a cliente prefere; quem vota entra numa lista para abordagem personalizada no Direct.",
    duracao: "1 dia (sequência de 3 stories)",
    canalPrincipal: "Stories",
    canaisApoio: [],
    objetivo: ["Gerar interação em massa nos Stories e abrir conversas individuais no Direct com quem já demonstrou preferência"],
    quandoUsar: ["Quando o objetivo é aumentar o alcance dos Stories e gerar oportunidades de venda consultiva no Direct"],
    quandoEvitar: ["Sem preparar antes a mensagem de abordagem para cada opção — a enquete vira só engajamento vazio, sem venda"],
    checklist: ["4 fotos escolhidas", "Pergunta da enquete definida", "Mensagens de Direct por opção escritas antes de postar"],
    checklistExecucao: ["Postar a enquete no horário certo", "Responder cada grupo de voto no Direct com a vantagem exclusiva"],
    planoDivulgacao: [{ marco: "Sequência do dia", itens: [
      "Story 1: preparar a audiência pedindo para não pular o próximo story",
      "Story 2: montar a enquete com 4 fotos (looks, produtos ou modelos do nicho)",
      "Aguardar os votos e separar os contatos por opção escolhida",
      "Enviar mensagem personalizada no Direct para cada grupo de voto, com uma vantagem exclusiva",
      "Story 3: fechar o dia mostrando o resultado (prints de conversa ou sacolas fechadas)",
    ]}],
    modelosMensagens: [],
    ideiasStories: ["Enquete com 4 fotos do nicho", "Mensagem individual no Direct pra cada grupo de voto"],
    dicas: "O que gera venda não é a enquete em si, é a mensagem individual enviada depois para quem votou.",
    resultado: ["Mais alcance nos Stories", "Conversas abertas no Direct com intenção de compra"],
    relacionadas: ["story-presente", "story-caca-palavras"],
    nichoExemplos: {
      "Moda Feminina": "4 looks (trabalho, jantar, almoço em família, balada) — 'qual look combina mais com seu estilo?'",
      "Moda Masculina": "4 modelos de camiseta ou cueca — 'qual modelo você não vive sem?'",
      "Moda Fitness": "4 tops ou conjuntos — 'qual você prefere pro treino pesado?'",
      "Acessórios": "4 mixes de colares ou brincos — 'se pudesse ganhar só um agora, qual seria?'",
      "Cosméticos / Skincare": "4 tons de batom ou blush — 'qual tom é a sua cara?'",
      "Chimarrão": "4 tipos de cuia — 'qual não pode faltar no seu mate?'",
      "Moda Evangélica": "4 looks midi — 'qual a escolha perfeita pro culto de domingo?'",
      "Moda Plus Size": "4 produções marcantes — 'qual te faria sentir a mulher mais poderosa da festa?'",
    },
  },
  {
    id: "story-presente", nome: "Story Interativo — Escolha seu Presente", cat: "engajamento", nichos: ["Geral"],
    tipo: "Jogo de emojis ou números",
    sugestoesNomes: [], alternativaCanal: null,
    como: "A cliente escolhe uma entre 3 caixas (emoji ou número) e manda a escolha por mensagem; cada caixa esconde um benefício diferente.",
    duracao: "1 dia",
    canalPrincipal: "Stories",
    canaisApoio: [],
    objetivo: ["Gerar volume alto de mensagens diretas em um curto espaço de tempo, criando urgência e senso de sorte"],
    quandoUsar: ["Em dias de movimento mais fraco, para gerar picos de conversas e vendas rápidas"],
    quandoEvitar: ["Sem definir os 3 benefícios com antecedência"],
    checklist: ["Definir os 3 benefícios (ex: frete grátis, desconto, mimo físico)", "Textos de resposta prontos para cada caixa", "Prazo de validade definido"],
    checklistExecucao: ["Responder cada mensagem com o benefício correspondente e prazo de validade curto"],
    planoDivulgacao: [{ marco: "Sequência do dia", itens: [
      "Story 1: anunciar que vem um jogo com presente exclusivo",
      "Story 2: mostrar as 3 caixas e pedir para responder por mensagem",
      "Responder cada mensagem com o benefício correspondente e prazo de validade curto",
      "Story 3: fechar o dia mostrando quantos benefícios foram desbloqueados",
    ]}],
    modelosMensagens: [],
    ideiasStories: ["3 caixas escondendo benefícios diferentes", "Prazo curto pra resgatar (ex: até as 18h)"],
    dicas: "Definir um prazo curto para resgatar o benefício aumenta a conversão imediata.",
    resultado: ["Pico de conversas no Direct convertendo em vendas no mesmo dia"],
    relacionadas: ["story-batalha", "story-caca-palavras"],
  },
  {
    id: "story-caca-palavras", nome: "Story Interativo — Caça-Palavras", cat: "engajamento", nichos: ["Geral"],
    tipo: "Desafio de atenção",
    sugestoesNomes: [], alternativaCanal: null,
    como: "Um caça-palavras simples esconde uma palavra do nicho; quem encontra e responde o story ganha um cupom ou benefício.",
    duracao: "1 dia",
    canalPrincipal: "Stories",
    canaisApoio: [],
    objetivo: ["Gerar respostas diretas ao story e recompensar quem presta atenção na marca"],
    quandoUsar: ["Quando a loja quer reforçar a percepção de marca através de um desafio leve e divertido"],
    quandoEvitar: ["Com a palavra fácil demais ou difícil demais"],
    checklist: ["Escolher uma palavra do nicho (ex: LOOK, GLOW, MATE)", "Imagem do caça-palavras pronta", "Benefício de recompensa definido"],
    checklistExecucao: ["Responder cada acerto com o benefício (cupom ou acesso antecipado)"],
    planoDivulgacao: [{ marco: "Sequência do dia", itens: [
      "Montar a imagem do caça-palavras com a palavra escondida entre letras aleatórias",
      "Pedir para responder o story com a palavra encontrada",
      "Responder cada acerto com o benefício",
      "Fechar o dia mostrando o resultado do desafio",
    ]}],
    modelosMensagens: [],
    ideiasStories: ["Caça-palavras com a palavra do nicho escondida"],
    dicas: "Oferecer 2 opções de prêmio (ex: acesso antecipado ao grupo VIP ou desconto) deixa a cliente escolher o que mais valoriza.",
    resultado: ["Aumento de respostas diretas ao story, o que melhora a entrega dos próximos stories pelo algoritmo"],
    relacionadas: ["story-batalha", "story-presente"],
  },
  {
    id: "sacola-premiada", nome: "Sacola Premiada", cat: "brindes",
    nichos: ["Chimarrão", "Acessórios", "Cosméticos / Skincare"],
    tipo: "Campanha de compra por impulso e surpresa",
    sugestoesNomes: [],
    alternativaCanal: "Escolha só um canal principal pra abrir a venda — quanto mais concentrado, maior o pico. Ordem de força: 1) Grupo VIP — anuncia as sacolas por nome e foto, quem escolhe rápido garante a sua; 2) Live de vendas — abre já no tema da campanha e vai vendendo as sacolas fechadas ao vivo, contando a narrativa de cada nome; 3) Stories — mostra a foto de todas as sacolas e pede pra comentar qual quer. Loja física não faz sentido aqui: a força da ação está no anúncio por nome que gera o pico, não numa vitrine presencial.",
    como: "A loja monta sacolas com o mesmo valor de venda, mas algumas recebem produtos extras como prêmio. A cliente compra sem saber exatamente o que está levando — o diferencial não é o desconto, é a experiência de descoberta.",
    duracao: "1 dia (no máximo 1x por mês, pra manter o efeito surpresa)",
    canalPrincipal: "Grupo VIP",
    canaisApoio: ["Live de vendas", "Stories", "WhatsApp individual", "Lista de transmissão"],
    objetivo: ["Gerar vendas rápidas através da curiosidade e do fator surpresa", "Aumentar o faturamento em curto período", "Incentivar a compra por impulso sem depender de desconto agressivo"],
    quandoUsar: [
      "Criar um pico de vendas em um único dia",
      "Movimentar o Grupo VIP",
      "Gerar engajamento nas redes sociais",
      "Trabalhar campanhas relâmpago",
      "Aproveitar datas comemorativas: Dia das Crianças, Primavera, Dia do Amigo, Dia das Mães, Dia dos Pais, aniversário da loja, Black Friday, Natal",
      "Em dias comuns, quando a loja quer gerar faturamento rápido",
    ],
    quandoEvitar: [
      "A loja tem poucos produtos pra montar kits variados",
      "Os produtos exigem escolha de tamanho ou numeração",
      "Não há organização suficiente pra montar as sacolas com antecedência",
      "O público não costuma aceitar bem compras surpresa",
      "Tentar vender pela loja física — a dinâmica depende do anúncio por nome num canal só, não da vitrine presencial",
    ],
    checklist: [
      "Definir o valor único das sacolas",
      "Escolher os produtos que vão compor os kits",
      "Montar todas as sacolas com o mesmo valor comercial",
      "Selecionar quais sacolas vão receber os produtos premiados",
      "Identificar cada sacola só com nome ou número, sem revelar o conteúdo",
      "Definir o tema/nome de cada sacola (ex: Dia das Mães — Mãe Clássica, Mãe Vaidosa, Mãe Elegante)",
      "Fotografar as sacolas fechadas, já com os nomes visíveis",
      "Combinar itens de menor giro com produtos de alta procura dentro dos kits",
      "Garantir que toda sacola entregue, no mínimo, o valor pago pela cliente",
    ],
    checklistExecucao: [
      "Apresentar a dinâmica da campanha",
      "Explicar que todas as sacolas têm o valor pago em produtos",
      "Informar que algumas têm um prêmio extra, sem revelar quais",
      "Avisar que os produtos da ação não têm troca",
      "Vender por ordem de quem escolher primeiro pelo nome",
      "Registrar os momentos de abertura como prova social",
    ],
    planoDivulgacao: [
      { marco: "Se for no Grupo VIP", itens: [
        "Um dia antes: avisar no grupo — 'Amanhã tem Sacola Premiada! Seja rápida, você escolhe pelo nome da sacola.'",
        "No dia: publicar a foto de todas as sacolas com os nomes visíveis",
        "Vender direto no grupo, por ordem de quem escolher primeiro pelo nome",
        "Revelar quem ganhou a sacola premiada",
      ]},
      { marco: "Se for em Live", itens: [
        "Abrir a live já com o tema da campanha (ex: Dia das Crianças)",
        "Anunciar cada sacola pelo nome durante a live, mantendo a narrativa e a brincadeira",
        "Vender a sacola fechada — a graça é a surpresa, não mostrar o conteúdo antes",
        "Revelar ao vivo quem ganhou a premiada",
      ]},
      { marco: "Se for nos Stories", itens: [
        "Um dia antes: fazer a preparação (teaser) sem mostrar as sacolas",
        "No dia: postar a foto de todas as sacolas com os nomes",
        "Perguntar nos comentários ou no Direct qual sacola a pessoa quer",
        "Pode fazer um story por sacola ou todas juntas numa foto só",
      ]},
    ],
    modelosMensagens: [
      { canal: "Grupo VIP (véspera)", texto: "Amanhã tem Sacola Premiada! Preparamos sacolas-surpresa com o mesmo valor de venda, mas algumas escondem prêmios especiais. Seja rápida — você escolhe pelo nome da sacola!" },
      { canal: "Grupo VIP (abertura)", texto: "As Sacolas Premiadas estão liberadas! Todas possuem o mesmo valor, mas algumas receberam produtos extras. Qual delas será a premiada? Quem participa descobre só na hora da abertura." },
    ],
    ideiasStories: [
      "Story 1: 'Você teria coragem de escolher uma sacola sem saber o que tem dentro?'",
      "Story 2: 'Todas possuem o mesmo valor… mas algumas escondem um presente especial.'",
      "Story 3: 'Qual será a premiada de hoje?'",
      "Story 4: 'Disponíveis enquanto durarem as unidades.'",
      "Foto com todas as sacolas e os nomes visíveis, perguntando qual a pessoa quer",
      "Enquete: 'Qual sacola você escolheria?'",
      "Mostrar alguém abrindo uma sacola premiada",
      "Bastidores da montagem sem revelar os prêmios",
      "Mostrar quantas sacolas ainda restam",
      "Reações das clientes compartilhadas",
      "Reels: time-lapse organizando os kits",
      "Reels: cliente descobrindo que ganhou a sacola premiada",
    ],
    dicas: "O sucesso dessa campanha não está no prêmio, e sim na experiência. Dê um nome ou tema pra cada sacola — a escolha deixa de ser só uma compra e vira uma brincadeira, o que aumenta a curiosidade e o compartilhamento. Concentre a venda em um único canal (de preferência Grupo VIP) pra gerar o pico — divulgar em vários lugares ao mesmo tempo dilui o efeito de urgência. Realize no máximo uma vez por mês: a exclusividade é o que sustenta o efeito surpresa.",
    resultado: [
      "Aumento das compras por impulso",
      "Faturamento concentrado em curto período",
      "Maior interação no Grupo VIP e nos Stories",
      "Aumento da percepção de valor da compra",
      "Fortalecimento da experiência da cliente",
      "Movimentação de produtos de menor saída sem recorrer a desconto",
      "Aumento do ticket médio quando combinada com vendas complementares",
    ],
    relacionadas: ["comprou-ganhou-stories", "desbloqueie-brindes", "clube-secreto"],
    narrativasPorData: {
      "Dia das Crianças": "Pega-pega, Esconde-esconde, Amarelinha, Queimada, Cabra-cega",
      "Primavera": "Girassol, Lavanda, Tulipa, Margarida, Rosa",
      "Dia do Amigo": "A amiga conselheira, A parceira de tudo, A divertida, A aventureira, A inseparável",
      "Dia das Mães": "Mãe clássica, Mãe vaidosa, Mãe prática, Mãe elegante, Mãe aventureira",
    },
  },
];

function CanalChip({ label, small, main }) {
  const info = canalInfo(label);
  const Icon = info.icon;
  return (
    <span className={`canal-pill ${small ? "sm" : ""} ${main ? "main" : ""}`}>
      <Icon size={small ? 10 : 11} /> {label}
    </span>
  );
}

function TagCard({ action, isFav, onToggleFav, onOpen, alt }) {
  const info = catInfo(action.cat);
  const Icon = info.icon;
  return (
    <div className={`tagcard ${alt ? "tagcard-alt" : ""}`} onClick={() => onOpen(action.id)}>
      <div className="tagcard-hole" />
      <div className="tagcard-body">
        <div className="tagcard-top">
          <span className="tagcard-cat">
            <Icon size={12} strokeWidth={2} /> {info.label}
          </span>
          <button
            className="tagcard-fav"
            onClick={(e) => { e.stopPropagation(); onToggleFav(action.id); }}
            aria-label="Favoritar"
          >
            <Heart size={16} fill={isFav ? "#143F35" : "none"} color={isFav ? "#143F35" : "#A9B0A4"} />
          </button>
        </div>
        <h3 className="tagcard-nome">{action.nome}</h3>
        <p className="tagcard-como">{action.como}</p>
        <div className="tagcard-canais">
          <CanalChip label={action.canalPrincipal} small main />
          {action.canaisApoio.length > 0 && <span className="canal-pill sm">+{action.canaisApoio.length} apoio</span>}
        </div>
        <div className="tagcard-foot">
          <span className="tagcard-duracao">
            <Clock size={11} /> {action.duracao}
            {action.nichos && action.nichos[0] !== "Geral" && <span className="nicho-tag"> · {action.nichos.join(", ")}</span>}
          </span>
          <ChevronRight size={16} color="#A9B0A4" />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="section">
      <h4 className="section-title">{title}</h4>
      <div className="section-body">{children}</div>
    </div>
  );
}

function Callout({ icon: Icon, title, children, tone }) {
  return (
    <div className={`callout callout-${tone}`}>
      <div className="callout-icon"><Icon size={17} /></div>
      <div className="callout-body">
        <span className="callout-title">{title}</span>
        <p className="callout-text">{children}</p>
      </div>
    </div>
  );
}

function Accordion({ title, icon: Icon, defaultOpen, accent, children }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={`acc ${accent ? `acc-${accent}` : ""}`}>
      <button className="acc-header" onClick={() => setOpen((o) => !o)} type="button">
        <span className="acc-header-left">{Icon && <Icon size={15} />} {title}</span>
        <ChevronRight size={16} className={`acc-chevron ${open ? "open" : ""}`} />
      </button>
      {open && <div className="acc-body">{children}</div>}
    </div>
  );
}

function DtlChecklistGroup({ itens, checked, onToggle }) {
  return (
    <div className="checklist">
      {itens.map((it, i) => (
        <label key={i} className="checkitem">
          <input type="checkbox" checked={!!checked[i]} onChange={() => onToggle(i)} />
          <span className={checked[i] ? "done" : ""}>{it}</span>
        </label>
      ))}
    </div>
  );
}

function DetailScreen({ action, isFav, onToggleFav, onBack, resultadosAcao, onVerHistorico, onOpenRelacionada }) {
  const info = catInfo(action.cat);
  const Icon = info.icon;
  const [checkedPrep, setCheckedPrep] = useState({});
  const [checkedExec, setCheckedExec] = useState({});
  const [checkedDiv, setCheckedDiv] = useState({});
  const relacionadas = action.relacionadas
    .map((id) => ACTIONS.find((a) => a.id === id))
    .filter(Boolean);

  const totalDivulgacao = action.planoDivulgacao.reduce((s, m) => s + m.itens.length, 0);
  const totalTarefas = action.checklist.length + action.checklistExecucao.length + totalDivulgacao;
  const concluidas =
    Object.values(checkedPrep).filter(Boolean).length +
    Object.values(checkedExec).filter(Boolean).length +
    Object.values(checkedDiv).filter(Boolean).length;
  const pctExecucao = totalTarefas > 0 ? Math.round((concluidas / totalTarefas) * 100) : 0;

  return (
    <div className="screen dtl-wrap">
      <div className="topbar">
        <button className="iconbtn" onClick={onBack}><ArrowLeft size={20} /></button>
        <span className="topbar-title dtl-topbar-title">Detalhe da campanha</span>
        <button className="iconbtn" onClick={() => onToggleFav(action.id)}>
          <Heart size={20} fill={isFav ? "#143F35" : "none"} color={isFav ? "#143F35" : "#1C201D"} />
        </button>
      </div>

      <div className="scroll">
        <div className="dtl-header">
          <h1 className="dtl-nome">{action.nome}</h1>
          <p className="dtl-desc">{action.como}</p>
          <div className="dtl-chips">
            <span className="dtl-chip"><Clock size={13} /> {action.duracao}</span>
            <span className="dtl-chip"><Target size={13} /> {action.objetivo[0]}</span>
            <span className="dtl-chip"><Icon size={13} /> {info.label}</span>
          </div>
        </div>

        <div className="dtl-section-card">
          <div className="dtl-section-title">Antes de começar</div>

          <Accordion title="Objetivo" icon={Target} defaultOpen>
            <ul className="bullet-list" style={{ marginBottom: 10 }}>{action.objetivo.map((o, i) => <li key={i}>{o}</li>)}</ul>
            <div className="canal-row">
              <span className="canal-row-label">Indicado para</span>
              <div className="chiprow">
                {(action.nichos && action.nichos[0] !== "Geral" ? action.nichos : ["Qualquer segmento"]).map((n) => <span key={n} className="chip">{n}</span>)}
              </div>
            </div>
            {action.sugestoesNomes.length > 0 && (
              <div className="canal-row" style={{ marginTop: 8 }}>
                <span className="canal-row-label">Outros nomes</span>
                <div className="chiprow">{action.sugestoesNomes.map((n) => <span key={n} className="chip">{n}</span>)}</div>
              </div>
            )}
          </Accordion>

          <Accordion title="Quando usar" icon={Check}>
            <ul className="bullet-list">{action.quandoUsar.map((o, i) => <li key={i}>{o}</li>)}</ul>
          </Accordion>

          {action.quandoEvitar.length > 0 && (
            <Accordion title="Quando evitar" icon={AlertTriangle}>
              <ul className="bullet-list">{action.quandoEvitar.map((o, i) => <li key={i}>{o}</li>)}</ul>
            </Accordion>
          )}

          <Accordion title="Canais recomendados" icon={Radio}>
            <div className="canal-row">
              <span className="canal-row-label">Principal</span>
              <CanalChip label={action.canalPrincipal} main />
            </div>
            {action.canaisApoio.length > 0 && (
              <div className="canal-row">
                <span className="canal-row-label">De apoio</span>
                <div className="chiprow">{action.canaisApoio.map((c) => <CanalChip key={c} label={c} />)}</div>
              </div>
            )}
            <p className="canal-caption">O canal principal é onde a ação acontece de fato. Os demais só existem pra levar as clientes até ele.</p>
            {action.alternativaCanal && <p className="canal-alt-nota">{action.alternativaCanal}</p>}
          </Accordion>
        </div>

        <div className="dtl-section-card dtl-checklist-card">
          <div className="dtl-checklist-top">
            <span className="dtl-checklist-titulo">Vamos executar</span>
            <span className="dtl-checklist-pct">{pctExecucao}% concluído</span>
          </div>
          <div className="dash-progress-track" style={{ marginBottom: 4 }}>
            <div className="dash-progress-fill" style={{ width: `${pctExecucao}%` }} />
          </div>

          <Accordion title="1 · Preparação" defaultOpen>
            <DtlChecklistGroup itens={action.checklist} checked={checkedPrep} onToggle={(i) => setCheckedPrep((s) => ({ ...s, [i]: !s[i] }))} />
          </Accordion>

          {action.checklistExecucao.length > 0 && (
            <Accordion title="2 · Execução">
              <DtlChecklistGroup itens={action.checklistExecucao} checked={checkedExec} onToggle={(i) => setCheckedExec((s) => ({ ...s, [i]: !s[i] }))} />
            </Accordion>
          )}

          {action.planoDivulgacao.length > 0 && (
            <Accordion title="3 · Divulgação">
              {action.planoDivulgacao.map((p, pi) => (
                <div key={pi} className="dtl-marco">
                  <span className="dtl-marco-titulo">{p.marco}</span>
                  <div className="checklist">
                    {p.itens.map((it, ii) => {
                      const key = `${pi}-${ii}`;
                      return (
                        <label key={ii} className="checkitem">
                          <input type="checkbox" checked={!!checkedDiv[key]} onChange={() => setCheckedDiv((s) => ({ ...s, [key]: !s[key] }))} />
                          <span className={checkedDiv[key] ? "done" : ""}>{it}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </Accordion>
          )}
        </div>

        {(action.modelosMensagens.length > 0 || action.ideiasStories.length > 0 || action.nichoExemplos || action.narrativasPorData) && (
          <div className="dtl-section-card">
            <div className="dtl-section-title">Materiais de apoio</div>

            {action.modelosMensagens.length > 0 && (
              <Accordion title="Modelos de mensagens" icon={MessageCircle} defaultOpen>
                <div className="msg-list">
                  {action.modelosMensagens.map((m, i) => (
                    <div key={i} className="msg-item">
                      <span className="msg-canal">{m.canal}</span>
                      <p className="msg-texto">"{m.texto}"</p>
                    </div>
                  ))}
                </div>
              </Accordion>
            )}

            {action.ideiasStories.length > 0 && (
              <Accordion title="Ideias de Stories e Reels" icon={Radio}>
                <ul className="bullet-list">{action.ideiasStories.map((s, i) => <li key={i}>{s}</li>)}</ul>
              </Accordion>
            )}

            {action.nichoExemplos && (
              <Accordion title="Exemplos por nicho" icon={Sparkles}>
                <div className="nicho-examples">
                  {Object.entries(action.nichoExemplos).map(([nicho, exemplo]) => (
                    <div key={nicho} className="nicho-example-item">
                      <span className="nicho-example-label">{nicho}</span>
                      <span className="nicho-example-text">{exemplo}</span>
                    </div>
                  ))}
                </div>
              </Accordion>
            )}

            {action.narrativasPorData && (
              <Accordion title="Narrativas por data" icon={Calendar}>
                <div className="nicho-examples">
                  {Object.entries(action.narrativasPorData).map(([data, itens]) => (
                    <div key={data} className="nicho-example-item">
                      <span className="nicho-example-label">{data}</span>
                      <span className="nicho-example-text">{itens}</span>
                    </div>
                  ))}
                </div>
              </Accordion>
            )}
          </div>
        )}

        <div className="dtl-dica-block">
          <div className="dtl-dica-titulo"><Lightbulb size={15} /> Dica estratégica</div>
          <p className="dtl-dica-texto">{action.dicas}</p>
        </div>

        <div className="dtl-resultado-block">
          <div className="dtl-resultado-titulo"><TrendingUp size={15} /> Resultado esperado</div>
          <ul className="bullet-list dtl-resultado-lista">{action.resultado.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </div>

        <div className="dtl-resultados-card">
          <span className="dtl-resultados-titulo">Como essa campanha está performando</span>
          <div className="dtl-resultados-grid">
            <div className="dtl-resultados-item">
              <span className="dtl-resultados-label">Total gerado</span>
              <span className="dtl-resultados-valor">{formatBRL(resultadosAcao.total)}</span>
            </div>
            <div className="dtl-resultados-item">
              <span className="dtl-resultados-label">Último registro</span>
              <span className="dtl-resultados-valor-sm">{resultadosAcao.ultimoRegistro || "—"}</span>
            </div>
            <div className="dtl-resultados-item">
              <span className="dtl-resultados-label">Registros</span>
              <span className="dtl-resultados-valor-sm">{resultadosAcao.qtd}</span>
            </div>
          </div>
          <button className="btn-ghost-box" style={{ marginBottom: 0 }} onClick={onVerHistorico}>Ver histórico</button>
        </div>

        {relacionadas.length > 0 && (
          <>
            <div className="dtl-guia-title">Campanhas relacionadas</div>
            <div className="dtl-relacionadas-grid">
              {relacionadas.map((r) => (
                <button key={r.id} className="dtl-relacionada-card" onClick={() => onOpenRelacionada(r.id)}>
                  <span className="dtl-relacionada-nome">{r.nome}</span>
                  <span className="dtl-relacionada-tipo">{r.tipo}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ onAuthed }) {
  const [modo, setModo] = useState("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const submeter = async () => {
    if (!email.trim() || !senha.trim()) { setErro("Preencha e-mail e senha para continuar."); return; }
    setErro(""); setMsg(""); setLoading(true);
    try {
      const data = modo === "criar" ? await supaSignUp(email.trim(), senha) : await supaSignIn(email.trim(), senha);
      if (data.access_token && data.user) {
        onAuthed({ accessToken: data.access_token, userId: data.user.id, email: data.user.email });
      } else {
        setMsg("Conta criada. Verifique seu e-mail pra confirmar o acesso e depois entre normalmente.");
        setModo("entrar");
      }
    } catch (e) {
      setErro(e.message || "Não foi possível continuar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <span className="auth-eyebrow">Gerador de Caixa</span>
        <h1 className="auth-title">{modo === "criar" ? "Criar conta" : "Acesso da lojista"}</h1>
        <p className="auth-sub">{modo === "criar" ? "Crie sua conta pra começar a usar o banco de ações." : "Entre para acessar o banco de ações e organizar sua rotina comercial."}</p>

        <label className="auth-label">E-mail</label>
        <div className="auth-input">
          <Mail size={16} color="#6B7268" />
          <input type="email" placeholder="seuemail@loja.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <label className="auth-label">Senha</label>
        <div className="auth-input">
          <KeyRound size={16} color="#6B7268" />
          <input type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submeter()} />
        </div>

        {erro && <p className="auth-erro">{erro}</p>}
        {msg && <p className="auth-msg">{msg}</p>}

        <button className="btn-primary" style={{ marginTop: 6 }} onClick={submeter} disabled={loading}>
          {loading ? "Aguarde…" : modo === "criar" ? "Criar conta" : "Entrar"}
        </button>
        <button className="btn-ghost" onClick={() => { setModo(modo === "criar" ? "entrar" : "criar"); setErro(""); setMsg(""); }}>
          {modo === "criar" ? "Já tenho conta — entrar" : "Ainda não tenho conta — criar"}
        </button>
      </div>
    </div>
  );
}

function DiagnosticoResultadoBody({ resultado }) {
  return (
    <>
      <div className="indice-hero">
        <span className="indice-num">{resultado.indice}</span>
        <span className="indice-max">/100</span>
        <span className="indice-faixa">{resultado.faixaIndice}</span>
      </div>

      <div className="pilares-wrap">
        {resultado.pilares.map((p) => (
          <div key={p.nome} className="pilar-row">
            <div className="pilar-row-top">
              <span>{p.nome}</span>
              <span className={`pilar-faixa faixa-${p.faixa.replace(/\s/g, "")}`}>{p.faixa}</span>
            </div>
            <div className="meta-bar-track"><div className="meta-bar-fill" style={{ width: `${(p.pontos / p.max) * 100}%` }} /></div>
          </div>
        ))}
      </div>

      <div className="resumo-card" style={{ margin: "16px 0" }}>
        <div className="resumo-row"><span className="resumo-label">Ponto forte</span><p>{resultado.pontoForte}</p></div>
        <div className="resumo-row"><span className="resumo-label">Principal gargalo</span><p>{resultado.gargalo}</p></div>
        <div className="resumo-row"><span className="resumo-label">Segunda prioridade</span><p>{resultado.segundaPrioridade}</p></div>
      </div>

      <p className="auth-sub" style={{ textAlign: "left" }}>{resultado.textoForte}</p>

      {resultado.alertas.length > 0 && (
        <div style={{ margin: "14px 0" }}>
          {resultado.alertas.map((a, i) => (
            <Callout key={i} icon={AlertTriangle} title={a.titulo} tone="outline">{a.texto}</Callout>
          ))}
        </div>
      )}

      {resultado.areas.length > 0 && (
        <div style={{ margin: "10px 0 16px" }}>
          <span className="resumo-label" style={{ display: "block", marginBottom: 8 }}>Áreas de oportunidade identificadas</span>
          <div className="chiprow">
            {resultado.areas.map((a) => <span key={a} className="chip">{a}</span>)}
          </div>
        </div>
      )}

      <Callout icon={TrendingUp} title="Recomendação" tone="solid">{resultado.recomendacao}</Callout>
    </>
  );
}

function DiagnosticoModal({ resultado, onClose }) {
  return (
    <div className="auth-wrap modal-overlay">
      <div className="auth-card resultado-card">
        <div className="modal-close-row">
          <span className="auth-eyebrow">Diagnóstico da loja</span>
          <button className="iconbtn" onClick={onClose}><X size={20} /></button>
        </div>
        <DiagnosticoResultadoBody resultado={resultado} />
        <button className="btn-primary" style={{ marginTop: 16 }} onClick={onClose}>Fechar</button>
      </div>
    </div>
  );
}

function DiagnosticoScreen({ onContinue, session }) {
  const [idx, setIdx] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [resultado, setResultado] = useState(null);
  const [salvo, setSalvo] = useState(false);

  const perguntaAtual = DIAG_PERGUNTAS[idx];
  const totalPerguntas = DIAG_PERGUNTAS.length;

  const escolher = (opt) => {
    const novasRespostas = { ...respostas, [perguntaAtual.id]: opt };
    setRespostas(novasRespostas);
    if (idx < totalPerguntas - 1) {
      setIdx(idx + 1);
    } else {
      const r = computeDiagnostico(novasRespostas);
      setResultado(r);
      if (session) {
        (async () => {
          try {
            await supaInsert("av_diagnosticos", session.accessToken, {
              user_id: session.userId,
              respostas: novasRespostas,
              indice: r.indice,
              faixa_indice: r.faixaIndice,
              ponto_forte: r.pontoForte,
              gargalo: r.gargalo,
              segunda_prioridade: r.segundaPrioridade,
              alertas: r.alertas,
              areas: r.areas,
            });
            setSalvo(true);
          } catch (e) { console.error("Erro ao salvar diagnóstico:", e); }
        })();
      }
    }
  };

  const voltar = () => { if (idx > 0) setIdx(idx - 1); };

  if (resultado) {
    return (
      <div className="auth-wrap">
        <div className="auth-card resultado-card">
          <span className="auth-eyebrow">Resultado do diagnóstico</span>
          <DiagnosticoResultadoBody resultado={resultado} />
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={onContinue}>Continuar para o app</button>
          <p className="auth-nota">Espaço reservado para o link da Mentoria — encaixa aqui, logo abaixo da recomendação.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card intro-card">
        <div className="quiz-progress-track"><div className="quiz-progress-fill" style={{ width: `${((idx) / totalPerguntas) * 100}%` }} /></div>
        <span className="auth-eyebrow">{perguntaAtual.pilar ? `Pilar · ${perguntaAtual.pilar}` : "Sobre sua loja"} · {idx + 1}/{totalPerguntas}</span>
        <h1 className="auth-title" style={{ fontSize: 19, lineHeight: 1.3 }}>{perguntaAtual.texto}</h1>

        <div className="quiz-opcoes">
          {perguntaAtual.opcoes.map((opt, i) => (
            <button key={i} className="quiz-opcao" onClick={() => escolher(opt)}>{opt.l}</button>
          ))}
        </div>

        {idx > 0 && <button className="btn-ghost" onClick={voltar}>Voltar</button>}
      </div>
    </div>
  );
}

function PerfilScreen({ onContinue, session }) {
  const [nomeLoja, setNomeLoja] = useState("");
  const [telefone, setTelefone] = useState("");
  const [instagram, setInstagram] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const salvar = async () => {
    if (!nomeLoja.trim() || !telefone.trim()) { setErro("Preencha ao menos o nome da loja e o telefone."); return; }
    setErro(""); setLoading(true);
    try {
      const perfil = { nome_loja: nomeLoja.trim(), telefone: telefone.trim(), instagram: instagram.trim() };
      if (session) {
        await supaInsert("av_perfis", session.accessToken, { user_id: session.userId, ...perfil });
      }
      onContinue(perfil);
    } catch (e) {
      setErro(e.message || "Não foi possível salvar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <span className="auth-eyebrow">Antes de começar</span>
        <h1 className="auth-title" style={{ fontSize: 22 }}>Conta pra gente sobre a sua loja</h1>
        <p className="auth-sub">Só pra deixar tudo personalizado — e pra gente poder falar com você se precisar.</p>

        <label className="auth-label">Nome da loja</label>
        <div className="auth-input">
          <Store size={16} color="#6B7268" />
          <input placeholder="Ex: Studio Bella Moda" value={nomeLoja} onChange={(e) => setNomeLoja(e.target.value)} />
        </div>

        <label className="auth-label">Telefone / WhatsApp</label>
        <div className="auth-input">
          <MessageCircle size={16} color="#6B7268" />
          <input placeholder="(00) 00000-0000" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        </div>

        <label className="auth-label">Instagram (opcional)</label>
        <div className="auth-input">
          <span style={{ color: "#6B7268", fontSize: 14 }}>@</span>
          <input placeholder="suaLoja" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </div>

        {erro && <p className="auth-erro">{erro}</p>}

        <button className="btn-primary" style={{ marginTop: 12 }} onClick={salvar} disabled={loading}>
          {loading ? "Salvando…" : "Continuar"}
        </button>
      </div>
    </div>
  );
}

const NAV = [
  { id: "inicio", label: "Início", icon: Home },
  { id: "biblioteca", label: "Biblioteca", icon: BookOpen },
  { id: "favoritos", label: "Favoritos", icon: Heart },
  { id: "historico", label: "Histórico", icon: Clock },
];

export default function App() {
  const [stage, setStage] = useState("login"); // login | diagnostico | app
  const [session, setSession] = useState(null); // { accessToken, userId, email }
  const [tab, setTab] = useState("inicio");
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState(null);
  const [canalFilter, setCanalFilter] = useState(null);
  const [nichoFilter, setNichoFilter] = useState(null);
  const [favs, setFavs] = useState(new Set());
  const [historico, setHistorico] = useState([]);
  const [doneNote, setDoneNote] = useState("");
  const [doneValor, setDoneValor] = useState("");
  const [showAnual, setShowAnual] = useState(false);
  const [metas, setMetas] = useState([]);
  const [dashMes, setDashMes] = useState(new Date().getMonth());
  const [dashAno, setDashAno] = useState(new Date().getFullYear());
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [novaMetaAcao, setNovaMetaAcao] = useState("");
  const [novaMetaValor, setNovaMetaValor] = useState("");
  const [showRegistrar, setShowRegistrar] = useState(false);
  const [registrarAcaoId, setRegistrarAcaoId] = useState("");
  const [adminDiagnosticos, setAdminDiagnosticos] = useState([]);
  const [adminPerfis, setAdminPerfis] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [meuDiagnostico, setMeuDiagnostico] = useState(null);
  const [showDiagCompleto, setShowDiagCompleto] = useState(false);
  const [searchFocado, setSearchFocado] = useState(false);

  const isAdmin = session?.email === ADMIN_EMAIL;
  const navItems = isAdmin ? [...NAV, { id: "admin", label: "Admin", icon: Shield }] : NAV;

  useEffect(() => {
    if (stage !== "app" || !session) return;
    (async () => {
      try {
        const [h, m, f, meusDiag, meuPerfil] = await Promise.all([
          supaSelect("av_historico", session.accessToken, session.userId),
          supaSelect("av_metas", session.accessToken, session.userId),
          supaSelect("av_favoritos", session.accessToken, session.userId),
          supaSelect("av_diagnosticos", session.accessToken, session.userId),
          supaSelect("av_perfis", session.accessToken, session.userId),
        ]);
        setHistorico(h.map((row) => ({
          id: row.acao_id, rowId: row.id, nota: row.nota, valor: Number(row.valor) || 0,
          data: new Date(row.criado_em).toLocaleDateString("pt-BR"), criadoEm: row.criado_em,
          mesAno: `${row.mes_idx + 1}/${row.ano}`, mesIdx: row.mes_idx, ano: row.ano,
        })));
        setMetas(m.map((row) => ({ id: row.id, acaoId: row.acao_id, mes: row.mes_idx, ano: row.ano, valorMeta: Number(row.valor_meta) || 0 })));
        setFavs(new Set(f.map((row) => row.acao_id)));
        if (meusDiag.length > 0) setMeuDiagnostico(meusDiag[0]);
        if (meuPerfil.length > 0) setPerfil(meuPerfil[0]);
      } catch (e) { console.error("Erro ao carregar dados do Supabase:", e); }
    })();
  }, [stage, session]);

  useEffect(() => {
    if (tab !== "admin" || !isAdmin || !session) return;
    setAdminLoading(true);
    Promise.all([
      supaSelectAll("av_diagnosticos", session.accessToken),
      supaSelectAll("av_perfis", session.accessToken),
    ])
      .then(([diags, perfis]) => { setAdminDiagnosticos(diags); setAdminPerfis(perfis); })
      .catch((e) => console.error("Erro ao carregar diagnósticos:", e))
      .finally(() => setAdminLoading(false));
  }, [tab, isAdmin, session]);

  const toggleFav = (id) => {
    setFavs((prev) => {
      const next = new Set(prev);
      const jaEra = next.has(id);
      jaEra ? next.delete(id) : next.add(id);
      if (session) {
        if (jaEra) {
          supaDeleteWhere("av_favoritos", session.accessToken, { user_id: session.userId, acao_id: id }).catch(console.error);
        } else {
          supaInsert("av_favoritos", session.accessToken, { user_id: session.userId, acao_id: id }).catch(console.error);
        }
      }
      return next;
    });
  };

  const markDone = (id) => {
    const now = new Date();
    const mesIdx = now.getMonth(), ano = now.getFullYear();
    const valor = Number(doneValor) || 0;
    const nota = doneNote;
    setHistorico((prev) => [
      { id, nota, valor, data: now.toLocaleDateString("pt-BR"), criadoEm: now.toISOString(), mesAno: `${mesIdx + 1}/${ano}`, mesIdx, ano },
      ...prev,
    ]);
    setDoneNote("");
    setDoneValor("");
    if (session) {
      supaInsert("av_historico", session.accessToken, { user_id: session.userId, acao_id: id, valor, nota, mes_idx: mesIdx, ano }).catch(console.error);
    }
  };

  const registrarRapido = () => {
    if (!registrarAcaoId) return;
    markDone(registrarAcaoId);
    setRegistrarAcaoId("");
    setShowRegistrar(false);
  };

  const shiftDash = (delta) => {
    let m = dashMes + delta;
    let a = dashAno;
    if (m < 0) { m = 11; a -= 1; }
    if (m > 11) { m = 0; a += 1; }
    setDashMes(m); setDashAno(a);
  };

  const addMeta = async () => {
    if (!novaMetaAcao || !novaMetaValor) return;
    const acaoId = novaMetaAcao, mes = dashMes, ano = dashAno, valorMeta = Number(novaMetaValor) || 0;
    setNovaMetaAcao(""); setNovaMetaValor(""); setShowMetaForm(false);
    if (session) {
      try {
        const [row] = await supaInsert("av_metas", session.accessToken, { user_id: session.userId, acao_id: acaoId, mes_idx: mes, ano, valor_meta: valorMeta });
        setMetas((prev) => [...prev, { id: row.id, acaoId: row.acao_id, mes: row.mes_idx, ano: row.ano, valorMeta: Number(row.valor_meta) || 0 }]);
      } catch (e) { console.error("Erro ao salvar meta:", e); }
    } else {
      setMetas((prev) => [...prev, { id: `local-${Date.now()}`, acaoId, mes, ano, valorMeta }]);
    }
  };

  const removeMeta = (id) => {
    setMetas((prev) => prev.filter((m) => m.id !== id));
    if (session && !String(id).startsWith("local-")) {
      supaDelete("av_metas", session.accessToken, id).catch(console.error);
    }
  };

  const buscaKw = search.trim() ? buscaInteligente(search) : { cats: new Set(), canais: new Set() };
  const filtered = ACTIONS.filter((a) => {
    const matchesCat = !catFilter || a.cat === catFilter;
    const matchesCanal = !canalFilter || a.canalPrincipal === canalFilter || a.canaisApoio.includes(canalFilter);
    const matchesNicho = !nichoFilter || (a.nichos && a.nichos.includes(nichoFilter));
    const q = search.trim().toLowerCase();
    const matchesTexto = !q || a.nome.toLowerCase().includes(q) || a.tipo.toLowerCase().includes(q) || a.como.toLowerCase().includes(q);
    const matchesKw = buscaKw.cats.has(a.cat) || buscaKw.canais.has(a.canalPrincipal) || a.canaisApoio.some((c) => buscaKw.canais.has(c));
    const matchesSearch = !q || matchesTexto || matchesKw;
    return matchesCat && matchesCanal && matchesNicho && matchesSearch;
  });

  const openAction = openId ? ACTIONS.find((a) => a.id === openId) : null;
  const isDoneAlready = openId ? historico.some((h) => h.id === openId) : false;
  const bibShowMenu = !catFilter && !canalFilter && !nichoFilter && !search.trim();
  const clearBibFilters = () => { setCatFilter(null); setCanalFilter(null); setNichoFilter(null); setSearch(""); };

  const mesAtualKey = `${dashMes + 1}/${dashAno}`;
  const nomeMesAno = new Date(dashAno, dashMes, 1).toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
  const historicoMes = historico.filter((h) => h.mesAno === mesAtualKey);
  const totalMes = historicoMes.reduce((sum, h) => sum + (h.valor || 0), 0);

  const porAcaoMes = {};
  historicoMes.forEach((h) => { porAcaoMes[h.id] = (porAcaoMes[h.id] || 0) + (h.valor || 0); });
  const chartMes = Object.entries(porAcaoMes)
    .map(([id, valor]) => ({ nome: ACTIONS.find((a) => a.id === id)?.nome || id, valor }))
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 6);

  const metasDoMes = metas.filter((m) => m.mes === dashMes && m.ano === dashAno).map((m) => {
    const realizado = porAcaoMes[m.acaoId] || 0;
    const pct = m.valorMeta > 0 ? Math.min(100, Math.round((realizado / m.valorMeta) * 100)) : 0;
    const status = pct >= 100 ? "Concluída" : "Em andamento";
    return { ...m, realizado, pct, status, nome: ACTIONS.find((a) => a.id === m.acaoId)?.nome || m.acaoId, objetivo: ACTIONS.find((a) => a.id === m.acaoId)?.objetivo?.[0] || "" };
  });
  const metaTotalMes = metasDoMes.reduce((s, m) => s + (m.valorMeta || 0), 0);
  const pctMes = metaTotalMes > 0 ? Math.min(100, Math.round((totalMes / metaTotalMes) * 100)) : 0;
  const historicoMesOrdenado = [...historicoMes].sort((a, b) => new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0));

  const resultadosAcaoAtual = (() => {
    if (!openId) return { total: 0, ultimoRegistro: null, qtd: 0 };
    const registros = historico.filter((h) => h.id === openId).sort((a, b) => new Date(b.criadoEm || 0) - new Date(a.criadoEm || 0));
    return {
      total: registros.reduce((s, h) => s + (h.valor || 0), 0),
      ultimoRegistro: registros.length > 0 ? labelRelativo(registros[0].criadoEm) || registros[0].data : null,
      qtd: registros.length,
    };
  })();
  const anosDisponiveis = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 3 + i);

  const now = new Date();
  const anoAtual = now.getFullYear();
  const historicoAno = historico.filter((h) => h.ano === anoAtual);
  const totalPorAcaoAno = {};
  historicoAno.forEach((h) => { totalPorAcaoAno[h.id] = (totalPorAcaoAno[h.id] || 0) + (h.valor || 0); });
  const topAcoesAno = Object.entries(totalPorAcaoAno).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => id);
  const chartAno = MESES_ABREV.map((mes, idx) => {
    const row = { mes };
    let outras = 0;
    historicoAno.filter((h) => h.mesIdx === idx).forEach((h) => {
      const a = ACTIONS.find((x) => x.id === h.id);
      const nome = a?.nome || h.id;
      if (topAcoesAno.includes(h.id)) {
        row[nome] = (row[nome] || 0) + (h.valor || 0);
      } else {
        outras += h.valor || 0;
      }
    });
    if (outras > 0) row["Outras"] = outras;
    return row;
  });
  const chartAnoSeries = [
    ...topAcoesAno.map((id) => ACTIONS.find((a) => a.id === id)?.nome || id),
    ...(chartAno.some((r) => r["Outras"]) ? ["Outras"] : []),
  ];

  const goto = (t, resetBib) => {
    setOpenId(null);
    if (resetBib && t === "biblioteca") { setCatFilter(null); setCanalFilter(null); setNichoFilter(null); setSearch(""); }
    setTab(t);
  };
  const logout = () => {
    setStage("login"); setSession(null); setTab("inicio"); setOpenId(null);
    setSearch(""); setCatFilter(null); setCanalFilter(null); setNichoFilter(null);
    setHistorico([]); setMetas([]); setFavs(new Set());
    setPerfil(null); setMeuDiagnostico(null);
  };

  const baseStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&family=Manrope:wght@500;600;700&display=swap');
    * { box-sizing: border-box; }
    .app-wrap {
      --paper: #FAFAF8;
      --card: #FFFFFF;
      --ink: #1C201D;
      --ink-soft: #6B7268;
      --wine: #143F35;
      --wine-dark: #0B2A23;
      --mustard: #4E9C7C;
      --line: #E2E4DE;
      font-family: 'Work Sans', sans-serif;
      color: var(--ink);
      min-height: 100vh;
      background: var(--paper);
    }

    /* ---- AUTH / INTRO ---- */
    .auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .auth-card {
      width: 100%; max-width: 380px; background: var(--card); border: 1px solid var(--line);
      border-radius: 18px; padding: 32px 28px; box-shadow: 0 20px 50px rgba(28,32,29,0.08);
    }
    .auth-eyebrow {
      font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--mustard);
    }
    .auth-title { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; margin: 6px 0 4px; }
    .auth-sub { font-size: 13px; color: var(--ink-soft); margin: 0 0 20px; line-height: 1.5; }
    .auth-label { font-size: 11.5px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.04em; display:block; margin: 12px 0 6px; }
    .auth-input {
      display: flex; align-items: center; gap: 8px; border: 1px solid var(--line); border-radius: 10px;
      padding: 11px 12px; background: var(--paper);
    }
    .auth-input input { border: none; outline: none; background: transparent; font-size: 14px; width: 100%; color: var(--ink); font-family: 'Work Sans', sans-serif; }
    .auth-erro { color: #A13A3A; font-size: 12px; margin-top: 10px; }
    .auth-msg { color: var(--wine); font-size: 12px; margin-top: 10px; line-height: 1.5; }
    .auth-nota { font-size: 11.5px; color: var(--ink-soft); text-align: center; margin-top: 12px; line-height: 1.5; }
    .btn-ghost {
      width: 100%; background: none; border: none; color: var(--ink-soft); font-size: 12.5px;
      padding: 10px; cursor: pointer; text-decoration: underline; font-family: 'Work Sans', sans-serif;
    }
    .intro-card { max-width: 420px; }
    .quiz-progress-track { height: 4px; background: var(--line); border-radius: 999px; margin-bottom: 18px; overflow: hidden; }
    .quiz-progress-fill { height: 100%; background: var(--wine); border-radius: 999px; transition: width 0.25s; }
    .quiz-opcoes { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .quiz-opcao {
      text-align: left; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--card);
      font-family: 'Work Sans', sans-serif; font-size: 13.5px; color: var(--ink); cursor: pointer;
    }
    .quiz-opcao:hover { border-color: var(--wine); background: var(--paper); }

    .resultado-card { max-width: 440px; }
    .indice-hero {
      display: flex; align-items: baseline; justify-content: center; gap: 4px; background: var(--wine); color: #fff;
      border-radius: 14px; padding: 20px; margin: 14px 0 18px; flex-wrap: wrap;
    }
    .indice-num { font-family: 'Fraunces', serif; font-size: 42px; font-weight: 600; }
    .indice-max { font-size: 15px; opacity: 0.75; }
    .indice-faixa { width: 100%; text-align: center; font-size: 12.5px; margin-top: 4px; opacity: 0.9; }

    .pilares-wrap { display: flex; flex-direction: column; gap: 12px; }
    .pilar-row-top { display: flex; justify-content: space-between; font-size: 12.5px; margin-bottom: 5px; }
    .pilar-faixa { font-family: 'IBM Plex Mono', monospace; font-size: 10px; text-transform: uppercase; }
    .pilar-faixa.faixa-Crítico, .pilar-faixa.faixa-Crítica { color: #A13A3A; }
    .pilar-faixa.faixa-Emdesenvolvimento { color: var(--mustard); }
    .pilar-faixa.faixa-Consistente { color: var(--wine); }

    /* ---- APP SHELL ---- */
    .shell { display: flex; min-height: 100vh; }
    .sidebar {
      display: none; width: 230px; flex-shrink: 0; background: var(--card); border-right: 1px solid var(--line);
      padding: 22px 16px; flex-direction: column;
    }
    .sidebar-logo { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600; margin-bottom: 26px; }
    .sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
    .sidebar-link {
      display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 9px;
      font-size: 13.5px; color: var(--ink-soft); cursor: pointer; background: none; border: none; text-align: left;
      font-family: 'Work Sans', sans-serif;
    }
    .sidebar-link.active { background: var(--wine); color: #fff; }
    .sidebar-logout {
      display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--ink-soft);
      background: none; border: none; cursor: pointer; padding: 10px 12px;
    }
    .main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
    .main-content { flex: 1; overflow-y: auto; padding-bottom: 90px; }

    .screen { display: flex; flex-direction: column; min-height: 100%; }
    .scroll { padding: 0 20px 40px; max-width: 720px; margin: 0 auto; width: 100%; }

    .topbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px 20px 14px; border-bottom: 1px solid var(--line); background: var(--card);
    }
    .topbar-title {
      font-family: 'IBM Plex Mono', monospace; font-size: 11px;
      letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft);
    }
    .iconbtn { background: none; border: none; cursor: pointer; color: var(--ink); padding: 4px; display: flex; align-items: center; }

    .home-header { padding: 26px 20px 10px; max-width: 720px; margin: 0 auto; width: 100%; }
    .home-eyebrow { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--mustard); }
    .home-title { font-family: 'Fraunces', serif; font-size: 28px; font-weight: 600; margin: 4px 0 2px; line-height: 1.15; }
    .home-sub { font-size: 13.5px; color: var(--ink-soft); margin: 0; }

    .search-bar {
      margin: 16px auto 6px; display: flex; align-items: center; gap: 8px; max-width: 720px;
      background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 11px 14px; width: calc(100% - 40px);
    }
    .search-bar input { border: none; outline: none; background: transparent; font-size: 13.5px; font-family: 'Work Sans', sans-serif; width: 100%; color: var(--ink); }

    .stats-row { display: flex; gap: 10px; margin: 16px auto; max-width: 720px; padding: 0 20px; }
    .stat-box { flex: 1; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 12px 14px; }
    .stat-num { font-family: 'Fraunces', serif; font-size: 21px; font-weight: 600; color: var(--wine); }
    .stat-label { font-size: 10.5px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.05em; }

    .section-label {
      font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.08em;
      text-transform: uppercase; color: var(--ink-soft); margin: 18px auto 8px; max-width: 720px; padding: 0 20px;
    }

    .catrow { display: flex; gap: 8px; overflow-x: auto; padding: 0 20px 6px; max-width: 720px; margin: 0 auto; }
    .catrow::-webkit-scrollbar { display: none; }
    .catchip {
      flex-shrink: 0; display: flex; align-items: center; gap: 6px;
      background: var(--card); border: 1px solid var(--line); border-radius: 999px;
      padding: 7px 12px; font-size: 12px; cursor: pointer; white-space: nowrap; color: var(--wine); font-weight: 500;
    }
    .catchip.active { background: var(--wine); border-color: var(--wine); color: #fff; }

    .bib-section-title {
      display: inline-block; background: var(--wine); color: #fff; font-family: 'IBM Plex Mono', monospace;
      font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; padding: 6px 14px; border-radius: 999px;
      margin: 18px auto 10px; max-width: 720px; width: fit-content;
    }
    .bib-section-title:first-of-type { margin-top: 4px; }

    .bib-video-wrap { max-width: 720px; margin: 14px auto 0; padding: 0 20px; }
    .bib-video-destaque { margin: 0; box-shadow: 0 2px 8px rgba(20,63,53,0.05); }
    .bib-video-caption { font-size: 12px; color: var(--ink-soft); line-height: 1.5; margin: 8px 4px 0; }

    .bib-busca-wrap { max-width: 720px; margin: 18px auto 4px; padding: 0 20px; }
    .bib-busca-label {
      font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase;
      color: var(--wine); margin-bottom: 8px;
    }
    .bib-busca-bar { margin: 0 !important; padding: 14px 16px !important; border: 1.5px solid var(--wine) !important; box-shadow: 0 2px 10px rgba(20,63,53,0.08); }
    .bib-busca-bar input { font-size: 14px !important; }
    .bib-sugestoes { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 10px; }
    .bib-sugestao-chip {
      background: var(--paper); border: 1px solid var(--line); color: var(--wine); font-size: 11.5px; font-weight: 500;
      padding: 6px 12px; border-radius: 999px; cursor: pointer; font-family: 'Work Sans', sans-serif;
    }
    .bib-sugestao-chip:hover { background: var(--wine); color: #fff; border-color: var(--wine); }

    .tagcard.tagcard-alt { background: #EEF6F1; }

    .filter-block { max-width: 720px; margin: 0 auto; width: 100%; }
    .filter-title { font-size: 10.5px; color: var(--ink-soft); padding: 6px 20px 2px; text-transform: uppercase; letter-spacing: 0.05em; font-family: 'IBM Plex Mono', monospace; }

    .menu-wrap { max-width: 720px; margin: 0 auto; width: 100%; padding-bottom: 20px; }
    .menu-list { display: flex; flex-direction: column; gap: 6px; padding: 0 20px 8px; }
    .menu-row {
      display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--line);
      border-radius: 10px; padding: 12px 14px; cursor: pointer; text-align: left; width: 100%;
      font-family: 'Work Sans', sans-serif; color: var(--ink);
    }
    .menu-row-icon { color: var(--wine); display: flex; }
    .menu-row-label { font-size: 13.5px; flex: 1; }
    .menu-count {
      font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--ink-soft);
      background: var(--paper); border-radius: 999px; padding: 2px 8px;
    }

    .active-filters {
      display: flex; flex-wrap: wrap; gap: 8px; align-items: center; max-width: 720px; margin: 4px auto 10px;
      padding: 0 20px;
    }
    .filter-pill {
      display: flex; align-items: center; gap: 5px; background: var(--wine); color: #fff; border-radius: 999px;
      padding: 5px 8px 5px 12px; font-size: 12px;
    }
    .filter-pill svg { cursor: pointer; }
    .filter-clear { font-size: 12px; color: var(--ink-soft); text-decoration: underline; cursor: pointer; }

    .featured-wrap { padding: 6px 20px 4px; max-width: 720px; margin: 0 auto; }
    .home-cta-wrap { max-width: 720px; margin: 4px auto 30px; padding: 0 20px; }

    .mes-nav {
      display: flex; align-items: center; justify-content: center; gap: 14px; max-width: 720px; margin: 0 auto 12px;
      padding: 0 20px;
    }
    .mes-nav-btn {
      background: var(--card); border: 1px solid var(--line); border-radius: 8px; width: 30px; height: 30px;
      display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--wine);
    }
    .mes-nav-label { font-family: 'Fraunces', serif; font-size: 15px; font-weight: 600; text-transform: capitalize; min-width: 150px; text-align: center; }

    .metas-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 12px; }
    .meta-row { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; }
    .meta-row-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    .meta-nome { font-size: 13px; font-weight: 500; }
    .meta-del { background: none; border: none; color: var(--ink-soft); cursor: pointer; padding: 2px; }
    .meta-bar-track { height: 7px; background: var(--paper); border-radius: 999px; overflow: hidden; }
    .meta-bar-fill { height: 100%; background: var(--wine); border-radius: 999px; transition: width 0.3s; }
    .meta-row-bottom { display: flex; justify-content: space-between; margin-top: 6px; font-size: 11px; color: var(--ink-soft); }
    .meta-pct { font-family: 'IBM Plex Mono', monospace; color: var(--wine); font-weight: 500; }

    .meta-form { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 14px; margin-bottom: 14px; }
    .meta-select {
      width: 100%; border: 1px solid var(--line); border-radius: 10px; padding: 10px 12px; background: var(--paper);
      font-family: 'Work Sans', sans-serif; font-size: 13px; color: var(--ink);
    }

    .resultados-wrap { max-width: 720px; margin: 0 auto; padding: 0 20px; }
    .resultados-summary {
      display: flex; align-items: baseline; gap: 8px; background: var(--wine); color: #fff; border-radius: 12px;
      padding: 16px 18px; margin-bottom: 12px;
    }
    .resultados-summary .stat-num { color: #fff; font-size: 22px; }

    .diag-mini-card { display: flex; align-items: center; gap: 14px; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px; }
    .diag-mini-card-sm { padding: 10px 14px; gap: 10px; }
    .diag-mini-card-sm .diag-mini-faixa { font-size: 11px; }
    .diag-mini-card-sm .diag-mini-linha { font-size: 11px; }

    /* ---- DASHBOARD (Painel Comercial) ---- */
    .dash-header {
      display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 12px;
      max-width: 1040px; margin: 0 auto; width: 100%; padding: 28px 24px 6px;
    }
    .dash-ola { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--mustard); }
    .dash-titulo { font-family: 'Fraunces', serif; font-size: 26px; font-weight: 600; margin: 4px 0 0; color: var(--ink); }
    .dash-selectors { display: flex; gap: 8px; }
    .dash-select {
      border: 1px solid var(--line); background: var(--card); border-radius: 8px; padding: 8px 10px; font-size: 12.5px;
      color: var(--ink); font-family: 'Work Sans', sans-serif; cursor: pointer;
    }

    .dash-cards-row {
      display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; max-width: 1040px; margin: 18px auto 0; padding: 0 24px;
    }
    .dash-card {
      background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px;
      box-shadow: 0 1px 3px rgba(20,63,53,0.05); display: flex; flex-direction: column; gap: 4px;
    }
    .dash-card-label { font-size: 11px; color: var(--ink-soft); }
    .dash-card-valor { font-family: 'Fraunces', serif; font-size: 21px; font-weight: 600; color: var(--ink); }
    .dash-card-valor-verde { color: var(--wine); }

    .dash-progress-wrap { max-width: 1040px; margin: 18px auto 0; padding: 0 24px; }
    .dash-progress-top { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--ink-soft); margin-bottom: 6px; }
    .dash-progress-pct { color: var(--wine); font-weight: 600; }
    .dash-progress-track { height: 10px; background: var(--paper); border: 1px solid var(--line); border-radius: 999px; overflow: hidden; }
    .dash-progress-fill { height: 100%; background: var(--wine); border-radius: 999px; transition: width 0.4s; }

    .dash-columns { display: grid; grid-template-columns: 1fr; gap: 26px; max-width: 1040px; margin: 26px auto 40px; padding: 0 24px; }
    .dash-col-title { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 12px; }

    .dash-acoes-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 10px; }
    .dash-acao-card {
      text-align: left; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px;
      box-shadow: 0 1px 3px rgba(20,63,53,0.04); cursor: pointer; font-family: 'Work Sans', sans-serif;
    }
    .dash-acao-top { display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 4px; }
    .dash-acao-nome { font-size: 13.5px; font-weight: 600; color: var(--ink); }
    .dash-status { font-size: 10px; padding: 3px 9px; border-radius: 999px; font-weight: 500; flex-shrink: 0; }
    .dash-status.andamento { background: #EAF0EC; color: var(--wine); }
    .dash-status.concluida { background: var(--wine); color: #fff; }
    .dash-acao-objetivo { font-size: 12px; color: var(--ink-soft); margin: 0 0 8px; }
    .dash-acao-valores { display: flex; justify-content: space-between; font-size: 11.5px; color: var(--ink-soft); margin-top: 6px; }

    .dash-timeline { display: flex; flex-direction: column; }
    .dash-timeline-item { display: flex; align-items: baseline; gap: 14px; padding: 10px 0; border-bottom: 1px solid var(--line); }
    .dash-timeline-item:last-child { border-bottom: none; }
    .dash-timeline-dia { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--ink-soft); width: 52px; flex-shrink: 0; }
    .dash-timeline-linha { display: flex; justify-content: space-between; flex: 1; gap: 10px; }
    .dash-timeline-nome { font-size: 13px; color: var(--ink); }
    .dash-timeline-valor { font-size: 13px; font-weight: 600; color: var(--wine); }

    .dash-col-side { display: flex; flex-direction: column; gap: 14px; }
    .dash-card-white { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(20,63,53,0.04); }
    .dash-atalhos { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .dash-atalho-btn {
      display: flex; align-items: center; gap: 8px; justify-content: center; background: var(--card); border: 1px solid var(--line);
      border-radius: 10px; padding: 12px 8px; font-size: 12px; color: var(--ink); cursor: pointer; font-family: 'Work Sans', sans-serif;
    }
    .dash-atalho-btn:hover { border-color: var(--wine); color: var(--wine); }
    .dash-diag-card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(20,63,53,0.04); }

    @media (min-width: 860px) {
      .dash-columns { grid-template-columns: 1.6fr 1fr; }
      .dash-cards-row { grid-template-columns: repeat(4, 1fr); }
    }

    .diag-mini-indice { display: flex; align-items: baseline; gap: 2px; color: var(--wine); flex-shrink: 0; }
    .diag-mini-info { display: flex; flex-direction: column; gap: 2px; }
    .diag-mini-faixa { font-size: 12px; color: var(--mustard); font-weight: 500; margin-bottom: 2px; }
    .diag-mini-linha { font-size: 12px; color: var(--ink-soft); }
    .diag-mini-linha b { color: var(--ink); font-weight: 600; }

    .registrar-atalho {
      width: 100%; display: flex; align-items: center; gap: 12px; background: var(--card); border: 1px solid var(--line);
      border-radius: 12px; padding: 14px 16px; cursor: pointer; text-align: left; font-family: 'Work Sans', sans-serif;
    }
    .registrar-atalho-icon {
      width: 36px; height: 36px; border-radius: 50%; background: var(--wine); color: #fff; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .registrar-atalho-texto { display: flex; flex-direction: column; flex: 1; gap: 2px; }
    .registrar-atalho-titulo { font-size: 13.5px; font-weight: 600; color: var(--ink); }
    .registrar-atalho-sub { font-size: 11.5px; color: var(--ink-soft); line-height: 1.4; }
    .registrar-card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px; }

    .tutorial-placeholder {
      display: flex; align-items: center; gap: 12px; padding: 12px 16px;
      background: var(--paper); border: 1.5px dashed var(--line); border-radius: 12px; margin: 0 20px 14px;
    }
    .tutorial-placeholder > div { display: flex; flex-direction: column; gap: 2px; }
    .tutorial-titulo { display: block; font-size: 13px; font-weight: 600; color: var(--ink); }
    .tutorial-sub { display: block; font-size: 11.5px; color: var(--ink-soft); line-height: 1.4; }

    .admin-card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px; margin-bottom: 12px; }
    .admin-contato { display: flex; flex-direction: column; gap: 4px; padding-bottom: 10px; border-bottom: 1px solid var(--line); }
    .admin-loja-nome { font-family: 'Fraunces', serif; font-weight: 600; font-size: 15px; }
    .admin-data { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--ink-soft); }
    .admin-contato-linha { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 4px; }
    .admin-respostas { display: flex; flex-direction: column; gap: 8px; }
    .admin-resposta-item { display: flex; justify-content: space-between; gap: 10px; font-size: 12.5px; padding-bottom: 6px; border-bottom: 1px dashed var(--line); }
    .admin-resposta-item:last-child { border-bottom: none; }
    .admin-resposta-pergunta { color: var(--ink-soft); flex: 1; }
    .admin-resposta-valor { color: var(--ink); font-weight: 500; text-align: right; flex-shrink: 0; }
    .resultados-summary .stat-label { color: rgba(255,255,255,0.75); }

    .chart-box { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px 10px 6px; }

    .valor-input {
      display: flex; align-items: center; gap: 6px; border: 1px solid var(--line); border-radius: 10px;
      padding: 10px 12px; background: var(--paper); margin-bottom: 6px;
    }
    .valor-prefix { color: var(--ink-soft); font-size: 13.5px; }
    .valor-input input {
      border: none; outline: none; background: transparent; font-size: 15px; width: 100%; color: var(--ink);
      font-family: 'Work Sans', sans-serif;
    }
    .valor-nota { font-size: 11.5px; color: var(--ink-soft); line-height: 1.4; margin: 0 0 12px; }

    .hist-valor {
      display: inline-block; margin-top: 6px; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px;
      color: var(--wine); font-weight: 500;
    }

    .btn-ghost-box {
      display: flex; align-items: center; gap: 7px; background: var(--card); border: 1px solid var(--line);
      border-radius: 10px; padding: 10px 14px; font-size: 12.5px; color: var(--wine); cursor: pointer;
      margin-bottom: 14px; font-family: 'Work Sans', sans-serif;
    }

    .empty-state.small { padding: 34px 20px; }
    .empty-state.small svg { margin-bottom: 8px; }
    .empty-state.small p { font-size: 12.5px; }

    .list-wrap { padding: 4px 16px 40px; display: flex; flex-direction: column; gap: 10px; max-width: 720px; margin: 0 auto; }
    .list-grid-desktop { display: grid; grid-template-columns: 1fr; gap: 10px; }

    .tagcard {
      position: relative; background: var(--card); border: 1px solid var(--line);
      border-radius: 4px 12px 12px 4px; padding: 12px 14px 12px 22px; cursor: pointer;
    }
    .tagcard-hole {
      position: absolute; left: -6px; top: 22px; width: 12px; height: 12px; border-radius: 50%;
      background: var(--paper); border: 1.5px solid var(--line);
    }
    .tagcard-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px; }
    .tagcard-cat {
      font-family: 'IBM Plex Mono', monospace; font-size: 9.5px; letter-spacing: 0.04em;
      text-transform: uppercase; color: var(--mustard); display: flex; align-items: center; gap: 4px;
    }
    .tagcard-fav { background: none; border: none; cursor: pointer; padding: 2px; }
    .tagcard-nome { font-family: 'Fraunces', serif; font-size: 16.5px; font-weight: 600; margin: 2px 0 3px; }
    .tagcard-como { font-size: 12.5px; color: var(--ink-soft); margin: 0 0 8px; line-height: 1.4; }
    .tagcard-canais { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 8px; }
    .tagcard-foot { display: flex; align-items: center; justify-content: space-between; }
    .tagcard-duracao { font-size: 11px; color: var(--ink-soft); display: flex; align-items: center; gap: 4px; }
    .nicho-tag { color: var(--mustard); font-weight: 500; }

    .nicho-examples { display: flex; flex-direction: column; gap: 10px; }
    .nicho-example-item { background: var(--paper); border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; }
    .nicho-example-label { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--wine); margin-bottom: 3px; }
    .nicho-example-text { font-size: 12.5px; color: var(--ink); line-height: 1.4; }

    .canal-pill {
      display: inline-flex; align-items: center; gap: 3px; background: var(--paper); border: 1px solid var(--line);
      border-radius: 999px; padding: 3px 8px; font-size: 10.5px; color: var(--ink-soft);
    }
    .canal-pill.sm { padding: 2px 7px; font-size: 10px; }
    .canal-pill.main { background: var(--wine); color: #fff; border-color: var(--wine); font-weight: 500; }

    .empty-state { text-align: center; padding: 60px 30px; color: var(--ink-soft); }
    .empty-state svg { margin-bottom: 10px; opacity: 0.5; }
    .empty-state p { font-size: 13px; line-height: 1.5; }

    .dtl-topbar-title { font-family: 'Manrope', sans-serif; text-transform: none; letter-spacing: 0; font-weight: 600; font-size: 13px; }

    .dtl-header { padding: 18px 0 6px; }
    .dtl-nome { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; margin: 0 0 6px; line-height: 1.15; color: var(--ink); }
    .dtl-desc { font-size: 13.5px; line-height: 1.55; color: var(--ink-soft); margin: 0 0 12px; }
    .dtl-chips { display: flex; flex-wrap: wrap; gap: 8px; }
    .dtl-chip {
      display: inline-flex; align-items: center; gap: 6px; background: var(--paper); border: 1px solid var(--line);
      border-radius: 999px; padding: 6px 12px; font-family: 'Manrope', sans-serif; font-size: 12px; font-weight: 500; color: var(--ink);
    }
    .dtl-chip svg { color: var(--wine); flex-shrink: 0; }

    .dtl-section-card {
      background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 18px;
      box-shadow: 0 2px 8px rgba(20,63,53,0.05); margin: 16px 0;
    }
    .dtl-section-title { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 15px; color: var(--ink); margin-bottom: 4px; }
    .dtl-section-card .acc { border: none; border-bottom: 1px solid var(--line); border-radius: 0; margin-bottom: 0; background: none; }
    .dtl-section-card .acc:last-child { border-bottom: none; }
    .dtl-section-card .acc-header { padding: 12px 2px; }

    .dtl-checklist-top { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px; }
    .dtl-checklist-titulo { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 15px; color: var(--ink); }
    .dtl-checklist-pct { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 12.5px; color: var(--wine); }
    .dtl-marco { padding: 8px 0 14px; }
    .dtl-marco:last-child { padding-bottom: 0; }
    .dtl-marco-titulo { display: block; font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--mustard); margin-bottom: 8px; }

    /* Vamos executar: tema escuro (verde escuro da identidade) */
    .dtl-checklist-card {
      background: var(--wine); border-color: var(--wine); color: #fff;
    }
    .dtl-checklist-card .dtl-checklist-titulo { color: #fff; }
    .dtl-checklist-card .dtl-checklist-pct { color: rgba(255,255,255,0.85); }
    .dtl-checklist-card .dash-progress-track { background: rgba(255,255,255,0.18); border-color: transparent; }
    .dtl-checklist-card .dash-progress-fill { background: #fff; }
    .dtl-checklist-card .acc { border-bottom-color: rgba(255,255,255,0.18); }
    .dtl-checklist-card .acc-header-left { color: #fff; }
    .dtl-checklist-card .acc-chevron { color: rgba(255,255,255,0.7); }
    .dtl-checklist-card .checkitem span { color: rgba(255,255,255,0.95); }
    .dtl-checklist-card .checkitem .done { color: rgba(255,255,255,0.5); }
    .dtl-checklist-card .checkitem input { accent-color: #fff; }
    .dtl-checklist-card .dtl-marco-titulo { color: rgba(255,255,255,0.65); }

    .dtl-guia-title { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 13px; color: var(--ink); margin: 22px 2px 10px; }

    .dtl-dica-block {
      background: var(--mustard); color: #fff; border-radius: 14px; padding: 18px; margin: 16px 0;
      box-shadow: 0 2px 8px rgba(20,63,53,0.06);
    }
    .dtl-dica-titulo {
      display: flex; align-items: center; gap: 7px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px;
      text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.85); margin-bottom: 8px;
    }
    .dtl-dica-texto { margin: 0; font-size: 13.5px; line-height: 1.55; color: #fff; }

    .dtl-resultado-block {
      background: #EAF5EF; border: 1px solid #D3E8DD; border-radius: 14px; padding: 18px; margin: 16px 0;
    }
    .dtl-resultado-titulo {
      display: flex; align-items: center; gap: 7px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px;
      text-transform: uppercase; letter-spacing: 0.04em; color: var(--wine); margin-bottom: 8px;
    }
    .dtl-resultado-lista { margin: 0; }

    .dtl-resultados-card {
      background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 18px;
      box-shadow: 0 2px 8px rgba(20,63,53,0.05); margin: 20px 0;
    }
    .dtl-resultados-titulo { display: block; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14px; color: var(--ink); margin-bottom: 14px; }
    .dtl-resultados-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px; }
    .dtl-resultados-item { display: flex; flex-direction: column; gap: 3px; }
    .dtl-resultados-label { font-size: 10.5px; color: var(--ink-soft); }
    .dtl-resultados-valor { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600; color: var(--wine); }
    .dtl-resultados-valor-sm { font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600; color: var(--ink); }

    .dtl-relacionadas-grid { display: grid; grid-template-columns: 1fr; gap: 8px; margin-bottom: 20px; }
    .dtl-relacionada-card {
      text-align: left; background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px;
      cursor: pointer; font-family: 'Manrope', sans-serif; display: flex; flex-direction: column; gap: 2px;
    }
    .dtl-relacionada-card:hover { border-color: var(--wine); }
    .dtl-relacionada-nome { font-size: 13px; font-weight: 600; color: var(--ink); }
    .dtl-relacionada-tipo { font-size: 11px; color: var(--ink-soft); }

    .acc { border: 1px solid var(--line); border-radius: 10px; margin-bottom: 8px; background: var(--card); overflow: hidden; }
    .acc-header {
      width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 8px;
      padding: 12px 14px; background: none; border: none; cursor: pointer; text-align: left;
    }
    .acc-header-left {
      display: flex; align-items: center; gap: 7px; font-family: 'IBM Plex Mono', monospace; font-size: 11px;
      letter-spacing: 0.05em; text-transform: uppercase; color: var(--wine);
    }
    .dtl-wrap .acc-header-left {
      font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 13px; letter-spacing: 0; text-transform: none;
    }
    .acc-chevron { color: var(--ink-soft); transition: transform 0.25s ease; flex-shrink: 0; }
    .acc-chevron.open { transform: rotate(90deg); }
    .acc-body { padding: 0 14px 14px; animation: dtlFadeIn 0.2s ease; }
    @keyframes dtlFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
    .acc-plain-text { margin: 0; font-size: 13.5px; line-height: 1.55; color: var(--ink); }
    .acc.acc-gold { border-left: 3px solid var(--mustard); }
    .acc.acc-gold .acc-header-left { color: var(--mustard); }
    .acc.acc-green { border-left: 3px solid var(--wine); }

    .canal-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap; }
    .canal-row:last-of-type { margin-bottom: 8px; }
    .canal-row-label { font-size: 11.5px; color: var(--ink-soft); min-width: 105px; flex-shrink: 0; }
    .canal-caption { font-size: 11.5px; color: var(--ink-soft); font-style: italic; margin: 4px 0 0; line-height: 1.4; }
    .canal-alt-nota { font-size: 12px; color: var(--ink); line-height: 1.5; margin: 10px 0 0; padding: 10px 12px; background: var(--paper); border-radius: 8px; border-left: 3px solid var(--mustard); }

    .section { margin: 16px 0; }
    .section-title {
      font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.07em;
      text-transform: uppercase; color: var(--wine); margin: 0 0 6px;
    }
    .section-body { font-size: 13.5px; line-height: 1.55; color: var(--ink); }

    .steps { margin: 0; padding-left: 0; list-style: none; display: flex; flex-direction: column; gap: 10px; counter-reset: stepcounter; }
    .steps li { font-size: 13.5px; line-height: 1.5; position: relative; padding-left: 30px; counter-increment: stepcounter; }
    .steps li::before {
      content: counter(stepcounter); position: absolute; left: 0; top: -1px; width: 20px; height: 20px;
      border-radius: 50%; background: var(--wine); color: #fff; font-size: 10.5px; font-family: 'IBM Plex Mono', monospace;
      display: flex; align-items: center; justify-content: center;
    }

    .resumo-card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 4px 16px; margin: 16px 0; }
    .resumo-row { padding: 12px 0; border-bottom: 1px solid var(--line); }
    .resumo-row:last-child { border-bottom: none; }
    .resumo-label {
      display: block; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.05em;
      text-transform: uppercase; color: var(--mustard); margin-bottom: 4px;
    }
    .resumo-row p { margin: 0; font-size: 13.5px; line-height: 1.5; color: var(--ink); }
    .bullet-list { margin: 0; padding-left: 18px; font-size: 13.5px; line-height: 1.5; color: var(--ink); }
    .bullet-list li { margin-bottom: 4px; }
    .bullet-list li:last-child { margin-bottom: 0; }
    .callout-bullets { padding-left: 16px; }
    .callout-bullets li { color: #fff; }

    .msg-list { display: flex; flex-direction: column; gap: 10px; }
    .msg-item { background: var(--paper); border: 1px solid var(--line); border-left: 3px solid var(--wine); border-radius: 8px; padding: 10px 12px; }
    .msg-canal { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--wine); margin-bottom: 4px; }
    .msg-texto { margin: 0; font-size: 13px; font-style: italic; color: var(--ink); line-height: 1.5; }

    .callout { display: flex; gap: 11px; border-radius: 12px; padding: 14px 16px; margin: 12px 0; }
    .callout-solid { background: var(--wine); color: #fff; }
    .callout-outline { background: var(--card); border: 1px solid var(--line); border-left: 3px solid var(--mustard); }
    .callout-icon { flex-shrink: 0; margin-top: 1px; }
    .callout-solid .callout-icon { color: #fff; }
    .callout-outline .callout-icon { color: var(--mustard); }
    .callout-title {
      display: block; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.05em;
      text-transform: uppercase; margin-bottom: 4px;
    }
    .callout-solid .callout-title { color: rgba(255,255,255,0.75); }
    .callout-outline .callout-title { color: var(--wine); }
    .callout-text { margin: 0; font-size: 13.5px; line-height: 1.5; }
    .callout-solid .callout-text { color: #fff; }
    .callout-outline .callout-text { color: var(--ink); }

    .roteiro-lead { font-size: 12.5px; color: var(--ink-soft); font-style: italic; margin: 0 0 16px; }
    .etapa-bloco { margin-bottom: 18px; }
    .etapa-bloco:last-child { margin-bottom: 0; }
    .etapa-titulo {
      display: flex; align-items: center; gap: 8px; font-family: 'IBM Plex Mono', monospace; font-size: 11px;
      letter-spacing: 0.05em; text-transform: uppercase; color: var(--wine); margin-bottom: 10px;
    }
    .etapa-num {
      display: flex; align-items: center; justify-content: center; width: 18px; height: 18px; border-radius: 50%;
      background: var(--wine); color: #fff; font-size: 10px;
    }
    .roteiro-sub { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; margin-top: 8px; }
    .roteiro-titulo { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--mustard); margin-bottom: 8px; }

    .checklist { display: flex; flex-direction: column; gap: 8px; }
    .checkitem { display: flex; align-items: center; gap: 8px; font-size: 13px; cursor: pointer; }
    .checkitem input { accent-color: var(--wine); width: 15px; height: 15px; }
    .checkitem .done { text-decoration: line-through; color: var(--ink-soft); transition: color 0.2s ease; }

    .chiprow { display: flex; flex-wrap: wrap; gap: 6px; }
    .chip { background: var(--card); border: 1px solid var(--line); border-radius: 999px; padding: 5px 11px; font-size: 11.5px; color: var(--ink-soft); }

    .done-box { margin: 20px 0 30px; padding-top: 12px; border-top: 1px solid var(--line); }
    .done-input {
      width: 100%; border: 1px solid var(--line); border-radius: 10px; padding: 10px;
      font-family: 'Work Sans', sans-serif; font-size: 13px; resize: none; height: 60px;
      margin-bottom: 10px; background: var(--card); color: var(--ink);
    }
    .btn-primary {
      width: 100%; background: var(--wine); color: #fff; border: none; border-radius: 10px;
      padding: 12px; font-size: 13.5px; font-weight: 500; cursor: pointer; font-family: 'Work Sans', sans-serif;
    }
    .btn-primary:hover { background: var(--wine-dark); }
    .done-confirm {
      display: flex; align-items: center; gap: 6px; justify-content: center;
      background: #EAF0EC; color: var(--wine); padding: 12px; border-radius: 10px; font-size: 13px;
    }

    .hist-item { background: var(--card); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; margin-bottom: 10px; }
    .hist-top { display: flex; justify-content: space-between; align-items: center; }
    .hist-nome { font-family: 'Fraunces', serif; font-weight: 600; font-size: 14.5px; }
    .hist-data { font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; color: var(--ink-soft); }
    .hist-nota { font-size: 12px; color: var(--ink-soft); margin-top: 4px; }

    .tabbar { display: flex; border-top: 1px solid var(--line); background: var(--card); padding: 8px 4px 12px; position: fixed; bottom: 0; left: 0; right: 0; }
    .tabbtn { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 3px; background: none; border: none; cursor: pointer; color: var(--ink-soft); padding: 4px; }
    .tabbtn.active { color: var(--wine); }
    .tabbtn span { font-size: 10px; font-weight: 500; }

    @media (min-width: 860px) {
      .sidebar { display: flex; }
      .tabbar { display: none; }
      .main-content { padding-bottom: 0; }
    }
  `;

  if (stage === "login") return (
    <div className="app-wrap"><style>{baseStyles}</style><LoginScreen onAuthed={(s) => {
      setSession(s);
      (async () => {
        try {
          const [diags, perfis] = await Promise.all([
            supaSelect("av_diagnosticos", s.accessToken, s.userId),
            supaSelect("av_perfis", s.accessToken, s.userId),
          ]);
          if (diags.length === 0) setStage("diagnostico");
          else if (perfis.length === 0) setStage("perfil");
          else setStage("app");
        } catch (e) {
          console.error("Erro ao verificar cadastro existente:", e);
          setStage("diagnostico");
        }
      })();
    }} /></div>
  );
  if (stage === "diagnostico") return (
    <div className="app-wrap"><style>{baseStyles}</style><DiagnosticoScreen session={session} onContinue={() => setStage("perfil")} /></div>
  );
  if (stage === "perfil") return (
    <div className="app-wrap"><style>{baseStyles}</style><PerfilScreen session={session} onContinue={(p) => { setPerfil(p); setStage("app"); }} /></div>
  );

  return (
    <div className="app-wrap">
      <style>{baseStyles}</style>
      <div className="shell">
        <aside className="sidebar">
          <div className="sidebar-logo">Gerador de Caixa</div>
          <nav className="sidebar-nav">
            {navItems.map((n) => (
              <button key={n.id} className={`sidebar-link ${tab === n.id && !openAction ? "active" : ""}`} onClick={() => goto(n.id, true)}>
                <n.icon size={16} /> {n.label}
              </button>
            ))}
          </nav>
          <button className="sidebar-logout" onClick={logout}><LogOut size={14} /> Sair</button>
        </aside>

        <div className="main">
          <div className="main-content">
            {openAction ? (
              <DetailScreen
                action={openAction}
                isFav={favs.has(openAction.id)}
                onToggleFav={toggleFav}
                onBack={() => setOpenId(null)}
                resultadosAcao={resultadosAcaoAtual}
                onVerHistorico={() => goto("historico")}
                onOpenRelacionada={(id) => setOpenId(id)}
              />
            ) : tab === "inicio" ? (
              <div className="screen">
                <div className="dash-header">
                  <div>
                    <span className="dash-ola">{perfil?.nome_loja ? `Olá, ${perfil.nome_loja}` : "Olá"}</span>
                    <h1 className="dash-titulo">Painel Comercial</h1>
                  </div>
                  <div className="dash-selectors">
                    <select className="dash-select" value={dashMes} onChange={(e) => setDashMes(Number(e.target.value))}>
                      {MESES_COMPLETOS.map((m, i) => <option key={i} value={i}>{m}</option>)}
                    </select>
                    <select className="dash-select" value={dashAno} onChange={(e) => setDashAno(Number(e.target.value))}>
                      {anosDisponiveis.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                </div>

                <div className="dash-cards-row">
                  <div className="dash-card">
                    <span className="dash-card-label">Meta do mês</span>
                    <span className="dash-card-valor">{formatBRL(metaTotalMes)}</span>
                  </div>
                  <div className="dash-card">
                    <span className="dash-card-label">Resultado gerado</span>
                    <span className="dash-card-valor dash-card-valor-verde">{formatBRL(totalMes)}</span>
                  </div>
                  <div className="dash-card">
                    <span className="dash-card-label">Percentual atingido</span>
                    <span className="dash-card-valor">{pctMes}%</span>
                  </div>
                  <div className="dash-card">
                    <span className="dash-card-label">Ações executadas</span>
                    <span className="dash-card-valor">{historicoMes.length}</span>
                  </div>
                </div>

                <div className="dash-progress-wrap">
                  <div className="dash-progress-top">
                    <span>Meta do mês</span>
                    <span className="dash-progress-pct">{pctMes}%</span>
                  </div>
                  <div className="dash-progress-track">
                    <div className="dash-progress-fill" style={{ width: `${pctMes}%` }} />
                  </div>
                </div>

                <div className="dash-columns">
                  <div className="dash-col-main">
                    <div className="dash-col-title">Ações em andamento</div>
                    {metasDoMes.length === 0 ? (
                      <div className="empty-state small">
                        <BarChart3 size={24} />
                        <p>Nenhuma meta definida em {nomeMesAno} ainda. Defina uma meta pra acompanhar o andamento aqui.</p>
                      </div>
                    ) : (
                      <>
                        <div className="dash-acoes-grid">
                          {metasDoMes.slice(0, 4).map((m) => (
                            <button className="dash-acao-card" key={m.id} onClick={() => setOpenId(m.acaoId)}>
                              <div className="dash-acao-top">
                                <span className="dash-acao-nome">{m.nome}</span>
                                <span className={`dash-status ${m.status === "Concluída" ? "concluida" : "andamento"}`}>{m.status}</span>
                              </div>
                              {m.objetivo && <p className="dash-acao-objetivo">{m.objetivo}</p>}
                              <div className="meta-bar-track"><div className="meta-bar-fill" style={{ width: `${m.pct}%` }} /></div>
                              <div className="dash-acao-valores">
                                <span>{formatBRL(m.realizado)} de {formatBRL(m.valorMeta)}</span>
                                <span className="meta-pct">{m.pct}%</span>
                              </div>
                            </button>
                          ))}
                        </div>
                        {metasDoMes.length > 4 && (
                          <button className="btn-ghost-box" onClick={() => goto("historico")}>Ver todas</button>
                        )}
                      </>
                    )}

                    <div className="dash-col-title" style={{ marginTop: 26 }}>Histórico do mês</div>
                    {historicoMesOrdenado.length === 0 ? (
                      <div className="empty-state small">
                        <Clock size={24} />
                        <p>Nenhum resultado registrado em {nomeMesAno} ainda.</p>
                      </div>
                    ) : (
                      <div className="dash-timeline">
                        {historicoMesOrdenado.map((h, i) => {
                          const a = ACTIONS.find((x) => x.id === h.id);
                          return (
                            <div className="dash-timeline-item" key={i}>
                              <span className="dash-timeline-dia">{labelRelativo(h.criadoEm)}</span>
                              <div className="dash-timeline-linha">
                                <span className="dash-timeline-nome">{a?.nome || h.id}</span>
                                <span className="dash-timeline-valor">{formatBRL(h.valor || 0)}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="dash-col-side">
                    <div className="dash-card-white">
                      <span className="resumo-label" style={{ display: "block", marginBottom: 10 }}>Registrar resultado</span>
                      <select className="meta-select" value={registrarAcaoId} onChange={(e) => setRegistrarAcaoId(e.target.value)}>
                        <option value="">Selecionar ação</option>
                        {ACTIONS.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                      </select>
                      <div className="valor-input" style={{ margin: "8px 0" }}>
                        <span className="valor-prefix">R$</span>
                        <input type="number" inputMode="decimal" placeholder="Valor gerado" value={doneValor} onChange={(e) => setDoneValor(e.target.value)} />
                      </div>
                      <button className="btn-primary" onClick={registrarRapido}>Salvar</button>
                    </div>

                    <div className="dash-atalhos">
                      <button className="dash-atalho-btn" onClick={() => setShowMetaForm(true)}>
                        <Plus size={16} /> Nova ação
                      </button>
                      <button className="dash-atalho-btn" onClick={() => goto("biblioteca", true)}>
                        <BookOpen size={16} /> Biblioteca de ações
                      </button>
                      <button className="dash-atalho-btn" onClick={() => goto("biblioteca", true)}>
                        <Search size={16} /> Pesquisar ação
                      </button>
                      <button className="dash-atalho-btn" onClick={() => goto("favoritos")}>
                        <Heart size={16} /> Favoritos
                      </button>
                    </div>

                    {showMetaForm && (
                      <div className="dash-card-white">
                        <span className="resumo-label" style={{ display: "block", marginBottom: 10 }}>Definir meta para {nomeMesAno}</span>
                        <select className="meta-select" value={novaMetaAcao} onChange={(e) => setNovaMetaAcao(e.target.value)}>
                          <option value="">Escolha a ação</option>
                          {ACTIONS.map((a) => <option key={a.id} value={a.id}>{a.nome}</option>)}
                        </select>
                        <div className="valor-input" style={{ margin: "8px 0" }}>
                          <span className="valor-prefix">R$</span>
                          <input type="number" inputMode="decimal" placeholder="Meta do mês" value={novaMetaValor} onChange={(e) => setNovaMetaValor(e.target.value)} />
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="btn-primary" onClick={addMeta}>Salvar meta</button>
                          <button className="btn-ghost-box" onClick={() => setShowMetaForm(false)}>Cancelar</button>
                        </div>
                      </div>
                    )}

                    {meuDiagnostico && (
                      <div className="dash-diag-card">
                        <span className="resumo-label" style={{ display: "block", marginBottom: 10 }}>Diagnóstico da Loja</span>
                        <div className="diag-mini-indice" style={{ marginBottom: 10 }}>
                          <span className="indice-num" style={{ fontSize: 30 }}>{meuDiagnostico.indice}</span>
                          <span className="indice-max" style={{ fontSize: 12 }}>/100</span>
                        </div>
                        <div className="diag-mini-info" style={{ marginBottom: 10 }}>
                          <span className="diag-mini-linha">Ponto forte: <b>{meuDiagnostico.ponto_forte}</b></span>
                          <span className="diag-mini-linha">Ponto de atenção: <b>{meuDiagnostico.gargalo}</b></span>
                          <span className="diag-mini-linha">Próxima prioridade: <b>{meuDiagnostico.segunda_prioridade}</b></span>
                        </div>
                        <button className="btn-ghost-box" style={{ marginBottom: showDiagCompleto ? 12 : 0 }} onClick={() => setShowDiagCompleto((s) => !s)}>
                          {showDiagCompleto ? "Ocultar diagnóstico completo" : "Ver diagnóstico completo"}
                        </button>
                        {showDiagCompleto && (() => {
                          const completo = computeDiagnostico(meuDiagnostico.respostas);
                          return (
                            <div className="pilares-wrap">
                              {completo.pilares.map((p) => (
                                <div key={p.nome} className="pilar-row">
                                  <div className="pilar-row-top">
                                    <span>{p.nome}</span>
                                    <span className={`pilar-faixa faixa-${p.faixa.replace(/\s/g, "")}`}>{p.faixa}</span>
                                  </div>
                                  <div className="meta-bar-track"><div className="meta-bar-fill" style={{ width: `${(p.pontos / p.max) * 100}%` }} /></div>
                                </div>
                              ))}
                              {completo.areas.length > 0 && (
                                <div className="chiprow" style={{ marginTop: 10 }}>
                                  {completo.areas.map((a) => <span key={a} className="chip">{a}</span>)}
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : tab === "biblioteca" ? (
              <div className="screen">
                <div className="topbar">
                  {!bibShowMenu && (
                    <button className="iconbtn" onClick={clearBibFilters}><ArrowLeft size={20} /></button>
                  )}
                  <span className="topbar-title">{bibShowMenu ? "Biblioteca de ações" : "Resultados"}</span>
                  <span style={{ width: 20 }} />
                </div>

                {bibShowMenu && (
                  <div className="bib-video-wrap">
                    <div className="tutorial-placeholder bib-video-destaque">
                      <Radio size={22} color="#143F35" />
                      <div>
                        <span className="tutorial-titulo">Vídeo: como usar a Biblioteca de Ações</span>
                        <span className="tutorial-sub">Em breve — um vídeo curto mostrando como encontrar e aplicar cada ação.</span>
                      </div>
                    </div>
                    <p className="bib-video-caption">Não sabe por onde começar? Assista este vídeo de 2 minutos e entenda como encontrar rapidamente a melhor estratégia para sua loja.</p>
                  </div>
                )}

                <div className="bib-busca-wrap">
                  <div className="bib-busca-label">Busca inteligente</div>
                  <div className="search-bar bib-busca-bar">
                    <Search size={17} color="#143F35" />
                    <input
                      placeholder="Ex: quero girar estoque, vender no WhatsApp, fazer uma promoção..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setSearchFocado(true)}
                      onBlur={() => setTimeout(() => setSearchFocado(false), 150)}
                    />
                    {search && <X size={14} color="#6B7268" style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
                  </div>
                  {searchFocado && (
                    <div className="bib-sugestoes">
                      {BUSCA_SUGESTOES.map((s) => (
                        <button key={s} className="bib-sugestao-chip" onMouseDown={() => setSearch(s)}>{s}</button>
                      ))}
                    </div>
                  )}
                </div>

                {bibShowMenu ? (
                  <div className="menu-wrap">
                    <div className="bib-section-title">Explorar por objetivo</div>
                    <div className="menu-list">
                      {CATS.map((c) => {
                        const count = ACTIONS.filter((a) => a.cat === c.id).length;
                        return (
                          <button key={c.id} className="menu-row" onClick={() => setCatFilter(c.id)}>
                            <span className="menu-row-icon"><c.icon size={16} /></span>
                            <span className="menu-row-label">{c.label}</span>
                            <span className="menu-count">{count}</span>
                            <ChevronRight size={16} color="#A9B0A4" />
                          </button>
                        );
                      })}
                    </div>

                    <div className="bib-section-title">Explorar por canal</div>
                    <div className="menu-list">
                      {CANAIS.map((c) => {
                        const count = ACTIONS.filter((a) => a.canalPrincipal === c.label || a.canaisApoio.includes(c.label)).length;
                        return (
                          <button key={c.label} className="menu-row" onClick={() => setCanalFilter(c.label)}>
                            <span className="menu-row-icon"><c.icon size={16} /></span>
                            <span className="menu-row-label">{c.label}</span>
                            <span className="menu-count">{count}</span>
                            <ChevronRight size={16} color="#A9B0A4" />
                          </button>
                        );
                      })}
                    </div>

                    <div className="bib-section-title">Explorar por nicho</div>
                    <div className="menu-list" style={{ marginBottom: 20 }}>
                      {NICHO_GRUPOS.map((g) => {
                        if (!g.itens) {
                          const count = ACTIONS.filter((a) => a.nichos && a.nichos.includes(g.valorDireto)).length;
                          return (
                            <button key={g.label} className="menu-row" onClick={() => setNichoFilter(g.valorDireto)}>
                              <span className="menu-row-label" style={{ marginLeft: 0 }}>{g.emoji} {g.label}</span>
                              <span className="menu-count">{count}</span>
                              <ChevronRight size={16} color="#A9B0A4" />
                            </button>
                          );
                        }
                        const totalGrupo = g.itens.reduce((s, it) => s + ACTIONS.filter((a) => a.nichos && a.nichos.includes(it.valor)).length, 0);
                        return (
                          <Accordion key={g.label} title={`${g.emoji} ${g.label}`}>
                            <div className="menu-list" style={{ padding: 0 }}>
                              {g.itens.map((it) => {
                                const count = ACTIONS.filter((a) => a.nichos && a.nichos.includes(it.valor)).length;
                                return (
                                  <button key={it.valor} className="menu-row" onClick={() => setNichoFilter(it.valor)}>
                                    <span className="menu-row-label" style={{ marginLeft: 0 }}>{it.label}</span>
                                    <span className="menu-count">{count}</span>
                                    <ChevronRight size={16} color="#A9B0A4" />
                                  </button>
                                );
                              })}
                            </div>
                          </Accordion>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="active-filters">
                      {catFilter && (
                        <span className="filter-pill">{catInfo(catFilter).label}<X size={12} onClick={() => setCatFilter(null)} /></span>
                      )}
                      {canalFilter && (
                        <span className="filter-pill">{canalFilter}<X size={12} onClick={() => setCanalFilter(null)} /></span>
                      )}
                      {nichoFilter && (
                        <span className="filter-pill">{nichoFilter}<X size={12} onClick={() => setNichoFilter(null)} /></span>
                      )}
                      <span className="filter-clear" onClick={clearBibFilters}>Limpar tudo</span>
                    </div>

                    <div className="list-wrap">
                      {filtered.length === 0 ? (
                        <div className="empty-state">
                          <Search size={28} />
                          <p>Nenhuma ação encontrada com esse filtro. Ajuste a busca ou volte ao menu para tentar outra combinação.</p>
                        </div>
                      ) : (
                        filtered.map((a, i) => (
                          <TagCard key={a.id} action={a} isFav={favs.has(a.id)} onToggleFav={toggleFav} onOpen={(id) => setOpenId(id)} alt={i % 2 === 1} />
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : tab === "favoritos" ? (
              <div className="screen">
                <div className="topbar"><span className="topbar-title">Favoritos</span><span /></div>
                <div className="list-wrap" style={{ paddingTop: 14 }}>
                  {favs.size === 0 ? (
                    <div className="empty-state"><Heart size={28} /><p>Nenhuma ação favoritada ainda. Toque no coração de uma ação para salvá-la aqui.</p></div>
                  ) : (
                    ACTIONS.filter((a) => favs.has(a.id)).map((a) => (
                      <TagCard key={a.id} action={a} isFav={true} onToggleFav={toggleFav} onOpen={(id) => setOpenId(id)} />
                    ))
                  )}
                </div>
              </div>
            ) : tab === "historico" ? (
              <div className="screen">
                <div className="topbar"><span className="topbar-title">Histórico</span><span /></div>
                <div className="scroll" style={{ paddingTop: 14 }}>
                  {historico.length === 0 ? (
                    <div className="empty-state"><Clock size={28} /><p>Nenhuma ação executada ainda. Marque uma ação como executada na tela de detalhe para vê-la aqui.</p></div>
                  ) : (
                    <>
                      <button className="btn-ghost-box" onClick={() => setShowAnual((s) => !s)}>
                        <BarChart3 size={15} /> {showAnual ? "Ocultar gráfico anual" : `Ver evolução de ${anoAtual} por ação`}
                      </button>

                      {showAnual && (
                        <div className="chart-box" style={{ marginBottom: 20 }}>
                          <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={chartAno} margin={{ top: 4, right: 8, left: -20, bottom: 4 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#E2E4DE" vertical={false} />
                              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "#6B7268" }} axisLine={false} tickLine={false} />
                              <YAxis tickFormatter={(v) => formatBRL(v)} tick={{ fontSize: 10, fill: "#6B7268" }} axisLine={false} tickLine={false} />
                              <Tooltip formatter={(v) => formatBRL(v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E4DE" }} />
                              <Legend wrapperStyle={{ fontSize: 11 }} />
                              {chartAnoSeries.map((nome, i) => (
                                <Bar key={nome} dataKey={nome} stackId="ano" fill={CHART_CORES[i % CHART_CORES.length]} radius={i === chartAnoSeries.length - 1 ? [4, 4, 0, 0] : 0} />
                              ))}
                            </BarChart>
                          </ResponsiveContainer>
                          <p className="roteiro-lead" style={{ padding: "0 4px" }}>Mostra as {chartAnoSeries.length > 0 ? "ações" : ""} que mais geraram vendas no ano, mês a mês — o resto entra em "Outras".</p>
                        </div>
                      )}

                      {historico.map((h, i) => {
                        const a = ACTIONS.find((x) => x.id === h.id);
                        return (
                          <div className="hist-item" key={i}>
                            <div className="hist-top">
                              <span className="hist-nome">{a?.nome}</span>
                              <span className="hist-data">{h.data}</span>
                            </div>
                            <span className="hist-valor">{formatBRL(h.valor || 0)}</span>
                            {h.nota && <div className="hist-nota">{h.nota}</div>}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="screen">
                <div className="topbar"><span className="topbar-title">Lojistas cadastradas</span><span /></div>
                <div className="scroll" style={{ paddingTop: 14 }}>
                  {adminLoading ? (
                    <p style={{ textAlign: "center", color: "#6B7268", fontSize: 13 }}>Carregando…</p>
                  ) : adminDiagnosticos.length === 0 ? (
                    <div className="empty-state"><Shield size={28} /><p>Nenhuma lojista respondeu o diagnóstico ainda.</p></div>
                  ) : (
                    <div className="list-wrap" style={{ padding: 0 }}>
                      {adminDiagnosticos.map((d) => {
                        const p = adminPerfis.find((x) => x.user_id === d.user_id);
                        return (
                          <div className="admin-card" key={d.id}>
                            <div className="admin-contato">
                              <span className="admin-loja-nome">{p?.nome_loja || "Nome da loja não informado"}</span>
                              <span className="admin-data">{new Date(d.criado_em).toLocaleDateString("pt-BR")}</span>
                              <div className="admin-contato-linha">
                                {p?.telefone && <span className="canal-pill sm"><MessageCircle size={10} /> {p.telefone}</span>}
                                {p?.instagram && <span className="canal-pill sm">@{p.instagram.replace(/^@/, "")}</span>}
                                {!p?.telefone && !p?.instagram && <span className="canal-pill sm">Sem contato informado</span>}
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "10px 0" }}>
                              <span className="canal-pill sm">Índice {d.indice} · {d.faixa_indice}</span>
                              <span className="canal-pill sm">Forte: {d.ponto_forte}</span>
                              <span className="canal-pill sm">Gargalo: {d.gargalo}</span>
                            </div>
                            {d.areas?.length > 0 && (
                              <div className="chiprow" style={{ marginBottom: 10 }}>
                                {d.areas.map((a) => <span key={a} className="chip">{a}</span>)}
                              </div>
                            )}

                            <Accordion title="Ver todas as respostas">
                              <div className="admin-respostas">
                                {DIAG_PERGUNTAS.map((q) => (
                                  <div className="admin-resposta-item" key={q.id}>
                                    <span className="admin-resposta-pergunta">{q.texto}</span>
                                    <span className="admin-resposta-valor">{d.respostas?.[q.id]?.l || "—"}</span>
                                  </div>
                                ))}
                              </div>
                            </Accordion>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {!openAction && (
            <div className="tabbar">
              {navItems.map((n) => (
                <button key={n.id} className={`tabbtn ${tab === n.id ? "active" : ""}`} onClick={() => goto(n.id, true)}>
                  <n.icon size={19} /><span>{n.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
