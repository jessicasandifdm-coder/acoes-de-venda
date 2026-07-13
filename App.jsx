import { useState, useEffect } from "react";
import {
  Search, Heart, Clock, Home, BookOpen, ArrowLeft, RefreshCw, Gift,
  Wallet, Truck, Package, TrendingDown, Users, CreditCard, Zap,
  Star, Target, Sparkles, Check, ChevronRight, X, Store, Crown,
  Megaphone, UserMinus, UserPlus, Globe, Radio, LogOut, Mail, KeyRound,
  Lightbulb, AlertTriangle, TrendingUp, DollarSign, BarChart3,
  ChevronLeft, Plus, Shield
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const CATS = [
  { id: "giro", label: "Giro de estoque", icon: RefreshCw },
  { id: "brindes", label: "Brindes", icon: Gift },
  { id: "cashback", label: "Cashback", icon: Wallet },
  { id: "frete", label: "Frete", icon: Truck },
  { id: "combos", label: "Combos", icon: Package },
  { id: "progressivo", label: "Desconto progressivo", icon: TrendingDown },
  { id: "indicacao", label: "Indicação", icon: Users },
  { id: "pagamento", label: "Condições de pagamento", icon: CreditCard },
  { id: "urgencia", label: "Urgência", icon: Zap },
  { id: "relacionamento", label: "Relacionamento", icon: Heart },
  { id: "exclusiva", label: "Campanhas exclusivas", icon: Star },
  { id: "engajamento", label: "Engajamento", icon: Target },
  { id: "emocional", label: "Emocional", icon: Sparkles },
];

const CANAIS = [
  { label: "Stories", icon: Radio },
  { label: "Loja física", icon: Store },
  { label: "Grupo VIP", icon: Crown },
  { label: "Grupo de promoção", icon: Megaphone },
  { label: "Com clientes", icon: Users },
  { label: "Clientes inativos", icon: UserMinus },
  { label: "Clientes que ainda não compraram", icon: UserPlus },
  { label: "Site", icon: Globe },
];

const NICHOS = [
  "Geral", "Moda Feminina", "Moda Masculina", "Moda Fitness", "Acessórios",
  "Cosméticos / Skincare", "Chimarrão", "Moda Evangélica", "Moda Plus Size", "Infantil",
];

const CHART_CORES = ["#163B2E", "#2F5C46", "#4E7A5E", "#B68A2E", "#8FA88F", "#D9C48A", "#0E2A20"];
const MESES_ABREV = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const formatBRL = (v) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

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

const ROTEIRO_GRUPO = [
  "2 dias antes: avisar dentro do Grupo VIP que a ação vai acontecer, sem entregar todos os detalhes ainda",
  "1 hora antes de abrir: aquecer o grupo mostrando bastidor ou preparação, para criar expectativa",
  "No horário definido: abrir a ação direto no grupo e vender por lá",
];

const ROTEIRO_ABERTO = [
  "1 a 2 dias antes: gravar um Reels curto anunciando o dia da ação",
  "Na véspera, à noite: lembrete nos Stories para acompanhar no dia seguinte",
  "Na véspera: avisar a base de clientes no privado (WhatsApp) sobre o que vai acontecer",
  "Na véspera: avisar o Grupo VIP para acompanhar os Stories, dando a eles a sensação de acesso antecipado",
  "No dia: divulgar ao vivo nos canais definidos e vender",
];

function getRoteiros(action) {
  const canais = action.canais || [];
  const temGrupoExclusivo = canais.includes("Grupo VIP");
  const temAberto = canais.some((c) => ["Stories", "Loja física", "Grupo de promoção"].includes(c));
  const roteiros = [];
  if (temAberto) roteiros.push({ titulo: "Se for aberta (Stories ou loja física)", passos: ROTEIRO_ABERTO });
  if (temGrupoExclusivo) roteiros.push({ titulo: "Se for só para o Grupo VIP", passos: ROTEIRO_GRUPO });
  return roteiros;
}

const ACTIONS = [
  {
    id: "cabide-livre", nome: "Operação Cabide Livre", cat: "giro", nichos: ["Moda Feminina", "Moda Masculina"], tipo: "Giro de peças",
    como: "Seleção de peças com preço especial para liberar estoque parado.", duracao: "Semana",
    canais: ["Loja física", "Stories", "Com clientes"],
    objetivo: "Reduzir estoque parado e abrir espaço de caixa para repor com peças novas.",
    quandoUsar: "Quando existem peças de coleções passadas ocupando espaço há mais de 60 dias.",
    quandoEvitar: "Perto do lançamento de uma coleção nova — mistura a comunicação.",
    passos: [
      "Separar as peças com giro baixo há mais de 60 dias",
      "Definir a tabela de desconto por peça ou grupo",
      "Criar identificação visual na loja (etiqueta ou plaquinha)",
      "Anunciar nos Stories informando quantidade disponível",
      "Atualizar o estoque restante todos os dias",
    ],
    checklist: ["Lista de peças definida", "Preços calculados", "Etiquetas prontas", "Stories agendados"],
    dicas: "Mostrar a quantidade restante gera escassez real — sem precisar forçar a régua.",
    erros: "Misturar peça de coleção nova dentro da ação. Isso quebra a credibilidade da campanha.",
    resultado: "Estoque parado reduzido e caixa liberado para reposição.",
    relacionadas: ["limpa-arara", "estoque-zero"],
  },
  {
    id: "limpa-arara", nome: "Limpa-Arara", cat: "giro", nichos: ["Moda Feminina", "Moda Masculina"], tipo: "Liquidação estratégica",
    como: "Peças selecionadas com desconto direto.", duracao: "Semana",
    canais: ["Loja física", "Stories", "Com clientes"],
    objetivo: "Girar peças específicas sem precisar declarar liquidação geral da loja.",
    quandoUsar: "Quando um grupo específico de produtos está parado (uma cor, um modelo, um tecido).",
    quandoEvitar: "Quando a loja acabou de subir preço — pode gerar comparação indesejada.",
    passos: [
      "Escolher o recorte de produto (cor, modelo ou tecido)",
      "Definir desconto único para o grupo",
      "Fotografar as peças já com o preço aplicado",
      "Divulgar como 'seleção da vez', não como liquidação geral",
    ],
    checklist: ["Recorte de produto definido", "Fotos feitas", "Preço aplicado no sistema"],
    dicas: "Nomear a seleção ajuda a cliente entender que é por tempo limitado, não uma queda de preço permanente.",
    erros: "Aplicar o desconto na loja toda sem querer — isso desvaloriza o preço cheio.",
    resultado: "Giro do grupo parado sem impactar a percepção de valor da coleção atual.",
    relacionadas: ["cabide-livre", "estoque-zero"],
  },
  {
    id: "estoque-zero", nome: "Missão Estoque Zero", cat: "giro", nichos: ["Moda Feminina", "Moda Masculina"], tipo: "Queima de coleção",
    como: "Últimas unidades com condição especial.", duracao: "Curta ou semanal",
    canais: ["Stories", "Loja física"],
    objetivo: "Esgotar unidades finais antes da chegada de uma nova coleção.",
    quandoUsar: "Quando restam poucas peças de um modelo ou tamanho.",
    quandoEvitar: "Quando o estoque restante ainda é grande — perde o senso de urgência real.",
    passos: [
      "Levantar peças com estoque unitário ou quase esgotado",
      "Definir condição especial (preço ou brinde)",
      "Comunicar como 'últimas unidades' com contagem visível",
    ],
    checklist: ["Peças levantadas", "Condição definida", "Contagem visível no post"],
    dicas: "Contagem regressiva de peças funciona melhor que contagem de dias nessa ação.",
    erros: "Anunciar 'últimas peças' quando na verdade o estoque é grande — perde credibilidade nas próximas ações.",
    resultado: "Estoque zerado do modelo e espaço físico liberado na loja.",
    relacionadas: ["cabide-livre", "limpa-arara"],
  },
  {
    id: "comprou-ganhou", nome: "Comprou, Ganhou", cat: "brindes", nichos: ["Geral"], tipo: "Brinde direto",
    como: "Qualquer compra no período recebe um presente.", duracao: "Dia ou semana",
    canais: ["Loja física", "Stories", "Com clientes"],
    objetivo: "Aumentar o volume de compras em um período específico.",
    quandoUsar: "Em dias de movimento historicamente mais fraco.",
    quandoEvitar: "Quando o brinde tem custo alto e a margem da peça já é apertada.",
    passos: [
      "Escolher o brinde e calcular o custo por unidade",
      "Definir o período de validade da ação",
      "Comunicar de forma simples: qualquer compra já garante o brinde",
      "Entregar o brinde já embalado, sem precisar perguntar",
    ],
    checklist: ["Brinde separado", "Custo calculado", "Equipe orientada"],
    dicas: "Brinde embalado e entregue sem a cliente pedir aumenta a percepção de cuidado.",
    erros: "Ficar sem brinde no meio da ação — quebra a expectativa criada.",
    resultado: "Aumento do número de compras no período da ação.",
    relacionadas: ["escalada-mimos", "combo-presenteado"],
  },
  {
    id: "escalada-mimos", nome: "Escalada de Mimos", cat: "brindes", nichos: ["Geral"], tipo: "Brinde progressivo",
    como: "Quanto maior a compra, maior o brinde.", duracao: "Semana",
    canais: ["Loja física", "Stories"],
    objetivo: "Aumentar o ticket médio incentivando a cliente a levar mais uma peça.",
    quandoUsar: "Quando o objetivo principal é ticket médio, não volume de clientes.",
    quandoEvitar: "Em dias de muito movimento — a régua de brindes pode confundir o caixa.",
    passos: [
      "Definir 2 ou 3 faixas de valor",
      "Definir o brinde de cada faixa",
      "Treinar a equipe para oferecer a próxima faixa na hora do fechamento",
    ],
    checklist: ["Faixas definidas", "Brindes separados por faixa", "Equipe treinada"],
    dicas: "A equipe oferecer a próxima faixa no caixa é o que realmente move o ticket médio.",
    erros: "Não avisar a equipe da loja sobre as faixas — a ação vira só um post bonito, sem efeito na venda.",
    resultado: "Ticket médio mais alto no período da campanha.",
    relacionadas: ["comprou-ganhou", "combo-presenteado"],
  },
  {
    id: "cashback-volta", nome: "Compre Agora, Ganhe Depois", cat: "cashback", nichos: ["Geral"], tipo: "Cashback",
    como: "Parte do valor pago volta como crédito para a próxima compra.", duracao: "Semana",
    canais: ["Stories", "Com clientes", "Clientes inativos"],
    objetivo: "Gerar retorno da cliente para uma segunda compra em prazo curto.",
    quandoUsar: "Quando o objetivo é reativar a base de clientes nas semanas seguintes.",
    quandoEvitar: "Sem um prazo de validade claro — o crédito se perde no esquecimento.",
    passos: [
      "Definir o percentual de cashback",
      "Definir prazo de validade do crédito (curto, de preferência)",
      "Registrar o crédito no sistema ou em caderno de controle",
      "Avisar a cliente por WhatsApp perto do prazo vencer",
    ],
    checklist: ["Percentual definido", "Prazo definido", "Forma de controle definida"],
    dicas: "O lembrete perto do vencimento é o que garante o retorno — sem ele, o crédito não é resgatado.",
    erros: "Não ter controle de quem tem crédito a resgatar, perdendo a segunda venda.",
    resultado: "Retorno de compra programado dentro do prazo definido.",
    relacionadas: ["cashback-emocional"],
  },
  {
    id: "frete-conta", nome: "Frete por Nossa Conta", cat: "frete", nichos: ["Geral"], tipo: "Frete grátis",
    como: "Envio gratuito para todo o site ou acima de valor mínimo.", duracao: "Dia ou semana",
    canais: ["Site", "Stories"],
    objetivo: "Reduzir a objeção do frete e aumentar a conversão online.",
    quandoUsar: "Quando o carrinho abandonado tem o frete como motivo frequente.",
    quandoEvitar: "Sem calcular o impacto do frete na margem — pode reduzir o lucro sem controle.",
    passos: [
      "Definir valor mínimo de compra, se houver",
      "Calcular o impacto do frete gratuito na margem",
      "Comunicar o prazo da condição de forma clara",
    ],
    checklist: ["Valor mínimo definido", "Margem calculada", "Prazo comunicado"],
    dicas: "Testar primeiro por poucos dias antes de tornar a condição permanente.",
    erros: "Deixar a condição no ar por tempo indefinido, sem previsão de quando encerra.",
    resultado: "Aumento de conversão no site durante o período.",
    relacionadas: ["frete-r1", "frete-fixo"],
  },
  {
    id: "frete-r1", nome: "O Dia em que o Frete Enlouqueceu", cat: "urgencia", nichos: ["Geral"], tipo: "Frete ultra reduzido",
    como: "Frete por valor simbólico, como R$1.", duracao: "24h a 3 dias",
    canais: ["Site", "Stories", "Grupo de promoção"],
    objetivo: "Gerar alto volume de pedidos em uma janela curta de tempo.",
    quandoUsar: "Em datas de baixo movimento, como forma de criar um pico pontual de vendas.",
    quandoEvitar: "Sem estrutura de expedição preparada para o pico — gera atraso e reclamação.",
    passos: [
      "Confirmar capacidade de expedição para o volume esperado",
      "Definir a janela exata de horário",
      "Criar contagem regressiva nos Stories",
      "Reforçar a comunicação horas antes de abrir",
    ],
    checklist: ["Expedição confirmada", "Janela definida", "Contagem criada"],
    dicas: "Contagem regressiva nas horas antes da abertura aumenta a expectativa e o volume no horário certo.",
    erros: "Abrir a condição sem avisar antes — perde o efeito de expectativa que gera o pico.",
    resultado: "Pico concentrado de pedidos na janela definida.",
    relacionadas: ["frete-conta", "frete-fixo"],
  },
  {
    id: "leve-mais", nome: "Leve Mais, Pague Menos", cat: "combos", nichos: ["Moda Feminina", "Moda Masculina"], tipo: "Combo com desconto",
    como: "Vantagem progressiva para quem leva mais de um item.", duracao: "Semana",
    canais: ["Loja física", "Stories"],
    objetivo: "Aumentar a quantidade de peças por venda.",
    quandoUsar: "Quando a loja tem peças complementares fáceis de combinar (blusa + calça, por exemplo).",
    quandoEvitar: "Quando o mix de produtos não tem peças complementares claras.",
    passos: [
      "Definir as combinações de produto sugeridas",
      "Definir a vantagem por quantidade",
      "Montar looks de vitrine e provador já combinados",
    ],
    checklist: ["Combinações definidas", "Vantagem calculada", "Vitrine montada"],
    dicas: "Montar o look pronto no provador facilita a decisão da cliente na hora.",
    erros: "Deixar a régua de desconto complexa demais para a equipe explicar no caixa.",
    resultado: "Aumento do número de peças por venda.",
    relacionadas: ["dupla-perfeita", "combo-premiado"],
  },
  {
    id: "carrinho-inteligente", nome: "Carrinho Inteligente", cat: "progressivo", nichos: ["Geral"], tipo: "Progressivo por quantidade",
    como: "Quanto mais itens no carrinho, maior o desconto.", duracao: "Semana",
    canais: ["Site", "Stories"],
    objetivo: "Incentivar a cliente a adicionar mais um item antes de fechar a compra.",
    quandoUsar: "Quando o objetivo é ticket médio no site, sem depender de brinde físico.",
    quandoEvitar: "Sem deixar a régua visível no carrinho — a cliente precisa ver o quanto falta para o próximo desconto.",
    passos: [
      "Definir as faixas de quantidade e desconto",
      "Deixar a régua visível no site ou no story fixado",
      "Reforçar a comunicação perto do fechamento do carrinho",
    ],
    checklist: ["Faixas definidas", "Régua visível", "Comunicação de reforço pronta"],
    dicas: "Mostrar 'faltam X para o próximo desconto' converte mais do que só anunciar a régua uma vez.",
    erros: "Anunciar a régua só no post e não deixar visível na hora da decisão de compra.",
    resultado: "Ticket médio maior no site durante o período.",
    relacionadas: ["desconto-cresce"],
  },
  {
    id: "amiga-indica", nome: "Amiga Indica, Amiga Ganha", cat: "indicacao", nichos: ["Geral"], tipo: "Indicação",
    como: "Quem indica e quem compra recebem benefício.", duracao: "Semana",
    canais: ["Com clientes", "Clientes que ainda não compraram"],
    objetivo: "Captar clientes novas a partir da base atual.",
    quandoUsar: "Quando a base de clientes fiéis já é sólida, mas a captação de novas está parada.",
    quandoEvitar: "Sem uma forma simples de rastrear quem indicou — a ação perde controle.",
    passos: [
      "Definir o benefício para quem indica e para quem compra",
      "Criar uma forma simples de identificar a indicação (código ou nome)",
      "Comunicar para a base mais fiel primeiro, antes do público geral",
    ],
    checklist: ["Benefício definido", "Forma de rastreio definida", "Base fiel avisada primeiro"],
    dicas: "Avisar as clientes mais fiéis antes do post geral aumenta a adesão inicial.",
    erros: "Não ter controle de quem indicou — a promessa de benefício vira motivo de atrito.",
    resultado: "Novas clientes captadas com custo baixo de aquisição.",
    relacionadas: ["clube-bem-indicadas"],
  },
  {
    id: "parcelamento-vip", nome: "Parcelamento Estendido VIP", cat: "pagamento", nichos: ["Moda Feminina", "Moda Masculina"], tipo: "Parcelamento maior",
    como: "Mais parcelas sem juros ou condição especial de pagamento.", duracao: "Semana",
    canais: ["Loja física", "Site", "Stories"],
    objetivo: "Facilitar a decisão de compra em peças de ticket mais alto.",
    quandoUsar: "Para peças de maior valor, como casacos ou peças de coleção especial.",
    quandoEvitar: "Sem calcular o custo da taxa de parcelamento na operação.",
    passos: [
      "Calcular o custo do parcelamento estendido",
      "Definir para quais peças a condição vale",
      "Comunicar a condição junto com a peça, não separado",
    ],
    checklist: ["Custo calculado", "Peças elegíveis definidas", "Comunicação alinhada com a equipe"],
    dicas: "Comunicar a condição junto da peça específica converte mais do que um anúncio genérico de parcelamento.",
    erros: "Aplicar em toda a loja sem medir o impacto da taxa na margem.",
    resultado: "Aumento de conversão em peças de ticket mais alto.",
    relacionadas: ["sem-peso-bolso"],
  },
  {
    id: "oferta-relampago", nome: "Oferta Relâmpago da Semana", cat: "urgencia", nichos: ["Geral"], tipo: "Promoção curta",
    como: "Condição especial válida por poucos dias.", duracao: "1 a 3 dias",
    canais: ["Stories", "Grupo de promoção"],
    objetivo: "Criar um pico de vendas pontual sem precisar de motivo sazonal.",
    quandoUsar: "Em semanas sem data comercial relevante, para manter o movimento.",
    quandoEvitar: "Com frequência alta demais — a urgência perde efeito se virar rotina.",
    passos: [
      "Escolher o recorte de produto ou benefício da semana",
      "Definir o prazo exato de início e fim",
      "Anunciar com contagem regressiva visível",
    ],
    checklist: ["Recorte definido", "Prazo definido", "Contagem criada"],
    dicas: "Usar essa ação no máximo a cada 3 ou 4 semanas mantém o senso real de urgência.",
    erros: "Repetir 'oferta relâmpago' toda semana — a cliente para de acreditar no prazo.",
    resultado: "Pico de vendas concentrado no prazo definido.",
    relacionadas: ["frete-r1", "sete-dias"],
  },
  {
    id: "cliente-especial", nome: "Semana da Cliente Especial", cat: "relacionamento", nichos: ["Geral"], tipo: "Benefícios gerais",
    como: "Vantagens e mimos exclusivos durante a semana.", duracao: "Semana",
    canais: ["Loja física", "Stories", "Grupo VIP"],
    objetivo: "Fortalecer o relacionamento com a base de clientes recorrentes.",
    quandoUsar: "Após um período de vendas mais operacional, para reforçar vínculo com a base.",
    quandoEvitar: "Sem uma lista clara de quem é a 'cliente especial' — a ação fica genérica demais.",
    passos: [
      "Definir critério de quem é a cliente especial (recorrência, ticket, tempo de casa)",
      "Definir os mimos e vantagens da semana",
      "Comunicar de forma pessoal, se possível por WhatsApp",
    ],
    checklist: ["Critério definido", "Mimos definidos", "Mensagens pessoais preparadas"],
    dicas: "Mensagem pessoal no WhatsApp para a base recorrente tem efeito maior que post público.",
    erros: "Tratar a ação como genérica para qualquer cliente, perdendo o efeito de exclusividade.",
    resultado: "Base recorrente mais engajada e propensa a voltar.",
    relacionadas: ["clube-secreto", "meta-batida"],
  },
  {
    id: "clube-secreto", nome: "Clube Secreto — Portas Abertas", cat: "exclusiva", nichos: ["Geral"], tipo: "Campanha para grupo de WhatsApp",
    como: "Acesso a ofertas exclusivas dentro de um grupo fechado.", duracao: "Semana",
    canais: ["Grupo VIP"],
    objetivo: "Construir uma base de relacionamento direto e recorrente fora do Instagram.",
    quandoUsar: "Quando a loja quer reduzir a dependência do alcance do Instagram para vender.",
    quandoEvitar: "Sem rotina definida de conteúdo para o grupo — ele esvazia rápido.",
    passos: [
      "Criar o grupo e definir a proposta de exclusividade",
      "Convidar as clientes mais engajadas primeiro",
      "Definir a rotina mínima de conteúdo (ofertas, prévias, novidades)",
    ],
    checklist: ["Grupo criado", "Convites feitos", "Rotina de conteúdo definida"],
    dicas: "Prévias de peças antes do lançamento oficial são o que mais engaja um grupo fechado.",
    erros: "Abrir o grupo e deixar sem conteúdo por semanas — a cliente silencia e depois sai.",
    resultado: "Canal direto de vendas com menos dependência do algoritmo.",
    relacionadas: ["cliente-especial"],
  },
  {
    id: "meta-batida", nome: "Meta Batida — Você Ganha", cat: "engajamento", nichos: ["Geral"], tipo: "Benefício desbloqueado",
    como: "Ao atingir uma meta de vendas do dia ou da semana, as clientes recebem um bônus.", duracao: "Curta ou semanal",
    canais: ["Stories", "Grupo de promoção"],
    objetivo: "Engajar a base em torno de uma meta coletiva, gerando movimento e compartilhamento.",
    quandoUsar: "Quando a loja quer criar um efeito de comunidade em torno das vendas.",
    quandoEvitar: "Com meta pouco realista — a falta de conquista gera frustração em vez de engajamento.",
    passos: [
      "Definir a meta de forma realista com base no histórico da loja",
      "Definir o bônus para quando a meta for batida",
      "Mostrar o progresso da meta nos Stories em tempo real",
    ],
    checklist: ["Meta definida", "Bônus definido", "Atualização de progresso planejada"],
    dicas: "Mostrar o progresso ao vivo nos Stories é o que gera o efeito de torcida coletiva.",
    erros: "Não atualizar o progresso — a cliente perde o interesse em acompanhar.",
    resultado: "Pico de movimento e senso de comunidade em torno da loja.",
    relacionadas: ["cliente-especial"],
  },
  {
    id: "merecimento", nome: "Semana do Merecimento", cat: "emocional", nichos: ["Geral"], tipo: "Campanha emocional",
    como: "Condições especiais para a cliente se presentear.", duracao: "Semana",
    canais: ["Stories", "Com clientes"],
    objetivo: "Ativar a compra por motivação pessoal, sem depender de data comercial ou desconto agressivo.",
    quandoUsar: "Em semanas sem apelo comercial natural, quando a comunicação emocional pode carregar a campanha.",
    quandoEvitar: "Sem conteúdo de conexão antes da oferta — a mensagem soa vazia sem contexto.",
    passos: [
      "Construir conteúdo de conexão antes de anunciar a condição",
      "Definir a condição especial da semana",
      "Comunicar com linguagem de autocuidado e merecimento, não de desconto",
    ],
    checklist: ["Conteúdo de conexão publicado", "Condição definida", "Linguagem revisada"],
    dicas: "Essa ação funciona melhor quando vem depois de conteúdo que já construiu conexão com a audiência.",
    erros: "Anunciar a condição sem preparar o terreno emocional antes — vira só mais uma promoção.",
    resultado: "Ativação de compra por motivação pessoal, com percepção de marca mais forte.",
    relacionadas: ["cliente-especial"],
  },
  {
    id: "clube-presente", nome: "Clube Presente — Aniversário Infantil", cat: "indicacao", nichos: ["Infantil"],
    tipo: "Lista de presentes com benefício", como: "A mãe monta uma lista de aniversário do filho na loja e compartilha com a família; a loja controla o que já foi comprado e dá benefício pelo volume vendido.",
    duracao: "Contínua, mês a mês por aniversariante",
    canais: ["Com clientes", "Stories", "Clientes que ainda não compraram"],
    objetivo: "Transformar o aniversário do filho em canal de vendas para toda a rede de familiares e amigos da cliente.",
    quandoUsar: "Para clientes com filhos pequenos que já compram na loja e têm aniversário se aproximando.",
    quandoEvitar: "Sem um controle claro de quem já comprou cada item — gera presente repetido e reclamação.",
    passos: [
      "Perguntar no caixa ou WhatsApp o mês de aniversário dos filhos das clientes",
      "Convidar a cliente para montar a lista com produtos, fotos, código e valores (Canva ou PDF simples)",
      "Enviar o link do catálogo para a mãe compartilhar com família e amigos",
      "Controlar as reservas para não repetir presente",
      "Aplicar o benefício (cashback ou presente surpresa) conforme o valor total vendido",
    ],
    checklist: ["Mês de aniversário cadastrado", "Catálogo montado", "Benefício definido (cashback ou brinde)", "Controle de reservas ativo"],
    dicas: "Avisar a base com um mês de antecedência do aniversário aumenta a adesão — de última hora reduz o tempo de divulgação da lista.",
    erros: "Não controlar quem já comprou cada item da lista, gerando presente repetido e cliente insatisfeita.",
    resultado: "Vendas para pessoas que nunca compraram na loja, ticket médio maior e relacionamento mais forte com a base de mães.",
    relacionadas: ["amiga-indica"],
  },
  {
    id: "story-batalha", nome: "Story Interativo — Batalha de Estilos", cat: "engajamento", nichos: ["Geral"],
    tipo: "Enquete de 4 opções", como: "Enquete com 4 fotos (looks, produtos ou modelos) perguntando qual a cliente prefere; quem vota entra numa lista para abordagem personalizada no Direct.",
    duracao: "1 dia (sequência de 3 stories)",
    canais: ["Stories"],
    objetivo: "Gerar interação em massa nos Stories e abrir conversas individuais no Direct com quem já demonstrou preferência.",
    quandoUsar: "Quando o objetivo é aumentar o alcance dos Stories e gerar oportunidades de venda consultiva no Direct.",
    quandoEvitar: "Sem preparar antes a mensagem de abordagem para cada opção — a enquete vira só engajamento vazio, sem venda.",
    passos: [
      "Story 1: preparar a audiência pedindo para não pular o próximo story",
      "Story 2: montar a enquete com 4 fotos (looks, produtos ou modelos do nicho)",
      "Aguardar os votos e separar os contatos por opção escolhida",
      "Enviar mensagem personalizada no Direct para cada grupo de voto, com uma vantagem exclusiva",
      "Story 3: fechar o dia mostrando o resultado (prints de conversa ou sacolas fechadas)",
    ],
    checklist: ["4 fotos escolhidas", "Pergunta da enquete definida", "Mensagens de Direct por opção escritas antes de postar"],
    dicas: "O que gera venda não é a enquete em si, é a mensagem individual enviada depois para quem votou.",
    erros: "Postar a enquete sem ter as mensagens de resposta prontas — a interação esfria antes da lojista conseguir responder todo mundo.",
    resultado: "Mais alcance nos Stories e conversas abertas no Direct com intenção de compra.",
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
    tipo: "Jogo de emojis ou números", como: "A cliente escolhe uma entre 3 caixas (emoji ou número) e manda a escolha por mensagem; cada caixa esconde um benefício diferente.",
    duracao: "1 dia",
    canais: ["Stories"],
    objetivo: "Gerar volume alto de mensagens diretas em um curto espaço de tempo, criando urgência e senso de sorte.",
    quandoUsar: "Em dias de movimento mais fraco, para gerar picos de conversas e vendas rápidas.",
    quandoEvitar: "Sem definir os 3 benefícios com antecedência — a resposta no Direct precisa ser imediata para manter o clima do jogo.",
    passos: [
      "Definir os 3 benefícios (ex: frete grátis, desconto, mimo físico)",
      "Story 1: anunciar que vem um jogo com presente exclusivo",
      "Story 2: mostrar as 3 caixas e pedir para responder por mensagem",
      "Responder cada mensagem com o benefício correspondente e prazo de validade curto",
      "Story 3: fechar o dia mostrando quantos benefícios foram desbloqueados",
    ],
    checklist: ["3 benefícios definidos", "Textos de resposta prontos para cada caixa", "Prazo de validade definido"],
    dicas: "Definir um prazo curto (ex: até as 18h) para resgatar o benefício aumenta a conversão imediata.",
    erros: "Demorar para responder as mensagens — o efeito de urgência do jogo se perde.",
    resultado: "Pico de conversas no Direct convertendo em vendas no mesmo dia.",
    relacionadas: ["story-batalha", "story-caca-palavras"],
  },
  {
    id: "story-caca-palavras", nome: "Story Interativo — Caça-Palavras", cat: "engajamento", nichos: ["Geral"],
    tipo: "Desafio de atenção", como: "Um caça-palavras simples esconde uma palavra do nicho; quem encontra e responde o story ganha um cupom ou benefício.",
    duracao: "1 dia",
    canais: ["Stories"],
    objetivo: "Gerar respostas diretas ao story — sinal forte de engajamento para o algoritmo — e recompensar quem presta atenção na marca.",
    quandoUsar: "Quando a loja quer reforçar a percepção de marca através de um desafio leve e divertido.",
    quandoEvitar: "Com a palavra fácil demais ou difícil demais — o equilíbrio de dificuldade é o que sustenta o interesse.",
    passos: [
      "Escolher uma palavra do nicho (ex: LOOK, GLOW, MATE)",
      "Montar a imagem do caça-palavras com a palavra escondida entre letras aleatórias",
      "Pedir para responder o story com a palavra encontrada",
      "Responder cada acerto com o benefício (cupom ou acesso antecipado)",
      "Fechar o dia mostrando o resultado do desafio",
    ],
    checklist: ["Palavra escolhida", "Imagem do caça-palavras pronta", "Benefício de recompensa definido"],
    dicas: "Oferecer 2 opções de prêmio (ex: acesso antecipado ao grupo VIP ou desconto) deixa a cliente escolher o que mais valoriza.",
    erros: "Usar uma palavra sem relação com o nicho — perde a graça e a identificação.",
    resultado: "Aumento de respostas diretas ao story, o que melhora a entrega dos próximos stories pelo algoritmo.",
    relacionadas: ["story-batalha", "story-presente"],
  },
];

function CanalChip({ label, small }) {
  const info = canalInfo(label);
  const Icon = info.icon;
  return (
    <span className={small ? "canal-pill sm" : "canal-pill"}>
      <Icon size={small ? 10 : 11} /> {label}
    </span>
  );
}

function TagCard({ action, isFav, onToggleFav, onOpen }) {
  const info = catInfo(action.cat);
  const Icon = info.icon;
  return (
    <div className="tagcard" onClick={() => onOpen(action.id)}>
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
            <Heart size={16} fill={isFav ? "#163B2E" : "none"} color={isFav ? "#163B2E" : "#A9B0A4"} />
          </button>
        </div>
        <h3 className="tagcard-nome">{action.nome}</h3>
        <p className="tagcard-como">{action.como}</p>
        <div className="tagcard-canais">
          {action.canais.slice(0, 2).map((c) => <CanalChip key={c} label={c} small />)}
          {action.canais.length > 2 && <span className="canal-pill sm">+{action.canais.length - 2}</span>}
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

function DetailScreen({ action, isFav, onToggleFav, onBack, onMarkDone, doneNote, setDoneNote, doneValor, setDoneValor, isDone }) {
  const info = catInfo(action.cat);
  const Icon = info.icon;
  const [checked, setChecked] = useState({});
  const relacionadas = action.relacionadas
    .map((id) => ACTIONS.find((a) => a.id === id))
    .filter(Boolean);

  return (
    <div className="screen">
      <div className="topbar">
        <button className="iconbtn" onClick={onBack}><ArrowLeft size={20} /></button>
        <span className="topbar-title">Detalhe da ação</span>
        <button className="iconbtn" onClick={() => onToggleFav(action.id)}>
          <Heart size={20} fill={isFav ? "#163B2E" : "none"} color={isFav ? "#163B2E" : "#1C201D"} />
        </button>
      </div>

      <div className="scroll">
        <div className="detail-header">
          <span className="tagcard-cat"><Icon size={12} /> {info.label}{action.nichos && action.nichos[0] !== "Geral" ? ` · ${action.nichos.join(", ")}` : ""}</span>
          <h1 className="detail-nome">{action.nome}</h1>
          <p className="detail-tipo">{action.tipo}</p>
          <div className="detail-canais">
            {action.canais.map((c) => <CanalChip key={c} label={c} />)}
          </div>
          <div className="detail-meta">
            <span><Clock size={13} /> {action.duracao}</span>
          </div>
        </div>

        <div className="resumo-card">
          <div className="resumo-row">
            <span className="resumo-label">Objetivo</span>
            <p>{action.objetivo}</p>
          </div>
          <div className="resumo-row">
            <span className="resumo-label">Quando usar</span>
            <p>{action.quandoUsar}</p>
          </div>
          <div className="resumo-row">
            <span className="resumo-label">Quando evitar</span>
            <p>{action.quandoEvitar}</p>
          </div>
        </div>

        <Section title="Roteiro de antecipação">
          <p className="roteiro-lead">A antecipação é o que garante o resultado — ninguém aparece no dia e vende bem sem preparar o terreno antes.</p>

          <div className="etapa-bloco">
            <span className="etapa-titulo"><span className="etapa-num">1</span> Preparação</span>
            <ol className="steps">
              {action.passos.map((p, i) => <li key={i}>{p}</li>)}
            </ol>
          </div>

          <div className="etapa-bloco">
            <span className="etapa-titulo"><span className="etapa-num">2</span> Execução</span>
            <div className="checklist">
              {action.checklist.map((c, i) => (
                <label key={i} className="checkitem">
                  <input
                    type="checkbox"
                    checked={!!checked[i]}
                    onChange={() => setChecked((s) => ({ ...s, [i]: !s[i] }))}
                  />
                  <span className={checked[i] ? "done" : ""}>{c}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="etapa-bloco">
            <span className="etapa-titulo"><span className="etapa-num">3</span> Divulgação</span>
            {getRoteiros(action).map((r, ri) => (
              <div key={ri} className="roteiro-sub">
                <span className="roteiro-titulo">{r.titulo}</span>
                <ol className="steps">
                  {r.passos.map((p, i) => <li key={i}>{p}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </Section>

        <Callout icon={Lightbulb} title="Dica estratégica" tone="solid">{action.dicas}</Callout>
        <Callout icon={TrendingUp} title="Resultado esperado" tone="solid">{action.resultado}</Callout>

        {action.nichoExemplos && (
          <Section title="Exemplos por nicho">
            <div className="nicho-examples">
              {Object.entries(action.nichoExemplos).map(([nicho, exemplo]) => (
                <div key={nicho} className="nicho-example-item">
                  <span className="nicho-example-label">{nicho}</span>
                  <span className="nicho-example-text">{exemplo}</span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {relacionadas.length > 0 && (
          <Section title="Ações relacionadas">
            <div className="chiprow">
              {relacionadas.map((r) => (
                <span key={r.id} className="chip">{r.nome}</span>
              ))}
            </div>
          </Section>
        )}

        <div className="done-box">
          {isDone ? (
            <div className="done-confirm"><Check size={16} /> Marcada como executada</div>
          ) : (
            <>
              <span className="resumo-label" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}><DollarSign size={12} /> Quanto essa ação gerou em vendas?</span>
              <div className="valor-input">
                <span className="valor-prefix">R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0"
                  value={doneValor}
                  onChange={(e) => setDoneValor(e.target.value)}
                />
              </div>
              <p className="valor-nota">Valor de vendas geradas, sem precisar calcular lucro — só pra mapear de onde as vendas estão vindo.</p>
              <textarea
                placeholder="Observação sobre o resultado (opcional)"
                value={doneNote}
                onChange={(e) => setDoneNote(e.target.value)}
                className="done-input"
              />
              <button className="btn-primary" onClick={() => onMarkDone(action.id)}>
                Marcar como executada
              </button>
            </>
          )}
        </div>
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
        <span className="auth-eyebrow">Ações de venda</span>
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
  const [adminDiagnosticos, setAdminDiagnosticos] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);

  const isAdmin = session?.email === ADMIN_EMAIL;
  const navItems = isAdmin ? [...NAV, { id: "admin", label: "Admin", icon: Shield }] : NAV;

  useEffect(() => {
    if (stage !== "app" || !session) return;
    (async () => {
      try {
        const [h, m, f] = await Promise.all([
          supaSelect("av_historico", session.accessToken, session.userId),
          supaSelect("av_metas", session.accessToken, session.userId),
          supaSelect("av_favoritos", session.accessToken, session.userId),
        ]);
        setHistorico(h.map((row) => ({
          id: row.acao_id, rowId: row.id, nota: row.nota, valor: Number(row.valor) || 0,
          data: new Date(row.criado_em).toLocaleDateString("pt-BR"),
          mesAno: `${row.mes_idx + 1}/${row.ano}`, mesIdx: row.mes_idx, ano: row.ano,
        })));
        setMetas(m.map((row) => ({ id: row.id, acaoId: row.acao_id, mes: row.mes_idx, ano: row.ano, valorMeta: Number(row.valor_meta) || 0 })));
        setFavs(new Set(f.map((row) => row.acao_id)));
      } catch (e) { console.error("Erro ao carregar dados do Supabase:", e); }
    })();
  }, [stage, session]);

  useEffect(() => {
    if (tab !== "admin" || !isAdmin || !session) return;
    setAdminLoading(true);
    supaSelectAll("av_diagnosticos", session.accessToken)
      .then((rows) => setAdminDiagnosticos(rows))
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
      { id, nota, valor, data: now.toLocaleDateString("pt-BR"), mesAno: `${mesIdx + 1}/${ano}`, mesIdx, ano },
      ...prev,
    ]);
    setDoneNote("");
    setDoneValor("");
    if (session) {
      supaInsert("av_historico", session.accessToken, { user_id: session.userId, acao_id: id, valor, nota, mes_idx: mesIdx, ano }).catch(console.error);
    }
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

  const filtered = ACTIONS.filter((a) => {
    const matchesCat = !catFilter || a.cat === catFilter;
    const matchesCanal = !canalFilter || a.canais.includes(canalFilter);
    const matchesNicho = !nichoFilter || (a.nichos && a.nichos.includes(nichoFilter));
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || a.nome.toLowerCase().includes(q) || a.tipo.toLowerCase().includes(q) || a.como.toLowerCase().includes(q);
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
    return { ...m, realizado, pct, nome: ACTIONS.find((a) => a.id === m.acaoId)?.nome || m.acaoId };
  });

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
  };

  const baseStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500&display=swap');
    * { box-sizing: border-box; }
    .app-wrap {
      --paper: #FAFAF8;
      --card: #FFFFFF;
      --ink: #1C201D;
      --ink-soft: #6B7268;
      --wine: #163B2E;
      --wine-dark: #0E2A20;
      --mustard: #B68A2E;
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
      padding: 7px 12px; font-size: 12px; cursor: pointer; white-space: nowrap; color: var(--ink);
    }
    .catchip.active { background: var(--wine); border-color: var(--wine); color: #fff; }

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

    .empty-state { text-align: center; padding: 60px 30px; color: var(--ink-soft); }
    .empty-state svg { margin-bottom: 10px; opacity: 0.5; }
    .empty-state p { font-size: 13px; line-height: 1.5; }

    .detail-header { padding: 16px 0 4px; }
    .detail-nome { font-family: 'Fraunces', serif; font-size: 25px; font-weight: 600; margin: 6px 0 2px; line-height: 1.15; }
    .detail-tipo { font-size: 12.5px; color: var(--ink-soft); margin: 0 0 10px; }
    .detail-canais { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
    .detail-meta {
      display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--ink-soft);
      border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 8px 0; margin-bottom: 4px;
    }
    .detail-meta span { display: flex; align-items: center; gap: 4px; }

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
    .checkitem .done { text-decoration: line-through; color: var(--ink-soft); }

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
    <div className="app-wrap"><style>{baseStyles}</style><LoginScreen onAuthed={(s) => { setSession(s); setStage("diagnostico"); }} /></div>
  );
  if (stage === "diagnostico") return (
    <div className="app-wrap"><style>{baseStyles}</style><DiagnosticoScreen session={session} onContinue={() => setStage("app")} /></div>
  );

  return (
    <div className="app-wrap">
      <style>{baseStyles}</style>
      <div className="shell">
        <aside className="sidebar">
          <div className="sidebar-logo">Ações de venda</div>
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
                onMarkDone={markDone}
                doneNote={doneNote}
                setDoneNote={setDoneNote}
                doneValor={doneValor}
                setDoneValor={setDoneValor}
                isDone={isDoneAlready}
              />
            ) : tab === "inicio" ? (
              <div className="screen">
                <div className="home-header">
                  <span className="home-eyebrow">Ações de venda</span>
                  <h1 className="home-title">O que vamos ativar hoje?</h1>
                  <p className="home-sub">Escolha uma ação pronta para movimentar a loja agora.</p>
                </div>

                <div className="search-bar" onClick={() => goto("biblioteca", true)}>
                  <Search size={16} color="#6B7268" />
                  <input placeholder="Buscar ação por objetivo ou nome" readOnly />
                </div>

                <div className="stats-row">
                  <div className="stat-box"><div className="stat-num">{favs.size}</div><div className="stat-label">Favoritas</div></div>
                  <div className="stat-box"><div className="stat-num">{historico.length}</div><div className="stat-label">Executadas</div></div>
                  <div className="stat-box"><div className="stat-num">{ACTIONS.length}</div><div className="stat-label">No banco</div></div>
                </div>

                <div className="section-label">Planejamento</div>
                <div className="mes-nav">
                  <button className="mes-nav-btn" onClick={() => shiftDash(-1)}><ChevronLeft size={16} /></button>
                  <span className="mes-nav-label">{nomeMesAno}</span>
                  <button className="mes-nav-btn" onClick={() => shiftDash(1)}><ChevronRight size={16} /></button>
                </div>

                <div className="resultados-wrap">
                  <div className="resultados-summary">
                    <span className="stat-num">{formatBRL(totalMes)}</span>
                    <span className="stat-label">gerados em {nomeMesAno}</span>
                  </div>

                  {metasDoMes.length > 0 && (
                    <div className="metas-list">
                      {metasDoMes.map((m) => (
                        <div key={m.id} className="meta-row">
                          <div className="meta-row-top">
                            <span className="meta-nome">{m.nome}</span>
                            <button className="meta-del" onClick={() => removeMeta(m.id)}><X size={13} /></button>
                          </div>
                          <div className="meta-bar-track">
                            <div className="meta-bar-fill" style={{ width: `${m.pct}%` }} />
                          </div>
                          <div className="meta-row-bottom">
                            <span>{formatBRL(m.realizado)} de {formatBRL(m.valorMeta)}</span>
                            <span className="meta-pct">{m.pct}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showMetaForm ? (
                    <div className="meta-form">
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
                  ) : (
                    <button className="btn-ghost-box" onClick={() => setShowMetaForm(true)}><Plus size={15} /> Definir meta para {nomeMesAno}</button>
                  )}

                  {historicoMes.length === 0 ? (
                    <div className="empty-state small">
                      <BarChart3 size={24} />
                      <p>Nenhuma ação registrada em {nomeMesAno} ainda. Marque uma ação como executada e informe o valor gerado para começar a ver o gráfico aqui.</p>
                    </div>
                  ) : (
                    <div className="chart-box">
                      <ResponsiveContainer width="100%" height={Math.max(120, chartMes.length * 42)}>
                        <BarChart data={chartMes} layout="vertical" margin={{ top: 4, right: 20, left: 4, bottom: 4 }}>
                          <XAxis type="number" tickFormatter={(v) => formatBRL(v)} tick={{ fontSize: 10, fill: "#6B7268" }} axisLine={false} tickLine={false} />
                          <YAxis type="category" dataKey="nome" width={140} tick={{ fontSize: 11, fill: "#1C201D" }} axisLine={false} tickLine={false} />
                          <Tooltip formatter={(v) => formatBRL(v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E4DE" }} />
                          <Bar dataKey="valor" fill="#163B2E" radius={[0, 6, 6, 0]} barSize={18} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </div>

                <div className="home-cta-wrap">
                  <button className="btn-primary" onClick={() => goto("biblioteca", true)}>Ver biblioteca de ações</button>
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

                <div className="search-bar" style={{ margin: "14px auto 8px" }}>
                  <Search size={16} color="#6B7268" />
                  <input placeholder="O que você precisa resolver hoje?" value={search} onChange={(e) => setSearch(e.target.value)} />
                  {search && <X size={14} color="#6B7268" style={{ cursor: "pointer" }} onClick={() => setSearch("")} />}
                </div>

                {bibShowMenu ? (
                  <div className="menu-wrap">
                    <div className="filter-title">Por categoria</div>
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

                    <div className="filter-title">Por canal</div>
                    <div className="menu-list">
                      {CANAIS.map((c) => {
                        const count = ACTIONS.filter((a) => a.canais.includes(c.label)).length;
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

                    <div className="filter-title">Por nicho</div>
                    <div className="menu-list" style={{ marginBottom: 20 }}>
                      {NICHOS.filter((n) => n !== "Geral").map((n) => {
                        const count = ACTIONS.filter((a) => a.nichos && a.nichos.includes(n)).length;
                        return (
                          <button key={n} className="menu-row" onClick={() => setNichoFilter(n)}>
                            <span className="menu-row-label" style={{ marginLeft: 0 }}>{n}</span>
                            <span className="menu-count">{count}</span>
                            <ChevronRight size={16} color="#A9B0A4" />
                          </button>
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
                        filtered.map((a) => (
                          <TagCard key={a.id} action={a} isFav={favs.has(a.id)} onToggleFav={toggleFav} onOpen={(id) => setOpenId(id)} />
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
                <div className="topbar"><span className="topbar-title">Respostas do diagnóstico</span><span /></div>
                <div className="scroll" style={{ paddingTop: 14 }}>
                  {adminLoading ? (
                    <p style={{ textAlign: "center", color: "#6B7268", fontSize: 13 }}>Carregando…</p>
                  ) : adminDiagnosticos.length === 0 ? (
                    <div className="empty-state"><Shield size={28} /><p>Nenhuma lojista respondeu o diagnóstico ainda.</p></div>
                  ) : (
                    <div className="list-wrap" style={{ padding: 0 }}>
                      {adminDiagnosticos.map((d) => (
                        <div className="hist-item" key={d.id}>
                          <div className="hist-top">
                            <span className="hist-nome">{d.respostas?.segmento?.l || "Segmento não informado"}</span>
                            <span className="hist-data">{new Date(d.criado_em).toLocaleDateString("pt-BR")}</span>
                          </div>
                          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", margin: "6px 0" }}>
                            <span className="canal-pill sm">Índice {d.indice} · {d.faixa_indice}</span>
                            <span className="canal-pill sm">Forte: {d.ponto_forte}</span>
                            <span className="canal-pill sm">Gargalo: {d.gargalo}</span>
                          </div>
                          <div className="hist-nota">
                            Faturamento: {d.respostas?.faturamento?.l || "—"} · Equipe: {d.respostas?.equipe?.l || "—"} · Seguidores: {d.respostas?.seguidores?.l || "—"}
                          </div>
                          {d.areas?.length > 0 && (
                            <div className="chiprow" style={{ marginTop: 8 }}>
                              {d.areas.map((a) => <span key={a} className="chip">{a}</span>)}
                            </div>
                          )}
                        </div>
                      ))}
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
