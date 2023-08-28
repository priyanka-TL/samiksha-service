// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// export const environment = {
//   production: false,
//   baseUrl: "assessment/web2/",
//   // apiHost: "http://localhost:4201",
//   apiHost: "https://staginghome.shikshalokam.org/",
//   keycloakBaseUrl:"https://dev.shikshalokam.org",
//   apiBaseEndpoint: "assessment/web2/"
// };

export const environment = {
  production: true,
  baseUrl: "assessment/web2/",
  apiHost: "https://staginghome.shikshalokam.org/slss-assessment-service/api/v1",
  keycloakBaseUrl:"https://staging.shikshalokam.org",
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
