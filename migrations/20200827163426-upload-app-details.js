module.exports = {
  async up(db) {

    const request = require('request');
    const fs = require("fs");
    const kendraCreateAppDetailsUrl = process.env.KENDRA_APPLICATION_ENDPOINT + "api/v1/apps/create";

    global.migrationMsg = "Upload app details"
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: true}});

    let appDetails = [
      {
        name: "samiksha",
        displayName: "Samiksha",
        description: "Get the app to discover more",
        logo: "samiksha.png",
        playstoreLink: "https://play.google.com/store/apps/details?id=org.shikshalokam.samiksha",
        appStoreLink: "https://apps.apple.com/in/app/shikshalokam-samiksha/id1442066610",
        status: "active"
      },
      {
        name: "darpan",
        displayName: "Darpan",
        description: "Get the app to discover more",
        logo: "darpan.jpg",
        playstoreLink: "https://play.google.com/store/apps/details?id=org.shikshalokam.samiksha.darpan",
        appStoreLink: "https://apps.apple.com/us/app/darpan/id1480404451",
        status: "active"
      },
      {
        name: "sdi",
        displayName: "SDI",
        description: "Get the app to discover more",
        logo: "sdi.png",
        playstoreLink: "https://play.google.com/store/apps/details?id=org.shikshalokam.samiksha.dcpcr",
        appStoreLink: "https://apps.apple.com/in/app/school-development-index/id1444625872",
        status: "active"
      },
      {
        name: "pallithalam",
        displayName: "Palli Thalam",
        description: "Get the app to discover more",
        logo: "pallithalam.png",
        playstoreLink: "https://play.google.com/store/apps/details?id=org.shikshalokam.samiksha.palliThalam",
        appStoreLink: "",
        status: "active"
      },
      {
        name: "ecekar",
        displayName: "ECE-KAR",
        description: "Get the app to discover more",
        logo: "ecekar.png",
        playstoreLink: "https://play.google.com/store/apps/details?id=org.shikshalokam.samiksha.kps",
        appStoreLink: "",
        status: "active"
      }
    ]
     
    for (let app = 0; app < appDetails.length; app++) {
      await makeCallToKendra(appDetails[app])
    }

    async function makeCallToKendra(app) {
      return new Promise(async function (resolve, reject) {

        let formData = request.post(kendraCreateAppDetailsUrl, {
          headers: {
            "internal-access-token": process.env.INTERNAL_ACCESS_TOKEN
          }
        }, function (err, response) {
          if (err) {
            throw err;
          }
          else {
            return resolve()
          }
        });

        let form = formData.form();
        form.append("name", app.name);
        form.append("displayName", app.displayName);
        form.append("description", app.description);
        form.append("playstoreLink", app.playstoreLink);
        form.append("appStoreLink", app.appStoreLink);
        form.append("status", app.status);
        form.append("logo", fs.createReadStream(`public/assets/apps/${app.logo}`));
      })
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};