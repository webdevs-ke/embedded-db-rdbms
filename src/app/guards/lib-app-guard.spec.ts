import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { cpanelGuard } from './lib-app-guard';

describe('cpanelGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => cpanelGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
