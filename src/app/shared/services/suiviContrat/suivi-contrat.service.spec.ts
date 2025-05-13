import { TestBed } from '@angular/core/testing';

import { SuiviContratService } from './suivi-contrat.service';

describe('SuiviContratService', () => {
  let service: SuiviContratService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuiviContratService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
