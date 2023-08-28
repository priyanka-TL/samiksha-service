module.exports = {
  async up(db) {
    global.migrationMsg = "Created static link for tutorial video."

    await db.collection('staticLinks').createIndex({ appType:1 });

    await db.collection('staticLinks').updateMany({}, { $set: { "appType": (process.env.MOBILE_APPLICATION_APP_TYPE && process.env.MOBILE_APPLICATION_APP_TYPE != "") ? process.env.MOBILE_APPLICATION_APP_TYPE : "assessment" } })

    let tutorialVideoLink = {
      value: "tutorial-video",
      appType: (process.env.MOBILE_APPLICATION_APP_TYPE && process.env.MOBILE_APPLICATION_APP_TYPE != "") ? process.env.MOBILE_APPLICATION_APP_TYPE : "assessment",
      link: "",
      title: "Tutorial Video",
      metaInformation : {
        videos : [ 
          {
              "value" : "video1",
              "title" : "How to create observations and see reports?",
              "link" : "https://youtu.be/ovqDe_G7ct8"
          }
        ]
      },
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      status: "active",
      isDeleted: false
    }

    return await db.collection('staticLinks').insertMany([
      tutorialVideoLink
    ]);

  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
