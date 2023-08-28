module.exports = {
  async up(db) {
    
    const kendraServiceHelper = require("../generics/services/kendra");

    global.migrationMsg = "Upload library images";

    let categories = [
      {
        name : "Individual Assessments",
        externalId : "individual",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        icon : "individualAssessments.png",
        isDeleted : false,
        isVisible : true,
        status : "active"
      },
      {
        name : "Institutional Assessments",
        externalId : "institutional",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        icon : "institutionalAssessments.png",
        isDeleted : false,
        isVisible : true,
        status : "active"
      },
      {
        name : "Observation Solutions",
        externalId : "observation",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        icon : "observationSolutions.png",
        isDeleted : false,
        isVisible : true,
        status : "active"
      },
      {
        name : "Drafts",
        externalId : "drafts",
        createdAt : new Date(),
        updatedAt : new Date(),
        updatedBy : "SYSTEM",
        createdBy : "SYSTEM",
        icon : "drafts.png",
        isDeleted : false,
        isVisible : true,
        status : "active"
      }
    ];

    for( let category = 0 ; category < categories.length; category++ ) {

      await kendraServiceHelper.upload(
        `public/assets/library/${categories[category].icon}`,
        `static/library/${categories[category].icon}`
      );

      categories[category].icon = "static/library/" + categories[category].icon; 
    }

    await db.collection('libraryCategories').insertMany(categories);
    await db.collection('libraryCategories').createIndex({ externalId : 1 });
  
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
