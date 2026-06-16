import { Injectable } from '@angular/core';
import { EtapaTratamento, StatusEtapa, StatusTratamento, Tratamento } from '../model/models';

const API_BASE = 'http://localhost:8000';

interface ApiStep {
  description: string;
  status:      string;
}

interface ApiTreatment {
  id:         string;
  disease:    string;
  severity:   string;
  started_at: string;
  status:     string;
  steps:      ApiStep[];
}

@Injectable({ providedIn: 'root' })
export class TratamentoService {

  async listar(): Promise<Tratamento[]> {
    const res = await fetch(`${API_BASE}/treatments`);
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    return (await res.json() as ApiTreatment[]).map(t => this.map(t));
  }

  async iniciar(_diagnosticoId: string, doenca: string, severidade: string): Promise<Tratamento> {
    const res = await fetch(`${API_BASE}/treatments`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ disease: doenca, severity: severidade }),
    });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    return this.map(await res.json() as ApiTreatment);
  }

  async buscarPorId(id: string): Promise<Tratamento | null> {
    const res = await fetch(`${API_BASE}/treatments/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    return this.map(await res.json() as ApiTreatment);
  }

  async concluirEtapa(tratamentoId: string, indice: number): Promise<Tratamento | null> {
    const res = await fetch(`${API_BASE}/treatments/${tratamentoId}/steps/${indice}`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    return this.map(await res.json() as ApiTreatment);
  }

  private map(data: ApiTreatment): Tratamento {
    return {
      id:            data.id,
      diagnosticoId: data.id,
      doenca:        data.disease,
      severidade:    data.severity,
      iniciadoEm:    data.started_at,
      status:        data.status as StatusTratamento,
      etapas:        data.steps.map(s => ({
        description: s.description,
        status:      s.status as StatusEtapa,
      } satisfies EtapaTratamento)),
    };
  }
}
