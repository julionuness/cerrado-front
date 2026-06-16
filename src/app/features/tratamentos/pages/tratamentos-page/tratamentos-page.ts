import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { Tratamento } from '../../../../core/model/models';
import { TratamentoService } from '../../../../core/services/tratamento.service';
import { getDoencaInfo, getSeveridadeConfig } from '../../../result/components/result.helpers';

@Component({
  selector: 'app-tratamentos-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tratamentos-page.html',
  styleUrl: './tratamentos-page.scss',
})
export class TratamentosPage implements OnInit {
  private readonly svc    = inject(TratamentoService);
  private readonly router = inject(Router);

  readonly tratamentos = signal<Tratamento[]>([]);
  readonly carregando  = signal(true);

  readonly getDoencaInfo       = getDoencaInfo;
  readonly getSeveridadeConfig = getSeveridadeConfig;

  async ngOnInit(): Promise<void> {
    const lista = await this.svc.listar();
    this.tratamentos.set(lista);
    this.carregando.set(false);
  }

  verTratamento(id: string): void {
    this.router.navigate(['/tratamento', id]);
  }

  novaAnalise(): void {
    this.router.navigate(['']);
  }

  progresso(t: Tratamento): number {
    if (!t.etapas.length) return 0;
    return Math.round(
      (t.etapas.filter(e => e.status === 'concluida').length / t.etapas.length) * 100
    );
  }

  formatarData(iso: string): string {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  }
}
