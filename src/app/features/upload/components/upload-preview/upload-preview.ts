// ─────────────────────────────────────────────
// features/upload/components/upload-preview/upload-preview.ts
// ─────────────────────────────────────────────

import { Component, effect, input, OnDestroy, output, signal } from '@angular/core';

interface PreviewItem {
  file: File;
  url:  string;
  info: string;
}

@Component({
  selector: 'app-upload-preview',
  standalone: true,
  imports: [],
  templateUrl: './upload-preview.html',
  styleUrl: './upload-preview.scss',
})
export class UploadPreview implements OnDestroy {
  // ── Inputs / Outputs ─────────────────────────
  readonly files      = input<File[]>([]);
  readonly removeFile = output<number>();

  // ── Estado interno ───────────────────────────
  readonly previews = signal<PreviewItem[]>([]);

  private objectUrls: string[] = [];

  // ── Reage à mudança de arquivos ──────────────
  constructor() {
    effect(() => {
      this.revokeAll();

      const items: PreviewItem[] = this.files().map(file => {
        const url = URL.createObjectURL(file);
        this.objectUrls.push(url);
        return {
          file,
          url,
          info: `${file.name} · ${(file.size / 1024).toFixed(1)} KB`,
        };
      });

      this.previews.set(items);
    });
  }

  // ── Ações ────────────────────────────────────
  onRemove(index: number): void {
    this.removeFile.emit(index);
  }

  // ── Limpeza de memória ───────────────────────
  private revokeAll(): void {
    this.objectUrls.forEach(url => URL.revokeObjectURL(url));
    this.objectUrls = [];
  }

  ngOnDestroy(): void {
    this.revokeAll();
  }
}