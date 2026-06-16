import { Injectable } from '@angular/core';
import { AnaliseResponse } from '../model/models';

const API_BASE = 'http://localhost:8000';

interface ApiResult {
  filename:         string;
  disease:          string;
  confidence:       number;
  confidence_level: string;
  area_percentage:  number;
  severity:         string;
  treatment:        string | null;
  image_url:        string | null;
}

interface ApiResponse {
  results: ApiResult[];
}

@Injectable({ providedIn: 'root' })
export class CameraUpload {
  private readonly API_URL = `${API_BASE}/analyze`;

  async uploadBatch(files: File[]): Promise<AnaliseResponse> {
    const form = new FormData();
    files.forEach(f => form.append('files', f, f.name));

    const res = await fetch(this.API_URL, { method: 'POST', body: form });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(`Erro ${res.status}: ${msg}`);
    }

    const data = (await res.json()) as ApiResponse;

    return {
      session_id: crypto.randomUUID(),
      resultados: data.results.map(r => ({
        filename:        r.filename,
        doenca:          r.disease,
        confianca:       r.confidence,
        nivel_confianca: r.confidence_level,
        area_percentual: r.area_percentage,
        severidade:      r.severity,
        tratamento:      r.treatment ?? undefined,
        imagem:          r.image_url ? `${API_BASE}${r.image_url}` : undefined,
      })),
    };
  }
}
