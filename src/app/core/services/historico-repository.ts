// Camada de abstração de persistência.
// Para migrar para um banco real, basta criar uma
// nova classe que implemente HistoricoRepository
// e trocar o provider em app.config.ts — sem tocar
// nos componentes.
// ─────────────────────────────────────────────

import { InjectionToken } from '@angular/core';
import { HistoricoItem } from '../model/models';

// ── Contrato (interface) ─────────────────────
export interface HistoricoRepository {
  listar(): Promise<HistoricoItem[]>;
  salvar(item: HistoricoItem): Promise<void>;
  remover(id: string): Promise<void>;
  limpar(): Promise<void>;
}

export const HISTORICO_REPO =
  new InjectionToken<HistoricoRepository>('HistoricoRepository');

// ── Implementação: localStorage (sem backend) ─
const CHAVE = 'agroleg:historico';

export class LocalStorageHistoricoRepository implements HistoricoRepository {

  async listar(): Promise<HistoricoItem[]> {
    try {
      const raw = localStorage.getItem(CHAVE);
      return raw ? (JSON.parse(raw) as HistoricoItem[]) : [];
    } catch {
      return [];
    }
  }

  async salvar(item: HistoricoItem): Promise<void> {
    const lista = await this.listar();
    // Evita duplicatas pelo id
    const atualizada = [item, ...lista.filter(i => i.id !== item.id)];
    localStorage.setItem(CHAVE, JSON.stringify(atualizada));
  }

  async remover(id: string): Promise<void> {
    const lista = await this.listar();
    localStorage.setItem(CHAVE, JSON.stringify(lista.filter(i => i.id !== id)));
  }

  async limpar(): Promise<void> {
    localStorage.removeItem(CHAVE);
  }
}

// ── TODO: implementação futura com backend ────
//
// export class ApiHistoricoRepository implements HistoricoRepository {
//   private http = inject(HttpClient);
//
//   listar()           { return firstValueFrom(this.http.get<HistoricoItem[]>('/api/historico')); }
//   salvar(item)       { return firstValueFrom(this.http.post<void>('/api/historico', item)); }
//   remover(id)        { return firstValueFrom(this.http.delete<void>(`/api/historico/${id}`)); }
//   limpar()           { return firstValueFrom(this.http.delete<void>('/api/historico')); }
// }