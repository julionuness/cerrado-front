// ─────────────────────────────────────────────
// core/services/historico.service.ts
//
// Serviço de domínio — conhece as regras de negócio
// mas não sabe como os dados são persistidos.
// ─────────────────────────────────────────────

import { inject, Injectable } from '@angular/core';
import { AnaliseResponse, HistoricoItem } from '../model/models';
import { HISTORICO_REPO } from './historico-repository';

const NOME_DOENCA: Record<string, string> = {
  cercospora:    'Cercosporiose',
  ferrugem:      'Ferrugem',
  bicho_mineiro: 'Bicho-mineiro',
  'bicho-mineiro': 'Bicho-mineiro',
  saudavel:      'Saudável',
  nao_detectado: 'Não detectado',
};

@Injectable({ providedIn: 'root' })
export class HistoricoService {
  private repo = inject(HISTORICO_REPO);

  listar(): Promise<HistoricoItem[]> {
    return this.repo.listar();
  }

  remover(id: string): Promise<void> {
    return this.repo.remover(id);
  }

  limpar(): Promise<void> {
    return this.repo.limpar();
  }

  /** Converte uma AnaliseResponse em HistoricoItem e persiste. */
  async registrar(analise: AnaliseResponse): Promise<void> {
    const doencas = [
      ...new Set(analise.resultados.map(r => NOME_DOENCA[r.doenca] ?? r.doenca)),
    ].join(', ');

    const item: HistoricoItem = {
      id:        analise.session_id,
      criadoEm:  new Date().toISOString(),
      resumo:    `${analise.resultados.length} imagem(ns) · ${doencas}`,
      resultados: analise.resultados,
    };

    await this.repo.salvar(item);
  }
}