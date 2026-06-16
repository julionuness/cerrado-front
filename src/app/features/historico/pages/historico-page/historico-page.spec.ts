import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricoPage } from './historico-page';

describe('HistoricoPage', () => {
  let component: HistoricoPage;
  let fixture: ComponentFixture<HistoricoPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoricoPage],
    }).compileComponents();

    fixture = TestBed.createComponent(HistoricoPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
