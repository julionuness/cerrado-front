// ── Banco de conhecimento das doenças ────────
interface DoencaInfo {
  nome:         string;
  descricao:    string;
  recomendacao: string;
}

const DOENCAS: Record<string, DoencaInfo> = {
  cercospora: {
    nome: 'Cercosporiose',
    descricao:
      'Doença fúngica causada por Cercospora coffeicola. Forma manchas circulares com centro claro e halo escuro nas folhas, podendo causar desfolha intensa e queda de produção.',
    recomendacao:
      'Aplique fungicidas à base de cobre ou triazóis. Evite excesso de umidade e melhore a ventilação entre as plantas.',
  },
  ferrugem: {
    nome: 'Ferrugem do Cafeeiro',
    descricao:
      'Causada pelo fungo Hemileia vastatrix, é a doença mais destrutiva do café. Provoca manchas amareladas na face superior e pústulas alaranjadas na face inferior das folhas.',
    recomendacao:
      'Use fungicidas sistêmicos (triazóis ou estrobilurinas). Faça monitoramento preventivo antes da florada.',
  },
  bicho_mineiro: {
    nome: 'Bicho-mineiro',
    descricao:
      'Lagarta da mariposa Leucoptera coffeella que escava o interior das folhas formando minas (galerias), reduzindo a área fotossintética e enfraquecendo a planta.',
    recomendacao:
      'Aplique inseticidas sistêmicos ou biológicos (Bacillus thuringiensis). Realize podas para reduzir o microclima favorável.',
  },
  'bicho-mineiro': {
    nome: 'Bicho-mineiro',
    descricao:
      'Lagarta da mariposa Leucoptera coffeella que escava o interior das folhas formando minas (galerias), reduzindo a área fotossintética e enfraquecendo a planta.',
    recomendacao:
      'Aplique inseticidas sistêmicos ou biológicos (Bacillus thuringiensis). Realize podas para reduzir o microclima favorável.',
  },
  saudavel: {
    nome: 'Folha Saudável',
    descricao:
      'Nenhuma doença ou praga detectada. A folha apresenta coloração e estrutura características de uma planta sadia.',
    recomendacao:
      'Sem ações necessárias. Mantenha o monitoramento periódico das folhas para detecção precoce.',
  },
  nao_detectado: {
    nome: 'Não identificado',
    descricao:
      'O modelo não conseguiu identificar com confiança um padrão conhecido.',
    recomendacao:
      'Tente uma nova foto com boa iluminação e foco na folha. Consulte um agrônomo para avaliação presencial.',
  },
  // Aliases inglês (compatibilidade com dados antigos)
  not_detected: {
    nome: 'Não identificado',
    descricao:
      'O modelo não conseguiu identificar com confiança um padrão conhecido.',
    recomendacao:
      'Tente uma nova foto com boa iluminação e foco na folha. Consulte um agrônomo para avaliação presencial.',
  },
  healthy: {
    nome: 'Folha Saudável',
    descricao:
      'Nenhuma doença ou praga detectada. A folha apresenta coloração e estrutura características de uma planta sadia.',
    recomendacao:
      'Sem ações necessárias. Mantenha o monitoramento periódico das folhas para detecção precoce.',
  },
};

const DOENCA_PADRAO: DoencaInfo = {
  nome:         '',
  descricao:    'Doença identificada na análise. Consulte um agrônomo para orientações específicas.',
  recomendacao: 'Entre em contato com um especialista para diagnóstico aprofundado e plano de manejo.',
};

export function getDoencaInfo(doenca: string): DoencaInfo {
  const key  = doenca.toLowerCase();
  const info = DOENCAS[key] ?? { ...DOENCA_PADRAO };
  if (!info.nome) info.nome = doenca.charAt(0).toUpperCase() + doenca.slice(1);
  return info;
}

// ── Configuração visual da confiança ────────
export interface ConfiancaConfig {
  label:    string;
  mensagem: string;
  cor:      'alta' | 'media' | 'baixa';
  icone:    string;
}

export function getConfiancaConfig(confianca: number): ConfiancaConfig {
  if (confianca >= 0.85) return {
    label:    'Alta confiança',
    mensagem: 'O diagnóstico é consistente. Recomendamos iniciar o tratamento conforme orientado abaixo.',
    cor:      'alta',
    icone:    '✅',
  };
  if (confianca >= 0.60) return {
    label:    'Confiança moderada',
    mensagem: 'O diagnóstico é provável, mas recomendamos uma segunda avaliação visual antes de tratar.',
    cor:      'media',
    icone:    '⚠️',
  };
  return {
    label:    'Baixa confiança',
    mensagem: 'Resultado inconclusivo. Tire uma nova foto com melhor iluminação ou consulte um agrônomo.',
    cor:      'baixa',
    icone:    '❓',
  };
}

// ── Configuração visual da severidade ───────
export type SeveridadeCor = 'saudavel' | 'leve' | 'moderada' | 'grave' | 'severa' | 'nao_detectado';

export interface SeveridadeConfig {
  cor:   SeveridadeCor;
  label: string;
}

const SEVERIDADE_MAP: Record<string, SeveridadeConfig> = {
  // Valores em português (API atual)
  saudavel:      { cor: 'saudavel',      label: 'Saudável'       },
  leve:          { cor: 'leve',          label: 'Leve'           },
  moderada:      { cor: 'moderada',      label: 'Moderada'       },
  grave:         { cor: 'grave',         label: 'Grave'          },
  severa:        { cor: 'severa',        label: 'Severa'         },
  nao_detectado: { cor: 'nao_detectado', label: 'Não detectado'  },
  desconhecido:  { cor: 'nao_detectado', label: 'Desconhecido'   },
  // Aliases inglês (compatibilidade com dados antigos)
  healthy:       { cor: 'saudavel',      label: 'Saudável'       },
  mild:          { cor: 'leve',          label: 'Leve'           },
  moderate:      { cor: 'moderada',      label: 'Moderada'       },
  high:          { cor: 'grave',         label: 'Grave'          },
  severe:        { cor: 'severa',        label: 'Severa'         },
  not_detected:  { cor: 'nao_detectado', label: 'Não detectado'  },
  unknown:       { cor: 'nao_detectado', label: 'Desconhecido'   },
};

export function getSeveridadeConfig(severidade: string): SeveridadeConfig {
  return SEVERIDADE_MAP[severidade?.toLowerCase()] ?? { cor: 'nao_detectado', label: severidade };
}
