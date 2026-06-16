import { TestBed } from '@angular/core/testing';

import { CameraUpload } from './camera-upload';

describe('CameraUpload', () => {
  let service: CameraUpload;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CameraUpload);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
