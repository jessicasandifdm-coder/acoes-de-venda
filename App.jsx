import { useState, useEffect } from "react";
import {
  Search, Heart, Clock, Home, BookOpen, ArrowLeft, RefreshCw, Gift,
  Wallet, Truck, Package, Users,
  Star, Target, Sparkles, Check, ChevronRight, X, Store, Crown,
  Megaphone, UserMinus, UserPlus, Globe, Radio, LogOut, Mail, KeyRound,
  Lightbulb, AlertTriangle, TrendingUp, DollarSign, BarChart3,
  ChevronLeft, Plus, Shield, Calendar, Rocket, Send, MessageCircle, Shirt, Video, Film, LayoutGrid, Play, Calculator,
  MapPin, Bell, List, Flag, Hash
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
  { label: "Reels", icon: Film },
  { label: "Feed", icon: LayoutGrid },
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
const APP_URL = "https://app.geradordevendasjs.com.br";

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

async function supaRecuperarSenha(email) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(APP_URL)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error_description || data.msg || "Não foi possível enviar o e-mail de recuperação.");
  }
  return true;
}

async function supaDefinirNovaSenha(accessToken, novaSenha) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ password: novaSenha }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error_description || data.msg || "Não foi possível definir a nova senha.");
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

async function supaUpdateWhere(table, accessToken, filters, patch) {
  const qs = Object.entries(filters).map(([k, v]) => `${k}=eq.${v}`).join("&");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${qs}`, {
    method: "PATCH",
    headers: { ...supaHeaders(accessToken), Prefer: "return=representation" },
    body: JSON.stringify(patch),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erro ao atualizar.");
  return data;
}

// --- Configuração da Sessão Estratégica (ajustar aqui quando precisar) ---
const INDICE_MINIMO_QUALIFICACAO = 40; // índice mínimo pra desbloquear o convite
const SESSAO_WHATSAPP_NUMERO = "5551997411360";
const SESSAO_WHATSAPP_MENSAGEM = "Olá! Fiz o diagnóstico no Gerador de Caixa e quero agendar minha Sessão Estratégica.";

const DIAG_PERGUNTAS = [
  {
    id: "q1", texto: "Hoje sua loja possui um calendário de ações comerciais?",
    opcoes: [
      { l: "Sim, organizado", p: 4 },
      { l: "Tenho parcialmente", p: 3 },
      { l: "Faço algumas ações", p: 2 },
      { l: "Faço tudo no improviso", p: 1 },
    ],
  },
  {
    id: "q2", texto: "Com que frequência sua loja realiza ações de vendas?",
    opcoes: [
      { l: "Toda semana", p: 4 },
      { l: "Quinzenalmente", p: 3 },
      { l: "Uma vez por mês", p: 2 },
      { l: "Apenas quando as vendas caem", p: 1 },
    ],
  },
  {
    id: "q3", texto: "Quando você faz uma ação de vendas, como normalmente decide qual ação realizar?",
    opcoes: [
      { l: "Tenho um planejamento definido", p: 4 },
      { l: "Escolho de acordo com o momento da loja", p: 3 },
      { l: "Faço igual ao que vejo outras lojas fazendo", p: 2 },
      { l: "Normalmente faço quando percebo que as vendas caíram", p: 1 },
    ],
  },
  {
    id: "q4", multipla: true, texto: "Quais estratégias sua loja costuma utilizar para vender mais?",
    opcoes: [
      "Descontos ou promoções", "Frete grátis", "Brindes", "Combos ou kits",
      "Campanhas para clientes antigos", "Lista de transmissão / WhatsApp", "Stories com ofertas",
      "Live de vendas", "Grupo VIP", "Campanhas sazonais", "Lançamento de coleção",
      "Não costumo fazer ações específicas",
    ].map((l) => ({ l })),
  },
  {
    id: "q5", texto: "Hoje você faz ações específicas para clientes que já compraram?",
    opcoes: [
      { l: "Sempre", p: 4 },
      { l: "Às vezes", p: 3 },
      { l: "Raramente", p: 2 },
      { l: "Nunca", p: 1 },
    ],
  },
  {
    id: "q6", texto: "Você sente que suas vendas são previsíveis?",
    opcoes: [
      { l: "Sim", p: 4 },
      { l: "Na maior parte do tempo", p: 3 },
      { l: "Oscilam bastante", p: 2 },
      { l: "Nunca sei como será o próximo mês", p: 1 },
    ],
  },
  {
    id: "q7", texto: "Qual é o faturamento médio mensal da sua loja?",
    opcoes: [
      { l: "Até R$ 5 mil", p: 1 },
      { l: "De R$ 5 mil a R$ 10 mil", p: 2 },
      { l: "De R$ 10 mil a R$ 20 mil", p: 2 },
      { l: "De R$ 20 mil a R$ 50 mil", p: 3 },
      { l: "Acima de R$ 50 mil", p: 4 },
    ],
  },
  {
    id: "q8", texto: "Quantas pessoas trabalham na operação?",
    opcoes: [
      { l: "Só eu", p: 1 },
      { l: "2 a 4 pessoas", p: 2 },
      { l: "5 a 10 pessoas", p: 3 },
      { l: "Mais de 10 pessoas", p: 4 },
    ],
  },
  {
    id: "q9", texto: "Hoje suas vendas acontecem principalmente por onde?",
    opcoes: [
      { l: "Loja física", p: 2 },
      { l: "Instagram", p: 2 },
      { l: "WhatsApp", p: 2 },
      { l: "Site", p: 3 },
      { l: "Marketplace", p: 2 },
      { l: "Mais de um canal", p: 4 },
    ],
  },
];

const DIAG_MAX_PONTOS = 36; // soma dos pontos máximos de q1..q9 (4 cada)

function classificarBrinde(pct) {
  if (pct <= 5) return { nivel: "Excelente estratégia", tom: "green" };
  if (pct <= 7) return { nivel: "Estratégia saudável", tom: "green" };
  if (pct <= 10) return { nivel: "Atenção. Avalie se o aumento do ticket compensa.", tom: "gold" };
  return { nivel: "O custo do brinde está alto para esse valor de compra. Considere aumentar o valor mínimo para ganhar o brinde ou escolher um brinde de menor custo.", tom: "gold" };
}

function normalizarAlertas(lista) {
  if (!Array.isArray(lista)) return [];
  return lista.map((a) => (typeof a === "string" ? a : a?.texto || "")).filter(Boolean);
}

function faixaGeral(indice) {
  if (indice <= 30) return {
    curta: "Muito no improviso",
    texto: "Sua loja ainda depende muito do improviso e as vendas tendem a oscilar. Criar uma rotina comercial será um dos principais fatores para gerar mais previsibilidade.",
  };
  if (indice <= 60) return {
    curta: "Pouco estruturada",
    texto: "Sua loja já realiza algumas ações de vendas, mas elas ainda acontecem de forma pouco estruturada. Organizar um calendário comercial e manter consistência nas ações tende a aumentar seus resultados.",
  };
  if (indice <= 80) return {
    curta: "Boa base comercial",
    texto: "Sua loja possui uma boa base comercial. O próximo passo é transformar as ações em um processo previsível, acompanhando resultados e repetindo aquilo que funciona.",
  };
  return {
    curta: "Alta previsibilidade",
    texto: "Sua loja demonstra um bom nível de organização comercial e possui potencial para crescer com ainda mais previsibilidade através de uma estratégia consistente.",
  };
}

const ESTRATEGIAS_PRECO = ["Descontos ou promoções", "Frete grátis", "Brindes"];

function computeDiagnostico(respostas) {
  const somaSimples = (ids) => ids.reduce((s, id) => s + (respostas[id]?.p || 0), 0);
  const selecionadasQ4 = respostas.q4?.selecionadas || [];
  const pontosQ4 = respostas.q4?.p || 0;

  const total = somaSimples(["q1", "q2", "q3", "q5", "q6", "q7", "q8", "q9"]) + pontosQ4;
  const indice = Math.round((total / DIAG_MAX_PONTOS) * 100);
  const faixa = faixaGeral(indice);

  const alertas = [];
  const naoFazNada = selecionadasQ4.includes("Não costumo fazer ações específicas");
  if (selecionadasQ4.length > 0 && selecionadasQ4.every((s) => ESTRATEGIAS_PRECO.includes(s))) {
    alertas.push("Atenção: hoje sua loja parece depender principalmente de incentivos de preço para vender. Existem outras estratégias capazes de aumentar as vendas sem reduzir sua margem.");
  }
  if (naoFazNada) {
    alertas.push("Hoje suas vendas parecem depender muito do movimento natural da loja. Criar uma rotina de ações comerciais aumenta a previsibilidade dos resultados.");
  }
  if (!naoFazNada && !selecionadasQ4.includes("Campanhas para clientes antigos")) {
    alertas.push("Você pode estar deixando de faturar com clientes que já compraram da sua loja. Trabalhar a recompra costuma ser uma das formas mais rápidas de aumentar o faturamento.");
  }

  const faturamentoLabel = respostas.q7?.l || "";
  const qualificado = faturamentoLabel !== "" && faturamentoLabel !== "Até R$ 5 mil" && indice >= INDICE_MINIMO_QUALIFICACAO;

  return { indice, faixaCurta: faixa.curta, faixaTexto: faixa.texto, alertas, qualificado, faturamentoLabel };
}

const catInfo = (id) => CATS.find((c) => c.id === id) || CATS[0];
const canalInfo = (label) => CANAIS.find((c) => c.label === label) || CANAIS[0];

// --- Radar de Oportunidades ---
const UFS_BR = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
  "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

const CATEGORIAS_RADAR = [
  { id: "nacional", label: "Data nacional", icon: Flag },
  { id: "estadual", label: "Data estadual", icon: MapPin },
  { id: "municipal", label: "Data municipal", icon: Home },
  { id: "comercial", label: "Data comercial", icon: TrendingUp },
];

function nthWeekday(ano, mes, diaSemana, n) {
  const primeiro = new Date(ano, mes, 1);
  const offset = (diaSemana - primeiro.getDay() + 7) % 7;
  return 1 + offset + (n - 1) * 7;
}
function lastWeekday(ano, mes, diaSemana) {
  const ultimoDia = new Date(ano, mes + 1, 0).getDate();
  const ultimo = new Date(ano, mes, ultimoDia);
  const offset = (ultimo.getDay() - diaSemana + 7) % 7;
  return ultimoDia - offset;
}
function getDataOportunidade(op, ano) {
  let dia;
  if (op.regra === "nthWeekday") dia = nthWeekday(ano, op.mes, op.diaSemana, op.n);
  else if (op.regra === "lastWeekday") dia = lastWeekday(ano, op.mes, op.diaSemana);
  else dia = op.dia;
  return new Date(ano, op.mes, dia);
}
function matchesLocalizacao(op, estado, cidade) {
  if (op.cidade) return op.cidade === cidade;
  if (op.estado) return op.estado === estado;
  return true;
}

function proximasOportunidades(hoje, estado, cidade, limite) {
  const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const candidatos = [];
  [hoje.getFullYear(), hoje.getFullYear() + 1].forEach((ano) => {
    OPORTUNIDADES.forEach((op) => {
      if (op.id.startsWith("data-")) return; // datas de números iguais têm seu próprio destaque separado
      if (!matchesLocalizacao(op, estado, cidade)) return;
      const data = getDataOportunidade(op, ano);
      if (data >= hojeSemHora) candidatos.push({ op, data });
    });
  });
  candidatos.sort((a, b) => a.data - b.data);
  const vistos = new Set();
  const resultado = [];
  for (const c of candidatos) {
    if (vistos.has(c.op.id)) continue;
    vistos.add(c.op.id);
    resultado.push({ ...c, dias: Math.round((c.data - hojeSemHora) / 86400000) });
    if (resultado.length >= limite) break;
  }
  return resultado;
}

const OPORTUNIDADES = [
  { id: "ano-novo", titulo: "Ano Novo", categoria: "nacional", mes: 0, dia: 1, descricao: "Início do ano é o momento em que a cliente troca o guarda-roupa e busca novidade — ótima janela pra lançamento de coleção.", comoAproveitar: ["Criar campanha de 'Ano novo, guarda-roupa novo'", "Lançar peças da coleção nova", "Campanha Compre e Ganhe pra girar o estoque do ano anterior"], palavrasChave: "lançamento coleção" },
  { id: "dia-mulher", titulo: "Dia Internacional da Mulher", categoria: "nacional", mes: 2, dia: 8, descricao: "Data emocional forte, ótima pra campanhas de autoestima e conexão com a cliente.", comoAproveitar: ["Campanha emocional (Semana do Merecimento)", "Brinde exclusivo pra quem comprar no dia", "Conteúdo de valorização antes da data, não só no dia"], palavrasChave: "campanha emocional" },
  { id: "dia-consumidor", titulo: "Dia do Consumidor", categoria: "comercial", mes: 2, dia: 15, descricao: "Data comercial forte no varejo, com clientes já esperando promoções.", comoAproveitar: ["Cashback ou desconto progressivo", "Frete grátis por tempo limitado", "Ação relâmpago de 1 dia"], palavrasChave: "promoção desconto" },
  { id: "dia-maes", titulo: "Dia das Mães", categoria: "nacional", mes: 4, regra: "nthWeekday", diaSemana: 0, n: 2, descricao: "Uma das datas de maior faturamento do varejo de moda no ano.", comoAproveitar: ["Kits presente prontos", "Campanha Compre e Ganhe", "Embalagem de presente gratuita", "Parcelamento facilitado pra ticket mais alto"], palavrasChave: "brindes combo" },
  { id: "namorados", titulo: "Dia dos Namorados", categoria: "nacional", mes: 5, dia: 12, descricao: "Boa oportunidade pra combos e presentes em dupla.", comoAproveitar: ["Combo pra casal", "Vale-presente", "Indicação premiada (leve sua amiga/namorado)"], palavrasChave: "combo indicação" },
  { id: "dia-pais", titulo: "Dia dos Pais", categoria: "nacional", mes: 7, regra: "nthWeekday", diaSemana: 0, n: 2, descricao: "Data forte de presentes pro público masculino — excelente oportunidade para campanhas promocionais.", comoAproveitar: ["Criar kits presente", "Fazer campanha Compre e Ganhe", "Criar indicação premiada", "Embalagem presente gratuita", "Campanha pra aumentar ticket médio"], palavrasChave: "brindes combo ticket médio" },
  { id: "dia-cliente", titulo: "Dia do Cliente", categoria: "comercial", mes: 8, dia: 15, descricao: "Criada pelo varejo pra gerar um 'segundo Natal' fora de época — ótima pra fidelizar quem já compra.", comoAproveitar: ["Cashback exclusivo pra clientes antigas", "Sacola Premiada", "Grupo VIP com condição especial"], palavrasChave: "fidelização cashback clientes antigos" },
  { id: "independencia", titulo: "Independência do Brasil", categoria: "nacional", mes: 8, dia: 7, descricao: "Feriado nacional, bom pra ação relâmpago de feriado prolongado.", comoAproveitar: ["Frete grátis relâmpago", "Ação de 1 dia nos Stories"], palavrasChave: "frete grátis" },
  { id: "dia-criancas", titulo: "Dia das Crianças", categoria: "nacional", mes: 9, dia: 12, descricao: "Forte pro nicho infantil e pra quem vende presentes.", comoAproveitar: ["Clube Presente (lista de aniversário/presente)", "Sacola Premiada temática", "Combo kit infantil"], palavrasChave: "sacola premiada brindes" },
  { id: "black-friday", titulo: "Black Friday", categoria: "comercial", mes: 10, regra: "lastWeekday", diaSemana: 5, descricao: "Maior pico de vendas do varejo online e físico no ano.", comoAproveitar: ["Frete grátis relâmpago", "Desbloqueando Brindes por faixa de valor", "Grupo VIP com acesso antecipado"], palavrasChave: "frete grátis brindes" },
  { id: "natal", titulo: "Natal", categoria: "nacional", mes: 11, dia: 25, descricao: "Principal data de presentes do ano.", comoAproveitar: ["Kits presente prontos", "Embalagem de presente gratuita", "Comprou Ganhou com brinde temático"], palavrasChave: "combo brindes" },
  { id: "liquidacao-verao", titulo: "Liquidação de Verão", categoria: "comercial", mes: 0, dia: 15, descricao: "Momento de girar o estoque da coleção de verão antes da troca.", comoAproveitar: ["Operação Cabide Livre", "Giro de estoque", "Pague 2 Leve 3 em peças paradas"], palavrasChave: "girar estoque" },
  { id: "volta-aulas", titulo: "Volta às Aulas", categoria: "comercial", mes: 1, dia: 1, descricao: "Movimenta categorias como papelaria, calçados e acessórios.", comoAproveitar: ["Combo de itens escolares", "Cashback pra recompra no ano letivo"], palavrasChave: "combo cashback" },
  { id: "troca-outono-inverno", titulo: "Troca de Coleção Outono/Inverno", categoria: "comercial", mes: 2, dia: 1, descricao: "Início da temporada de frio, hora de lançar a coleção nova e girar o que sobrou do verão.", comoAproveitar: ["Lançamento com Grupo VIP (preview)", "Operação Cabide Livre nas peças de verão"], palavrasChave: "lançamento giro estoque" },
  { id: "liquidacao-inverno", titulo: "Liquidação de Inverno", categoria: "comercial", mes: 6, dia: 15, descricao: "Fim do inverno é quando o estoque de frio precisa girar rápido.", comoAproveitar: ["Missão Estoque Zero", "Desconto progressivo por quantidade"], palavrasChave: "girar estoque desconto" },
  { id: "troca-primavera-verao", titulo: "Troca de Coleção Primavera/Verão", categoria: "comercial", mes: 8, dia: 1, descricao: "Início da temporada quente, momento de lançamento.", comoAproveitar: ["Preview da Nova Coleção pro Grupo VIP", "Story Interativo anunciando a chegada da coleção"], palavrasChave: "lançamento coleção" },
  { id: "ferias-verao", titulo: "Férias Escolares de Verão", categoria: "comercial", mes: 11, dia: 20, descricao: "Mais gente em casa e viajando — bom momento pra ações de lazer/presente.", comoAproveitar: ["Campanha de viagem/lazer temática", "Sacola Premiada"], palavrasChave: "brindes sacola" },
  { id: "farroupilha", titulo: "Revolução Farroupilha", categoria: "estadual", mes: 8, dia: 20, estado: "RS", descricao: "Semana Farroupilha movimenta o Rio Grande do Sul inteiro, com forte apelo de tradição gaúcha.", comoAproveitar: ["Vitrine e Stories temáticos com identidade gaúcha", "Combo temático (ex: produtos pra churrasco, chimarrão)", "Ação de indicação na semana"], palavrasChave: "combo indicação" },
  { id: "expointer", titulo: "Expointer", categoria: "estadual", mes: 7, dia: 29, estado: "RS", descricao: "A Expointer, em Esteio/RS, é a maior feira do agronegócio da América Latina e atrai milhares de consumidores pra região — excelente oportunidade pra campanhas promocionais em toda a região metropolitana.", comoAproveitar: ["Frete grátis ou condição especial pra quem vem de fora", "Campanha Compre e Ganhe na semana da feira", "Divulgação nos Stories pra quem estiver na região"], palavrasChave: "promoção frete grátis" },
  { id: "aniversario-sao-leopoldo", titulo: "Aniversário de São Leopoldo", categoria: "municipal", mes: 6, dia: 25, estado: "RS", cidade: "São Leopoldo", descricao: "Feriado municipal — bom momento pra uma ação com identidade local.", comoAproveitar: ["Ação especial 'Aniversário da cidade'", "Desconto ou brinde temático com a data", "Divulgação na loja física e Stories"], palavrasChave: "promoção brindes" },
  {
    id: "data-01-01", titulo: "01/01", categoria: "comercial", mes: 0, dia: 1,
    descricao: "Data de números iguais logo na virada do ano — aproveita o clima de 'começo novo' junto com a mecânica do número 1.",
    comoAproveitar: [
      "1ª compra do ano ganha um brinde",
      "1% extra de cashback no dia",
      "Cupom válido só no dia 1",
      "Kit número 1 da coleção nova com condição especial",
      "1 sorteio surpresa entre quem comprar no dia",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
  {
    id: "data-02-02", titulo: "02/02", categoria: "comercial", mes: 1, dia: 2,
    descricao: "Data de números iguais — boa pra mecânica de 'leve mais, pague menos' em cima do número 2.",
    comoAproveitar: [
      "Leve 2 peças participantes e pague 1",
      "2% de cashback nas compras do dia",
      "Compras acima de R$200 ganham um brinde",
      "2 clientes sorteadas ganham vale-compra",
      "Cupom válido por apenas 2 horas",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
  {
    id: "data-03-03", titulo: "03/03", categoria: "comercial", mes: 2, dia: 3,
    descricao: "Data de números iguais — mecânica em cima do número 3, boa pra girar peças em conjunto.",
    comoAproveitar: [
      "3% de desconto em peças selecionadas",
      "Leve 3 peças e pague 2",
      "3 primeiras compras do dia ganham mimo",
      "Cupom válido por apenas 3 horas",
      "3 kits exclusivos disponíveis só no dia",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
  {
    id: "data-04-04", titulo: "04/04", categoria: "comercial", mes: 3, dia: 4,
    descricao: "Data de números iguais — parcelamento e ofertas relâmpago em cima do número 4.",
    comoAproveitar: [
      "4% de cashback nas compras do dia",
      "4 primeiras clientes ganham presente",
      "Parcelamento em 4x sem juros",
      "4 produtos em oferta relâmpago",
      "Cupom válido por apenas 4 horas",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
  {
    id: "data-05-05", titulo: "05/05", categoria: "comercial", mes: 4, dia: 5,
    descricao: "Data de números iguais — boa pra vale-compras e ofertas relâmpago em cima do número 5.",
    comoAproveitar: [
      "5% de desconto em peças selecionadas",
      "5 primeiras compras do dia ganham brinde",
      "Compras acima de R$500 ganham vale-compra de R$50",
      "5 minutos de oferta surpresa a cada hora",
      "5 kits exclusivos disponíveis só no dia",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
  {
    id: "data-06-06", titulo: "06/06", categoria: "comercial", mes: 5, dia: 6,
    descricao: "Data de números iguais — boa pra live de vendas com horário temático (18h) em cima do número 6.",
    comoAproveitar: [
      "6% de cashback nas compras do dia",
      "Leve 6 peças com condição especial",
      "6 primeiras clientes ganham mimo",
      "Cupom válido por apenas 6 horas",
      "Live às 18h (6 da tarde) com oferta exclusiva",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
  {
    id: "data-07-07", titulo: "07/07", categoria: "comercial", mes: 6, dia: 7,
    descricao: "Data de números iguais — mecânica de sorte e brindes em cima do número 7.",
    comoAproveitar: [
      "7% de desconto em peças selecionadas",
      "7 primeiras compras do dia ganham presente",
      "7 minutos de oferta surpresa a cada hora",
      "Compras acima de R$700 ganham um brinde",
      "7 kits exclusivos disponíveis só no dia",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
  {
    id: "data-08-08", titulo: "08/08", categoria: "comercial", mes: 7, dia: 8,
    descricao: "Data de números iguais — boa pra desafio de combinações em cima do número 8.",
    comoAproveitar: [
      "8% de cashback nas compras do dia",
      "8 primeiras clientes ganham mimo",
      "Desafio das 8 peças: monte 8 combinações diferentes",
      "Cupom válido por apenas 8 horas",
      "8 kits exclusivos disponíveis só no dia",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
  {
    id: "data-09-09", titulo: "09/09", categoria: "comercial", mes: 8, dia: 9,
    descricao: "Data de números iguais: em vez de só 'aproveitar a data', o número do dia vira a mecânica da campanha. Isso chama mais atenção e facilita a comunicação do que uma promoção genérica.",
    comoAproveitar: [
      "9% de desconto ou 9 produtos em destaque",
      "9 primeiros clientes do dia ganham um mimo",
      "Cupom válido por apenas 9 horas",
      "Compras acima de R$299 ganham R$9 de cashback",
      "9 sacolas ou envelopes premiados escondidos nos pedidos",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
  {
    id: "data-10-10", titulo: "10/10", categoria: "comercial", mes: 9, dia: 10,
    descricao: "Data de números iguais: use o conceito de 'nota 10' pra transformar o número em mecânica de campanha.",
    comoAproveitar: [
      "Promoção 'Nota 10' com os 10 looks mais vendidos",
      "10 kits prontos ou parcelamento em 10x",
      "As 10 primeiras clientes ganham presente",
      "Vale-compras de R$100 escondido em 10 pedidos",
      "10 minutos de oferta relâmpago a cada hora",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
  {
    id: "data-11-11", titulo: "11/11", categoria: "comercial", mes: 10, dia: 11,
    descricao: "Data de números iguais, conhecida no varejo como 'Dia dos Solteiros' — ótima pra uma campanha toda construída em cima do número 11.",
    comoAproveitar: [
      "11 ofertas ou 11% de cashback",
      "11 primeiras clientes recebem um presente",
      "Cupom 'ONZE11' ou roleta com 11 benefícios",
      "Live às 11h11 com oferta exclusiva",
      "Durante 11 minutos, uma oferta surpresa",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
  {
    id: "data-12-12", titulo: "12/12", categoria: "comercial", mes: 11, dia: 12,
    descricao: "Data de números iguais junto da reta final do Natal — combine o clima natalino com o número 12 na mecânica da campanha.",
    comoAproveitar: [
      "12 presentes para as 12 primeiras clientes",
      "12 kits de Natal ou parcelamento em 12x",
      "Frete grátis nas primeiras 12 compras",
      "Caixa Misteriosa com 12 brindes diferentes",
      "Calendário da Sorte com 12 envelopes",
      "Mecânicas prontas pra usar: Sacola Premiada, Cofre de Benefícios, Chave Premiada, Caixa Misteriosa, Raspe e Ganhe, Desafio do Tempo, Cupom Escondido, Carrinho Premiado, Cliente Número X, Estoure o Balão, Dados da Sorte, Árvore dos Benefícios, Compra Premiada, Passaporte da Data, Mural da Sorte, Relógio da Oferta, Combo da Data, Desbloqueio por Valor",
      "Dica: faça o número aparecer em tudo — nos kits, no parcelamento, no horário da live, no cupom — não só no desconto",
    ],
    palavrasChave: "brindes cashback",
  },
];

const MESES_CALENDARIO = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const CALENDARIO_ANUAL = [
  {
    mes: 0, nome: "Janeiro", pronto: true,
    campanhaTitulo: "Novo Ano, Novos Estilos",
    intro: "Janeiro é um mês marcado por férias, viagens e descanso. Muitas clientes estão viajando ou aproveitando finais de semana fora, o que pode impactar no fluxo da loja. Por isso, a campanha será dividida em duas grandes etapas:",
    etapas: [
      { titulo: "1ª Quinzena – Ano Novo, Peças Novas", texto: "Trabalhar a narrativa de renovação: looks para mala de viagem, kits para férias, combos inteligentes e até ação social com doação de peças antigas." },
      { titulo: "2ª Quinzena – Sacola Premiada do Verão", texto: "Criar engajamento e picos de vendas com uma ação divertida, de sacolas surpresas com valor fixo, em que uma delas é premiada com valor maior." },
    ],
    adaptavel: "A campanha é adaptável para moda feminina, cosméticos e infantil.",
    estrategiaGeral: [
      "Estimular compras de início de ano, reforçando o desejo de começar o ano renovada.",
      "Criar momentos de pico de venda mesmo em período de férias.",
      "Movimentar estoque parado de forma criativa (sacolas).",
      "Aumentar engajamento e relacionamento com o público.",
    ],
    objetivos: [
      { tema: "Ano Novo, Peças Novas", bullets: ["Vender kits e combos de início de ano.", "Posicionar a marca como parte da \"renovação\" do cliente.", "Incentivar compras através de ação social (trazer peças usadas para doação)."] },
      { tema: "Sacola Premiada do Verão", bullets: ["Movimentar estoque parado do verão.", "Criar engajamento com uma ação divertida e exclusiva.", "Gerar pico de vendas em semana mais fraca."] },
    ],
    preparacao: [
      { periodo: "Primeira Quinzena de Janeiro", itens: [
        "Separar peças-chaves para kits (looks, combos de cosméticos, conjuntos infantis).",
        "Criar comunicação visual com frases como \"Comece o ano renovada\" ou \"Sua mala de férias começa aqui\".",
        "Se optar pela ação social → preparar caixa/coletor de doações e parceria com instituição local.",
      ]},
      { periodo: "Segunda Quinzena de Janeiro (💰 Ações de Venda)", itens: [
        "Definir valor fixo das sacolas (ex.: R$50).",
        "Montar sacolas com peças variadas.",
        "Selecionar 1 ou 2 sacolas premiadas (ex.: R$100 em produtos pelo valor de R$50).",
        "Definir nome criativo (ex.: \"Sacola do Sol\", \"Sacola Calor da Sorte\").",
        "Criar limite de quantidade (ex.: apenas 20 unidades).",
      ]},
    ],
    acaoDeVendas: [
      {
        periodo: "Primeira Quinzena de Janeiro",
        bullets: [
          "Kits inteligentes: ex.: \"Look viagem + acessório com preço fechado\".",
          "Combos promocionais: descontos progressivos para quem leva mais peças.",
          "Ação social: \"Traga uma peça usada e ganhe 5% de desconto na nova coleção\".",
        ],
        sugestoes: [
          { titulo: "Kits/Combos Inteligentes", bullets: [
            "Moda feminina: \"O que não pode faltar na mala de verão\" (look dia + look noite).",
            "Cosméticos: \"Kit beleza verão\" (protetor, hidratante, batom/gloss).",
            "Infantil: \"Kit férias kids\" (conjuntinho + acessório + brinquedo pequeno).",
          ]},
          { titulo: "Ação Social \"Renova e doa\"", bullets: [
            "Incentivo: \"Traga uma peça usada e ganhe 5% de desconto na nova coleção.\"",
            "Resultado: reforça o posicionamento da marca e cria motivo extra para a compra.",
          ]},
          { titulo: "Sugestão de Narrativa nos Conteúdos", bullets: [
            "\"3 looks que não podem faltar na mala de viagem.\"",
            "\"Peças que você precisa para começar o ano renovada.\"",
            "\"Checklist de verão: o que não pode faltar para você.\"",
          ]},
        ],
      },
      {
        periodo: "Segunda Quinzena de Janeiro",
        bullets: [
          "Sacola premiada em Stories ou grupos de WhatsApp.",
          "Vendas rápidas → quem garantir primeiro, leva.",
          "Revelar depois quais clientes foram premiadas → gera prova social.",
        ],
        sacolaDetalhe: {
          titulo: "Sacola Premiada do Verão",
          narrativa: "Divertir, engajar e movimentar estoque parado sem parecer liquidação pesada.",
          comoFunciona: [
            "Criar sacolas (por exemplo, R$50 cada) com peças variadas do verão.",
            "Uma ou duas sacolas terão valor maior em mercadorias (ex.: R$100 por R$50).",
          ],
          adaptacao: [
            "Moda feminina: peças de verão, básicos, acessórios.",
            "Cosméticos: combos surpresa (batom + máscara + esmalte).",
            "Infantil: looks casuais + acessórios surpresa.",
          ],
          diferenciais: [
            "Nome criativo (ex.: \"Sacola do Sol\", \"Sacola Calor da Sorte\").",
            "Limitado (ex.: 20 sacolas disponíveis).",
            "Pode ser revelado apenas em Stories ou grupo de WhatsApp → aumenta exclusividade.",
          ],
          sugestaoConteudo: [
            "Reels bastidores montando as sacolas.",
            "Enquete: \"Você compraria uma sacola surpresa por R$50?\"",
            "Stories revelando algumas sacolas (sem mostrar todas).",
          ],
        },
      },
    ],
    conteudo: [
      {
        semana: "Semana 1 (01 a 07/01/2027)", titulo: "Ano Novo, Peças Novas",
        feed: ["Post/Reels: \"Ano novo pede peças novas — looks para começar o ano renovada\"", "Carrossel: \"Checklist da mala de férias – o que não pode faltar\""],
        stories: ["Enquete: \"Você já separou suas roupas para viagem?\"", "Bastidores: mostrando combos/kits prontos.", "CTA: \"Arraste para ver os combos da semana\"."],
        extra: "Conteúdo adaptado para cosméticos → \"Kit beleza pronta para viajar\" / Infantil → \"Conjuntinhos kids para férias\".",
      },
      {
        semana: "Semana 2 (08 a 14/01/2027)", titulo: "Kits e Ação Social",
        feed: ["Post: \"Traga sua peça usada e ganhe desconto na nova coleção\" (ação social)", "Reels: cliente montando look/kit de viagem."],
        stories: ["Quiz: \"O que você levaria para a mala? Look praia ou look cidade?\"", "Depoimento/print: clientes participando da ação social.", "CTA: \"Escolha seu kit agora, estoque limitado\"."],
      },
      {
        semana: "Semana 3 (15 a 21/01/2027)", titulo: "Aquecimento Sacola Premiada",
        feed: ["Teaser post: \"Em breve: Sacola Premiada do Verão – quem arrisca, ganha!\"", "Reels: bastidores (sem mostrar o que tem dentro das sacolas)."],
        stories: ["Contagem regressiva: \"Falta 3 dias para a Sacola Premiada\"", "Enquete: \"Você compraria uma sacola surpresa por R$50?\"", "Bastidores rápidos: sacolas sendo preparadas."],
      },
      {
        semana: "Semana 4 (22 a 31/01/2027)", titulo: "Sacola Premiada do Verão",
        feed: ["Post/Reels: \"Sacola Premiada já começou – quem garante a sua?\"", "Reels: cliente abrindo sacola premiada."],
        stories: ["CTA: \"Últimas unidades da Sacola Premiada, arrasta pra garantir a sua agora\".", "Prova social: repost de clientes mostrando suas sacolas.", "Revelação: quem foi a sortuda da sacola premiada."],
      },
    ],
    observacoes: {
      liveSugerida: [
        "Pode ser feita no dia do lançamento da Sacola Premiada, mostrando algumas sacolas (sem revelar todas).",
        "Alternativa: Live de \"looks para viagem\" na primeira semana, com combos e kits.",
      ],
      adaptacaoNichos: [
        { nicho: "Cosméticos", texto: "kits de skincare para viagem, sacola premiada com produtos surpresa." },
        { nicho: "Infantil", texto: "conjuntos kids, sacola premiada kids." },
        { nicho: "Acessórios", texto: "kits de bijoux/verão, sacola premiada de acessórios." },
      ],
      dicaFinal: "Não copie a ação pronta. Adapte: escolha a narrativa, ajuste os produtos e crie uma campanha que faça sentido para o seu público.",
    },
    posCampanha: null,
    ideiasVideos: null,
    referenciasVisuais: [
      { label: "Inspiração 1 — TikTok", url: "https://www.tiktok.com/@licrochetoficial/video/7444942036161056055" },
      { label: "Inspiração 2 — TikTok", url: "https://www.tiktok.com/@eduardanicaretta/video/7322113060557278469" },
      { label: "Inspiração 3 — TikTok", url: "https://www.tiktok.com/@isab.cesario/video/7446134404570828038" },
      { label: "Inspiração 4 — TikTok", url: "https://www.tiktok.com/@victoriaweitzel/video/7114058406507351301" },
      { label: "Inspiração 5 — TikTok", url: "https://www.tiktok.com/@rjhennys/video/7239098254548389126" },
    ],
  },
  ...Array.from({ length: 11 }, (_, i) => ({ mes: i + 1, nome: MESES_CALENDARIO[i + 1], pronto: false })),
];

const IMG_PACK_EM_DOBRO = "data:image/jpeg;base64,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";

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
    id: "comprou-ganhou", nome: "Comprou, Ganhou", cat: "brindes", nichos: ["Geral"],
    tipo: "Campanha completa de brindes",
    sugestoesNomes: [],
    objetivoPrincipal: "Aumentar a conversão e gerar mais vendas através de um benefício exclusivo.",
    alternativaCanal: "O canal principal pode ser a Loja física, o Site ou o Atendimento pelo WhatsApp — escolha o que fizer mais sentido pro jeito que sua loja vende hoje. Os demais canais abaixo (Stories, Reels, Feed, Status, Lista de transmissão) servem de apoio pra divulgar, independentemente de qual você escolher como principal.",
    como: "A campanha Comprou, Ganhou é uma estratégia comercial criada para aumentar as vendas durante um período específico oferecendo um benefício para quem realizar uma compra. Ao invés de oferecer desconto, a loja entrega um brinde de alto valor percebido, aumentando a sensação de vantagem e incentivando a decisão de compra sem desvalorizar os produtos. Essa estratégia pode ser utilizada em lançamentos de coleção, aniversários da loja, campanhas sazonais, datas comemorativas ou qualquer período em que o objetivo seja gerar mais vendas e movimentar a loja.",
    duracao: "3 a 7 dias",
    canalPrincipal: "Loja física",
    canaisApoio: ["Site", "WhatsApp individual", "Stories", "Reels", "Feed", "Status do WhatsApp", "Lista de transmissão"],
    objetivo: [
      "Aumentar as vendas durante um período específico.",
      "Aumentar a conversão sem depender de descontos.",
      "Agregar valor à compra.",
      "Incentivar clientes indecisos.",
      "Fortalecer campanhas de lançamento ou datas especiais.",
    ],
    quandoUsar: [
      "Lançamento de coleção.",
      "Datas comemorativas.",
      "Aniversário da loja.",
      "Semana especial de vendas.",
      "Campanhas para aumentar faturamento.",
      "Sempre que desejar oferecer um benefício sem reduzir a margem.",
    ],
    quandoEvitar: [
      "Durante liquidações com descontos muito agressivos.",
      "Quando houver outra campanha principal acontecendo ao mesmo tempo.",
      "Quando o brinde não tiver valor percebido para o cliente.",
    ],
    comoEscolherBrinde: {
      intro: "O sucesso da campanha depende da escolha do brinde. Evite brindes muito simples ou sem relação com o seu público. O ideal é que o cliente sinta que está recebendo um benefício exclusivo e que valha a pena aproveitar a campanha.",
      boasOpcoes: ["Necessaire personalizada", "Garrafa térmica", "Acessório exclusivo", "Cosmético", "Produto da nova coleção", "Segunda peça selecionada", "Kit da marca", "Lenço", "Organizador", "Vale para um serviço exclusivo"],
      perguntaChave: "Pergunte sempre: 'Esse brinde faria meu cliente comprar hoje para não perder essa oportunidade?' Se a resposta for não, escolha outro.",
    },
    checklist: [
      "Definir qual será o brinde.",
      "Definir a quantidade disponível.",
      "Definir as regras da campanha.",
      "Estabelecer o período da ação.",
      "Fotografar o brinde.",
      "Organizar os brindes na loja.",
      "Criar a comunicação visual da campanha.",
      "Preparar vitrine, site ou catálogo.",
      "Alinhar toda a equipe sobre as regras da campanha.",
    ],
    checklistExecucao: [
      "Iniciar a campanha na data planejada.",
      "Apresentar o benefício em todos os atendimentos.",
      "Mostrar o brinde antes de apresentar o preço.",
      "Entregar o brinde de forma especial para aumentar a percepção de valor.",
      "Registrar fotos e vídeos de clientes recebendo o benefício.",
      "Atualizar diariamente os conteúdos da campanha.",
      "Registrar internamente as vendas da campanha para acompanhar os resultados posteriormente.",
    ],
    planoDivulgacao: [
      { marco: "Dois dias antes", itens: [
        "Publicar um Reels anunciando que uma campanha especial está chegando.",
        "Mostrar bastidores da preparação nos Stories.",
        "Atualizar o Status do WhatsApp.",
        "Avisar clientes pelo WhatsApp que uma campanha exclusiva começa em breve.",
      ]},
      { marco: "Um dia antes", itens: [
        "Fazer contagem regressiva nos Stories.",
        "Mostrar parte do brinde sem revelar todos os detalhes.",
        "Reforçar a data de início da campanha.",
        "Publicar um lembrete no Status do WhatsApp.",
      ]},
      { marco: "Durante toda a campanha", itens: [
        "Mostrar clientes recebendo o brinde.",
        "Mostrar produtos participantes.",
        "Mostrar bastidores da loja.",
        "Compartilhar provas sociais e depoimentos.",
        "Mostrar quantidade limitada de brindes, quando fizer sentido.",
        "Fazer lembretes diários nos Stories.",
        "Reforçar a campanha no WhatsApp para clientes interessados.",
      ]},
    ],
    modelosMensagens: [
      { canal: "WhatsApp", texto: "Oi! Passei para avisar em primeira mão que nossa campanha Comprou, Ganhou começa em breve. Durante esse período, nas compras participantes, você recebe um presente exclusivo preparado especialmente para nossas clientes. Se quiser conhecer os produtos participantes, é só me chamar." },
    ],
    ideiasStories: [
      "Reels — Tema: 'Tem presente chegando por aqui.' Roteiro: comece mostrando detalhes do brinde sem revelar completamente, depois mostre alguns produtos participantes, finalize convidando o cliente para acompanhar a campanha e descobrir como garantir o presente.",
      "Story 1: mostre os bastidores da preparação da campanha.",
      "Story 2: apresente parte do brinde e gere curiosidade.",
      "Story 3: explique que a campanha começa em uma data específica.",
      "Story 4: mostre alguns produtos participantes.",
      "Story 5: finalize com uma chamada para ação — 'A partir de amanhã, nas compras participantes, você garante um presente exclusivo. Ative o lembrete e não perca.'",
    ],
    materiaisNecessarios: ["Brindes", "Embalagens", "Comunicação visual", "Celular para produção dos conteúdos", "Cartazes ou etiquetas (opcional)"],
    dicas: "Não comunique apenas 'ganhe um brinde'. Mostre o benefício de forma visual e destaque por que ele torna a compra ainda mais vantajosa. Quanto maior a percepção de valor do presente, maior será o desejo de participar da campanha.",
    resultado: [
      "Aumento das vendas durante a campanha.",
      "Maior conversão de clientes indecisos.",
      "Fortalecimento da percepção de valor da marca.",
      "Aumento do ticket médio (quando houver valor mínimo para participação).",
      "Maior engajamento nos canais de comunicação da loja.",
    ],
    relacionadas: ["comprou-ganhou-stories", "comprou-ganhou-vip", "desbloqueie-brindes", "cashback-inteligente", "frete-gratis-relampago", "combo-inteligente"],
  },
  {
    id: "comprou-ganhou-stories", nome: "Comprou, Ganhou Express (Stories)", cat: "brindes", nichos: ["Geral"],
    tipo: "Ação relâmpago de 1 dia",
    sugestoesNomes: [], alternativaCanal: null,
    objetivoPrincipal: "Gerar um pico imediato de vendas utilizando urgência e escassez.",
    como: "A campanha Comprou, Ganhou Express é uma ação relâmpago realizada exclusivamente pelos Stories com o objetivo de gerar um pico de vendas em poucas horas. A estratégia utiliza a combinação de urgência + escassez + exclusividade, incentivando os clientes a comprarem imediatamente para garantir um benefício limitado. Diferente da campanha tradicional, essa ação acontece em apenas um dia e normalmente possui uma quantidade limitada de brindes ou um período específico de duração. É ideal para movimentar um dia de baixo fluxo, destacar um produto específico, impulsionar uma coleção ou gerar vendas rápidas sem depender de descontos.",
    duracao: "1 dia",
    canalPrincipal: "Stories",
    canaisApoio: ["WhatsApp individual", "Status do WhatsApp"],
    objetivo: ["Gerar vendas rápidas.", "Movimentar produtos específicos.", "Criar sensação de oportunidade.", "Aumentar o fluxo de pedidos em poucas horas.", "Gerar engajamento nos Stories."],
    quandoUsar: ["Dias de baixo movimento.", "Meta de vendas do dia.", "Lançamento de um produto específico.", "Quando deseja destacar poucas peças.", "Para gerar faturamento rápido."],
    quandoEvitar: ["Durante campanhas maiores que já estejam acontecendo.", "Quando não houver disponibilidade suficiente de brindes.", "Quando a equipe não conseguir atender um aumento rápido na demanda."],
    comoEscolherBrinde: {
      intro: "Como essa campanha acontece em apenas um dia, o benefício precisa despertar desejo imediato. Escolha um brinde que faça o cliente sentir que vale a pena comprar naquele momento.",
      boasOpcoes: ["Acessório exclusivo", "Segunda peça selecionada", "Produto da coleção nova", "Necessaire", "Cosmético", "Kit personalizado", "Vale para um benefício futuro"],
      perguntaChave: "Você também pode limitar a quantidade disponível. Exemplos: primeiras 10 clientes, primeiras 20 compras, enquanto durarem os brindes. Isso aumenta a sensação de urgência.",
    },
    checklist: ["Escolher os produtos participantes.", "Definir qual será o brinde.", "Definir a quantidade disponível.", "Fotografar os produtos.", "Fotografar o brinde.", "Organizar os produtos para gravação.", "Definir o horário em que a campanha será aberta.", "Preparar toda a sequência de Stories antes do início."],
    checklistExecucao: ["Publicar os Stories no horário definido.", "Explicar claramente as regras.", "Mostrar os produtos participantes.", "Mostrar o brinde.", "Informar constantemente quantos brindes ainda restam.", "Responder rapidamente às mensagens.", "Atualizar os Stories durante todo o dia mostrando vendas acontecendo.", "Encerrar oficialmente quando os brindes acabarem ou no horário previsto."],
    planoDivulgacao: [
      { marco: "Um dia antes", itens: ["Publicar Stories avisando que uma oportunidade exclusiva será liberada no dia seguinte.", "Atualizar o Status do WhatsApp.", "Enviar mensagem para clientes mais próximas avisando para acompanharem os Stories."] },
      { marco: "No dia da campanha", itens: ["Abrir a campanha nos Stories.", "Explicar as regras.", "Mostrar os produtos participantes.", "Mostrar o brinde.", "Fazer atualizações durante o dia.", "Mostrar clientes comprando.", "Mostrar brindes sendo entregues.", "Fazer uma última chamada antes do encerramento."] },
    ],
    modelosMensagens: [{ canal: "WhatsApp (véspera)", texto: "Oi! Amanhã vou liberar uma oportunidade exclusiva pelos Stories. Se você gosta de garantir condições especiais, acompanha nosso Instagram porque será válido apenas durante o dia e com quantidade limitada." }],
    ideiasStories: [
      "Reels (véspera) — Tema: 'Amanhã vou liberar uma oportunidade para quem acompanha meus Stories.' Mostre rapidamente alguns detalhes do brinde e alguns produtos, sem revelar todas as informações. Finalize dizendo: 'Amanhã você vai entender por que vale a pena acompanhar desde cedo.'",
      "Story 1: 'Hoje preparei uma oportunidade especial para quem acompanha nossos Stories.'",
      "Story 2: apresente rapidamente o benefício. Exemplo: 'As primeiras 10 clientes que comprarem hoje vão ganhar um presente exclusivo.'",
      "Story 3: mostre os produtos participantes.",
      "Story 4: mostre o brinde.",
      "Story 5: explique como comprar.",
      "Story 6: mostre pedidos entrando.",
      "Story 7: atualize — 'Já restam apenas 5 brindes.'",
      "Story 8: última chamada — 'Estamos encerrando a campanha. Se você ainda quer garantir o presente, essa é a última oportunidade.'",
    ],
    materiaisNecessarios: ["Brindes", "Produtos participantes", "Celular", "Boa iluminação", "Organização para responder rapidamente os pedidos"],
    dicas: "Essa campanha funciona porque gera velocidade na decisão de compra. Evite deixá-la aberta por muitos dias. Quanto mais limitada for a oportunidade, maior será a tendência de o cliente agir imediatamente. Sempre mostre movimento durante a campanha: pedidos entrando, brindes sendo entregues e a quantidade restante. Isso aumenta a prova social e reforça a sensação de urgência.",
    resultado: ["Pico de vendas em um único dia.", "Aumento do engajamento nos Stories.", "Maior fluxo de mensagens no WhatsApp.", "Venda rápida de produtos específicos.", "Fortalecimento da percepção de exclusividade."],
    relacionadas: ["comprou-ganhou", "comprou-ganhou-vip", "desbloqueie-brindes", "frete-gratis-relampago", "cashback-relampago-vip"],
  },
  {
    id: "comprou-ganhou-vip", nome: "Comprou, Ganhou Express (Grupo VIP)", cat: "brindes", nichos: ["Geral"],
    tipo: "Ação relâmpago exclusiva para o grupo",
    sugestoesNomes: [], alternativaCanal: null,
    objetivoPrincipal: "Gerar um pico imediato de vendas e fortalecer o Grupo VIP da loja.",
    como: "A campanha Comprou, Ganhou Express (Grupo VIP) é uma estratégia relâmpago criada para gerar um pico de vendas utilizando um grupo exclusivo no WhatsApp. O benefício é disponibilizado apenas para quem faz parte do grupo, tornando a campanha mais exclusiva e incentivando clientes a permanecerem na comunidade para não perder futuras oportunidades. Diferente da campanha tradicional, essa ação acontece em apenas um dia e utiliza a antecipação para criar expectativa antes da abertura oficial.",
    duracao: "1 dia",
    canalPrincipal: "Grupo VIP",
    canaisApoio: ["Stories", "Status do WhatsApp", "WhatsApp individual"],
    objetivo: ["Gerar vendas rápidas.", "Aumentar o movimento no Grupo VIP.", "Criar exclusividade.", "Incentivar clientes a entrarem no grupo.", "Gerar sensação de oportunidade limitada."],
    quandoUsar: ["Dias de baixo movimento.", "Lançamento de produtos.", "Queima de estoque de poucas peças.", "Meta de vendas do dia.", "Quando deseja fortalecer o Grupo VIP."],
    quandoEvitar: ["Quando o grupo estiver pouco movimentado.", "Sem tempo suficiente para fazer a antecipação.", "Durante campanhas maiores acontecendo ao mesmo tempo."],
    comoEscolherBrinde: {
      intro: "O benefício precisa ser percebido como exclusivo. Escolha brindes que despertem desejo e façam o cliente sentir que vale a pena participar do grupo.",
      boasOpcoes: ["Acessório exclusivo", "Necessaire", "Produto da nova coleção", "Cosmético", "Segunda peça selecionada", "Kit personalizado", "Vale para um benefício futuro"],
      perguntaChave: "Sempre limite a quantidade disponível. Exemplos: primeiras 10 compras, primeiras 15 clientes, enquanto durarem os brindes.",
    },
    checklist: ["Definir qual será o brinde.", "Escolher os produtos participantes.", "Definir quantidade disponível.", "Organizar fotos e vídeos dos produtos.", "Preparar todas as mensagens do grupo antecipadamente.", "Definir o horário oficial da abertura.", "Criar link de convite do Grupo VIP."],
    checklistExecucao: ["Abrir oficialmente a campanha no grupo.", "Explicar claramente as regras.", "Publicar os produtos participantes.", "Mostrar o brinde.", "Atualizar constantemente as vendas.", "Informar quantos brindes ainda restam.", "Responder rapidamente às clientes.", "Encerrar oficialmente a campanha ao final do dia ou quando os brindes acabarem."],
    planoDivulgacao: [
      { marco: "Dois dias antes", itens: ["Publicar Stories convidando pessoas para entrarem no Grupo VIP.", "Atualizar o Status do WhatsApp.", "Compartilhar o link do grupo com clientes estratégicas."] },
      { marco: "Um dia antes", itens: ["Enviar uma mensagem no grupo informando que uma campanha exclusiva acontecerá no dia seguinte.", "Publicar Stories reforçando que somente participantes do grupo terão acesso.", "Fazer uma contagem regressiva."] },
      { marco: "No dia da campanha", itens: ["Abrir oficialmente a campanha no grupo.", "Publicar os produtos participantes.", "Mostrar o brinde.", "Atualizar as vendas ao longo do dia.", "Mostrar quais produtos já foram vendidos.", "Informar a quantidade restante de brindes.", "Fazer uma última chamada antes do encerramento."] },
    ],
    modelosMensagens: [
      { canal: "Grupo VIP (véspera)", texto: "Amanhã vou liberar uma campanha exclusiva para quem está aqui no grupo. Preparei um presente especial para as primeiras clientes que comprarem. Fique de olho porque a abertura será às ____." },
      { canal: "Grupo VIP (abertura)", texto: "Começou! A partir de agora, as primeiras clientes que realizarem compras participantes garantem um presente exclusivo preparado especialmente para esta campanha. Assim que os brindes acabarem, a campanha será encerrada." },
      { canal: "Grupo VIP (encerramento)", texto: "Encerramos nossa campanha de hoje! Obrigada a todas que participaram. Se você não conseguiu aproveitar desta vez, continue no grupo porque novas ações exclusivas serão liberadas por aqui." },
    ],
    ideiasStories: [
      "Reels (2 dias antes) — Tema: 'Essa oportunidade não vai acontecer no Instagram.' Mostre apenas pequenos detalhes do benefício e finalize convidando as pessoas para entrarem no Grupo VIP. Final: 'Se você quer participar, entre no nosso Grupo VIP. A campanha será exclusiva para quem estiver lá.'",
      "Story 1: 'Estou preparando uma ação exclusiva.'",
      "Story 2: 'Ela vai acontecer somente dentro do nosso Grupo VIP.'",
      "Story 3: mostre rapidamente o brinde sem revelar tudo.",
      "Story 4: explique que o grupo será fechado antes da campanha começar.",
      "Story 5: compartilhe o link para entrada.",
      "Story 6 (no dia): avise que a campanha começou dentro do grupo.",
    ],
    materiaisNecessarios: ["Grupo VIP organizado", "Link de convite", "Brindes", "Produtos participantes", "Fotos e vídeos prontos", "Celular disponível para atendimento rápido"],
    dicas: "O verdadeiro objetivo dessa campanha não é apenas vender naquele dia, mas fazer o cliente perceber que estar no Grupo VIP gera vantagens reais. Evite repetir esse tipo de ação com muita frequência. Quanto mais exclusiva ela parecer, maior será o interesse das clientes em permanecer no grupo e acompanhar as próximas oportunidades.",
    resultado: ["Pico de vendas em um único dia.", "Crescimento do Grupo VIP.", "Maior engajamento das clientes.", "Fortalecimento do relacionamento com a base.", "Mais vendas através do WhatsApp."],
    relacionadas: ["comprou-ganhou", "comprou-ganhou-stories", "desbloqueie-brindes", "cashback-relampago-vip", "frete-gratis-relampago", "preview-nova-colecao"],
  },
  {
    id: "desbloqueie-brindes", nome: "Desbloqueando Brindes", cat: "brindes", nichos: ["Geral"],
    tipo: "Compre mais, conquiste mais.",
    sugestoesNomes: [],
    objetivoPrincipal: "Aumentar o ticket médio através de brindes progressivos.",
    alternativaCanal: "O canal principal pode ser a Loja física, o Site ou o Atendimento pelo WhatsApp — escolha o que fizer mais sentido pro jeito que sua loja vende hoje.",
    como: "A campanha Desbloqueando Brindes é uma estratégia criada para aumentar o ticket médio incentivando o cliente a comprar mais para conquistar novos benefícios. Ao invés de oferecer apenas um único brinde, o cliente vai desbloqueando recompensas conforme aumenta o valor da sua compra. Isso cria uma sensação de progressão e faz com que ele queira adicionar mais produtos ao carrinho para alcançar o próximo nível. Essa estratégia funciona muito bem em lançamentos de coleção, datas comemorativas, semanas especiais e campanhas para aumentar o faturamento sem depender de descontos.",
    duracao: "3 a 7 dias",
    canalPrincipal: "Loja física",
    canaisApoio: ["Site", "WhatsApp individual", "Stories", "Reels", "Feed", "Status do WhatsApp", "Lista de transmissão"],
    objetivo: ["Aumentar o valor médio das compras.", "Incentivar o cliente a adicionar mais produtos ao carrinho.", "Criar uma experiência de compra mais divertida.", "Aumentar a percepção de valor da campanha.", "Vender mais sem oferecer descontos."],
    quandoUsar: ["Lançamento de coleção.", "Datas comemorativas.", "Aniversário da loja.", "Campanhas de aumento de faturamento.", "Semanas especiais de vendas.", "Quando deseja aumentar o ticket médio."],
    quandoEvitar: ["Durante liquidações agressivas.", "Quando os brindes não possuem valor percebido.", "Quando não for possível controlar os níveis de premiação."],
    comoEscolherBrinde: {
      intro: "Os brindes devem aumentar de valor conforme o cliente sobe de nível. A ideia é que cada recompensa desperte ainda mais desejo para que ele continue comprando. Evite oferecer brindes aleatórios ou sem relação entre si. Uma ótima estratégia é montar um kit progressivo. Exemplo: compras acima de R$150 → escova de cabelo personalizada; acima de R$300 → escova + espelho personalizado; acima de R$450 → escova + espelho + necessaire exclusiva. O cliente percebe que, comprando um pouco mais, recebe um benefício muito maior.",
      boasOpcoes: ["Cosméticos", "Acessórios", "Produtos exclusivos", "Kits personalizados", "Vale para um serviço", "Produtos da nova coleção"],
      perguntaChave: "Você também pode adaptar os níveis para qualquer segmento da sua loja.",
    },
    checklist: ["Definir quantos níveis de brindes existirão.", "Escolher os brindes de cada nível.", "Definir os valores mínimos para desbloqueio.", "Fotografar todos os brindes.", "Criar uma identidade visual mostrando cada etapa.", "Organizar os brindes por categoria.", "Alinhar toda a equipe sobre as regras da campanha."],
    checklistExecucao: ["Apresentar os níveis da campanha para todos os clientes.", "Durante o atendimento, informar quanto falta para desbloquear o próximo nível.", "Sugerir produtos complementares para atingir o próximo valor.", "Entregar os brindes de forma especial.", "Registrar fotos e vídeos dos clientes recebendo os kits.", "Atualizar diariamente os conteúdos da campanha.", "Registrar internamente as vendas para acompanhar o resultado da ação."],
    planoDivulgacao: [
      { marco: "Dois dias antes", itens: ["Publicar um Reels mostrando que uma campanha especial está chegando.", "Mostrar apenas partes dos brindes nos Stories.", "Atualizar o Status do WhatsApp.", "Avisar clientes que uma campanha exclusiva será lançada em breve."] },
      { marco: "Um dia antes", itens: ["Publicar uma contagem regressiva.", "Mostrar que existirão diferentes níveis de brindes.", "Criar expectativa sem revelar todos os detalhes."] },
      { marco: "Durante toda a campanha", itens: ["Mostrar clientes desbloqueando os brindes.", "Mostrar os kits completos.", "Explicar quanto falta para alcançar o próximo nível.", "Mostrar sugestões de combinações de produtos.", "Compartilhar depoimentos e provas sociais.", "Fazer lembretes diários nos Stories.", "Reforçar a campanha pelo WhatsApp."] },
    ],
    modelosMensagens: [{ canal: "WhatsApp", texto: "Nossa campanha Desbloqueando Brindes já começou! Quanto maior o valor da sua compra, mais presentes você conquista. Posso te mostrar algumas combinações que já desbloqueiam os próximos níveis." }],
    ideiasStories: [
      "Reels — Tema: 'Até onde você consegue desbloquear?' Comece mostrando apenas o primeiro brinde, depois revele rapidamente o segundo, finalize mostrando o kit completo. Encerramento: 'Quanto maior a sua compra, mais presentes você desbloqueia durante nossa campanha.'",
      "Story 1: apresente a campanha — 'Hoje você pode desbloquear presentes conforme aumenta sua compra.'",
      "Story 2: mostre o primeiro nível.",
      "Story 3: mostre o segundo nível.",
      "Story 4: mostre o terceiro nível.",
      "Story 5: monte uma combinação de produtos que já atinge um dos níveis.",
      "Story 6: mostre clientes desbloqueando brindes.",
      "Story 7: faça uma última chamada — 'Ainda dá tempo de garantir o seu kit antes do encerramento da campanha.'",
    ],
    materiaisNecessarios: ["Brindes organizados por nível", "Comunicação visual da campanha", "Cartaz ou tabela mostrando os níveis", "Celular para produção dos conteúdos", "Embalagens para os kits"],
    exemplosReais: [
      {
        titulo: "Vídeo de antecipação — Semana do Cliente",
        descricao: "Reels mostrando o pedido sendo montado ao vivo, peça por peça, antes de revelar que é de graça: 'Vem fechar esse pedido comigo' → escolhe a necessaire (R$49,90) → escolhe a regata da coleção nova (R$59,90) → escolhe o gloss da marca → soma o total na tela (R$144,90) → só no final revela: 'Se eu te disser que você pode ganhar esse presente totalmente de graça na Semana do Cliente...' e chama pra ler a legenda pra participar. Gera desejo pelos produtos antes de contar que é brinde — funciona pra qualquer data, não só Semana do Cliente.",
        url: "https://www.instagram.com/p/DOvvyc0gLsw/",
      },
    ],
    dicas: "O segredo dessa campanha não está apenas nos brindes, mas em mostrar ao cliente que ele está muito próximo de conquistar um benefício ainda melhor. Durante o atendimento, utilize frases como: 'Faltam apenas R$40 para você desbloquear o próximo presente' ou 'Com mais uma peça você leva um kit completo.' Esse tipo de abordagem aumenta naturalmente o ticket médio sem que o cliente tenha a sensação de estar sendo pressionado.",
    resultado: ["Aumento do ticket médio.", "Mais produtos por venda.", "Maior percepção de valor.", "Aumento do faturamento durante a campanha.", "Maior engajamento nos canais da loja."],
    relacionadas: ["comprou-ganhou", "comprou-ganhou-stories", "comprou-ganhou-vip", "combo-inteligente", "leve-mais-pague-menos", "cashback-inteligente"],
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
    templateVisual: { label: "Modelo pronto no Canva", url: "https://canva.link/pk7hu5wbrrx8lhl" },
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
    templateVisual: { label: "Modelo pronto no Canva", url: "https://canva.link/pk7hu5wbrrx8lhl" },
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
    templateVisual: { label: "Modelo pronto no Canva", url: "https://canva.link/pk7hu5wbrrx8lhl" },
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
  {
    id: "chave-premiada", nome: "Chave Premiada", cat: "brindes", nichos: ["Geral"],
    tipo: "Mecânica de surpresa e descoberta para ação rápida",
    sugestoesNomes: [],
    como: "Use a Chave Premiada para criar uma ação rápida, com sensação de exclusividade e descoberta, estimulando a cliente a comprar naquele dia. Funciona especialmente bem em datas repetidas, como 10/10, 11/11 ou 12/12, porque o próprio conceito da data pode virar o motivo da ação. Também pode ser usada em lançamentos, aniversário da loja, Dia do Cliente ou em um dia estratégico de vendas.",
    duracao: "Ação relâmpago: 1 dia. Na loja física, pode ser estendida para 2 ou 3 dias se você quiser gerar mais fluxo.",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories"],
    objetivo: [
      "Criar uma ação rápida, com sensação de exclusividade e descoberta",
      "Estimular a cliente a comprar naquele dia",
      "Aproveitar datas repetidas (10/10, 11/11, 12/12) como motivo da ação",
      "Também funciona em lançamentos, aniversário da loja, Dia do Cliente ou um dia estratégico de vendas",
    ],
    quandoUsar: ["Datas repetidas como 10/10, 11/11 ou 12/12", "Lançamentos", "Aniversário da loja", "Dia do Cliente", "Um dia estratégico de vendas"],
    quandoEvitar: [],
    checklist: [
      "Defina o objetivo da ação.",
      "Defina a condição para participar.",
      "Escolha os benefícios: desconto, brinde, cashback, vale-compra, frete, condição especial de pagamento ou benefício para a próxima compra.",
      "Defina quantas chaves estarão disponíveis.",
      "Organize a forma de participação.",
      "Defina horário de início e encerramento.",
    ],
    checklistExecucao: [
      "Se for no Instagram: criar três ou mais chaves numeradas e publicar os Stories na sequência.",
      "Se for na loja: deixar as chaves visíveis em um ponto estratégico, com uma pequena estação 'ESCOLHA SUA CHAVE'.",
      "A cliente realiza a condição definida, escolhe uma chave e descobre o benefício.",
      "Aproveite para gravar algumas participações.",
    ],
    planoDivulgacao: [
      { marco: "Antecipação para uma data repetida (dia anterior)", itens: [
        "Story 1: foto de um detalhe da loja — 'Amanhã é 10/10.'",
        "Story 2: 'E a gente decidiu que uma data dessas não podia passar em branco.'",
        "Story 3: foto de uma chave — 'Amanhã você vai precisar escolher uma.'",
        "Story 4: '10/10 — Chave Premiada. Só amanhã.'",
      ]},
      { marco: "Se for fazer no Instagram", itens: [
        "Story 1: 'Hoje é 10/10. E já que a data é especial, resolvemos transformar o dia em uma oportunidade especial também.'",
        "Story 2: 'Escolha uma chave: 🔑 1 🔑 2 🔑 3'",
        "Story 3 (depois que a cliente escolher): 'Você escolheu a chave [X]. Seu benefício é: [BENEFÍCIO].'",
        "Story 4: 'Para aproveitar, é só [condição de compra].'",
        "Story 5: 'A Chave Premiada é válida somente hoje, até [horário].'",
      ]},
      { marco: "Durante a ação", itens: [
        "Não fique apenas repetindo a promoção.",
        "Mostre: as chaves; clientes escolhendo; benefícios sendo revelados; quantidade de chaves restantes; horário final.",
        "Story: 'A primeira chave já foi escolhida por aqui.'",
        "Depois: 'E o benefício foi esse…'",
        "No final: 'Últimas horas para participar. Hoje, às [horário], encerramos.'",
      ]},
    ],
    modelosMensagens: [
      { canal: "Lista de clientes", texto: "Oi, [nome]! Hoje estamos fazendo uma ação especial por causa do 10/10. Nas compras acima de R$[X], você escolhe uma chave e descobre um benefício. É só hoje e lembrei de te avisar porque achei que você poderia aproveitar." },
    ],
    ideiasStories: [],
    dicas: "Não coloque todos os benefícios no mesmo nível. Você pode ter benefícios menores e alguns mais desejados para criar expectativa.",
    resultado: [
      "Sensação de exclusividade e descoberta para a cliente",
      "Estímulo à compra no mesmo dia",
      "Conteúdo natural pra Stories (escolha, revelação, reação)",
      "Aproveitamento direto do conceito da data repetida",
    ],
    relacionadas: ["cofre-de-beneficios", "caixa-misteriosa", "dados-da-sorte"],
    nichoExemplos: {
      "Loja de acessórios": "Escolha sua chave e desbloqueie um benefício na compra do seu próximo acessório.",
      "Loja infantil": "Na compra acima de R$X, escolha uma chave e descubra seu presente.",
      "Loja de beleza": "Transforme o benefício em serviço, produto ou condição para uma próxima visita.",
    },
  },
  {
    id: "envelope-premiado", nome: "Envelope Premiado", cat: "brindes", nichos: ["Geral"],
    tipo: "Mecânica de curiosidade, incentivo de compra e experiência",
    sugestoesNomes: [],
    como: "O Envelope Premiado é uma ação simples para criar curiosidade + incentivo de compra + experiência. É especialmente interessante quando você quer transformar uma promoção comum em algo que gere participação.",
    duracao: "1 dia para uma ação relâmpago. Pode durar 2 a 4 dias em campanhas especiais.",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories", "WhatsApp individual"],
    objetivo: ["Criar curiosidade, incentivo de compra e experiência", "Transformar uma promoção comum em algo que gere participação"],
    quandoUsar: [
      "Quando quer transformar uma promoção comum em experiência",
      "Loja física — excelente para criar experiência",
      "Instagram/WhatsApp — pode funcionar de forma virtual, com envelopes numerados que a cliente escolhe",
    ],
    quandoEvitar: [],
    checklist: [
      "Separe os envelopes e defina previamente o que haverá dentro de cada um.",
      "Use descontos, brindes, cashback, vale-compra, benefícios para próxima compra ou condições especiais.",
      "Não revele tudo antes da ação.",
    ],
    checklistExecucao: [
      "Nas compras acima de R$[X] (valor definido), a cliente escolhe um envelope e descobre seu benefício.",
      "Mostrar uma cliente escolhendo e a abertura do envelope.",
    ],
    planoDivulgacao: [
      { marco: "Antecipação", itens: [
        "Story 1: foto dos envelopes — 'Amanhã tem uma coisa diferente por aqui.'",
        "Story 2: 'Você vai poder escolher um deles.'",
        "Story 3: 'Mas o que tem dentro… só quem participar vai descobrir.'",
        "Story 4: '[DATA] — Envelope Premiado.'",
      ]},
      { marco: "Dia da ação", itens: [
        "Story 1: vídeo mostrando os envelopes — 'É HOJE.'",
        "Story 2: 'Nas compras acima de R$[X], você escolhe um envelope.'",
        "Story 3: 'E dentro dele existe um benefício para você.'",
        "Story 4: mostre uma cliente escolhendo — 'Qual você escolheria?'",
        "Story 5: mostre a abertura — 'Ela escolheu o [número].'",
        "Story 6: 'E ganhou [benefício].'",
        "Story 7: 'Quer escolher o seu? Hoje até [horário].'",
      ]},
    ],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Para uma data como 11/11, você pode criar: '11/11 — 11 envelopes, 11 oportunidades' ou '11/11 — Escolha seu envelope'. A data passa a ser parte do conceito da ação, e não apenas uma desculpa para fazer promoção.",
    resultado: [
      "Curiosidade e participação em torno da ação",
      "Experiência de escolha e descoberta pra cliente",
      "Boa adaptação pra loja física e também pra Instagram/WhatsApp",
    ],
    relacionadas: ["chave-premiada", "balao-premiado", "mural-da-sorte"],
    narrativasPorData: {
      "11/11": "11/11 — 11 envelopes, 11 oportunidades (ou: 11/11 — Escolha seu envelope)",
    },
  },
  {
    id: "balao-premiado", nome: "Balão Premiado", cat: "brindes", nichos: ["Geral"],
    tipo: "Mecânica de movimento, experiência e conteúdo para loja física",
    sugestoesNomes: ["Estoure o Balão"],
    como: "Ideal para criar movimento, experiência e conteúdo, principalmente na loja física. É uma ótima opção para um sábado, evento, aniversário da loja ou data repetida.",
    duracao: "Relâmpago: algumas horas ou 1 dia. Também pode funcionar durante um evento específico.",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories"],
    objetivo: ["Criar movimento, experiência e conteúdo na loja física", "O objetivo não é apenas o benefício — é a experiência de participar"],
    quandoUsar: ["Um sábado", "Um evento", "Aniversário da loja", "Data repetida"],
    quandoEvitar: [],
    checklist: [
      "Defina quantidade de balões.",
      "Defina os benefícios.",
      "Defina a condição de participação.",
      "Defina horário.",
      "Defina validade dos benefícios.",
      "Coloque os benefícios dentro dos balões antes da ação.",
    ],
    checklistExecucao: [
      "Faça a ação acontecer em um lugar visível da loja.",
      "Nas compras acima de R$[X], a cliente escolhe um balão e estoura.",
      "Grave o momento de estourar o balão.",
    ],
    planoDivulgacao: [
      { marco: "Antecipação", itens: [
        "Story 1: mostre apenas alguns balões — 'Tem coisa diferente acontecendo por aqui amanhã…'",
        "Story 2: 'E você vai precisar escolher um.'",
        "Story 3: 'Mas só vai descobrir o que ganhou depois.'",
        "Story 4: '[DATA] — Balão Premiado.'",
      ]},
      { marco: "No dia", itens: [
        "Story 1: vídeo mostrando todos os balões — 'COMEÇOU.'",
        "Story 2: 'Hoje, nas compras acima de R$[X], você escolhe um balão.'",
        "Story 3: 'E agora vem a parte mais divertida.'",
        "Story 4: vídeo de uma cliente estourando — 'Vamos descobrir o que veio?'",
        "Story 5: revele o benefício.",
        "Story 6: 'Ainda dá tempo de participar. Estamos aqui até [horário].'",
      ]},
    ],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "No 12/12, use: '12/12 — 12 balões, 12 benefícios.' Trabalhe inclusive uma quantidade limitada — 'Só 12 balões disponíveis hoje.' Isso cria urgência sem precisar aumentar o desconto.",
    resultado: [
      "Movimento e experiência visível na loja física",
      "Conteúdo natural pra Stories (escolha, estouro, reação)",
      "Urgência criada sem precisar aumentar desconto",
    ],
    relacionadas: ["chave-premiada", "caixa-misteriosa", "dados-da-sorte"],
    narrativasPorData: {
      "12/12": "12/12 — 12 balões, 12 benefícios (quantidade limitada: 'Só 12 balões disponíveis hoje.')",
    },
  },
  {
    id: "caixa-misteriosa", nome: "Caixa Misteriosa", cat: "brindes", nichos: ["Geral"],
    tipo: "Mecânica pra aumentar ticket médio e criar experiência",
    sugestoesNomes: ["Caixa do Amor"],
    como: "Use quando o objetivo principal for aumentar o valor da compra e, ao mesmo tempo, criar uma experiência na loja. É uma das melhores mecânicas para trabalhar ticket.",
    duracao: "2 a 7 dias. Também pode ser usada exclusivamente durante um evento ou em um sábado.",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories"],
    objetivo: ["Aumentar o valor da compra (ticket médio)", "Criar uma experiência na loja"],
    quandoUsar: ["Quando o objetivo é aumentar ticket médio", "Durante um evento ou em um sábado"],
    quandoEvitar: [],
    checklist: [
      "Não escolha o valor mínimo aleatoriamente — olhe para o seu ticket médio (ex: ticket em R$180, uma condição de R$200 pode estimular uma pequena evolução na compra).",
      "A ação precisa criar um próximo degrau, não ser liberada para praticamente todas as compras.",
      "Defina o que vai dentro da caixa: produtos da loja, acessórios, pequenos mimos, brindes, vouchers, benefícios para próxima compra ou produtos comprados especialmente para a ação.",
    ],
    checklistExecucao: [
      "Compras acima do valor mínimo definido dão direito a colocar a mão na Caixa Misteriosa e retirar um presente.",
      "Não revele a regra logo de cara na antecipação.",
    ],
    planoDivulgacao: [
      { marco: "Antecipação", itens: [
        "Story 1: vídeo da caixa fechada — 'Tem uma caixa aqui na loja que eu não posso abrir.'",
        "Story 2: 'Na verdade, quem vai abrir é você.'",
        "Story 3: 'Amanhã eu explico como participar.'",
      ]},
      { marco: "Lançamento", itens: [
        "Story 1: mostre a caixa — 'A Caixa Misteriosa está aberta.'",
        "Story 2: 'Nas compras acima de R$[X], você ganha o direito de colocar a mão aqui dentro e retirar um presente.'",
        "Story 3: 'E não, você não pode olhar antes.'",
        "Story 4: mostre uma cliente participando — 'O que será que ela vai tirar?'",
        "Story 5: reação + presente.",
        "Story 6: 'Quer descobrir o seu? Vem para a loja.'",
      ]},
    ],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Pra Dia dos Namorados, transforme a mesma mecânica em 'Caixa do Amor', trocando os brindes por itens relacionados à data. A estrutura continua sendo: valor mínimo → experiência → surpresa → benefício.",
    resultado: [
      "Aumento do ticket médio (próximo degrau de compra)",
      "Experiência de surpresa na loja",
      "Boa adaptação pra datas temáticas (ex: Caixa do Amor)",
    ],
    relacionadas: ["balao-premiado", "cofre-de-beneficios", "chave-premiada"],
  },
  {
    id: "dados-da-sorte", nome: "Dados da Sorte", cat: "brindes", nichos: ["Geral"],
    tipo: "Mecânica rápida e divertida pra datas especiais",
    sugestoesNomes: [],
    como: "Use para transformar uma compra em uma experiência rápida e divertida. Funciona muito bem em datas especiais, eventos e ações de um único dia.",
    duracao: "1 dia ou algumas horas.",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories"],
    objetivo: ["Transformar uma compra em uma experiência rápida e divertida"],
    quandoUsar: ["Datas especiais", "Eventos", "Ações de um único dia"],
    quandoEvitar: [],
    checklist: [
      "Defina os benefícios de acordo com sua margem e objetivo. Exemplo: 1 — 5% de desconto; 2 — Brinde; 3 — R$20 de cashback; 4 — Frete grátis; 5 — Benefício para próxima compra; 6 — Prêmio especial.",
    ],
    checklistExecucao: [
      "A cliente cumpre a condição da ação e joga um dado.",
      "Cada número corresponde a um benefício.",
    ],
    planoDivulgacao: [
      { marco: "Antecipação", itens: [
        "Story 1: close no dado — 'Amanhã você vai precisar contar com a sorte.'",
        "Story 2: 'Mas o melhor é que qualquer resultado pode virar benefício.'",
        "Story 3: '[DATA] — Dados da Sorte.'",
      ]},
      { marco: "No dia", itens: [
        "Story 1: 'Seu número pode valer um benefício.'",
        "Story 2: 'Nas compras acima de R$[X], você joga o dado.'",
        "Story 3: mostre uma cliente jogando — 'Qual número será?'",
        "Story 4: 'Caiu [X].'",
        "Story 5: 'E isso significa: [benefício].'",
        "Story 6: 'Ainda dá tempo de jogar o seu. Até [horário].'",
      ]},
    ],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Pra uma data como 10/10, crie '10/10 — Dados da Sorte' e limite a ação ('Hoje, somente 10 clientes poderão participar') ou ofereça '10 benefícios diferentes para quem comprar hoje' — assim você usa o número da data para construir a campanha.",
    resultado: [
      "Experiência rápida e divertida de compra",
      "Conteúdo fácil de gerar pros Stories",
      "Número da data incorporado na mecânica",
    ],
    relacionadas: ["chave-premiada", "balao-premiado", "mural-da-sorte"],
    narrativasPorData: {
      "10/10": "10/10 — Dados da Sorte (ex: 'Hoje, somente 10 clientes poderão participar' ou '10 benefícios diferentes para quem comprar hoje')",
    },
  },
  {
    id: "mural-da-sorte", nome: "Mural da Sorte", cat: "brindes", nichos: ["Geral"],
    tipo: "Ponto visual na loja que gera curiosidade e interação",
    sugestoesNomes: [],
    como: "O Mural da Sorte funciona muito bem quando você quer criar um ponto visual dentro da loja que gere curiosidade e faça a cliente interagir.",
    duracao: "2 a 7 dias.",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories"],
    objetivo: ["Criar um ponto visual dentro da loja que gere curiosidade", "Fazer a cliente interagir"],
    quandoUsar: ["Quando quer um ponto visual de curiosidade na loja por alguns dias"],
    quandoEvitar: [],
    checklist: [
      "Monte um mural com envelopes, cartões ou espaços numerados — pode ser mural com envelopes, mural com cartões, mural numerado, painel com bolsos ou cartões pendurados.",
      "O importante é que a cliente veja a ação antes mesmo de alguém explicar.",
    ],
    checklistExecucao: [
      "A cliente que cumprir a condição escolhe um espaço e descobre seu benefício.",
      "Use uma enquete ou caixa de resposta pra gerar interação mesmo de quem não está na loja.",
    ],
    planoDivulgacao: [
      { marco: "Antecipação", itens: [
        "Story 1: mostre apenas um detalhe — 'Estamos montando uma coisa nova na loja.'",
        "Story 2: mostre outro pedaço — 'Você vai poder escolher um.'",
        "Story 3: 'Mas o que tem dentro só vamos descobrir amanhã.'",
      ]},
      { marco: "Lançamento", itens: [
        "Story 1: revele o mural — 'MURAL DA SORTE liberado.'",
        "Story 2: 'Nas compras acima de R$[X], você escolhe um envelope.'",
        "Story 3: 'E descobre seu benefício.'",
        "Story 4: mostre uma cliente escolhendo.",
        "Story 5: mostre a abertura.",
        "Story 6: 'Qual você escolheria?'",
      ]},
    ],
    modelosMensagens: [],
    ideiasStories: [],
    dicas: "Pra datas repetidas, crie um mural numerado: '11/11 — 11 envelopes' ou '12/12 — 12 benefícios'. Isso dá uma identidade própria para cada campanha.",
    resultado: [
      "Curiosidade visível na loja antes mesmo de explicar a ação",
      "Interação mesmo de quem não está presencialmente na loja (enquete)",
      "Identidade própria por campanha quando numerado pela data",
    ],
    relacionadas: ["envelope-premiado", "dados-da-sorte", "chave-premiada"],
    narrativasPorData: {
      "11/11": "11/11 — 11 envelopes",
      "12/12": "12/12 — 12 benefícios",
    },
  },
  {
    id: "passaporte-da-data", nome: "Passaporte da Data", cat: "brindes", nichos: ["Geral"],
    tipo: "Mecânica de recorrência em etapas, não só na primeira compra",
    sugestoesNomes: [],
    como: "Essa ação é diferente das anteriores porque não precisa terminar na primeira compra. Use quando o objetivo for fazer a cliente voltar, participar de mais de uma etapa e criar recorrência durante uma campanha.",
    duracao: "7 a 10 dias.",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories", "WhatsApp individual"],
    objetivo: ["Fazer a cliente voltar à loja mais de uma vez", "Criar recorrência durante uma campanha"],
    quandoUsar: ["Quando o objetivo é recorrência, não só a primeira compra"],
    quandoEvitar: [],
    checklist: [
      "Monte o passaporte com algumas etapas que façam sentido para o objetivo da loja. Exemplo (Passaporte 10/10): 1) Faça uma compra durante a campanha. 2) Volte à loja em outro dia. 3) Conheça uma nova categoria. 4) Faça uma segunda compra. 5) Complete o passaporte.",
      "Ao completar, a cliente desbloqueia um benefício especial.",
    ],
    checklistExecucao: [
      "Cada etapa cumprida gera um carimbo, marcação ou avanço no passaporte da cliente.",
      "Mostre progresso durante a campanha em vez de ficar repetindo a promoção.",
    ],
    planoDivulgacao: [
      { marco: "Dia 1 — lançamento", itens: [
        "Story 1: 'Começou uma campanha diferente por aqui.'",
        "Story 2: 'Dessa vez, você não precisa resolver tudo em um único dia.'",
        "Story 3: mostre o passaporte — 'Você vai completar algumas etapas e desbloquear um benefício no final.'",
        "Story 4: 'Quer receber o seu? [CTA]'",
      ]},
      { marco: "Durante a campanha", itens: [
        "'Hoje ela completou mais uma etapa.'",
        "'Falta pouco para desbloquear o benefício.'",
        "'Você já começou o seu?'",
      ]},
    ],
    modelosMensagens: [
      { canal: "WhatsApp", texto: "Oi, [nome]! Começamos uma ação diferente aqui na loja. É o Passaporte [nome da campanha]. Você recebe algumas etapas para completar durante os próximos dias e, quando finalizar, desbloqueia um benefício especial. Se quiser participar, posso te explicar como funciona." },
    ],
    ideiasStories: [],
    dicas: "As etapas devem fazer sentido para o objetivo da loja — não force etapas aleatórias só pra ter mais passos.",
    resultado: [
      "Cliente volta à loja mais de uma vez durante a campanha",
      "Recorrência criada dentro de um único período promocional",
      "Conteúdo de progresso ao longo de vários dias, não só no lançamento",
    ],
    relacionadas: ["cofre-de-beneficios", "mural-da-sorte"],
  },
  {
    id: "cofre-de-beneficios", nome: "Cofre de Benefícios", cat: "brindes", nichos: ["Geral"],
    tipo: "Mecânica de fidelização e recompra, com liberação progressiva de benefícios",
    sugestoesNomes: [],
    como: "O Cofre de Benefícios é mais indicado para fidelização e recompra. Em vez de dar um benefício imediatamente, você cria uma condição que faz a cliente desbloquear benefícios ao longo de determinado período.",
    duracao: "7 a 30 dias.",
    canalPrincipal: "WhatsApp individual",
    canaisApoio: ["Stories"],
    objetivo: ["Fidelização e recompra", "Criar exclusividade, e não simplesmente oferecer desconto para todo mundo"],
    quandoUsar: ["Fidelização de um grupo de clientes selecionadas", "Quando quer criar exclusividade em vez de desconto genérico"],
    quandoEvitar: [],
    checklist: [
      "Defina as etapas de desbloqueio. Exemplo: primeira compra desbloqueia benefício 1; segunda compra desbloqueia benefício 2; atingiu determinado valor desbloqueia benefício 3.",
      "Pode ser utilizado com um grupo de clientes selecionadas.",
    ],
    checklistExecucao: [
      "A cliente entra no 'cofre' e vai desbloqueando benefícios conforme cumpre determinadas ações.",
      "A comunicação pode ser mais exclusiva — funciona especialmente bem por mensagem individual.",
    ],
    planoDivulgacao: [
      { marco: "Conteúdo", itens: [
        "Story 1: 'Tem uma novidade que não vai ser para todo mundo.'",
        "Story 2: 'Estamos abrindo um grupo especial de clientes.'",
        "Story 3: 'Quem estiver dentro vai receber alguns benefícios ao longo deste mês.'",
        "Story 4: 'Quer saber como entrar? [CTA]'",
      ]},
      { marco: "Para as clientes selecionadas", itens: [
        "'Seu acesso ao Cofre de Benefícios está liberado.'",
        "A cada benefício liberado: 'Cofre aberto. Benefício de hoje: [benefício].'",
      ]},
    ],
    modelosMensagens: [
      { canal: "WhatsApp individual", texto: "Oi, [nome]! Estou entrando em contato porque você está entre as clientes que receberam acesso ao nosso Cofre de Benefícios deste mês. Vou te enviar algumas condições especiais ao longo dos próximos dias. A primeira é [benefício]." },
    ],
    ideiasStories: [],
    dicas: "Isso transforma a ação em relacionamento, e não apenas em promoção.",
    resultado: [
      "Fidelização e aumento de recompra",
      "Sensação de exclusividade pra quem participa",
      "Relacionamento construído ao longo do período, não só uma venda pontual",
    ],
    relacionadas: ["passaporte-da-data", "caixa-misteriosa"],
  },
  {
    id: "mecanicas-datas-repetidas-guia", nome: "Como Usar Essas Ações em Datas Repetidas", cat: "brindes", nichos: ["Geral"],
    tipo: "Guia de aplicação das mecânicas em datas de números iguais",
    sugestoesNomes: [],
    como: "As datas iguais são uma ótima oportunidade para criar microcampanhas de um dia, sem precisar inventar uma grande promoção todos os meses. Você pode transformar a própria data no conceito. O mais importante é não usar a data apenas como título — faça a data influenciar a mecânica: 10 clientes, 10 benefícios, 10 oportunidades, 10 horas, 10 produtos, R$10 de benefício, 10% em determinada condição. Assim a campanha ganha um conceito.",
    duracao: "Normalmente 1 dia (microcampanha).",
    canalPrincipal: "Loja física",
    canaisApoio: ["Stories", "WhatsApp individual"],
    objetivo: ["Criar microcampanhas de um dia em cima das datas de números iguais", "Fazer a data influenciar a mecânica, não ser só um título"],
    quandoUsar: ["10/10", "11/11", "12/12", "e qualquer outra data de números iguais do calendário"],
    quandoEvitar: [],
    checklist: [
      "10/10 — Chave Premiada: '10/10 — escolha sua chave.'",
      "10/10 — Dados da Sorte: '10/10 — seu número pode virar benefício.' / '10 benefícios disponíveis durante o dia.'",
      "11/11 — Envelope Premiado: '11/11 — 11 envelopes.'",
      "11/11 — Mural da Sorte: '11/11 — escolha um dos 11 benefícios.'",
      "12/12 — Balão Premiado: '12/12 — 12 balões.'",
      "12/12 — Caixa Misteriosa: '12/12 — compras acima de R$X participam.'",
    ],
    checklistExecucao: [
      "Um exemplo completo (10/10) — Objetivo: gerar vendas em um dia específico.",
      "Mecânica: Chave Premiada.",
      "Condição: compras acima de R$200.",
      "Benefícios: 10 benefícios diferentes.",
    ],
    planoDivulgacao: [
      { marco: "09/10 — antecipação", itens: [
        "'Amanhã é 10/10. E a gente resolveu fazer uma coisa diferente. Amanhã você vai precisar escolher uma chave.'",
      ]},
      { marco: "10/10 — manhã", itens: [
        "'É HOJE. 10/10 — Chave Premiada. Nas compras acima de R$200, você escolhe uma chave e descobre seu benefício.'",
      ]},
      { marco: "Durante o dia", itens: [
        "Mostrar clientes escolhendo.",
        "Mostrar benefícios.",
        "Mostrar movimento.",
      ]},
      { marco: "Final do dia", itens: [
        "'Últimas horas para participar do 10/10. Às [horário], nossas chaves encerram.'",
      ]},
    ],
    modelosMensagens: [
      { canal: "WhatsApp (clientes com potencial de compra)", texto: "Oi, [nome]! Hoje é 10/10 e estamos fazendo uma ação especial aqui na loja. Nas compras acima de R$200, você escolhe uma chave e desbloqueia um benefício. É só hoje. Se quiser aproveitar, me chama que te mostro as opções disponíveis." },
    ],
    ideiasStories: [],
    dicas: "O mais importante é não usar a data apenas como título. Faça a data influenciar a mecânica — na quantidade de kits, no número de brindes, no parcelamento, nos primeiros clientes, no cashback, no horário da live, no cupom e até na comunicação.",
    resultado: [
      "Microcampanhas de um dia, fáceis de repetir todo mês",
      "Conceito de campanha memorável, não só mais uma promoção",
      "Mecânicas reaproveitáveis entre as datas de números iguais",
    ],
    relacionadas: ["chave-premiada", "dados-da-sorte", "envelope-premiado", "mural-da-sorte", "balao-premiado", "caixa-misteriosa"],
    narrativasPorData: {
      "10/10": "Chave Premiada ('10/10 — escolha sua chave') ou Dados da Sorte ('10/10 — seu número pode virar benefício', '10 benefícios disponíveis durante o dia')",
      "11/11": "Envelope Premiado ('11/11 — 11 envelopes') ou Mural da Sorte ('11/11 — escolha um dos 11 benefícios')",
      "12/12": "Balão Premiado ('12/12 — 12 balões') ou Caixa Misteriosa ('12/12 — compras acima de R$X participam')",
    },
  },
  {
    id: "pack-em-dobro", nome: "Pack em Dobro", cat: "combos", nichos: ["Geral"],
    tipo: "Campanha de ticket médio e giro com 2 unidades do mesmo produto",
    sugestoesNomes: [],
    imagens: [{ src: IMG_PACK_EM_DOBRO, legenda: "Exemplo de divulgação do Pack em Dobro nos Stories" }],
    como: "Venda duas unidades do mesmo produto com um incentivo especial. Crie uma campanha para incentivar a cliente a comprar duas unidades do mesmo produto, utilizando uma condição especial e uma divulgação concentrada nos Stories.",
    duracao: "Antecipação de 2 dias + dia do lançamento",
    canalPrincipal: "Stories",
    canaisApoio: ["Grupo VIP", "Feed", "Reels", "Loja física"],
    objetivo: ["Aumentar o ticket médio", "Vender mais unidades por cliente", "Acelerar o giro dos produtos escolhidos"],
    quandoUsar: [
      "Produtos básicos e de uso recorrente.",
      "Itens com boa saída e estoque disponível.",
      "Produtos que a cliente costuma comprar em mais de uma unidade.",
    ],
    quandoEvitar: [
      "Produtos com estoque muito limitado.",
      "Itens com margem insuficiente para conceder desconto.",
      "Produtos que não fazem sentido comprar em duplicidade.",
    ],
    checklist: [
      "Escolha o produto: selecione um produto que faça sentido comprar em dobro, como duas regatas, duas camisetas, dois glosses ou dois hidratantes.",
      "Defina o preço do pack: some o valor de duas unidades e determine o desconto que será oferecido.",
      "Exemplo: valor individual R$ 60,00 · duas unidades R$ 120,00 · desconto no pack R$ 10,00 · Preço do Pack em Dobro R$ 110,00. A cliente economiza R$ 10,00 e paga R$ 55,00 por unidade.",
      "Importante: R$ 10,00 é o desconto utilizado neste exemplo, não um mínimo universal. O valor deve ser definido conforme o custo do produto, as despesas e a margem da loja. Antes de lançar, confira se o preço promocional continua rentável.",
      "Prepare as imagens: produza fotos e vídeos do produto individualmente, mostrando detalhes, uso e cores disponíveis.",
      "Faça uma foto das duas unidades juntas, com o preço normal, o preço do pack e a economia em destaque.",
      "Se houver diferentes cores, informe se a cliente pode escolher duas cores diferentes do mesmo modelo.",
    ],
    checklistExecucao: [],
    planoDivulgacao: [
      { marco: "1. Dois dias antes — Gere desejo", itens: [
        "Mostre o produto em uso, seus detalhes e as opções disponíveis.",
        "A ideia é despertar o interesse antes de apresentar a oferta.",
      ]},
      { marco: "2. Um dia antes — Antecipe o lançamento", itens: [
        "Avise nos Stories que, no dia seguinte, haverá uma condição especial para quem quiser levar duas unidades.",
        "Use uma enquete para estimular a interação.",
        "Se a loja tiver grupo VIP, envie uma mensagem antecipando a novidade.",
      ]},
      { marco: "3. No dia — Lance o Pack em Dobro", itens: [
        "Publique a sequência de Stories apresentando o produto, as opções disponíveis, o preço especial e a economia.",
        "Reforce como comprar e mostre as vendas realizadas ao longo do dia, quando houver.",
      ]},
      { marco: "4. Reforce a oferta", itens: [
        "Retome a divulgação nos Stories, mostre outras combinações possíveis e responda às dúvidas que surgirem.",
        "Se houver prazo ou quantidade limitada, comunique apenas limites reais.",
      ]},
      { marco: "Stories de antecipação — 1 dia antes", itens: [
        "Story 1 — Despertar interesse\nTexto: “Tu também é daquelas que, quando gosta de uma peça, já quer garantir outra?”\nVisual: vídeo mostrando o produto individualmente.",
        "Story 2 — Interação\nTexto: “Me conta: tu compraria duas unidades de [nome do produto]?”\nEnquete:\n- Com certeza!\n- Depende da condição.",
        "Story 3 — Criar expectativa\nTexto: “Amanhã tem novidade por aqui! Vamos lançar uma condição especial para quem quiser levar duas unidades de [nome do produto].”\nVisual: mostrar detalhes do produto, sem revelar toda a oferta.",
        "Story 4 — Aviso do lançamento\nTexto: “É amanhã! Fica de olho nos nossos Stories para conferir o Pack em Dobro.”",
      ]},
      { marco: "Stories de lançamento — no dia", itens: [
        "Story 1 — Anunciar\nTexto: “LANÇAMENTO: PACK EM DOBRO!\n\nAquele [nome do produto] que tu gosta, agora em uma condição especial para levar duas unidades.”",
        "Story 2 — Mostrar o produto\nTexto: “Olha os detalhes de [nome do produto]!\n\n[Descreva aqui o principal benefício ou característica do produto.]”\nVisual: fotos ou vídeos do produto em uso.",
        "Story 3 — Mostrar as opções\nTexto: “Temos estas opções de cores: [cores disponíveis].\n\nTu pode escolher [duas cores diferentes ou duas unidades iguais], conforme a disponibilidade.”",
        "Story 4 — Apresentar o preço\nTexto: “Olha essa condição!\n\n1 unidade: R$ [valor].\n\n2 unidades: de R$ [valor total] por R$ [valor do pack].\n\nTu economiza R$ [desconto] levando as duas!”",
        "Story 5 — Mostrar o pack\nTexto: “Duas unidades de [nome do produto] para tu aproveitar essa condição especial.\n\nQual combinação tu escolheria?”\nVisual: foto das duas unidades juntas.",
        "Story 6 — Chamada para compra\nTexto: “Nosso Pack em Dobro já está disponível!\n\nMe chama no direct com a palavra PACK para escolher as tuas opções.”\nAdapte a chamada ao canal de compra da loja.",
        "Story 7 — Reforçar a campanha\nTexto: “Já conferiu o nosso Pack em Dobro?\n\nSe tu estava querendo [nome do produto], essa é a oportunidade de levar duas unidades por R$ [valor].”\nVisual: repetir a foto do pack com o preço em destaque.",
      ]},
      { marco: "Conteúdo para Feed/Reels", itens: [
        "Reel de antecipação\nTítulo na tela: “Amanhã tem Pack em Dobro!”\nRoteiro:\n- Cena 1: mostrar o produto individual.\n- Cena 2: apresentar as opções disponíveis.\n- Cena 3: mostrar duas unidades juntas.\n- Cena 4: anunciar o lançamento do dia seguinte.\nTexto final na tela: “Amanhã, nos nossos Stories.”\n(Legenda em Modelos de mensagens.)",
        "Reel ou post de lançamento\nTítulo: “Duas unidades, uma condição especial.”\n(Legenda em Modelos de mensagens.)",
      ]},
    ],
    modelosMensagens: [
      { canal: "Grupo VIP — antecipação (dia anterior)", texto: "Tenho uma novidade para vocês!\n\nAmanhã vamos lançar uma condição especial para quem quiser levar duas unidades de [nome do produto].\n\nVou mostrar tudo nos Stories, com as opções disponíveis e o valor especial do pack.\n\nFica de olho!" },
      { canal: "Grupo VIP — lançamento (no dia)", texto: "Bom dia!\n\nO nosso Pack em Dobro de [nome do produto] já está disponível!\n\nTu pode levar duas unidades por R$ [valor do pack], economizando R$ [desconto] em relação à compra separada.\n\nTemos estas opções: [cores ou variações].\n\nPara conferir e garantir o teu, acessa [link ou canal de compra]." },
      { canal: "Legenda — Reel de antecipação", texto: "Tem produto que vale a pena ter em dobro!\n\nAmanhã vamos lançar uma condição especial para quem quiser levar duas unidades de [nome do produto].\n\nFica de olho nos nossos Stories para conferir o Pack em Dobro." },
      { canal: "Legenda — Reel ou post de lançamento", texto: "O nosso Pack em Dobro de [nome do produto] já está disponível!\n\nDe R$ [valor total] por R$ [valor do pack], levando duas unidades.\n\nTu pode escolher [opções de cores ou variações], conforme a disponibilidade.\n\nMe chama no direct com a palavra PACK para garantir o teu." },
    ],
    ideiasStories: [
      "Enquete na antecipação: “Tu também gosta de ter tuas peças básicas em mais de uma cor?”",
    ],
    dicas: [
      "Escolha produtos que a cliente realmente tenha motivo para comprar em dobro.",
      "O desconto deve ser percebido como um benefício, mas precisa preservar a margem da loja.",
      "Mostre o valor das duas unidades separadas e o preço especial do pack.",
      "Faça uma apresentação visual que deixe a oferta fácil de entender.",
      "Não publique apenas o preço: mostre o produto em uso e as possibilidades de combinação.",
      "Registre quantos packs foram vendidos para avaliar se vale a pena repetir a campanha.",
    ],
    resultado: [
      "Criar uma campanha simples e organizada para vender mais unidades do mesmo produto por compra, aumentando o valor vendido por cliente sem depender exclusivamente de atrair novos compradores.",
    ],
    checklistRapido: [
      "Produto escolhido e estoque conferido.",
      "Preço do pack calculado com margem preservada.",
      "Fotos e vídeos preparados.",
      "Stories de antecipação publicados.",
      "Mensagem do grupo VIP enviada, se houver.",
      "Conteúdo de Feed/Reels publicado.",
      "Stories de lançamento publicados.",
      "Vendas e resultado da campanha registrados.",
    ],
    relacionadas: ["pague-2-leve-3", "leve-mais-pague-menos", "combo-inteligente"],
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

function TagCard({ action, isFav, onToggleFav, onOpen }) {
  const info = catInfo(action.cat);
  const Icon = info.icon;
  return (
    <div className="tagcard-v2" onClick={() => onOpen(action.id)}>
      <div className="tagcard-v2-top">
        <div className="tagcard-v2-badge"><Icon size={20} /></div>
        <button
          className="tagcard-v2-fav"
          onClick={(e) => { e.stopPropagation(); onToggleFav(action.id); }}
          aria-label="Favoritar"
        >
          <Heart size={17} fill={isFav ? "#D9C48A" : "none"} color={isFav ? "#D9C48A" : "rgba(255,255,255,0.6)"} />
        </button>
      </div>
      <h3 className="tagcard-v2-nome">{action.nome}</h3>
      <span className="tagcard-v2-cat">{info.label}</span>
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

function RadarLocalizacaoForm({ onSalvar }) {
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const salvar = async () => {
    if (!estado || !cidade.trim()) { setErro("Escolha o estado e informe a cidade."); return; }
    setErro(""); setSalvando(true);
    await onSalvar({ pais: "Brasil", estado, cidade: cidade.trim() });
    setSalvando(false);
  };

  return (
    <div className="dtl-section-card" style={{ maxWidth: 440, margin: "24px auto" }}>
      <div className="dtl-section-title">Onde fica a sua loja?</div>
      <p className="acc-plain-text" style={{ marginBottom: 14 }}>Só precisamos saber uma vez — assim o Radar já mostra as datas certas pra sua região sempre que você entrar.</p>
      <label className="auth-label">País</label>
      <div className="auth-input"><span style={{ fontSize: 13, color: "var(--ink)" }}>Brasil</span></div>
      <label className="auth-label">Estado</label>
      <select className="meta-select" value={estado} onChange={(e) => setEstado(e.target.value)}>
        <option value="">Selecione o estado</option>
        {UFS_BR.map((uf) => <option key={uf} value={uf}>{uf}</option>)}
      </select>
      <label className="auth-label">Cidade</label>
      <div className="auth-input">
        <input placeholder="Ex: São Leopoldo" value={cidade} onChange={(e) => setCidade(e.target.value)} />
      </div>
      {erro && <p className="auth-erro">{erro}</p>}
      <button className="btn-primary" style={{ marginTop: 12 }} onClick={salvar} disabled={salvando}>
        {salvando ? "Salvando…" : "Salvar e continuar"}
      </button>
    </div>
  );
}

function RadarCard({ op, favorito, onToggleFavorito, onDefinirLembrete, onVerAcoes }) {
  const [aberto, setAberto] = useState(false);
  const info = CATEGORIAS_RADAR.find((c) => c.id === op.categoria) || CATEGORIAS_RADAR[0];
  const Icon = info.icon;
  const dataFmt = op.data.toLocaleDateString("pt-BR", { day: "2-digit", month: "long" });
  const localTexto = op.cidade ? `${op.cidade}/${op.estado}` : op.estado ? op.estado : "Nacional";

  return (
    <div className="radar-card">
      <div className="radar-card-top">
        <span className="radar-card-cat"><Icon size={12} /> {info.label}</span>
        <button className="tagcard-v2-fav" onClick={() => onToggleFavorito(op.id)} aria-label="Favoritar">
          <Heart size={17} fill={favorito ? "#D9C48A" : "none"} color={favorito ? "#D9C48A" : "#A9B0A4"} />
        </button>
      </div>
      <h3 className="radar-card-titulo">{op.titulo}</h3>
      <span className="radar-card-data"><Calendar size={12} /> {dataFmt} · {localTexto}</span>
      <p className="radar-card-desc">{op.descricao}</p>

      {favorito && (
        <select
          className="radar-lembrete-select"
          value={favorito.lembrete || ""}
          onChange={(e) => onDefinirLembrete(op.id, e.target.value)}
        >
          <option value="">Sem lembrete</option>
          <option value="7">🔔 Lembrar 7 dias antes</option>
          <option value="15">🔔 Lembrar 15 dias antes</option>
          <option value="30">🔔 Lembrar 30 dias antes</option>
        </select>
      )}

      <button className="btn-ghost-box" onClick={() => setAberto((s) => !s)}>
        {aberto ? "Ocultar como aproveitar" : "Como aproveitar essa oportunidade"}
      </button>
      {aberto && (
        <ul className="bullet-list" style={{ margin: "4px 0 10px" }}>
          {op.comoAproveitar.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      )}

      {!op.id.startsWith("data-") && (
        <button className="btn-primary" style={{ marginBottom: 0 }} onClick={() => onVerAcoes(op.palavrasChave)}>
          Ver ações comerciais
        </button>
      )}
    </div>
  );
}

function VideoAula({ aula }) {
  const [tocando, setTocando] = useState(false);
  return (
    <div className="aprenda-video-card">
      <div className="aprenda-video-frame">
        {tocando ? (
          <>
            <iframe
              src={`https://www.youtube.com/embed/${aula.youtubeId}?autoplay=1&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3`}
              title={aula.titulo}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
              allowFullScreen
            />
            <div className="aprenda-video-bloqueio" aria-hidden="true" />
          </>
        ) : (
          <button type="button" className="aprenda-video-capa" onClick={() => setTocando(true)} aria-label={`Assistir: ${aula.titulo}`}>
            <img src={`https://i.ytimg.com/vi/${aula.youtubeId}/hqdefault.jpg`} alt="" loading="lazy" />
            <span className="aprenda-video-play"><Play size={28} fill="#fff" /></span>
          </button>
        )}
      </div>
      <span className="aprenda-video-titulo">{aula.titulo}</span>
    </div>
  );
}

