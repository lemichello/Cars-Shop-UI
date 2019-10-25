import { TestBed } from '@angular/core/testing';

import { EngineVolumesService } from './engine-volumes.service';

describe('EngineVolumesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EngineVolumesService = TestBed.get(EngineVolumesService);
    expect(service).toBeTruthy();
  });
});
