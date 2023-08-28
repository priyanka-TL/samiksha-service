module.exports = class entityAssessorTrackerHelper {

  static filterByDate(params, userIds, solutionId) {
    return new Promise(async (resolve, reject) => {

      let queryObject = {
        assessorUserId: { $in: userIds },
        solutionId: solutionId,
        //formula =  (validFrom <= fromDate && fromDate <= validTo) || (validFrom <= toDate && toDate <= validTo)
        $or:
          [
            {
              validFrom: { $lte: params.fromDate },
              validTo: { $gte: params.fromDate }
            },
            {
              validFrom: { $lte: params.toDate },
              validTo: { $gte: params.toDate }
            },
          ]
      };

      let entityAssessorsTrackersDocuments = await database.models.entityAssessorsTrackers.find(queryObject, { updatedData: 1 }).lean();
      let entityIds = entityAssessorsTrackersDocuments.map(documents => documents.updatedData)
      let result = _.flattenDeep(entityIds);
      return resolve(result);

    })
  }

};