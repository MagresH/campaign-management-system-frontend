import {TestBed} from '@angular/core/testing';

import {AccountBalanceService} from './account-balance.service';

describe('AccountBalanceService', () => {
  let service: AccountBalanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccountBalanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
