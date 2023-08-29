import { Location } from '@angular/common';

export class Config {
  public route: string;
  public url: string;
  public domainAndApp: string;
  constructor(private location: Location) {
    this.route = this.location.path();
    this.url = window.location.href;
    this.domainAndApp = this.url.replace(this.route, '');
  }
}
