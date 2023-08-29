import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Http, URLSearchParams } from '@angular/http';
import { LocalStorageService } from '../localStrage/local-storage.service';
import * as jwt_decode from 'jwt-decode';

import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AppConfigs } from './conf';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUser: any = {};
  private redirect_url: string;

  private logout_url: string;

  private auth_url: string;

  private base_url: string;

  private logout_redirect_url: string;

  constructor(
    public http: Http,
    private localStorage: LocalStorageService,
  ) {
    this.base_url = environment.keycloakBaseUrl;
    this.redirect_url = AppConfigs.keyCloak.redirection_url;
    this.auth_url =
      this.base_url +
      '/auth/realms/sunbird/protocol/openid-connect/auth?response_type=code&scope=openid&client_id=sl-ionic-connect&redirect_uri=' +
      this.redirect_url;
  }

  doOAuthStepOne() {
    window.location.href = this.auth_url;
  }

  doOAuthStepTwo(token: string): Promise<any> {
    // let bodyString =
    //   "grant_type=authorization_code&client_id=sl-ionic-connect&code=" +
    //   token +
    //   "&redirect_uri=" +
    //   this.redirect_url +
    //   "&scope=offline_access";
    const body = new URLSearchParams();
    body.set('grant_type', 'authorization_code');
    body.set('client_id', 'sl-ionic-connect');
    body.set('code', token);
    body.set('redirect_uri', this.redirect_url);
    body.set('scope', 'offline_access');
    // body.set("credentials", "false");
    // //console.log(body);
    return new Promise((resolve) => {
      this.http.post(this.base_url + AppConfigs.keyCloak.getAccessToken, body).subscribe(
        (data: any) => {
          let parsedData = JSON.parse(data._body);
          let userTokens = {
            accessToken: parsedData.access_token,
            refreshToken: parsedData.refresh_token,
            idToken: parsedData.id_token,
          };

          let userDetails = jwt_decode(userTokens.accessToken);
          // //console.log(JSON.stringify(userTokens));
          this.localStorage.put({
            name: 'userTokens',
            value: JSON.stringify(userTokens),
          });
          this.localStorage.put({
            name: 'userDetails',
            value: JSON.stringify(userDetails),
          });

          // this.currentUser.setCurrentUserDetails(userTokens);
          // var userDetails = jwt_decode(parsedData.access_token);
          resolve(data);
        },
        (error) => {
          resolve(error);
        },
      );
    });
  }

  getRefreshToken(): Promise<any> {
    let self = this;
    let userTokens = JSON.parse(
      this.localStorage.get({
        name: 'userTokens',
      }),
    );
    return new Promise(function (resolve, reject) {
      // //console.log("Refres token function");
      const body = new HttpParams();
      body.set('grant_type', 'refresh_token');
      body.set('client_id', 'sl-ionic-connect');
      body.set('refresh_token', userTokens.refreshToken);
      // body.set('scope', "offline_access");
      // //console.log("refresh_token " + userTokens);
      // //console.log(userTokens.refreshToken);
      // //console.log(AppConfigs.app_url + AppConfigs.keyCloak.getAccessToken);

      self.http.post(AppConfigs.app_url + AppConfigs.keyCloak.getAccessToken, body).subscribe(
        (data: any) => {
          //console.log(JSON.stringify(data));
          //console.log(JSON.parse(data._data));
          let parsedData = JSON.parse(data._body);

          let userTokens = {
            accessToken: parsedData.access_token,
            refreshToken: parsedData.refresh_token,
            idToken: parsedData.id_token,
          };

          // //console.log(parsedData);

          self.localStorage.put({
            name: 'userTokens',
            value: JSON.stringify(userTokens),
          });
          resolve(userTokens);
        },
        (error) => {
          // //console.log("error " + JSON.stringify(error));
          reject();
        },
      );
    });
  }

  doLogout() {
    // this.localStorage.clearAll();
    let logout_redirect_url = AppConfigs.keyCloak.logout_redirect_url;
    let logout_url =
      AppConfigs.app_url + '/auth/realms/sunbird/protocol/openid-connect/logout?redirect_uri=' + logout_redirect_url;

    let userDetails = JSON.parse(
      this.localStorage.get({
        name: 'userDetails',
      }),
    );

    userDetails.exp = Date.now() / 1000;

    this.localStorage.put({
      name: 'userDetails',
      value: JSON.stringify(userDetails),
    });

    // //console.log(logout_url);
    window.location.href = logout_url;
  }

  validateApiToken(): Promise<any> {
    let userTokens = JSON.parse(
      this.localStorage.get({
        name: 'userTokens',
      }),
    );
    let userDetails = JSON.parse(this.localStorage.get({ name: 'userDetails' }));

    return new Promise((resolve, reject) => {
      //console.log("Utils: validate token");
      //console.log(userDetails.exp + " " + Date.now);
      if (userDetails.exp <= Date.now() / 1000) {
        //console.log("Utils: invalid token");
        const body = new URLSearchParams();
        body.set('grant_type', 'refresh_token');
        body.set('client_id', 'sl-ionic-connect');
        body.set('refresh_token', userTokens.refreshToken);
        //console.log(userTokens.refreshToken);
        const url = environment.keycloakBaseUrl + AppConfigs.keyCloak.getAccessToken;
        //console.log(url);

        this.http.post(url, body).subscribe(
          (data: any) => {
            //console.log("Utils: received validated token");
            //console.log(data._body);
            let parsedData = JSON.parse(data._body);
            let userTokens = {
              accessToken: parsedData.access_token,
              refreshToken: parsedData.refresh_token,
              idToken: parsedData.id_token,
            };
            this.localStorage.put({
              name: 'userTokens',
              value: JSON.stringify(userTokens),
            });
            resolve(userTokens);
          },
          (error) => {
            // this.currentUser.removeUser();
            //console.log("Utils: Logout,token invalid");
            //console.log("error " + JSON.stringify(error));
            reject({ status: '401' });
          },
        );
      } else {
        //console.log("Utils: valid token");
        resolve(userTokens);
      }
    });
  }
}
