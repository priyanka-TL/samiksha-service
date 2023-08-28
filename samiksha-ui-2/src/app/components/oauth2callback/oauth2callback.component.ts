import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../service/auth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "sl-oauth2callback",
  templateUrl: "./oauth2callback.component.html",
  styleUrls: ["./oauth2callback.component.scss"]
})
export class Oauth2callbackComponent implements OnInit {
  constructor(
    private activeRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    const queryParams = this.activeRoute.snapshot.queryParams;
    const routeParams = this.activeRoute.snapshot.params;

    // do something with the parameters
    console.log(queryParams, routeParams);
    this.authService
      .doOAuthStepTwo(queryParams.code)
      .then(result => {
        if (result.ok) {
          this.router.navigateByUrl("/");
        }
        console.log("result---->", result.ok);
      })
      .catch(
        console.error
        );
  }
}
