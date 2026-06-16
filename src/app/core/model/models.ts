export interface Resultado {
  filename:        string;
  doenca:          string;
  confianca:       number;
  nivel_confianca: string;
  area_percentual: number;
  severidade:      string;
  tratamento?:     string;
  imagem?:         string;
}

export interface AnaliseResponse {
  session_id: string;
  resultados: Resultado[];
}

export type StatusEnvio = 'idle' | 'enviando' | 'sucesso' | 'erro';

// ── Tratamento ────────────────────────────────
export type StatusEtapa      = 'pendente' | 'em_andamento' | 'concluida';
export type StatusTratamento = 'em_andamento' | 'concluido';

export interface EtapaTratamento {
  description: string;
  status:      StatusEtapa;
}

export interface Tratamento {
  id:            string;
  diagnosticoId: string;
  doenca:        string;
  severidade:    string;
  iniciadoEm:    string;
  status:        StatusTratamento;
  etapas:        EtapaTratamento[];
}

// ── Histórico ────────────────────────────────
export interface HistoricoItem {
  id:         string;       // session_id da análise
  criadoEm:   string;       // ISO 8601
  resumo:     string;       // ex: "3 imagens · ferrugem, cercospora"
  resultados: Resultado[];
  // Quando houver auth, adicione aqui:
  // userId?: string;
}