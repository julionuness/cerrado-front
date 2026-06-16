import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Tratamento } from '../../../../core/model/models';
import { TratamentoService } from '../../../../core/services/tratamento.service';
import { getDoencaInfo, getSeveridadeConfig } from '../../../result/components/result.helpers';

@Component({
  selector: 'app-tratamento-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tratamento-page.html',
  styleUrl: './tratamento-page.scss',
})
export class TratamentoPage implements OnInit {
  private readonly svc    = inject(TratamentoService);
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // ── Estado ───────────────────────────────────
  readonly tratamento = signal<Tratamento | null>(null);

  // ── Derivados ────────────────────────────────
  readonly doencaInfo = computed(() =>
    getDoencaInfo(this.tratamento()?.doenca ?? '')
  );

  readonly severidadeConfig = computed(() =>
    getSeveridadeConfig(this.tratamento()?.severidade ?? '')
  );

  readonly progresso = computed(() => {
    const t = this.tratamento();
    if (!t || t.etapas.length === 0) return 0;
    const concluidas = t.etapas.filter(e => e.status === 'concluida').length;
    return Math.round((concluidas / t.etapas.length) * 100);
  });

  // ── Ciclo de vida ────────────────────────────
  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) { this.router.navigate(['']); return; }

    const t = await this.svc.buscarPorId(id);
    if (!t) { this.router.navigate(['']); return; }

    this.tratamento.set(t);
  }

  // ── Ações ────────────────────────────────────
  async concluirEtapa(indice: number): Promise<void> {
    const id = this.tratamento()?.id;
    if (!id) return;
    const atualizado = await this.svc.concluirEtapa(id, indice);
    if (atualizado) this.tratamento.set(atualizado);
  }

  voltar(): void {
    this.router.navigate(['/historico']);
  }

  novaAnalise(): void {
    this.router.navigate(['']);
  }

  // ── Helpers ──────────────────────────────────
  formatarData(iso: string): string {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  }
}
