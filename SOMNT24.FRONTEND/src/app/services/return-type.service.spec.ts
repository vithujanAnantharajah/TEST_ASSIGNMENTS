import { TestBed } from '@angular/core/testing';

import { ReturnTypeService } from './return-type.service';

describe('ReturnTypeService', () => {
  let service: ReturnTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReturnTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
