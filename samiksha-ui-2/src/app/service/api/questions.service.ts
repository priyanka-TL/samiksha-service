import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { LocalStorageService } from '../localStrage/local-storage.service';
// import { Config } from "../index";

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private options: any;
  constructor(
    private http: HttpClient,
    private _router: Router, // private config: Config
    private localStorage: LocalStorageService,
  ) {}

  getAuthHeaders() {
    let userTokens = JSON.parse(
      this.localStorage.get({
        name: 'userTokens',
      }),
    );

    return (this.options = {
      headers: { 'x-authenticated-user-token': userTokens.accessToken },
    });
  }

  REST(type, url, data) {
    var self = this;
    return new Promise((resolve, reject) => {
      self.http[type](url, data, this.getAuthHeaders()).subscribe(
        (result) => {
          resolve(result);
        },
        (error) => {
          var error_obj = error.error;
          // if (error_obj.code == "1016") {
          //   this._router.navigate(["/login"]);
          // } else {
          reject(error_obj);
          // }
        },
      );
    });
  }
}
