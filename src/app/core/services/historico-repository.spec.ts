import { TestBed } from '@angular/core/testing';

import { HistoricoRepository } from './historico-repository';

describe('HistoricoRepository', () => {
  let service: HistoricoRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HistoricoRepository);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
