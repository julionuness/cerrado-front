import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPreview } from './upload-preview';

describe('UploadPreview', () => {
  let component: UploadPreview;
  let fixture: ComponentFixture<UploadPreview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadPreview],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadPreview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
