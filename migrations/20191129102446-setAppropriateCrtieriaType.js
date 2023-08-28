module.exports = {
  async up(db) {
    
    global.migrationMsg = "Migrated up setAppropriateCriteriaType file";
    let criteriaDocuments = await db.collection('criteria').find({"rubric.levels.L1.expression" :{$eq : ""}}).project({rubric: 1,criteriaType : 1}).toArray();

    if(criteriaDocuments.length>0) {
    
    global.migrationMsg = "Set criteriaType to manual for non algo criteria and update solutions/frameworks accordingly"
    
    await Promise.all(criteriaDocuments.map(async (criteria) => {

      
      if (criteria.criteriaType == "auto") {

        return await db.collection('criteria').findOneAndUpdate({
          _id: criteria._id
        }, { $set: {criteriaType: "manual"}})

      }

    }))

    let frameworkAndSolutionTypes = [
      "observation",
      "assessment"
    ]

    let frameworkDocuments = await db.collection('frameworks').find({"isRubricDriven" : true}).project({themes: 1,isRubricDriven : 1}).toArray();

    await Promise.all(frameworkDocuments.map(async (framework) => {

      
      if (framework.themes.length>0) {

        function getCriteriaIds(themes) {
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

        let allFrameworkCriteriaIds = getCriteriaIds(framework.themes)

        let criteriaDocuments = await db.collection('criteria').find({"_id" :{$in : allFrameworkCriteriaIds},criteriaType:"auto"}).project({_id: 1}).toArray();

        if(criteriaDocuments.length < 1) {
          return await db.collection('frameworks').findOneAndUpdate({
            _id: framework._id
          }, { $set: {isRubricDriven: false}})
        } else {
          return await db.collection('frameworks').findOneAndUpdate({
            _id: framework._id
          }, { $set: {isRubricDriven: true}})
        }

      }

    }))


    let solutionDocuments = await db.collection('solutions').find({"isRubricDriven" : true,"type":{$in:frameworkAndSolutionTypes}}).project({themes: 1,isRubricDriven :1}).toArray();

    await Promise.all(solutionDocuments.map(async (solution) => {

      
      if (solution.themes.length>0) {

        function getCriteriaIds(themes) {
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

        let allSolutionCriteriaIds = getCriteriaIds(solution.themes)

        let criteriaDocuments = await db.collection('criteria').find({"_id" :{$in : allSolutionCriteriaIds},criteriaType:"auto"}).project({_id: 1}).toArray();
        
        if(criteriaDocuments.length < 1) {
          return await db.collection('solutions').findOneAndUpdate({
            _id: solution._id
          }, { $set: {isRubricDriven: false}})
        } else {
          return await db.collection('solutions').findOneAndUpdate({
            _id: solution._id
          }, { $set: {isRubricDriven: true}})
        }

      }

    }))


  }},

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
