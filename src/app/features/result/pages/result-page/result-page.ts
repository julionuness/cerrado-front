import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AnaliseResponse, Resultado } from '../../../../core/model/models';
import {
  getConfiancaConfig,
  getDoencaInfo,
  getSeveridadeConfig,
} from '../../components/result.helpers';
import { TratamentoService } from '../../../../core/services/tratamento.service';

@Component({
  selector: 'app-result-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './result-page.html',
  styleUrl: './result-page.scss',
})
export class ResultPage implements OnInit {
  private router            = inject(Router);
  private tratamentoService = inject(TratamentoService);

  // ── Estado ───────────────────────────────────
  readonly analise = signal<AnaliseResponse | null>(null);
  readonly indice  = signal<number>(0);

  // ── Derivados ────────────────────────────────
  readonly total = computed(() => this.analise()?.resultados.length ?? 0);

  readonly resultado = computed<Resultado | null>(() =>
    this.analise()?.resultados[this.indice()] ?? null
  );

  readonly percentualBarra = computed(() =>
    Math.round((this.resultado()?.confianca ?? 0) * 100)
  );

  readonly confiancaConfig = computed(() =>
    getConfiancaConfig(this.resultado()?.confianca ?? 0)
  );

  readonly doencaInfo = computed(() =>
    getDoencaInfo(this.resultado()?.doenca ?? '')
  );

  readonly severidadeConfig = computed(() =>
    getSeveridadeConfig(this.resultado()?.severidade ?? '')
  );

  readonly infoAberta = signal(false);

  readonly isSaudavel = computed(() => {
    const d = this.resultado()?.doenca?.toLowerCase() ?? '';
    return d === 'saudavel' || d === 'healthy';
  });

  // ── Helpers expostos ao template ─────────────
  readonly getSeveridadeConfig = getSeveridadeConfig;

  // ── Ciclo de vida ────────────────────────────
  ngOnInit(): void {
    const analise = history.state?.analise as AnaliseResponse | undefined;

    if (!analise?.resultados?.length) {
      this.router.navigate(['']);
      return;
    }

    this.analise.set(analise);
  }

  // ── Ações ────────────────────────────────────
  anterior(): void {
    this.indice.update(i => Math.max(0, i - 1));
  }

  proximo(): void {
    this.indice.update(i => Math.min(this.total() - 1, i + 1));
  }

  toggleInfo(): void {
    this.infoAberta.update(v => !v);
  }

  novaAnalise(): void {
    this.router.navigate(['']);
  }

  async iniciarTratamento(): Promise<void> {
    const r = this.resultado();
    if (!r) return;
    const diagnosticoId = this.analise()?.session_id ?? crypto.randomUUID();
    const t = await this.tratamentoService.iniciar(diagnosticoId, r.doenca, r.severidade);
    this.router.navigate(['/tratamento', t.id]);
  }
}