module.exports = {
  async up(db) {
    const kendraServiceHelper = require('../generics/services/kendra');

    global.migrationMsg = 'Upload survey and feedback image';

    let surveyInformation = {
      name: 'Survey and Feedback',
      externalId: 'survey',
      createdAt: new Date(),
      updatedAt: new Date(),
      updatedBy: 'SYSTEM',
      createdBy: 'SYSTEM',
      icon: 'surveyAndFeedback.png',
      isDeleted: false,
      isVisible: true,
      status: 'active',
    };

    await kendraServiceHelper.upload(
      `public/assets/library/${surveyInformation.icon}`,
      `static/library/${surveyInformation.icon}`,
    );

    surveyInformation.icon = 'static/library/' + surveyInformation.icon;

    await db.collection('libraryCategories').insertOne(surveyInformation);
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  },
};
