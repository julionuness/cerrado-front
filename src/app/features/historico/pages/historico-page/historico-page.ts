// ─────────────────────────────────────────────
// features/historico/pages/historico-page/historico-page.ts
// ─────────────────────────────────────────────

import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HistoricoItem } from '../../../../core/model/models';
import { HistoricoService } from '../../../../core/services/historico.service';
import { getConfiancaConfig, getDoencaInfo, getSeveridadeConfig } from '../../../result/components/result.helpers';

@Component({
  selector: 'app-historico-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historico-page.html',
  styleUrl: './historico-page.scss',
})
export class HistoricoPage implements OnInit {
  private readonly svc    = inject(HistoricoService);
  private readonly router = inject(Router);

  // ── Estado ───────────────────────────────────
  readonly historico        = signal<HistoricoItem[]>([]);
  readonly expandido        = signal<string | null>(null); // id do card aberto
  readonly confirmandoLimpar = signal(false);

  // ── Helpers expostos ao template ─────────────
  readonly getConfiancaConfig  = getConfiancaConfig;
  readonly getSeveridadeConfig = getSeveridadeConfig;
  readonly getDoencaInfo       = getDoencaInfo;

  // ── Ciclo de vida ────────────────────────────
  async ngOnInit(): Promise<void> {
    await this.carregar();
  }

  // ── Ações ────────────────────────────────────
  toggleExpandido(id: string): void {
    this.expandido.update(atual => atual === id ? null : id);
  }

  async remover(id: string): Promise<void> {
    await this.svc.remover(id);
    await this.carregar();
  }

  async limparTudo(): Promise<void> {
    if (!this.confirmandoLimpar()) {
      this.confirmandoLimpar.set(true);
      return;
    }
    await this.svc.limpar();
    this.confirmandoLimpar.set(false);
    await this.carregar();
  }

  cancelarLimpar(): void {
    this.confirmandoLimpar.set(false);
  }

  verResultado(item: HistoricoItem): void {
    this.router.navigate(['/result'], {
      state: {
        analise: {
          session_id: item.id,
          resultados: item.resultados,
        },
      },
    });
  }

  novaAnalise(): void {
    this.router.navigate(['']);
  }

  // ── Formatação de data ───────────────────────
  formatarData(iso: string): string {
    return new Date(iso).toLocaleString('pt-BR', {
      day:    '2-digit',
      month:  '2-digit',
      year:   'numeric',
      hour:   '2-digit',
      minute: '2-digit',
    });
  }

  // ── Helpers privados ─────────────────────────
  private async carregar(): Promise<void> {
    const lista = await this.svc.listar();
    this.historico.set(lista);
  }
}