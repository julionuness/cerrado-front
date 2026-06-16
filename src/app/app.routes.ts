import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/upload/pages/upload-page/upload-page').then(m => m.UploadPage),
  },
  {
    path: 'result',
    loadComponent: () =>
      import('./features/result/pages/result-page/result-page').then(m => m.ResultPage),
  },
  {
    path: 'historico',
    loadComponent: () =>
      import('./features/historico/pages/historico-page/historico-page').then(m => m.HistoricoPage),
  },
  {
    path: 'tratamentos',
    loadComponent: () =>
      import('./features/tratamentos/pages/tratamentos-page/tratamentos-page').then(m => m.TratamentosPage),
  },
  {
    path: 'tratamento/:id',
    loadComponent: () =>
      import('./features/tratamento/pages/tratamento-page/tratamento-page').then(m => m.TratamentoPage),
  },
];