import { TestBed } from '@angular/core/testing';

import { HeaderTextService } from './header-text.service';

describe('HeaderTextService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HeaderTextService = TestBed.get(HeaderTextService);
    expect(service).toBeTruthy();
  });
});
