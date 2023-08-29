import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  host: string;
  api: any;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
  ) {
    this.host = environment.apiHost;
    this.api = {
      createCriteria: { uri: this.host + '/criterias/insert', method: 'post' },
      getCriteriaAndQuestion: {
        uri: this.host + '/criterias/getCriteriasParentQuesAndInstParentQues',
        method: 'get',
      },
      saveQuestion: {
        uri: this.host + '/criterias/addQuestion',
        method: 'post',
      },
    };
  }

  reqHandler(name: string, data: Object) {
    return this.REST(this.api[name].method, this.api[name].uri, data);
  }

  REST(type, url, data) {
    var self = this;
    return new Promise((resolve, reject) => {
      this.auth.validateApiToken().then((tokens) => {
        //console.log(tokens);
        let options = {
          headers: { 'x-authenticated-user-token': tokens.accessToken },
        };
        self.http[type](url, data || options, options).subscribe(
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
    });
  }
}
