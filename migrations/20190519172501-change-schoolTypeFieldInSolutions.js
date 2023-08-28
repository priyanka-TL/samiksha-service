module.exports = {
  async up(db) {

      global.migrationMsg = "Migrated up change-schoolTypeFieldInSolutions file";
    
      let solutionDocuments = await db.collection('solutions').find({ "entityProfileFieldsPerEntityTypes.A1": { $exists: true } }).project({ "roles": 1, "entityProfileFieldsPerEntityTypes.A1": 1 }).toArray();

      if(solutionDocuments.length >0) {

        global.migrationMsg = "Change schoolTypes to types in solution entity profile fields and in entityTypes collection."
        
        await Promise.all(solutionDocuments.map(async (solution) => {

          let newA1 = new Array
          solution.entityProfileFieldsPerEntityTypes.A1.forEach(A1Fields => {
            if (A1Fields == "schoolType" || A1Fields == "schoolTypes") {
              newA1.push("types")
            } else {
              newA1.push(A1Fields)
            }
          })

        let newRoles = {}
        Object.keys(solution.roles).forEach(role => {
          if (solution.roles[role].acl && solution.roles[role].acl.entityProfile) {
            var editableIndexOfSchoolType = solution.roles[role].acl.entityProfile.editable.indexOf("schoolType");
            var editableIndexOfSchoolTypes = solution.roles[role].acl.entityProfile.editable.indexOf("schoolTypes");

            if (editableIndexOfSchoolType !== -1) {
              solution.roles[role].acl.entityProfile.editable[editableIndexOfSchoolType] = "types";
            }
            if (editableIndexOfSchoolTypes !== -1) {
              solution.roles[role].acl.entityProfile.editable[editableIndexOfSchoolTypes] = "types";
            }

            var visibleIndexOfSchoolType = solution.roles[role].acl.entityProfile.visible.indexOf("schoolType");
            var visibleIndexOfSchoolTypes = solution.roles[role].acl.entityProfile.visible.indexOf("schoolTypes");

            if (visibleIndexOfSchoolType !== -1) {
              solution.roles[role].acl.entityProfile.visible[visibleIndexOfSchoolType] = "types";
            }
            if (visibleIndexOfSchoolTypes !== -1) {
              solution.roles[role].acl.entityProfile.visible[visibleIndexOfSchoolTypes] = "types";
            }

          }
          newRoles[role] = solution.roles[role]
        })

        return await db.collection('solutions').findOneAndUpdate({
          _id: solution._id
        }, { $set: { "entityProfileFieldsPerEntityTypes.A1": newA1, roles: newRoles } })

        }))

        let entityTypeDocuments = await db.collection('entityTypes').find({ "profileFields": { $exists: true } }).project({ "profileFields": 1 }).toArray();

        await Promise.all(entityTypeDocuments.map(async (entityType) => {

          let newProfileFields = new Array
          entityType.profileFields.forEach(eachProfileField => {
            if (eachProfileField == "schoolTypes" || eachProfileField == "schoolType") {
              newProfileFields.push("types")
            } else {
              newProfileFields.push(eachProfileField)
            }
          })

          return await db.collection('entityTypes').findOneAndUpdate({
            _id: entityType._id
          }, { $set: { "profileFields": newProfileFields } })

        }))

        return true
      }
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
