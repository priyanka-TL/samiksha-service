module.exports = {
  async up(db) {
    global.migrationMsg = "Created static links."

    await db.collection('staticLinks').createIndex({ value: 1 }, { unique: true })

    let privacyPolicyLink = {
      value: "privacyPolicy",
      link: "https://shikshalokam.org/wp-content/uploads/2019/01/data_privacy_policy.html",
      title: "Privacy Policy",
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      status: "active",
      isDeleted: false
    }

    let termsOfUseLink = {
      value: "termsOfUse",
      link: "https://shikshalokam.org/wp-content/uploads/2019/05/Final-ShikshaLokam-Terms-of-Use-MCM-08052019-Clean-copy-1.html",
      title: "Terms of Use",
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      status: "active",
      isDeleted: false
    }


    let faqLink = {
      value: "faq",
      link: "",
      title: "FAQ",
      createdAt: new Date,
      updatedAt: new Date,
      createdBy: "SYSTEM",
      updatedBy: "SYSTEM",
      status: "active",
      isDeleted: false
    }

    return await db.collection('staticLinks').insertMany([
      privacyPolicyLink,
      termsOfUseLink,
      faqLink
    ]);

  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
