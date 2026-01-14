import { TestBed } from '@angular/core/testing';

import { SqlEngineService } from './sql-engine.service';

describe('SqlEngineService', () => {
  let service: SqlEngineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SqlEngineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
