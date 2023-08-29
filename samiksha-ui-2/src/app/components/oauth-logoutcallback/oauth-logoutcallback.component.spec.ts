import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OauthLogoutcallbackComponent } from './oauth-logoutcallback.component';

describe('OauthLogoutcallbackComponent', () => {
  let component: OauthLogoutcallbackComponent;
  let fixture: ComponentFixture<OauthLogoutcallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OauthLogoutcallbackComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OauthLogoutcallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
