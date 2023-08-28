import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AddQuestionComponent } from "../../pages/add-question/add-question.component";
import { environment } from "../../../environments/environment";
import { Oauth2callbackComponent } from "../../components/oauth2callback/oauth2callback.component";
import { OauthLogoutcallbackComponent } from "../../components/oauth-logoutcallback/oauth-logoutcallback.component";
import { AddCriteriaComponent } from "../../pages/add-criteria/add-criteria.component";
import { CriteriaComponent } from "../../pages/criteria/criteria.component";

const routes: Routes = [
  {
    path: "questions/new",
    component: AddQuestionComponent
  },
  {
    path: "criteria/new",
    component: AddCriteriaComponent
  },
  {
    path: "criteria",
    component: CriteriaComponent
  },
  {
    path: "oauth2callback",
    component: Oauth2callbackComponent
  },
  {
    path: "oauthLogoutcallback",
    component: OauthLogoutcallbackComponent
  },
  {
    path: "",
    // component: CriteriaComponent
    redirectTo: "criteria",
    pathMatch: "full"
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // onSameUrlNavigation: "reload"
      // enableTracing: true
    })
  ],
  exports: [RouterModule]
})
export class RoutingModule {}
