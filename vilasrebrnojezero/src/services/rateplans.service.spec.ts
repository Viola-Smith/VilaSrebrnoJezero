import { TestBed } from '@angular/core/testing';

import { RateplansService } from './rateplans.service';

describe('RateplansService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RateplansService = TestBed.get(RateplansService);
    expect(service).toBeTruthy();
  });
});
