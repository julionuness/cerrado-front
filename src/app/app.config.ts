// Para trocar para o backend real:
//   1. Crie ApiHistoricoRepository (veja historico.repository.ts)
//   2. Troque useValue por useClass: ApiHistoricoRepository
// ─────────────────────────────────────────────

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import {
  HISTORICO_REPO,
  LocalStorageHistoricoRepository,
} from './core/services/historico-repository';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    {
      provide:  HISTORICO_REPO,
      useValue: new LocalStorageHistoricoRepository(),
    },
  ],
};