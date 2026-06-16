import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AnaliseResponse, StatusEnvio } from '../../../../core/model/models';
import { CameraUpload } from '../../../../core/services/camera-upload';
import { HistoricoService } from '../../../../core/services/historico.service';
import { UploadPreview } from '../../components/upload-preview/upload-preview';

@Component({
  selector: 'app-upload-page',
  standalone: true,
  imports: [UploadPreview],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.scss',
})
export class UploadPage {
  private readonly svc       = inject(CameraUpload);
  private readonly historico = inject(HistoricoService);
  private readonly router    = inject(Router);

  // ── Estado ───────────────────────────────────
  readonly selectedFiles = signal<File[]>([]);
  readonly status        = signal<StatusEnvio>('idle');
  readonly erroMsg       = signal<string>('');
  readonly resultado     = signal<AnaliseResponse | null>(null);

  // ── Derivado ─────────────────────────────────
  get podeEnviar(): boolean {
    return this.selectedFiles().length > 0 && this.status() !== 'enviando';
  }

  // ── Ações de arquivo ─────────────────────────
  onTakePhoto(): void {
    const input    = document.createElement('input');
    input.type     = 'file';
    input.accept   = 'image/*';
    input.capture  = 'environment';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        this.selectedFiles.update(list => [...list, file]);
        this.resetStatus();
      }
    };
    input.click();
  }

  onFileSelected(input: HTMLInputElement): void {
    const novos = Array.from(input.files ?? []);
    this.selectedFiles.update(atuais => {
      const nomes = new Set(atuais.map(f => f.name));
      return [...atuais, ...novos.filter(f => !nomes.has(f.name))];
    });
    input.value = '';
    this.resetStatus();
  }

  onRemoveFile(index: number): void {
    this.selectedFiles.update(list => list.filter((_, i) => i !== index));
    this.resetStatus();
  }

  // ── Envio ────────────────────────────────────
  async onEnviar(): Promise<void> {
    if (!this.podeEnviar) return;

    this.status.set('enviando');
    this.erroMsg.set('');
    this.resultado.set(null);

    try {
      const resposta = await this.svc.uploadBatch(this.selectedFiles());

      // Persiste no histórico antes de navegar
      await this.historico.registrar(resposta);

      this.resultado.set(resposta);
      this.status.set('sucesso');
      this.router.navigate(['/result'], { state: { analise: resposta } });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erro desconhecido';
      this.erroMsg.set(msg);
      this.status.set('erro');
    }
  }

  // ── Helpers privados ─────────────────────────
  private resetStatus(): void {
    this.status.set('idle');
    this.erroMsg.set('');
    this.resultado.set(null);
  }
}