function AprendaEApliqueScreen() {
  const grupos = [...new Set(AULAS.map((a) => a.grupo))];

  return (
    <div className="screen">
      <div className="dash-header">
        <div>
          <span className="dash-ola">🎓 Vídeos curtos pra aplicar na loja</span>
          <h1 className="dash-titulo">Aprenda e Aplique</h1>
        </div>
      </div>

      <div className="aprenda-conteudo">
        {grupos.map((grupo) => (
          <div key={grupo} className="dtl-section-card">
            <div className="dtl-section-title">{grupo}</div>
            <div className="aprenda-grid">
              {AULAS.filter((a) => a.grupo === grupo).map((a) => <VideoAula key={a.id} aula={a} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CalendarioAnualScreen({ onVerAcoes }) {
  const [mesAberto, setMesAberto] = useState(new Date().getMonth());
  const dados = CALENDARIO_ANUAL.find((m) => m.mes === mesAberto);

  return (
    <div className="screen">
      <div className="dash-header">
        <div>
          <span className="dash-ola">📅 Uma campanha pronta pra cada mês do ano</span>
          <h1 className="dash-titulo">Calendário Anual</h1>
        </div>
      </div>

      <div className="cal-anual-meses">
        {CALENDARIO_ANUAL.map((m) => (
          <button
            key={m.mes}
            className={`cal-anual-mes-btn ${mesAberto === m.mes ? "active" : ""} ${!m.pronto ? "vazio" : ""}`}
            onClick={() => setMesAberto(m.mes)}
          >
            {m.nome}
          </button>
        ))}
      </div>

      {!dados?.pronto ? (
        <div className="empty-state" style={{ maxWidth: 1160, margin: "20px auto", padding: "0 24px" }}>
          <Calendar size={28} />
          <p>A campanha de {MESES_CALENDARIO[mesAberto]} ainda não foi cadastrada. Assim que a Jéssica mandar o conteúdo, ela aparece aqui.</p>
        </div>
      ) : (
        <div className="cal-anual-conteudo">
          <div className="dtl-header" style={{ padding: "18px 0 6px" }}>
            <h1 className="dtl-nome">Campanha {dados.nome}: {dados.campanhaTitulo}</h1>
            <p className="dtl-desc">{dados.intro}</p>
          </div>

          <div className="dtl-section-card">
            {dados.etapas.map((e, i) => (
              <div key={i} style={{ marginBottom: i < dados.etapas.length - 1 ? 14 : 0 }}>
                <span className="dash-datasiguais-eyebrow" style={{ display: "block", marginBottom: 4 }}>{e.titulo}</span>
                <p className="acc-plain-text">{e.texto}</p>
              </div>
            ))}
            <p className="canal-caption" style={{ marginTop: 12 }}>{dados.adaptavel}</p>
          </div>

          <Accordion title="Estratégia geral" icon={Target} defaultOpen>
            <ul className="bullet-list">{dados.estrategiaGeral.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </Accordion>

          <Accordion title="Objetivo por tema" icon={Check}>
            {dados.objetivos.map((o, i) => (
              <div key={i} style={{ marginBottom: i < dados.objetivos.length - 1 ? 12 : 0 }}>
                <span className="msg-canal" style={{ display: "block", marginBottom: 4 }}>{o.tema}</span>
                <ul className="bullet-list">{o.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>
              </div>
            ))}
          </Accordion>

          <div className="dtl-guia-title">Vamos executar</div>

          <Accordion title="Preparação" icon={Gift} defaultOpen>
            {dados.preparacao.map((p, i) => (
              <div key={i} className="dtl-marco">
                <span className="dtl-marco-titulo">{p.periodo}</span>
                <ul className="bullet-list">{p.itens.map((it, j) => <li key={j}>{it}</li>)}</ul>
              </div>
            ))}
          </Accordion>

          <Accordion title="Ação de vendas" icon={TrendingUp}>
            {dados.acaoDeVendas.map((a, i) => (
              <div key={i} className="dtl-marco">
                <span className="dtl-marco-titulo">{a.periodo}</span>
                <ul className="bullet-list" style={{ marginBottom: a.sugestoes || a.sacolaDetalhe ? 10 : 0 }}>{a.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>

                {a.sugestoes && a.sugestoes.map((s, j) => (
                  <div key={j} className="exemplo-real-item" style={{ marginBottom: 8 }}>
                    <span className="exemplo-real-titulo">{s.titulo}</span>
                    <ul className="bullet-list">{s.bullets.map((b, k) => <li key={k}>{b}</li>)}</ul>
                  </div>
                ))}

                {a.sacolaDetalhe && (
                  <div className="exemplo-real-item">
                    <span className="exemplo-real-titulo">{a.sacolaDetalhe.titulo}</span>
                    <p className="acc-plain-text" style={{ marginBottom: 8 }}><i>{a.sacolaDetalhe.narrativa}</i></p>
                    <span className="canal-row-label" style={{ display: "block", marginBottom: 4 }}>Como funciona</span>
                    <ul className="bullet-list" style={{ marginBottom: 8 }}>{a.sacolaDetalhe.comoFunciona.map((b, k) => <li key={k}>{b}</li>)}</ul>
                    <span className="canal-row-label" style={{ display: "block", marginBottom: 4 }}>Adaptação por nicho</span>
                    <ul className="bullet-list" style={{ marginBottom: 8 }}>{a.sacolaDetalhe.adaptacao.map((b, k) => <li key={k}>{b}</li>)}</ul>
                    <span className="canal-row-label" style={{ display: "block", marginBottom: 4 }}>Diferenciais</span>
                    <ul className="bullet-list" style={{ marginBottom: 8 }}>{a.sacolaDetalhe.diferenciais.map((b, k) => <li key={k}>{b}</li>)}</ul>
                    <span className="canal-row-label" style={{ display: "block", marginBottom: 4 }}>Sugestão de conteúdo</span>
                    <ul className="bullet-list">{a.sacolaDetalhe.sugestaoConteudo.map((b, k) => <li key={k}>{b}</li>)}</ul>
                  </div>
                )}
              </div>
            ))}
          </Accordion>

          <div className="dtl-guia-title">Materiais de apoio</div>

          <Accordion title="Calendário de conteúdo" icon={Radio} defaultOpen>
            {dados.conteudo.map((c, i) => (
              <div key={i} className="dtl-marco">
                <span className="dtl-marco-titulo">{c.semana} — {c.titulo}</span>
                <span className="canal-row-label" style={{ display: "block", marginBottom: 4 }}>Feed</span>
                <ul className="bullet-list" style={{ marginBottom: 8 }}>{c.feed.map((f, j) => <li key={j}>{f}</li>)}</ul>
                <span className="canal-row-label" style={{ display: "block", marginBottom: 4 }}>Stories</span>
                <ul className="bullet-list">{c.stories.map((s, j) => <li key={j}>{s}</li>)}</ul>
                {c.extra && <p className="canal-caption" style={{ marginTop: 8 }}>{c.extra}</p>}
              </div>
            ))}
          </Accordion>

          {dados.observacoes && (
            <Accordion title="Observações e adaptação por nicho" icon={Lightbulb}>
              <span className="canal-row-label" style={{ display: "block", marginBottom: 4 }}>Live sugerida</span>
              <ul className="bullet-list" style={{ marginBottom: 10 }}>{dados.observacoes.liveSugerida.map((l, i) => <li key={i}>{l}</li>)}</ul>
              <span className="canal-row-label" style={{ display: "block", marginBottom: 4 }}>Adaptação rápida para outros nichos</span>
              <div className="nicho-examples" style={{ marginBottom: 10 }}>
                {dados.observacoes.adaptacaoNichos.map((n, i) => (
                  <div key={i} className="nicho-example-item">
                    <span className="nicho-example-label">{n.nicho}</span>
                    <span className="nicho-example-text">{n.texto}</span>
                  </div>
                ))}
              </div>
              <p className="canal-caption">💡 {dados.observacoes.dicaFinal}</p>
            </Accordion>
          )}

          {dados.referenciasVisuais && dados.referenciasVisuais.length > 0 && (
            <Accordion title="Referências visuais e inspirações" icon={Sparkles}>
              <p className="canal-caption" style={{ marginTop: 0, marginBottom: 10 }}>Vídeos de referência pra inspirar as alunas — não são conteúdo pronto, só ideia de formato e narrativa.</p>
              <div className="dtl-relacionadas-grid" style={{ marginBottom: 0 }}>
                {dados.referenciasVisuais.map((r, i) => (
                  <a key={i} className="dtl-relacionada-card" href={r.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                    <span className="dtl-relacionada-nome">{r.label}</span>
                    <span className="dtl-relacionada-tipo">Ver vídeo →</span>
                  </a>
                ))}
              </div>
            </Accordion>
          )}

          {(!dados.posCampanha || !dados.ideiasVideos) && (
            <p className="canal-caption" style={{ maxWidth: 1160, margin: "12px auto 0", padding: "0 4px" }}>
              Pós campanha e Ideias/vídeos ainda não foram cadastrados pra {dados.nome}.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function RadarOportunidades({ perfil, onSalvarLocalizacao, favoritos, onToggleFavorito, onDefinirLembrete, onVerAcoes, viewInicial }) {
  const hoje = new Date();
  const [radarMes, setRadarMes] = useState(hoje.getMonth());
  const [radarAno, setRadarAno] = useState(hoje.getFullYear());
  const [view, setView] = useState(viewInicial || "lista");
  const [search, setSearch] = useState("");
  const [somenteFavoritos, setSomenteFavoritos] = useState(false);
  const [diaSelecionado, setDiaSelecionado] = useState(null);
  const [editandoLocal, setEditandoLocal] = useState(false);

  if (!perfil?.estado || !perfil?.cidade) {
    return <RadarLocalizacaoForm onSalvar={onSalvarLocalizacao} />;
  }

  if (editandoLocal) {
    return (
      <RadarLocalizacaoForm
        onSalvar={async (dados) => { await onSalvarLocalizacao(dados); setEditandoLocal(false); }}
      />
    );
  }

  const anosDisponiveis = Array.from({ length: 3 }, (_, i) => hoje.getFullYear() + i);

  const oportunidadesDoMes = OPORTUNIDADES
    .filter((op) => matchesLocalizacao(op, perfil.estado, perfil.cidade))
    .map((op) => ({ ...op, data: getDataOportunidade(op, radarAno) }))
    .filter((op) => op.data.getMonth() === radarMes)
    .filter((op) => !somenteFavoritos || favoritos.some((f) => f.oportunidade_id === op.id))
    .filter((op) => {
      if (diaSelecionado && op.data.getDate() !== diaSelecionado) return false;
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return op.titulo.toLowerCase().includes(q) || (op.cidade || "").toLowerCase().includes(q) ||
        (op.estado || "").toLowerCase().includes(q) || op.categoria.includes(q);
    })
    .sort((a, b) => a.data - b.data);

  const insights = proximasOportunidades(hoje, perfil.estado, perfil.cidade, 4);

  const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const datasIguaisOrdenadas = OPORTUNIDADES.filter((op) => op.id.startsWith("data-")).map((op) => {
    let data = getDataOportunidade(op, hoje.getFullYear());
    if (data < hojeSemHora) data = getDataOportunidade(op, hoje.getFullYear() + 1);
    const dias = Math.round((data - hojeSemHora) / 86400000);
    return { ...op, data, dias };
  }).sort((a, b) => a.dias - b.dias);
  const diasComOportunidade = new Set(
    OPORTUNIDADES.filter((op) => matchesLocalizacao(op, perfil.estado, perfil.cidade))
      .map((op) => getDataOportunidade(op, radarAno))
      .filter((d) => d.getMonth() === radarMes)
      .map((d) => d.getDate())
  );
  const diasNoMes = new Date(radarAno, radarMes + 1, 0).getDate();
  const primeiroDiaSemana = new Date(radarAno, radarMes, 1).getDay();

  return (
    <div className="screen">
      <div className="dash-header">
        <div>
          <span className="dash-ola">📍 {perfil.cidade} • {perfil.estado}</span>
          <h1 className="dash-titulo">Radar de Oportunidades</h1>
        </div>
        <button className="btn-ghost-box" style={{ marginBottom: 0 }} onClick={() => setEditandoLocal(true)}>
          <MapPin size={14} /> Alterar localização
        </button>
      </div>

      {insights.length > 0 && (
        <div className="radar-insights">
          {insights.map((ins, i) => (
            <p key={i} className="radar-insight-item">
              🎯 {ins.dias === 0 ? "É hoje:" : ins.dias === 1 ? "Falta 1 dia para" : `Faltam ${ins.dias} dias para`} <b>{ins.op.titulo}</b>{ins.dias > 0 ? "." : "!"}
            </p>
          ))}
        </div>
      )}

      <div className="radar-filtros">
        {view !== "datas-iguais" && (
          <>
            <select className="dash-select" value={radarMes} onChange={(e) => { setRadarMes(Number(e.target.value)); setDiaSelecionado(null); }}>
              {MESES_COMPLETOS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select className="dash-select" value={radarAno} onChange={(e) => { setRadarAno(Number(e.target.value)); setDiaSelecionado(null); }}>
              {anosDisponiveis.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </>
        )}
        <div className="radar-view-toggle">
          <button className={`radar-view-btn ${view === "lista" ? "active" : ""}`} onClick={() => setView("lista")}><List size={14} /> Lista</button>
          <button className={`radar-view-btn ${view === "calendario" ? "active" : ""}`} onClick={() => setView("calendario")}><Calendar size={14} /> Calendário</button>
          <button className={`radar-view-btn ${view === "datas-iguais" ? "active" : ""}`} onClick={() => setView("datas-iguais")}>🔢 Datas Iguais</button>
        </div>
      </div>

      {view === "datas-iguais" && (
        <p className="radar-datas-iguais-intro">Todo mês tem uma data de números iguais (01/01, 02/02... 12/12) — o ano inteiro, de uma vez, sem precisar trocar de mês.</p>
      )}

      <div className="search-bar" style={{ margin: "0 auto 8px" }}>
        <Search size={16} color="#6B7268" />
        <input placeholder="Buscar por nome, cidade, evento..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="radar-filtros" style={{ marginTop: 0 }}>
        <button className={`catchip ${!somenteFavoritos ? "active" : ""}`} onClick={() => setSomenteFavoritos(false)}>Todas</button>
        <button className={`catchip ${somenteFavoritos ? "active" : ""}`} onClick={() => setSomenteFavoritos(true)}><Heart size={12} /> Favoritos</button>
      </div>

      {view === "calendario" && (
        <div className="radar-cal-wrap">
          <div className="radar-cal-grid">
            {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => <span key={i} className="radar-cal-dow">{d}</span>)}
            {Array.from({ length: primeiroDiaSemana }).map((_, i) => <span key={`b${i}`} />)}
            {Array.from({ length: diasNoMes }).map((_, i) => {
              const dia = i + 1;
              return (
                <button
                  key={dia}
                  className={`radar-cal-dia ${diasComOportunidade.has(dia) ? "tem-op" : ""} ${diaSelecionado === dia ? "selecionado" : ""}`}
                  onClick={() => setDiaSelecionado(diaSelecionado === dia ? null : dia)}
                >
                  {dia}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {view === "datas-iguais" ? (
        <div className="list-wrap" style={{ paddingTop: 4 }}>
          {datasIguaisOrdenadas
            .filter((op) => !somenteFavoritos || favoritos.some((f) => f.oportunidade_id === op.id))
            .filter((op) => {
              const q = search.trim().toLowerCase();
              if (!q) return true;
              return op.titulo.toLowerCase().includes(q);
            })
            .map((op) => (
              <div key={op.id} className={op.dias <= 10 ? "radar-destaque-10" : ""}>
                {op.dias <= 10 && (
                  <span className="radar-destaque-10-badge">
                    {op.dias === 0 ? "É hoje!" : op.dias === 1 ? "Falta 1 dia" : `Faltam ${op.dias} dias`}
                  </span>
                )}
                <RadarCard
                  op={op}
                  favorito={favoritos.find((f) => f.oportunidade_id === op.id)}
                  onToggleFavorito={onToggleFavorito}
                  onDefinirLembrete={onDefinirLembrete}
                  onVerAcoes={onVerAcoes}
                />
              </div>
            ))}
        </div>
      ) : (
        <div className="list-wrap" style={{ paddingTop: 4 }}>
          {oportunidadesDoMes.length === 0 ? (
            <div className="empty-state">
              <Calendar size={28} />
              <p>Nenhuma oportunidade encontrada com esse filtro pra {MESES_COMPLETOS[radarMes]}.</p>
            </div>
          ) : (
            oportunidadesDoMes.map((op) => (
              <RadarCard
                key={op.id}
                op={op}
                favorito={favoritos.find((f) => f.oportunidade_id === op.id)}
                onToggleFavorito={onToggleFavorito}
                onDefinirLembrete={onDefinirLembrete}
                onVerAcoes={onVerAcoes}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SimuladorBrindes({ onBack }) {
  const [ticketMedio, setTicketMedio] = useState("");
  const [custoBrinde, setCustoBrinde] = useState("");
  const [valorMinimo, setValorMinimo] = useState("");

  const ticket = Number(ticketMedio) || 0;
  const custo = Number(custoBrinde) || 0;
  const minimo = Number(valorMinimo) || 0;
  const pronto = ticket > 0 && custo > 0 && minimo > 0;

  const pct = pronto ? (custo / minimo) * 100 : 0;
  const aumento = minimo - ticket;
  const classificacao = pronto ? classificarBrinde(pct) : null;
  const pctFormatado = pct.toLocaleString("pt-BR", { maximumFractionDigits: 1 });

  return (
    <div className="screen dtl-wrap">
      <div className="topbar">
        <button className="iconbtn" onClick={onBack}><ArrowLeft size={20} /></button>
        <span className="topbar-title dtl-topbar-title">Simulador de Brindes</span>
        <span style={{ width: 20 }} />
      </div>

      <div className="scroll">
        <div className="dtl-header">
          <h1 className="dtl-nome">Vale a pena esse brinde?</h1>
          <p className="dtl-desc">Descubra se a sua campanha de "Compre e Ganhe" está saudável antes de colocar no ar — sem precisar saber margem, markup ou nenhum número financeiro complicado.</p>
        </div>

        <div className="dtl-section-card">
          <div className="dtl-section-title">Preencha os valores</div>

          <label className="auth-label">Ticket médio atual da loja</label>
          <div className="valor-input">
            <span className="valor-prefix">R$</span>
            <input type="number" inputMode="decimal" placeholder="Ex: 180" value={ticketMedio} onChange={(e) => setTicketMedio(e.target.value)} />
          </div>

          <label className="auth-label">Custo do brinde para a loja</label>
          <div className="valor-input">
            <span className="valor-prefix">R$</span>
            <input type="number" inputMode="decimal" placeholder="Ex: 15" value={custoBrinde} onChange={(e) => setCustoBrinde(e.target.value)} />
          </div>

          <label className="auth-label">Valor mínimo que o cliente deverá comprar para ganhar o brinde</label>
          <div className="valor-input" style={{ marginBottom: 0 }}>
            <span className="valor-prefix">R$</span>
            <input type="number" inputMode="decimal" placeholder="Ex: 300" value={valorMinimo} onChange={(e) => setValorMinimo(e.target.value)} />
          </div>
        </div>

        {pronto && (
          <>
            <div className="dtl-section-card">
              <div className="dtl-section-title">Resultado</div>
              <div className="resumo-card" style={{ margin: 0 }}>
                <div className="resumo-row">
                  <span className="resumo-label">Esse brinde representa da venda</span>
                  <p style={{ fontSize: 20, fontWeight: 600, color: "var(--wine)" }}>{pctFormatado}%</p>
                </div>
                <div className="resumo-row">
                  <span className="resumo-label">Aumento de ticket necessário</span>
                  <p>{aumento > 0 ? `Seu cliente precisará aumentar aproximadamente ${formatBRL(aumento)} na compra para desbloquear o brinde.` : "Seu ticket médio atual já atinge o valor mínimo — o brinde pode ser conquistado sem precisar aumentar a compra."}</p>
                </div>
              </div>
            </div>

            <div className={`dtl-dica-block ${classificacao.tom === "gold" ? "sim-classificacao-atencao" : ""}`}>
              <div className="dtl-dica-titulo"><Calculator size={15} /> Classificação da estratégia</div>
              <p className="dtl-dica-texto">{classificacao.nivel}</p>
            </div>

            <div className="dtl-section-card">
              <div className="dtl-section-title">Análise da sua estratégia</div>
              <p className="acc-plain-text" style={{ marginBottom: 8 }}>Seu ticket médio atual é de {formatBRL(ticket)}.</p>
              <p className="acc-plain-text" style={{ marginBottom: 8 }}>
                Para ganhar esse brinde, seu cliente deverá realizar uma compra de pelo menos {formatBRL(minimo)}
                {aumento > 0 ? `, ou seja, aumentar aproximadamente ${formatBRL(aumento)} no valor da compra.` : "."}
              </p>
              <p className="acc-plain-text">
                O custo desse brinde representa {pctFormatado}% dessa venda, {pct <= 7 ? "o que torna essa estratégia financeiramente saudável." : pct <= 10 ? "um valor que já pede atenção — vale avaliar se o aumento de ticket compensa." : "um valor alto para esse patamar de compra."} Ao invés de oferecer um desconto direto, você incentiva o cliente a comprar mais para conquistar um benefício percebido como um presente. Isso aumenta o ticket médio sem reduzir o valor percebido dos seus produtos.
              </p>
            </div>
          </>
        )}

        <div className="dtl-resultado-block">
          <div className="dtl-resultado-titulo"><Lightbulb size={15} /> Por que um brinde costuma ser melhor do que dar desconto?</div>
          <p className="acc-plain-text">
            Porque o cliente percebe que está ganhando algo extra, enquanto o desconto reduz o valor percebido dos produtos. Além disso, um brinde pode criar uma experiência positiva, fortalecer a marca e incentivar compras maiores para atingir o valor necessário. Quando bem planejada, essa estratégia aumenta o ticket médio preservando a rentabilidade da loja.
          </p>
        </div>
      </div>
    </div>
  );
}

function DetailScreen({ action, isFav, onToggleFav, onBack, resultadosAcao, onVerHistorico, onOpenRelacionada, onAbrirSimulador, metaAtual, mesAtualLabel, onDefinirMeta, onRegistrarResultado }) {
  const info = catInfo(action.cat);
  const Icon = info.icon;
  const [checkedPrep, setCheckedPrep] = useState({});
  const [checkedExec, setCheckedExec] = useState({});
  const [checkedDiv, setCheckedDiv] = useState({});
  const [checkedRapido, setCheckedRapido] = useState({});
  const [metaInput, setMetaInput] = useState("");
  const [registroValor, setRegistroValor] = useState("");
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
            <span className="dtl-chip"><Target size={13} /> {action.objetivoPrincipal || action.objetivo[0]}</span>
            <span className="dtl-chip"><Icon size={13} /> {info.label}</span>
          </div>
        </div>

        {action.imagens && action.imagens.length > 0 && (
          <div className={`dtl-imagens ${action.imagens.length > 1 ? "multi" : ""}`}>
            {action.imagens.map((img, i) => (
              <figure key={i} className="dtl-imagem">
                <img src={img.src} alt={img.legenda || action.nome} loading="lazy" onError={(e) => { e.currentTarget.parentElement.style.display = "none"; }} />
                {img.legenda && <figcaption>{img.legenda}</figcaption>}
              </figure>
            ))}
          </div>
        )}

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

          {action.comoEscolherBrinde && (
            <Accordion title="Como escolher o brinde" icon={Gift}>
              <p className="acc-plain-text" style={{ marginBottom: 10 }}>{action.comoEscolherBrinde.intro}</p>
              {action.comoEscolherBrinde.boasOpcoes.length > 0 && (
                <div className="canal-row" style={{ alignItems: "flex-start" }}>
                  <span className="canal-row-label">Boas opções</span>
                  <div className="chiprow">{action.comoEscolherBrinde.boasOpcoes.map((o) => <span key={o} className="chip">{o}</span>)}</div>
                </div>
              )}
              <p className="canal-caption" style={{ marginTop: 10 }}>{action.comoEscolherBrinde.perguntaChave}</p>
              <button className="btn-ghost-box" style={{ marginTop: 10, marginBottom: 0 }} onClick={onAbrirSimulador}>
                <Calculator size={15} /> Calcular se esse brinde vale a pena
              </button>
            </Accordion>
          )}
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
            <Accordion title={`${2} · Execução`}>
              <DtlChecklistGroup itens={action.checklistExecucao} checked={checkedExec} onToggle={(i) => setCheckedExec((s) => ({ ...s, [i]: !s[i] }))} />
            </Accordion>
          )}

          {action.planoDivulgacao.length > 0 && (
            <Accordion title={`${action.checklistExecucao.length > 0 ? 3 : 2} · Divulgação`}>
              {action.planoDivulgacao.map((p, pi) => (
                <div key={pi} className="dtl-marco">
                  <span className="dtl-marco-titulo">{p.marco}</span>
                  <div className="checklist">
                    {p.itens.map((it, ii) => {
                      const key = `${pi}-${ii}`;
                      return (
                        <label key={ii} className="checkitem">
                          <input type="checkbox" checked={!!checkedDiv[key]} onChange={() => setCheckedDiv((s) => ({ ...s, [key]: !s[key] }))} />
                          <span className={checkedDiv[key] ? "done" : ""} style={{ whiteSpace: "pre-line" }}>{it}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </Accordion>
          )}
        </div>

        {(action.modelosMensagens.length > 0 || action.ideiasStories.length > 0 || action.nichoExemplos || action.narrativasPorData || action.materiaisNecessarios || action.checklistRapido || action.templateVisual || action.exemplosReais) && (
          <div className="dtl-section-card">
            <div className="dtl-section-title">Materiais de apoio</div>

            {action.templateVisual && (
              <a className="btn-ghost-box" style={{ marginBottom: 12, textDecoration: "none" }} href={action.templateVisual.url} target="_blank" rel="noopener noreferrer">
                <Sparkles size={15} /> {action.templateVisual.label}
              </a>
            )}

            {action.modelosMensagens.length > 0 && (
              <Accordion title="Modelos de mensagens" icon={MessageCircle} defaultOpen>
                <div className="msg-list">
                  {action.modelosMensagens.map((m, i) => (
                    <div key={i} className="msg-item">
                      <span className="msg-canal">{m.canal}</span>
                      <p className="msg-texto" style={{ whiteSpace: "pre-line" }}>"{m.texto}"</p>
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

            {action.exemplosReais && (
              <Accordion title="Exemplos reais de divulgação" icon={Video} defaultOpen>
                <div className="exemplo-real-list">
                  {action.exemplosReais.map((ex, i) => (
                    <div key={i} className="exemplo-real-item">
                      <span className="exemplo-real-titulo">{ex.titulo}</span>
                      <p className="exemplo-real-desc">{ex.descricao}</p>
                      <a className="btn-ghost-box" style={{ marginBottom: 0, textDecoration: "none", display: "inline-flex" }} href={ex.url} target="_blank" rel="noopener noreferrer">
                        <Video size={14} /> Ver vídeo no Instagram
                      </a>
                    </div>
                  ))}
                </div>
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

            {action.checklistRapido && (
              <Accordion title="Checklist rápido" icon={Check}>
                <DtlChecklistGroup itens={action.checklistRapido} checked={checkedRapido} onToggle={(i) => setCheckedRapido((x) => ({ ...x, [i]: !x[i] }))} />
              </Accordion>
            )}

            {action.materiaisNecessarios && (
              <Accordion title="Materiais necessários" icon={Package}>
                <ul className="bullet-list">{action.materiaisNecessarios.map((m, i) => <li key={i}>{m}</li>)}</ul>
              </Accordion>
            )}
          </div>
        )}

        <div className="dtl-dica-block">
          <div className="dtl-dica-titulo"><Lightbulb size={15} /> Dica estratégica</div>
          {Array.isArray(action.dicas)
            ? <ul className="dtl-dica-lista">{action.dicas.map((d, i) => <li key={i}>{d}</li>)}</ul>
            : <p className="dtl-dica-texto">{action.dicas}</p>}
        </div>

        <div className="dtl-resultado-block">
          <div className="dtl-resultado-titulo"><TrendingUp size={15} /> Resultado esperado</div>
          <ul className="bullet-list dtl-resultado-lista">{action.resultado.map((r, i) => <li key={i}>{r}</li>)}</ul>
        </div>

        <div className="dtl-meta-resultado-card">
          <span className="dtl-resultados-titulo">Meta e resultado desta ação — {mesAtualLabel}</span>

          {metaAtual ? (
            <>
              <div className="dtl-meta-progresso-top">
                <span>{formatBRL(metaAtual.realizado)} de {formatBRL(metaAtual.valorMeta)}</span>
                <span className="meta-pct">{metaAtual.pct}%</span>
              </div>
              <div className="meta-bar-track"><div className="meta-bar-fill" style={{ width: `${metaAtual.pct}%` }} /></div>
            </>
          ) : (
            <div className="dtl-meta-form">
              <p className="canal-caption" style={{ marginTop: 0 }}>Ainda não tem meta definida pra essa ação em {mesAtualLabel}.</p>
              <div className="valor-input" style={{ margin: "0 0 8px" }}>
                <span className="valor-prefix">R$</span>
                <input type="number" inputMode="decimal" placeholder="Quanto quer gerar com essa ação" value={metaInput} onChange={(e) => setMetaInput(e.target.value)} />
              </div>
              <button className="btn-ghost-box" style={{ marginBottom: 0 }} onClick={() => { if (metaInput) { onDefinirMeta(Number(metaInput) || 0); setMetaInput(""); } }} disabled={!metaInput}>
                Definir meta desta ação
              </button>
            </div>
          )}

          <div className="dtl-registrar-divisor">
            <span className="resumo-label" style={{ display: "block", marginBottom: 8 }}>Registrar resultado</span>
            <div className="valor-input" style={{ margin: "0 0 8px" }}>
              <span className="valor-prefix">R$</span>
              <input type="number" inputMode="decimal" placeholder="Valor gerado" value={registroValor} onChange={(e) => setRegistroValor(e.target.value)} />
            </div>
            <button className="btn-primary" style={{ marginBottom: 0 }} onClick={() => { if (registroValor) { onRegistrarResultado(Number(registroValor) || 0); setRegistroValor(""); } }} disabled={!registroValor}>
              Salvar resultado
            </button>
          </div>
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
  const [recuperando, setRecuperando] = useState(false);
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

  const enviarRecuperacao = async () => {
    if (!email.trim()) { setErro("Digite seu e-mail pra enviar o link de recuperação."); return; }
    setErro(""); setMsg(""); setLoading(true);
    try {
      await supaRecuperarSenha(email.trim());
      setMsg("Enviamos um link de recuperação pro seu e-mail. Abra a mensagem e clique no link pra definir uma nova senha.");
    } catch (e) {
      setErro(e.message || "Não foi possível enviar o e-mail de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  if (recuperando) {
    return (
      <div className="auth-wrap">
        <div className="auth-backdrop" aria-hidden="true" />
        <div className="auth-card">
          <div className="auth-mark"><Wallet size={20} /></div>
          <span className="auth-eyebrow">Gerador de Caixa</span>
          <h1 className="auth-title">Recuperar senha</h1>
          <p className="auth-sub">Digite o e-mail da sua conta. Vamos te mandar um link pra você criar uma senha nova.</p>

          <label className="auth-label">E-mail</label>
          <div className="auth-input">
            <Mail size={16} color="#6B7268" />
            <input type="email" placeholder="seuemail@loja.com" value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarRecuperacao()} />
          </div>

          {erro && <p className="auth-alerta auth-alerta-erro"><AlertTriangle size={13} /> {erro}</p>}
          {msg && <p className="auth-alerta auth-alerta-msg"><Check size={13} /> {msg}</p>}

          <button className="btn-primary" style={{ marginTop: 14 }} onClick={enviarRecuperacao} disabled={loading}>
            {loading ? "Enviando…" : "Enviar link de recuperação"}
          </button>
          <button className="btn-ghost" onClick={() => { setRecuperando(false); setErro(""); setMsg(""); }}>Voltar pro login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <div className="auth-backdrop" aria-hidden="true" />
      <div className="auth-card">
        <div className="auth-mark"><Wallet size={20} /></div>
        <span className="auth-eyebrow">Gerador de Caixa</span>

        <div className="auth-toggle" role="tablist" aria-label="Entrar ou criar conta">
          <button
            type="button" role="tab" aria-selected={modo === "entrar"}
            className={`auth-toggle-btn ${modo === "entrar" ? "active" : ""}`}
            onClick={() => { setModo("entrar"); setErro(""); setMsg(""); }}
          >
            Entrar
          </button>
          <button
            type="button" role="tab" aria-selected={modo === "criar"}
            className={`auth-toggle-btn ${modo === "criar" ? "active" : ""}`}
            onClick={() => { setModo("criar"); setErro(""); setMsg(""); }}
          >
            Criar conta
          </button>
        </div>

        <h1 className="auth-title">{modo === "criar" ? "Crie sua conta" : "Acesso da lojista"}</h1>
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
        {modo === "entrar" && (
          <button type="button" className="auth-link-esqueci" onClick={() => { setRecuperando(true); setErro(""); setMsg(""); }}>
            Esqueci minha senha
          </button>
        )}

        {erro && <p className="auth-alerta auth-alerta-erro"><AlertTriangle size={13} /> {erro}</p>}
        {msg && <p className="auth-alerta auth-alerta-msg"><Check size={13} /> {msg}</p>}

        <button className="btn-primary" style={{ marginTop: 14 }} onClick={submeter} disabled={loading}>
          {loading ? "Aguarde…" : modo === "criar" ? "Criar conta" : "Entrar"}
        </button>
      </div>
    </div>
  );
}

function DefinirNovaSenhaScreen({ accessToken, onDefinida }) {
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const salvar = async () => {
    if (!senha || senha.length < 6) { setErro("A senha precisa ter pelo menos 6 caracteres."); return; }
    if (senha !== confirmar) { setErro("As senhas não são iguais."); return; }
    setErro(""); setLoading(true);
    try {
      await supaDefinirNovaSenha(accessToken, senha);
      const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: supaHeaders(accessToken) });
      const userData = await res.json();
      onDefinida({ accessToken, userId: userData.id, email: userData.email });
    } catch (e) {
      setErro(e.message || "Não foi possível salvar a nova senha. Peça um novo link de recuperação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-backdrop" aria-hidden="true" />
      <div className="auth-card">
        <div className="auth-mark"><Wallet size={20} /></div>
        <span className="auth-eyebrow">Gerador de Caixa</span>
        <h1 className="auth-title">Defina sua nova senha</h1>
        <p className="auth-sub">Escolha uma senha nova pra sua conta.</p>

        <label className="auth-label">Nova senha</label>
        <div className="auth-input">
          <KeyRound size={16} color="#6B7268" />
          <input type="password" placeholder="••••••••" value={senha} onChange={(e) => setSenha(e.target.value)} />
        </div>

        <label className="auth-label">Confirmar nova senha</label>
        <div className="auth-input">
          <KeyRound size={16} color="#6B7268" />
          <input type="password" placeholder="••••••••" value={confirmar} onChange={(e) => setConfirmar(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && salvar()} />
        </div>

        {erro && <p className="auth-alerta auth-alerta-erro"><AlertTriangle size={13} /> {erro}</p>}

        <button className="btn-primary" style={{ marginTop: 14 }} onClick={salvar} disabled={loading}>
          {loading ? "Salvando…" : "Salvar nova senha e entrar"}
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
        <span className="indice-faixa">{resultado.faixaCurta}</span>
      </div>

      <p className="auth-sub" style={{ textAlign: "left", marginTop: 14 }}>{resultado.faixaTexto}</p>

      {resultado.alertas.length > 0 && (
        <div style={{ margin: "14px 0" }}>
          {resultado.alertas.map((texto, i) => (
            <Callout key={i} icon={AlertTriangle} title="Atenção" tone="outline">{texto}</Callout>
          ))}
        </div>
      )}
    </>
  );
}

function SessaoModal({ onClose }) {
  const linkWhatsapp = `https://wa.me/${SESSAO_WHATSAPP_NUMERO}?text=${encodeURIComponent(SESSAO_WHATSAPP_MENSAGEM)}`;
  return (
    <div className="auth-wrap modal-overlay">
      <div className="auth-card sessao-modal-card">
        <span className="sessao-modal-emoji">🎉</span>
        <h1 className="auth-title" style={{ fontSize: 21 }}>Você desbloqueou uma Sessão Estratégica Individual</h1>
        <p className="auth-sub" style={{ textAlign: "left" }}>
          Analisando suas respostas, identificamos oportunidades que podem gerar impacto nos resultados da sua loja.
        </p>
        <p className="auth-sub" style={{ textAlign: "left" }}>
          Por isso, você recebeu uma Sessão Estratégica Individual de aproximadamente 30 minutos. Durante esse encontro vamos analisar o seu diagnóstico e indicar quais ações comerciais fazem mais sentido para o momento da sua loja.
        </p>
        <a className="btn-primary sessao-modal-btn" href={linkWhatsapp} target="_blank" rel="noopener noreferrer">
          Agendar minha Sessão Estratégica
        </a>
        <button className="btn-ghost" onClick={onClose}>Continuar para o app</button>
      </div>
    </div>
  );
}

function DiagnosticoScreen({ onContinue, session }) {
  const [iniciou, setIniciou] = useState(false);
  const [idx, setIdx] = useState(0);
  const [respostas, setRespostas] = useState({});
  const [selecaoMultipla, setSelecaoMultipla] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [salvo, setSalvo] = useState(false);

  const perguntaAtual = DIAG_PERGUNTAS[idx];
  const totalPerguntas = DIAG_PERGUNTAS.length;

  const finalizar = (novasRespostas) => {
    const r = computeDiagnostico(novasRespostas);
    setResultado(r);
    if (session) {
      (async () => {
        try {
          await supaInsert("av_diagnosticos", session.accessToken, {
            user_id: session.userId,
            respostas: novasRespostas,
            indice: r.indice,
            faixa_indice: r.faixaCurta,
            alertas: r.alertas,
            qualificado: r.qualificado,
          });
          setSalvo(true);
        } catch (e) { console.error("Erro ao salvar diagnóstico:", e); }
      })();
    }
  };

  const escolher = (opt) => {
    const novasRespostas = { ...respostas, [perguntaAtual.id]: opt };
    setRespostas(novasRespostas);
    if (idx < totalPerguntas - 1) {
      setIdx(idx + 1);
      setSelecaoMultipla([]);
    } else {
      finalizar(novasRespostas);
    }
  };

  const toggleMultipla = (label) => {
    setSelecaoMultipla((prev) => prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]);
  };

  const confirmarMultipla = () => {
    const pontos = Math.min(4, selecaoMultipla.filter((l) => l !== "Não costumo fazer ações específicas").length);
    const opt = { selecionadas: selecaoMultipla, p: selecaoMultipla.includes("Não costumo fazer ações específicas") ? 0 : pontos };
    const novasRespostas = { ...respostas, [perguntaAtual.id]: opt };
    setRespostas(novasRespostas);
    if (idx < totalPerguntas - 1) {
      setIdx(idx + 1);
      setSelecaoMultipla([]);
    } else {
      finalizar(novasRespostas);
    }
  };

  const voltar = () => { if (idx > 0) setIdx(idx - 1); };

  if (resultado) {
    return (
      <div className="auth-wrap">
        <div className="auth-card resultado-card">
          <span className="auth-eyebrow">Seu Diagnóstico Comercial</span>
          <DiagnosticoResultadoBody resultado={resultado} />
          <button className="btn-primary" style={{ marginTop: 16 }} onClick={onContinue}>Continuar para o app</button>
        </div>
      </div>
    );
  }

  if (!iniciou) {
    return (
      <div className="auth-wrap">
        <div className="auth-card">
          <span className="auth-eyebrow">Seu Diagnóstico Comercial</span>
          <h1 className="auth-title" style={{ fontSize: 22 }}>Antes de começar a usar a ferramenta</h1>
          <p className="auth-sub">Você vai receber um diagnóstico rápido sobre a maturidade comercial da sua loja. Responda com sinceridade — são só {totalPerguntas} perguntas simples, leva menos de 2 minutos.</p>
          <button className="btn-primary" onClick={() => setIniciou(true)}>Começar o diagnóstico</button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card intro-card">
        <div className="quiz-progress-track"><div className="quiz-progress-fill" style={{ width: `${((idx) / totalPerguntas) * 100}%` }} /></div>
        <span className="auth-eyebrow">Pergunta {idx + 1}/{totalPerguntas}</span>
        <h1 className="auth-title" style={{ fontSize: 19, lineHeight: 1.3 }}>{perguntaAtual.texto}</h1>

        {perguntaAtual.multipla ? (
          <>
            <p className="auth-nota" style={{ textAlign: "left", margin: "6px 0 12px" }}>Pode marcar mais de uma opção.</p>
            <div className="quiz-opcoes">
              {perguntaAtual.opcoes.map((opt, i) => (
                <label key={i} className={`quiz-opcao quiz-opcao-check ${selecaoMultipla.includes(opt.l) ? "selecionada" : ""}`}>
                  <input type="checkbox" checked={selecaoMultipla.includes(opt.l)} onChange={() => toggleMultipla(opt.l)} />
                  {opt.l}
                </label>
              ))}
            </div>
            <button className="btn-primary" style={{ marginTop: 14 }} onClick={confirmarMultipla} disabled={selecaoMultipla.length === 0}>Continuar</button>
          </>
        ) : (
          <div className="quiz-opcoes">
            {perguntaAtual.opcoes.map((opt, i) => (
              <button key={i} className="quiz-opcao" onClick={() => escolher(opt)}>{opt.l}</button>
            ))}
          </div>
        )}

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
  { id: "biblioteca", label: "Ações Comerciais", icon: BookOpen },
  { id: "calendario-anual", label: "Calendário Anual", icon: Calendar },
  { id: "radar", label: "Radar", icon: MapPin },
  { id: "datas-iguais", label: "Datas Iguais", icon: Hash },
  { id: "aprenda-e-aplique", label: "Aprenda e Aplique", icon: Play },
  { id: "favoritos", label: "Favoritos", icon: Heart },
  { id: "historico", label: "Histórico", icon: Clock },
  { id: "simulador", label: "Simulador", icon: Calculator },
];

const AULAS = [
  {
    id: "aula-campanhas",
    titulo: "Campanhas e datas sazonais",
    grupo: "Vendas e previsibilidade",
    youtubeId: "PloUTj3rh3U",
  },
  {
    id: "venda-com-previsibilidade",
    titulo: "Venda com previsibilidade",
    grupo: "Vendas e previsibilidade",
    youtubeId: "CvOC4TNqK6Y",
  },
  {
    id: "estrategia-de-brindes",
    titulo: "Estratégia de brindes — garrafas",
    grupo: "Brindes e mecânicas",
    youtubeId: "GFca1lNGfZA",
  },
];

export default function App() {
  const [stage, setStage] = useState("login"); // login | diagnostico | app
  const [session, setSession] = useState(null); // { accessToken, userId, email }
  const [recoveryToken, setRecoveryToken] = useState(() => {
    if (typeof window === "undefined") return null;
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    if (hash.get("type") === "recovery" && hash.get("access_token")) return hash.get("access_token");
    return null;
  });
  const [tab, setTab] = useState("inicio");
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");
  const [buscaHome, setBuscaHome] = useState("");
  const [buscaHomeFocado, setBuscaHomeFocado] = useState(false);
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
  const [radarFavoritos, setRadarFavoritos] = useState([]);
  const [precisaDiagnostico, setPrecisaDiagnostico] = useState(true);
  const [meuDiagnostico, setMeuDiagnostico] = useState(null);
  const [showDiagCompleto, setShowDiagCompleto] = useState(false);
  const [showSimulador, setShowSimulador] = useState(false);
  const [radarViewPadrao, setRadarViewPadrao] = useState("lista");
  const [searchFocado, setSearchFocado] = useState(false);
  const [showVideoInicio, setShowVideoInicio] = useState(false);

  const isAdmin = session?.email === ADMIN_EMAIL;
  const navItems = isAdmin ? [...NAV, { id: "admin", label: "Admin", icon: Shield }] : NAV;

  useEffect(() => {
    if (stage !== "app" || !session) return;
    (async () => {
      try {
        const [h, m, f, meusDiag, meuPerfil, radarFav] = await Promise.all([
          supaSelect("av_historico", session.accessToken, session.userId),
          supaSelect("av_metas", session.accessToken, session.userId),
          supaSelect("av_favoritos", session.accessToken, session.userId),
          supaSelect("av_diagnosticos", session.accessToken, session.userId),
          supaSelect("av_perfis", session.accessToken, session.userId),
          supaSelect("av_radar_favoritos", session.accessToken, session.userId),
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
        setRadarFavoritos(radarFav.map((row) => ({ oportunidade_id: row.oportunidade_id, lembrete: row.lembrete })));
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

  const markDone = (id, valorParam, notaParam) => {
    const now = new Date();
    const mesIdx = now.getMonth(), ano = now.getFullYear();
    const valor = valorParam !== undefined ? valorParam : (Number(doneValor) || 0);
    const nota = notaParam !== undefined ? notaParam : doneNote;
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

  const salvarLocalizacaoRadar = async (dados) => {
    setPerfil((prev) => ({ ...(prev || {}), ...dados }));
    if (session) {
      try {
        await supaUpdateWhere("av_perfis", session.accessToken, { user_id: session.userId }, dados);
      } catch (e) { console.error("Erro ao salvar localização:", e); }
    }
  };

  const toggleFavoritoOportunidade = (oportunidadeId) => {
    setRadarFavoritos((prev) => {
      const existe = prev.find((f) => f.oportunidade_id === oportunidadeId);
      if (existe) {
        if (session) supaDeleteWhere("av_radar_favoritos", session.accessToken, { user_id: session.userId, oportunidade_id: oportunidadeId }).catch(console.error);
        return prev.filter((f) => f.oportunidade_id !== oportunidadeId);
      }
      if (session) supaInsert("av_radar_favoritos", session.accessToken, { user_id: session.userId, oportunidade_id: oportunidadeId }).catch(console.error);
      return [...prev, { oportunidade_id: oportunidadeId, lembrete: null }];
    });
  };

  const definirLembreteOportunidade = (oportunidadeId, lembrete) => {
    setRadarFavoritos((prev) => prev.map((f) => (f.oportunidade_id === oportunidadeId ? { ...f, lembrete: lembrete || null } : f)));
    if (session) supaUpdateWhere("av_radar_favoritos", session.accessToken, { user_id: session.userId, oportunidade_id: oportunidadeId }, { lembrete: lembrete || null }).catch(console.error);
  };

  const verAcoesDoRadar = (palavrasChave) => {
    goto("biblioteca", true);
    setSearch(palavrasChave);
  };

  const shiftDash = (delta) => {
    let m = dashMes + delta;
    let a = dashAno;
    if (m < 0) { m = 11; a -= 1; }
    if (m > 11) { m = 0; a += 1; }
    setDashMes(m); setDashAno(a);
  };

  const addMeta = async (acaoIdParam, valorParam) => {
    const acaoId = acaoIdParam !== undefined ? acaoIdParam : novaMetaAcao;
    const valorMeta = valorParam !== undefined ? valorParam : (Number(novaMetaValor) || 0);
    const mes = dashMes, ano = dashAno;
    if (!acaoId || !valorMeta) return;
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

  const buscaHomeQ = buscaHome.trim().toLowerCase();
  const buscaHomeKw = buscaHomeQ ? buscaInteligente(buscaHomeQ) : { cats: new Set(), canais: new Set() };
  const resultadosBuscaHome = !buscaHomeQ ? [] : ACTIONS.filter((a) => {
    const matchesTexto = a.nome.toLowerCase().includes(buscaHomeQ) || a.tipo.toLowerCase().includes(buscaHomeQ) || a.como.toLowerCase().includes(buscaHomeQ);
    const matchesKw = buscaHomeKw.cats.has(a.cat) || buscaHomeKw.canais.has(a.canalPrincipal) || a.canaisApoio.some((c) => buscaHomeKw.canais.has(c));
    return matchesTexto || matchesKw;
  }).slice(0, 6);

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
    .auth-wrap { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; position: relative; overflow: hidden; }
    .auth-backdrop {
      position: absolute; inset: 0; z-index: 0; pointer-events: none;
      background:
        radial-gradient(circle at 12% -10%, rgba(20,63,53,0.10), transparent 45%),
        radial-gradient(circle at 100% 110%, rgba(78,156,124,0.12), transparent 40%);
    }
    .auth-card {
      position: relative; z-index: 1; width: 100%; max-width: 380px; background: var(--card); border: 1px solid var(--line);
      border-radius: 18px; padding: 32px 28px; box-shadow: 0 20px 50px rgba(28,32,29,0.08);
    }
    .auth-mark {
      width: 42px; height: 42px; border-radius: 12px; background: var(--wine); color: #fff;
      display: flex; align-items: center; justify-content: center; margin-bottom: 12px;
    }
    .auth-eyebrow {
      font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.1em;
      text-transform: uppercase; color: var(--mustard);
    }
    .auth-toggle {
      display: flex; background: var(--paper); border: 1px solid var(--line); border-radius: 999px;
      padding: 3px; margin: 16px 0 4px; gap: 3px;
    }
    .auth-toggle-btn {
      flex: 1; border: none; background: none; padding: 8px 10px; border-radius: 999px; font-size: 12.5px;
      font-weight: 500; color: var(--ink-soft); cursor: pointer; font-family: 'Work Sans', sans-serif; transition: all 0.15s ease;
    }
    .auth-toggle-btn.active { background: var(--wine); color: #fff; box-shadow: 0 2px 6px rgba(20,63,53,0.25); }
    .auth-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 600; margin: 14px 0 4px; }
    .auth-sub { font-size: 13px; color: var(--ink-soft); margin: 0 0 20px; line-height: 1.5; }
    .auth-label { font-size: 11.5px; color: var(--ink-soft); text-transform: uppercase; letter-spacing: 0.04em; display:block; margin: 12px 0 6px; }
    .auth-input {
      display: flex; align-items: center; gap: 8px; border: 1px solid var(--line); border-radius: 10px;
      padding: 11px 12px; background: var(--paper); transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .auth-input:focus-within { border-color: var(--wine); box-shadow: 0 0 0 3px rgba(20,63,53,0.1); }
    .auth-input input { border: none; outline: none; background: transparent; font-size: 14px; width: 100%; color: var(--ink); font-family: 'Work Sans', sans-serif; }
    .auth-alerta-erro, .auth-erro { color: #A13A3A; }
    .auth-alerta-erro { display: flex; align-items: center; gap: 6px; font-size: 12px; margin-top: 12px; padding: 9px 12px; border-radius: 8px; line-height: 1.4; background: rgba(161,58,58,0.08); }
    .auth-erro { font-size: 12px; margin-top: 10px; }
    .auth-alerta-msg, .auth-msg { color: var(--wine); }
    .auth-alerta-msg { display: flex; align-items: center; gap: 6px; font-size: 12px; margin-top: 12px; padding: 9px 12px; border-radius: 8px; line-height: 1.4; background: rgba(20,63,53,0.07); }
    .auth-msg { font-size: 12px; margin-top: 10px; line-height: 1.5; }
    .auth-alerta { display: flex; align-items: center; gap: 6px; font-size: 12px; margin-top: 12px; padding: 9px 12px; border-radius: 8px; line-height: 1.4; }
    .auth-nota { font-size: 11.5px; color: var(--ink-soft); text-align: center; margin-top: 12px; line-height: 1.5; }
    .btn-ghost {
      width: 100%; background: none; border: none; color: var(--ink-soft); font-size: 12.5px;
      padding: 10px; cursor: pointer; font-family: 'Work Sans', sans-serif; font-weight: 500; transition: color 0.15s ease;
    }
    .btn-ghost:hover { color: var(--wine); }
    .auth-link-esqueci {
      display: block; background: none; border: none; color: var(--ink-soft); font-size: 11.5px; cursor: pointer;
      font-family: 'Work Sans', sans-serif; margin: 8px 0 0; padding: 0; text-align: right; width: 100%;
    }
    .auth-link-esqueci:hover { color: var(--wine); text-decoration: underline; }
    .intro-card { max-width: 420px; }
    .quiz-progress-track { height: 4px; background: var(--line); border-radius: 999px; margin-bottom: 18px; overflow: hidden; }
    .quiz-progress-fill { height: 100%; background: var(--wine); border-radius: 999px; transition: width 0.25s; }
    .quiz-opcoes { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; }
    .quiz-opcao {
      text-align: left; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--card);
      font-family: 'Work Sans', sans-serif; font-size: 13.5px; color: var(--ink); cursor: pointer;
    }
    .quiz-opcao:hover { border-color: var(--wine); background: var(--paper); }
    .quiz-opcao-check { display: flex; align-items: center; gap: 10px; cursor: pointer; }
    .quiz-opcao-check input { accent-color: var(--wine); width: 16px; height: 16px; flex-shrink: 0; }
    .quiz-opcao-check.selecionada { border-color: var(--wine); background: var(--paper); }

    .modal-overlay {
      position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(20,63,53,0.55);
      z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px;
    }
    .sessao-modal-card { max-width: 420px; text-align: center; }
    .sessao-modal-emoji { font-size: 40px; display: block; margin-bottom: 8px; }
    .sessao-modal-btn { display: block; text-decoration: none; text-align: center; margin-top: 6px; }

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
      display: none; width: 254px; flex-shrink: 0; background: var(--card); border-right: 1px solid var(--line);
      padding: 24px 18px; flex-direction: column;
    }
    .sidebar-logo-wrap { display: flex; align-items: center; gap: 10px; margin-bottom: 30px; padding: 0 4px; }
    .sidebar-mark {
      width: 32px; height: 32px; border-radius: 9px; background: var(--wine); color: #fff; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
    }
    .sidebar-logo { font-family: 'Fraunces', serif; font-size: 17.5px; font-weight: 600; color: var(--ink); line-height: 1.2; }
    .sidebar-nav { display: flex; flex-direction: column; gap: 5px; flex: 1; }
    .sidebar-link {
      display: flex; align-items: center; gap: 11px; padding: 11px 14px; border-radius: 11px;
      font-size: 13.5px; color: var(--ink-soft); cursor: pointer; background: none; border: none; text-align: left;
      font-family: 'Work Sans', sans-serif; font-weight: 500; transition: background 0.15s ease, color 0.15s ease;
    }
    .sidebar-link:hover { background: var(--paper); color: var(--ink); }
    .sidebar-link.active { background: var(--wine); color: #fff; box-shadow: 0 4px 12px rgba(20,63,53,0.22); }
    .sidebar-logout {
      display: flex; align-items: center; gap: 8px; font-size: 12.5px; color: var(--ink-soft);
      background: none; border: none; cursor: pointer; padding: 12px 14px;
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

    .bib-simulador-card {
      width: calc(100% - 40px); margin: 4px 20px 18px; display: flex; align-items: center; gap: 12px;
      background: var(--wine); border: none; border-radius: 14px; padding: 16px; cursor: pointer;
      box-shadow: 0 4px 14px rgba(20,63,53,0.16); text-align: left; font-family: 'Work Sans', sans-serif;
    }
    .bib-simulador-icon {
      width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.16); color: #fff;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .bib-simulador-texto { display: flex; flex-direction: column; gap: 2px; flex: 1; }
    .bib-simulador-titulo { font-size: 14px; font-weight: 600; color: #fff; }
    .bib-simulador-sub { font-size: 11.5px; color: rgba(255,255,255,0.75); line-height: 1.4; }

    .bib-section-title {
      display: inline-block; background: var(--wine); color: #fff; font-family: 'IBM Plex Mono', monospace;
      font-size: 10.5px; letter-spacing: 0.06em; text-transform: uppercase; padding: 6px 14px; border-radius: 999px;
      margin: 18px auto 10px; max-width: 720px; width: fit-content;
    }
    .bib-section-title:first-of-type { margin-top: 4px; }

    .bib-video-wrap { max-width: 720px; margin: 14px auto 0; padding: 0 20px; }
    .bib-video-destaque { margin: 0; box-shadow: 0 2px 8px rgba(20,63,53,0.05); }
    .bib-video-embed {
      position: relative; width: 100%; padding-top: 56.25%; border-radius: 12px; overflow: hidden;
      box-shadow: 0 2px 8px rgba(20,63,53,0.08); background: #000;
    }
    .bib-video-embed iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
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
      max-width: 1160px; margin: 0 auto; width: 100%; padding: 32px 24px 8px;
    }
    .dash-ola { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--mustard); }
    .dash-titulo { font-family: 'Fraunces', serif; font-size: 27px; font-weight: 600; margin: 4px 0 0; color: var(--ink); }
    .dash-selectors { display: flex; gap: 8px; }
    .dash-select {
      border: 1px solid var(--line); background: var(--card); border-radius: 10px; padding: 8px 12px; font-size: 12.5px;
      color: var(--ink); font-family: 'Work Sans', sans-serif; cursor: pointer; box-shadow: 0 1px 2px rgba(20,63,53,0.04);
    }

    .dash-video-wrap { max-width: 1160px; margin: 14px auto 0; padding: 0 24px; }
    .dash-video-btn {
      display: inline-flex; align-items: center; gap: 8px; background: var(--card); border: 1px solid var(--line);
      border-radius: 999px; padding: 9px 16px; font-size: 12.5px; font-weight: 500; color: var(--wine);
      cursor: pointer; font-family: 'Work Sans', sans-serif;
    }
    .dash-video-btn:hover { border-color: var(--wine); background: var(--paper); }

    .dash-busca-wrap {
      max-width: 1160px; margin: 18px auto 0; padding: 22px 24px; background: var(--card); border: 1.5px solid var(--wine);
      border-radius: 20px; box-shadow: 0 6px 20px rgba(20,63,53,0.1);
    }
    .dash-busca-titulo { display: block; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 16px; color: var(--ink); margin-bottom: 4px; }
    .dash-busca-sub { font-size: 12px; color: var(--ink-soft); margin: 0 0 14px; line-height: 1.5; }
    .dash-busca-bar { margin: 0 !important; padding: 14px 16px !important; }
    .dash-busca-bar input { font-size: 14px !important; }
    .dash-busca-resultados { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
    .dash-busca-item {
      display: flex; flex-direction: column; gap: 2px; text-align: left; background: var(--paper); border: 1px solid var(--line);
      border-radius: 10px; padding: 12px 14px; cursor: pointer; font-family: 'Work Sans', sans-serif;
    }
    .dash-busca-item:hover { border-color: var(--wine); }
    .dash-busca-item-nome { font-size: 13.5px; font-weight: 600; color: var(--ink); }
    .dash-busca-item-tipo { font-size: 11.5px; color: var(--ink-soft); }
    .dash-busca-link { background: none; border: none; color: var(--wine); text-decoration: underline; cursor: pointer; font-size: 12px; padding: 0; font-family: 'Work Sans', sans-serif; }

    /* Grid principal da Início — mobile empilha por ordem de prioridade, desktop usa áreas nomeadas */
    .dash-grid {
      display: grid; grid-template-columns: 1fr; gap: 18px; max-width: 1160px; margin: 20px auto 40px; padding: 0 24px;
    }
    .dash-cell-progresso { order: 1; }
    .dash-cell-oportunidade { order: 2; }
    .dash-cell-datasiguais { order: 3; }
    .dash-cell-acoes { order: 4; }
    .dash-cell-diagnostico { order: 5; }
    .dash-col-title { font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 12px; }

    /* Seu progresso — bloco hero */
    .dash-progresso-hero {
      height: 100%; padding: 22px 24px; border-radius: 20px; box-sizing: border-box;
      background: linear-gradient(135deg, var(--wine-dark), var(--wine) 65%, #1c5744);
      box-shadow: 0 10px 28px rgba(20,63,53,0.22); color: #fff;
    }
    .dash-progresso-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .dash-progresso-titulo { font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 15px; color: #fff; }
    .dash-progresso-pct-badge {
      background: rgba(255,255,255,0.16); border-radius: 999px; padding: 4px 12px; font-size: 13px; font-weight: 700; color: #fff;
    }
    .dash-progresso-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin-bottom: 16px; }
    .dash-progresso-stat { display: flex; flex-direction: column; gap: 4px; }
    .dash-progresso-stat-icon {
      width: 26px; height: 26px; border-radius: 8px; background: rgba(255,255,255,0.16); color: #fff;
      display: flex; align-items: center; justify-content: center; margin-bottom: 2px;
    }
    .dash-progresso-stat-label { font-size: 10.5px; color: rgba(255,255,255,0.7); }
    .dash-progresso-stat-valor { font-family: 'Fraunces', serif; font-size: 19px; font-weight: 600; color: #fff; }
    .dash-progresso-stat-valor.dash-progresso-destaque { color: #D9C48A; }
    .dash-progresso-barra-track { height: 12px; background: rgba(255,255,255,0.18); border-radius: 999px; overflow: hidden; }
    .dash-progresso-barra-fill { height: 100%; background: #fff; border-radius: 999px; transition: width 0.5s ease; }
    .dash-progresso-falta { font-size: 12px; color: rgba(255,255,255,0.8); margin: 10px 0 0; font-weight: 500; }

    .dash-meta-registro {
      height: 100%; box-sizing: border-box; display: flex; flex-direction: column; justify-content: center;
      padding: 22px; background: var(--card); border: 1px solid var(--line);
      border-radius: 20px; box-shadow: 0 2px 10px rgba(20,63,53,0.06);
    }
    .dash-meta-registro-title { display: block; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 14.5px; color: var(--ink); margin-bottom: 12px; }
    .dash-meta-registro-sub { display: block; font-size: 11.5px; color: var(--ink-soft); line-height: 1.5; margin: 0 0 12px; max-width: 560px; }
    .dash-registrar-acao-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; background: var(--wine);
      color: #fff; border: none; border-radius: 14px; padding: 18px 18px; font-size: 15px; font-weight: 700;
      cursor: pointer; font-family: 'Manrope', sans-serif; box-shadow: 0 6px 18px rgba(20,63,53,0.22);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .dash-registrar-acao-btn:hover { background: var(--wine-dark); transform: translateY(-1px); box-shadow: 0 8px 22px rgba(20,63,53,0.28); }
    .dash-meta-registro-expandido { margin-top: 4px; }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Oportunidade da semana */
    .dash-oportunidade-card {
      height: 100%; box-sizing: border-box; padding: 18px 20px; background: var(--card); border: 1px solid var(--line);
      border-radius: 20px; box-shadow: 0 4px 16px rgba(184,145,47,0.14), 0 2px 10px rgba(20,63,53,0.05);
      display: flex; gap: 16px; align-items: flex-start;
    }
    .dash-oportunidade-vazia { height: 100%; box-sizing: border-box; padding: 18px 20px; background: var(--card); border: 1px dashed var(--line); border-radius: 20px; }
    .dash-oportunidade-badge {
      flex-shrink: 0; width: 56px; height: 56px; border-radius: 16px; background: linear-gradient(135deg, var(--mustard), #B8912F);
      display: flex; flex-direction: column; align-items: center; justify-content: center; color: #fff;
      box-shadow: 0 4px 12px rgba(184,145,47,0.35);
    }
    .dash-oportunidade-dias { font-family: 'Fraunces', serif; font-size: 20px; font-weight: 700; line-height: 1; }
    .dash-oportunidade-dias-label { font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em; opacity: 0.85; }
    .dash-oportunidade-corpo { flex: 1; min-width: 0; }
    .dash-oportunidade-eyebrow {
      display: block; font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.05em; text-transform: uppercase;
      color: var(--mustard); margin-bottom: 4px;
    }
    .dash-oportunidade-texto { font-size: 14.5px; color: var(--ink); margin: 0 0 4px; }
    .dash-oportunidade-texto b { color: var(--wine); }
    .dash-oportunidade-dica { font-size: 11.5px; color: var(--ink-soft); margin: 0 0 12px; }
    .dash-oportunidade-botoes { display: flex; gap: 8px; flex-wrap: wrap; }
    .dash-oportunidade-botoes button { flex: 1; min-width: 140px; }

    .dash-registro-nota { font-size: 11.5px; color: var(--ink-soft); margin: 0 0 12px; line-height: 1.4; }

    .dash-datasiguais-card {
      height: 100%; box-sizing: border-box; padding: 16px 20px; background: var(--card); border: 1px dashed var(--mustard);
      border-radius: 16px;
    }
    .dash-datasiguais-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px; margin-bottom: 4px; }
    .dash-datasiguais-eyebrow {
      font-family: 'IBM Plex Mono', monospace; font-size: 10.5px; letter-spacing: 0.05em; text-transform: uppercase; color: var(--mustard);
    }
    .dash-datasiguais-contagem { font-size: 11.5px; font-weight: 700; color: var(--wine); }
    .dash-datasiguais-titulo { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; color: var(--ink); margin: 2px 0 8px; }
    .dash-datasiguais-lista { margin: 0; padding-left: 18px; font-size: 12px; color: var(--ink); line-height: 1.6; }

    .dash-acoes-grid { display: grid; grid-template-columns: 1fr; gap: 10px; margin-bottom: 10px; }
    .dash-acao-card {
      text-align: left; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 14px 16px;
      box-shadow: 0 1px 3px rgba(20,63,53,0.04); cursor: pointer; font-family: 'Work Sans', sans-serif;
    }
    .dash-acao-card.dash-acao-card-compacta { padding: 11px 14px; }
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

    .dash-card-white { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(20,63,53,0.04); }
    .dash-diag-card { background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px; box-shadow: 0 1px 3px rgba(20,63,53,0.04); }

    .dash-diag-card-discreta { padding: 14px 16px; }
    .dash-diag-discreta-top { display: flex; align-items: center; gap: 12px; }
    .diag-mini-indice-sm { gap: 1px; }

    @media (min-width: 860px) {
      .dash-progresso-stats { grid-template-columns: repeat(4, 1fr); }

      .dash-grid {
        grid-template-columns: 1.5fr 1fr;
        grid-template-areas:
          "progresso oport"
          "datasiguais diag"
          "acoes acoes";
        gap: 22px;
      }
      .dash-cell-progresso { grid-area: progresso; order: initial; }
      .dash-cell-oportunidade { grid-area: oport; order: initial; }
      .dash-cell-diagnostico { grid-area: diag; order: initial; }
      .dash-cell-datasiguais { grid-area: datasiguais; order: initial; }
      .dash-cell-acoes { grid-area: acoes; order: initial; }
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

    .tagcard-v2 {
      position: relative; background: var(--wine); border-radius: 16px; padding: 18px;
      cursor: pointer; box-shadow: 0 6px 16px rgba(20,63,53,0.18); transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    .tagcard-v2:hover { transform: translateY(-2px); box-shadow: 0 10px 22px rgba(20,63,53,0.24); }
    .tagcard-v2-top { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 14px; }
    .tagcard-v2-badge {
      width: 40px; height: 40px; border-radius: 12px; background: rgba(255,255,255,0.14);
      display: flex; align-items: center; justify-content: center; color: #fff;
    }
    .tagcard-v2-fav { background: none; border: none; cursor: pointer; padding: 2px; }
    .tagcard-v2-nome { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: #fff; margin: 0 0 6px; line-height: 1.25; }
    .tagcard-v2-cat {
      font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.05em; text-transform: uppercase;
      color: rgba(255,255,255,0.65);
    }

    .nicho-examples { display: flex; flex-direction: column; gap: 10px; }
    .nicho-example-item { background: var(--paper); border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; }
    .nicho-example-label { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 10px; letter-spacing: 0.04em; text-transform: uppercase; color: var(--wine); margin-bottom: 3px; }
    .nicho-example-text { font-size: 12.5px; color: var(--ink); line-height: 1.4; }

    .exemplo-real-list { display: flex; flex-direction: column; gap: 14px; }
    .exemplo-real-item { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; padding: 14px; }
    .exemplo-real-titulo { display: block; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px; color: var(--wine); margin-bottom: 6px; }
    .exemplo-real-desc { font-size: 12.5px; color: var(--ink); line-height: 1.55; margin: 0 0 10px; }

    .radar-insights { max-width: 1040px; margin: 14px auto 0; padding: 14px 20px; background: var(--card); border: 1px solid var(--line); border-radius: 14px; box-shadow: 0 2px 8px rgba(20,63,53,0.05); }
    .radar-insight-item { font-size: 12.5px; color: var(--ink); line-height: 1.6; margin: 0; }
    .radar-insight-item b { color: var(--wine); }

    .radar-filtros { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; max-width: 1040px; margin: 16px auto 10px; padding: 0 20px; }
    .radar-view-toggle { display: flex; gap: 6px; margin-left: auto; }
    .radar-view-btn {
      display: flex; align-items: center; gap: 5px; background: var(--card); border: 1px solid var(--line); border-radius: 999px;
      padding: 7px 12px; font-size: 12px; color: var(--ink-soft); cursor: pointer; font-family: 'Work Sans', sans-serif;
    }
    .radar-view-btn.active { background: var(--wine); border-color: var(--wine); color: #fff; }

    .cal-anual-meses { display: flex; flex-wrap: wrap; gap: 6px; max-width: 1160px; margin: 16px auto 0; padding: 0 24px; }
    .cal-anual-mes-btn {
      background: var(--card); border: 1px solid var(--line); border-radius: 999px; padding: 8px 14px; font-size: 12px;
      color: var(--ink-soft); cursor: pointer; font-family: 'Work Sans', sans-serif; font-weight: 500;
    }
    .cal-anual-mes-btn.active { background: var(--wine); border-color: var(--wine); color: #fff; }
    .cal-anual-mes-btn.vazio { opacity: 0.55; }
    .cal-anual-conteudo { max-width: 1160px; margin: 0 auto 40px; padding: 0 24px; }

    .aprenda-conteudo { width: 100%; max-width: 1040px; box-sizing: border-box; margin: 0 auto 40px; padding: 0 24px; }
    .aprenda-conteudo .dtl-section-card { width: 100%; box-sizing: border-box; }
    @media (max-width: 859px) { .aprenda-conteudo { padding: 0 14px 90px; } }
    .aprenda-grid { display: grid; grid-template-columns: 1fr; gap: 28px; margin-top: 8px; }
    .aprenda-video-card { display: flex; flex-direction: column; gap: 10px; }
    .aprenda-video-frame {
      position: relative; width: 100%; padding-top: 56.25%; border-radius: 12px; overflow: hidden;
      box-shadow: 0 2px 8px rgba(20,63,53,0.08); background: #000;
    }
    .aprenda-video-frame iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; }
    .aprenda-video-capa { position: absolute; inset: 0; width: 100%; height: 100%; border: none; padding: 0; cursor: pointer; background: #000; }
    .aprenda-video-capa img { width: 100%; height: 100%; object-fit: cover; display: block; opacity: 0.92; }
    .aprenda-video-play {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 68px; height: 68px; border-radius: 50%;
      background: rgba(20,63,53,0.88); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 16px rgba(0,0,0,0.35);
    }
    .aprenda-video-bloqueio { position: absolute; top: 0; left: 0; right: 0; height: 18%; z-index: 2; }
    .aprenda-video-titulo { font-family: 'Manrope', sans-serif; font-weight: 600; font-size: 15px; color: var(--ink); }

    .radar-datas-iguais-intro { max-width: 1040px; margin: 0 auto 12px; padding: 0 20px; font-size: 12px; color: var(--ink-soft); line-height: 1.5; }
    .radar-destaque-10 { position: relative; margin-bottom: 4px; }
    .radar-destaque-10 .radar-card { border: 1.5px solid var(--mustard); box-shadow: 0 4px 16px rgba(184,145,47,0.18); }
    .radar-destaque-10-badge {
      display: inline-block; background: linear-gradient(135deg, var(--mustard), #B8912F); color: #fff; font-size: 10.5px;
      font-weight: 700; padding: 4px 12px; border-radius: 999px 999px 0 0; margin-left: 16px;
    }

    .radar-cal-wrap { max-width: 1040px; margin: 0 auto 14px; padding: 0 20px; }
    .radar-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 14px; box-shadow: 0 2px 8px rgba(20,63,53,0.05); }
    .radar-cal-dow { text-align: center; font-size: 10.5px; color: var(--ink-soft); font-weight: 600; padding-bottom: 4px; }
    .radar-cal-dia {
      aspect-ratio: 1; border: none; background: var(--paper); border-radius: 8px; font-size: 12px; color: var(--ink);
      cursor: pointer; position: relative; font-family: 'Work Sans', sans-serif;
    }
    .radar-cal-dia.tem-op { background: #EAF0EC; font-weight: 600; color: var(--wine); }
    .radar-cal-dia.tem-op::after { content: ""; position: absolute; bottom: 3px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: var(--wine); }
    .radar-cal-dia.selecionado { background: var(--wine); color: #fff; }
    .radar-cal-dia.selecionado::after { background: #fff; }

    .radar-card { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 16px; box-shadow: 0 2px 8px rgba(20,63,53,0.05); }
    .radar-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px; }
    .radar-card-cat {
      font-family: 'IBM Plex Mono', monospace; font-size: 9.5px; letter-spacing: 0.04em; text-transform: uppercase;
      color: var(--mustard); display: flex; align-items: center; gap: 4px;
    }
    .radar-card-titulo { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; margin: 0 0 4px; color: var(--ink); }
    .radar-card-data { display: flex; align-items: center; gap: 4px; font-size: 11.5px; color: var(--ink-soft); margin-bottom: 8px; }
    .radar-card-desc { font-size: 13px; color: var(--ink); line-height: 1.5; margin: 0 0 10px; }
    .radar-lembrete-select {
      width: 100%; border: 1px solid var(--line); border-radius: 8px; padding: 7px 10px; font-size: 12px; color: var(--ink);
      background: var(--paper); margin-bottom: 10px; font-family: 'Work Sans', sans-serif;
    }

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
    .dtl-dica-block.sim-classificacao-atencao { background: #B8912F; }
    .dtl-dica-titulo {
      display: flex; align-items: center; gap: 7px; font-family: 'Manrope', sans-serif; font-weight: 700; font-size: 12.5px;
      text-transform: uppercase; letter-spacing: 0.04em; color: rgba(255,255,255,0.85); margin-bottom: 8px;
    }
    .dtl-dica-lista { margin: 0; padding-left: 18px; font-size: 13.5px; line-height: 1.55; color: #fff; }
    .dtl-dica-lista li { margin-bottom: 6px; }
    .dtl-imagens { display: grid; grid-template-columns: 1fr; gap: 12px; margin: 4px 0 14px; }
    .dtl-imagens.multi { grid-template-columns: repeat(2, 1fr); }
    .dtl-imagem { margin: 0; border-radius: 14px; overflow: hidden; background: var(--card); border: 1px solid var(--line); box-shadow: 0 2px 8px rgba(20,63,53,0.06); }
    .dtl-imagem { text-align: center; }
    .dtl-imagem img { display: block; width: auto; max-width: 100%; max-height: 520px; margin: 0 auto; object-fit: contain; }
    .dtl-imagem figcaption { padding: 8px 12px; font-size: 12px; color: var(--ink-soft); line-height: 1.4; }
    @media (max-width: 560px) { .dtl-imagens.multi { grid-template-columns: 1fr; } }
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

    .dtl-meta-resultado-card {
      background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 18px;
      box-shadow: 0 2px 8px rgba(20,63,53,0.05); margin: 20px 0 0;
    }
    .dtl-meta-progresso-top { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--ink-soft); margin-bottom: 6px; }
    .dtl-meta-form { margin-bottom: 4px; }
    .dtl-registrar-divisor { margin-top: 16px; padding-top: 16px; border-top: 1px dashed var(--line); }

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

    .tabbar {
      display: flex; gap: 4px; background: var(--wine-dark); padding: 8px 10px calc(10px + env(safe-area-inset-bottom, 0px));
      position: fixed; bottom: 0; left: 0; right: 0; box-shadow: 0 -4px 16px rgba(20,63,53,0.2); z-index: 20;
      overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; scroll-snap-type: x proximity;
    }
    .tabbar::-webkit-scrollbar { display: none; }
    .tabbtn {
      flex: 0 0 auto; display: flex; flex-direction: column; align-items: center; gap: 4px; background: none; border: none;
      cursor: pointer; color: rgba(255,255,255,0.55); padding: 8px 14px; border-radius: 14px; transition: background 0.15s ease, color 0.15s ease;
      min-width: 68px; scroll-snap-align: start;
    }
    .tabbtn.active { color: #fff; background: rgba(255,255,255,0.14); }
    .tabbtn span { font-size: 10.5px; font-weight: 500; white-space: nowrap; }

    @media (min-width: 860px) {
      .sidebar { display: flex; }
      .tabbar { display: none; }
      .main-content { padding-bottom: 0; }
    }
  `;

  const handleAuthed = (s) => {
    setSession(s);
    (async () => {
      try {
        const [diags, perfis] = await Promise.all([
          supaSelect("av_diagnosticos", s.accessToken, s.userId),
          supaSelect("av_perfis", s.accessToken, s.userId),
        ]);
        setPrecisaDiagnostico(diags.length === 0);
        if (perfis.length === 0) setStage("perfil");
        else if (diags.length === 0) setStage("diagnostico");
        else setStage("app");
      } catch (e) {
        console.error("Erro ao verificar cadastro existente:", e);
        setStage("perfil");
      }
    })();
  };

  if (recoveryToken) return (
    <div className="app-wrap"><style>{baseStyles}</style><DefinirNovaSenhaScreen
      accessToken={recoveryToken}
      onDefinida={(s) => {
        window.history.replaceState(null, "", window.location.pathname);
        setRecoveryToken(null);
        handleAuthed(s);
      }}
    /></div>
  );

  if (stage === "login") return (
    <div className="app-wrap"><style>{baseStyles}</style><LoginScreen onAuthed={handleAuthed} /></div>
  );
  if (stage === "perfil") return (
    <div className="app-wrap"><style>{baseStyles}</style><PerfilScreen session={session} onContinue={(p) => { setPerfil(p); setStage(precisaDiagnostico ? "diagnostico" : "app"); }} /></div>
  );
  if (stage === "diagnostico") return (
    <div className="app-wrap"><style>{baseStyles}</style><DiagnosticoScreen session={session} onContinue={() => setStage("app")} /></div>
  );

  return (
    <div className="app-wrap">
      <style>{baseStyles}</style>
      <div className="shell">
        <aside className="sidebar">
          <div className="sidebar-logo-wrap">
            <div className="sidebar-mark"><Wallet size={16} /></div>
            <div className="sidebar-logo">Gerador de Caixa</div>
          </div>
          <nav className="sidebar-nav">
            {navItems.map((n) => (
              <button
                key={n.id}
                className={`sidebar-link ${(n.id === "simulador" ? showSimulador : n.id === "datas-iguais" ? (tab === "radar" && radarViewPadrao === "datas-iguais" && !showSimulador) : tab === n.id && !openAction && !showSimulador) ? "active" : ""}`}
                onClick={() => {
                  if (n.id === "simulador") { setOpenId(null); setShowSimulador(true); }
                  else if (n.id === "datas-iguais") { setShowSimulador(false); setRadarViewPadrao("datas-iguais"); goto("radar", true); }
                  else { setShowSimulador(false); if (n.id === "radar") setRadarViewPadrao("lista"); goto(n.id, true); }
                }}
              >
                <n.icon size={17} /> {n.label}
              </button>
            ))}
          </nav>
          <button className="sidebar-logout" onClick={logout}><LogOut size={14} /> Sair</button>
        </aside>

        <div className="main">
          <div className="main-content">
            {showSimulador ? (
              <SimuladorBrindes onBack={() => setShowSimulador(false)} />
            ) : openAction ? (
              <DetailScreen
                action={openAction}
                isFav={favs.has(openAction.id)}
                onToggleFav={toggleFav}
                onBack={() => setOpenId(null)}
                resultadosAcao={resultadosAcaoAtual}
                onVerHistorico={() => goto("historico")}
                onOpenRelacionada={(id) => setOpenId(id)}
                onAbrirSimulador={() => setShowSimulador(true)}
                metaAtual={metasDoMes.find((m) => m.acaoId === openAction.id)}
                mesAtualLabel={nomeMesAno}
                onDefinirMeta={(valor) => addMeta(openAction.id, valor)}
                onRegistrarResultado={(valor) => markDone(openAction.id, valor, "")}
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

                <div className="dash-video-wrap">
                  <button type="button" className="dash-video-btn" onClick={() => setShowVideoInicio((s) => !s)}>
                    <Play size={14} /> Como usar a ferramenta — assista o vídeo
                  </button>
                  {showVideoInicio && (
                    <div className="bib-video-embed" style={{ marginTop: 10 }}>
                      <iframe
                        src="https://www.youtube.com/embed/kUry5SeSTYc"
                        title="Como usar a ferramenta"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )}
                </div>

                <div className="dash-busca-wrap">
                  <span className="dash-busca-titulo">🔎 O que você quer fazer hoje?</span>
                  <p className="dash-busca-sub">Digite o que você precisa — "quero fazer uma promoção", "preciso de dinheiro rápido", "tem Dia dos Pais chegando"...</p>
                  <div className="search-bar dash-busca-bar">
                    <Search size={16} color="#143F35" />
                    <input
                      placeholder="Ex: quero girar estoque, vender no WhatsApp..."
                      value={buscaHome}
                      onChange={(e) => setBuscaHome(e.target.value)}
                      onFocus={() => setBuscaHomeFocado(true)}
                      onBlur={() => setTimeout(() => setBuscaHomeFocado(false), 150)}
                    />
                    {buscaHome && <X size={14} color="#6B7268" style={{ cursor: "pointer" }} onClick={() => setBuscaHome("")} />}
                  </div>

                  {buscaHomeFocado && !buscaHomeQ && (
                    <div className="bib-sugestoes" style={{ marginTop: 10 }}>
                      {BUSCA_SUGESTOES.map((s) => (
                        <button key={s} className="bib-sugestao-chip" onMouseDown={() => setBuscaHome(s)}>{s}</button>
                      ))}
                    </div>
                  )}

                  {buscaHomeQ && (
                    <div className="dash-busca-resultados">
                      {resultadosBuscaHome.length === 0 ? (
                        <p className="canal-caption" style={{ margin: "10px 0 0" }}>
                          Nada encontrado com essas palavras. Que tal <button type="button" className="dash-busca-link" onClick={() => goto("biblioteca", true)}>explorar todas as Ações Comerciais</button>?
                        </p>
                      ) : (
                        resultadosBuscaHome.map((a) => (
                          <button key={a.id} className="dash-busca-item" onClick={() => setOpenId(a.id)}>
                            <span className="dash-busca-item-nome">{a.nome}</span>
                            <span className="dash-busca-item-tipo">{a.tipo}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                <div className="dash-grid">
                  <div className="dash-cell-progresso">
                    <div className="dash-progresso-hero">
                      <div className="dash-progresso-header">
                        <span className="dash-progresso-titulo">Seu progresso</span>
                        <span className="dash-progresso-pct-badge">{pctMes}%</span>
                      </div>
                      <div className="dash-progresso-stats">
                        <div className="dash-progresso-stat">
                          <div className="dash-progresso-stat-icon"><Target size={14} /></div>
                          <span className="dash-progresso-stat-label">Meta acumulada</span>
                          <span className="dash-progresso-stat-valor">{formatBRL(metaTotalMes)}</span>
                        </div>
                        <div className="dash-progresso-stat">
                          <div className="dash-progresso-stat-icon"><DollarSign size={14} /></div>
                          <span className="dash-progresso-stat-label">Resultado gerado</span>
                          <span className="dash-progresso-stat-valor dash-progresso-destaque">{formatBRL(totalMes)}</span>
                        </div>
                        <div className="dash-progresso-stat">
                          <div className="dash-progresso-stat-icon"><TrendingUp size={14} /></div>
                          <span className="dash-progresso-stat-label">Percentual atingido</span>
                          <span className="dash-progresso-stat-valor">{pctMes}%</span>
                        </div>
                        <div className="dash-progresso-stat">
                          <div className="dash-progresso-stat-icon"><Check size={14} /></div>
                          <span className="dash-progresso-stat-label">Ações executadas</span>
                          <span className="dash-progresso-stat-valor">{historicoMes.length}</span>
                        </div>
                      </div>
                      <div className="dash-progresso-barra-track">
                        <div className="dash-progresso-barra-fill" style={{ width: `${Math.min(pctMes, 100)}%` }} />
                      </div>
                      <p className="dash-progresso-falta">
                        {metaTotalMes === 0
                          ? "Encontre uma ação na busca acima pra começar a acompanhar sua meta acumulada."
                          : totalMes >= metaTotalMes
                          ? "Meta acumulada batida! 🎉"
                          : `Faltam apenas ${formatBRL(metaTotalMes - totalMes)} para atingir sua meta acumulada.`}
                      </p>
                    </div>
                  </div>

                  <div className="dash-cell-oportunidade">
                    {(() => {
                      const hoje = new Date();
                      const prox = proximasOportunidades(hoje, perfil?.estado, perfil?.cidade, 1)[0];
                      if (!prox || prox.dias > 30) return (
                        <div className="dash-oportunidade-vazia">
                          <span className="dash-oportunidade-eyebrow">🔥 Oportunidade da semana</span>
                          <p className="dash-oportunidade-dica" style={{ marginTop: 6 }}>Nada nos próximos 30 dias pra sua região. Volte aqui em breve.</p>
                        </div>
                      );
                      return (
                        <div className="dash-oportunidade-card">
                          <div className="dash-oportunidade-badge">
                            <span className="dash-oportunidade-dias">{prox.dias}</span>
                            <span className="dash-oportunidade-dias-label">{prox.dias === 1 ? "dia" : "dias"}</span>
                          </div>
                          <div className="dash-oportunidade-corpo">
                            <span className="dash-oportunidade-eyebrow">🔥 Oportunidade da semana</span>
                            <p className="dash-oportunidade-texto">📅 <b>{prox.op.titulo}</b></p>
                            <p className="dash-oportunidade-dica">{prox.dias === 0 ? "É hoje!" : prox.dias === 1 ? "Falta 1 dia." : `Faltam ${prox.dias} dias.`} Quem se antecipa costuma vender mais.</p>
                            <div className="dash-oportunidade-botoes">
                              <button type="button" className="btn-primary" style={{ marginBottom: 0 }} onClick={() => goto("radar")}>Ver oportunidade</button>
                              <button type="button" className="btn-ghost-box" style={{ marginBottom: 0 }} onClick={() => verAcoesDoRadar(prox.op.palavrasChave)}>Ver ações comerciais</button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className="dash-cell-datasiguais">
                    {(() => {
                      const hoje = new Date();
                      const hojeSemHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
                      const prox = OPORTUNIDADES.filter((op) => op.id.startsWith("data-")).map((op) => {
                        let data = getDataOportunidade(op, hoje.getFullYear());
                        if (data < hojeSemHora) data = getDataOportunidade(op, hoje.getFullYear() + 1);
                        return { ...op, data, dias: Math.round((data - hojeSemHora) / 86400000) };
                      }).sort((a, b) => a.dias - b.dias)[0];
                      if (!prox) return null;
                      return (
                        <div className="dash-datasiguais-card">
                          <div className="dash-datasiguais-header">
                            <span className="dash-datasiguais-eyebrow">🔢 Data de números iguais</span>
                            <span className="dash-datasiguais-contagem">
                              {prox.dias === 0 ? "É hoje!" : prox.dias === 1 ? "Falta 1 dia" : `Faltam ${prox.dias} dias`}
                            </span>
                          </div>
                          <p className="dash-datasiguais-titulo">{prox.titulo}</p>
                          <ul className="dash-datasiguais-lista">
                            {prox.comoAproveitar.slice(0, 4).map((c, i) => <li key={i}>{c}</li>)}
                          </ul>
                        </div>
                      );
                    })()}
                  </div>

                  {meuDiagnostico && (
                    <div className="dash-cell-diagnostico">
                      <div className="dash-diag-card dash-diag-card-discreta">
                        <div className="dash-diag-discreta-top">
                          <div className="diag-mini-indice diag-mini-indice-sm">
                            <span className="indice-num" style={{ fontSize: 22 }}>{meuDiagnostico.indice}</span>
                            <span className="indice-max" style={{ fontSize: 10 }}>/100</span>
                          </div>
                          <div>
                            <span className="resumo-label" style={{ display: "block" }}>Diagnóstico da Loja</span>
                            <span className="diag-mini-faixa">{meuDiagnostico.faixa_indice}</span>
                          </div>
                        </div>
                        <button type="button" className="btn-ghost-box" style={{ marginTop: 10, marginBottom: showDiagCompleto ? 12 : 0 }} onClick={() => setShowDiagCompleto((s) => !s)}>
                          {showDiagCompleto ? "Ocultar" : "Ver diagnóstico completo"}
                        </button>
                        {showDiagCompleto && (
                          <div className="pilares-wrap">
                            {meuDiagnostico.qualificado && <p className="diag-mini-linha" style={{ marginBottom: 8 }}>⭐ Qualificada pra Sessão Estratégica</p>}
                            <p className="acc-plain-text">{faixaGeral(meuDiagnostico.indice).texto}</p>
                            {normalizarAlertas(meuDiagnostico.alertas).length > 0 && (
                              <div style={{ marginTop: 10 }}>
                                {normalizarAlertas(meuDiagnostico.alertas).map((texto, i) => (
                                  <Callout key={i} icon={AlertTriangle} title="Atenção" tone="outline">{texto}</Callout>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="dash-cell-acoes">
                    <div className="dash-col-title">Ações em andamento</div>
                    {metasDoMes.length === 0 ? (
                      <div className="empty-state small">
                        <BarChart3 size={24} />
                        <p>Nenhuma ação em andamento em {nomeMesAno} ainda. Registre a ação que vai executar acima pra acompanhar aqui.</p>
                      </div>
                    ) : (
                      <>
                        <div className="dash-acoes-grid">
                          {metasDoMes.slice(0, 4).map((m) => (
                            <button className="dash-acao-card dash-acao-card-compacta" key={m.id} onClick={() => setOpenId(m.acaoId)}>
                              <div className="dash-acao-top">
                                <span className="dash-acao-nome">{m.nome}</span>
                                <span className={`dash-status ${m.status === "Concluída" ? "concluida" : "andamento"}`}>{m.status}</span>
                              </div>
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
                  </div>
                </div>
              </div>
            ) : tab === "biblioteca" ? (
              <div className="screen">
                <div className="topbar">
                  {!bibShowMenu && (
                    <button className="iconbtn" onClick={clearBibFilters}><ArrowLeft size={20} /></button>
                  )}
                  <span className="topbar-title">{bibShowMenu ? "Ações Comerciais" : "Resultados"}</span>
                  <span style={{ width: 20 }} />
                </div>

                {bibShowMenu && (
                  <div className="bib-video-wrap">
                    <div className="bib-video-embed">
                      <iframe
                        src="https://www.youtube.com/embed/kUry5SeSTYc"
                        title="Como usar a Biblioteca de Ações Comerciais"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
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
                          <TagCard key={a.id} action={a} isFav={favs.has(a.id)} onToggleFav={toggleFav} onOpen={(id) => setOpenId(id)} />
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            ) : tab === "calendario-anual" ? (
              <CalendarioAnualScreen onVerAcoes={verAcoesDoRadar} />
            ) : tab === "aprenda-e-aplique" ? (
              <AprendaEApliqueScreen />
            ) : tab === "radar" ? (
              <RadarOportunidades
                perfil={perfil}
                onSalvarLocalizacao={salvarLocalizacaoRadar}
                favoritos={radarFavoritos}
                onToggleFavorito={toggleFavoritoOportunidade}
                onDefinirLembrete={definirLembreteOportunidade}
                onVerAcoes={verAcoesDoRadar}
                viewInicial={radarViewPadrao}
              />
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
                              {d.qualificado && <span className="canal-pill sm">⭐ Qualificada pra Sessão Estratégica</span>}
                            </div>
                            {normalizarAlertas(d.alertas).length > 0 && (
                              <div style={{ marginBottom: 10 }}>
                                {normalizarAlertas(d.alertas).map((texto, i) => (
                                  <p key={i} className="canal-caption" style={{ margin: "2px 0" }}>⚠ {texto}</p>
                                ))}
                              </div>
                            )}

                            <Accordion title="Ver todas as respostas">
                              <div className="admin-respostas">
                                {DIAG_PERGUNTAS.map((q) => (
                                  <div className="admin-resposta-item" key={q.id}>
                                    <span className="admin-resposta-pergunta">{q.texto}</span>
                                    <span className="admin-resposta-valor">
                                      {q.multipla ? (d.respostas?.[q.id]?.selecionadas || []).join(", ") || "—" : d.respostas?.[q.id]?.l || "—"}
                                    </span>
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

          {!openAction && !showSimulador && (
            <div className="tabbar">
              {navItems.map((n) => (
                <button
                  key={n.id}
                  className={`tabbtn ${(n.id === "simulador" ? showSimulador : n.id === "datas-iguais" ? (tab === "radar" && radarViewPadrao === "datas-iguais" && !showSimulador) : tab === n.id && !showSimulador) ? "active" : ""}`}
                  onClick={() => {
                    if (n.id === "simulador") { setOpenId(null); setShowSimulador(true); }
                    else if (n.id === "datas-iguais") { setShowSimulador(false); setRadarViewPadrao("datas-iguais"); goto("radar", true); }
                    else { setShowSimulador(false); if (n.id === "radar") setRadarViewPadrao("lista"); goto(n.id, true); }
                  }}
                >
                  <n.icon size={21} /><span>{n.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
