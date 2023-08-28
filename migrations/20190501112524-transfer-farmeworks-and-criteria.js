module.exports = {
  async up(db) {

    global.migrationMsg = "Migrated up transfer-frameworks-and-criteria file";
  
    if (process.env.TRANSFER_FROM_DB !== "") {
      let sourceDB = global.transferFromDb;
      let evaluationFrameworks = await sourceDB.collection('evaluationFrameworks').find({}).toArray();

      let allCriteria = await sourceDB.collection('criterias').find({}).toArray();

      let solutionCriteriaToFrameworkCriteriaMap = {}

      allCriteria.forEach(criteria => {
        solutionCriteriaToFrameworkCriteriaMap[criteria._id.toString()] = ""
      })

      await db.collection('criteria').insertMany(allCriteria);

      await Promise.all(evaluationFrameworks.map(async (eachFrameworkDocument) => {

        let solutionIdToUpdate = eachFrameworkDocument._id

        let updateThemes = function (themes) {
          themes.forEach(theme => {
            let criteriaIdArray = new Array
            let themeCriteriaToSet = new Array
            if (theme.children) {
              updateThemes(theme.children);
            } else {
              criteriaIdArray = theme.criteria;
              criteriaIdArray.forEach(eachCriteriaId => {
                themeCriteriaToSet.push({
                  criteriaId: solutionCriteriaToFrameworkCriteriaMap[eachCriteriaId.criteriaId.toString()],
                  weightage: eachCriteriaId.weightage
                })
              })
              theme.criteria = themeCriteriaToSet
            }
          })
          return true;
        }

        let getCriteriaIds = function (themes) {
          let allCriteriaIds = [];
          themes.forEach(theme => {
            let criteriaIdArray = [];
            if (theme.children) {
              criteriaIdArray = getCriteriaIds(theme.children);
            } else {
              criteriaIdArray = theme.criteria;
            }
            criteriaIdArray.forEach(eachCriteria => {
              if (eachCriteria.criteriaId) {
                allCriteriaIds.push(eachCriteria.criteriaId);
              } else {
                allCriteriaIds.push(eachCriteria);
              }
            })
          })
          return allCriteriaIds;
        }

        let frameworkCriteriaArray = getCriteriaIds(eachFrameworkDocument.themes)

        let frameworkCriteria = await db.collection('criteria').find({ _id: { $in: frameworkCriteriaArray } }).toArray();

        await Promise.all(frameworkCriteria.map(async (criteria) => {
          let newCriteriaId = await db.collection('criteria').insertOne(_.omit(criteria, ["_id"]))
          if (newCriteriaId.insertedId) {
            solutionCriteriaToFrameworkCriteriaMap[criteria._id.toString()] = newCriteriaId.insertedId
            await db.collection('criteria').findOneAndUpdate({
              _id: criteria._id
            }, { $set: { frameworkCriteriaId: newCriteriaId.insertedId } })
          }
        }))

        updateThemes(eachFrameworkDocument.themes)

        eachFrameworkDocument.noOfRatingLevels = 4
        eachFrameworkDocument.isRubricDriven = true

        eachFrameworkDocument.isDeleted = false
        eachFrameworkDocument.updatedBy = (eachFrameworkDocument.updatedBy) ? eachFrameworkDocument.updatedBy : "INITIALIZE"
        eachFrameworkDocument.createdBy = (eachFrameworkDocument.updatedBy) ? eachFrameworkDocument.updatedBy : "INITIALIZE"
        eachFrameworkDocument.createdAt = (eachFrameworkDocument.createdAt) ? eachFrameworkDocument.createdAt : new Date
        eachFrameworkDocument.updatedAt = (eachFrameworkDocument.updatedAt) ? eachFrameworkDocument.updatedAt : new Date

        let frameworkId = await db.collection('frameworks').insertOne(_.omit(eachFrameworkDocument, ["_id"]))
        if (frameworkId.insertedId) {
          await db.collection('solutions').findOneAndUpdate({
            "_id": solutionIdToUpdate
          }, { $set: { frameworkId: frameworkId.insertedId, frameworkExternalId: eachFrameworkDocument.externalId } })
        }

        return true
      }))

      global.migrationMsg = "Total evaluationFrameworks transferred - " + evaluationFrameworks.length + " and total criteria transferred - " + allCriteria.length

      return
    }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
