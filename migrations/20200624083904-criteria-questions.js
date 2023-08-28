module.exports = {
  async up(db) {
    global.migrationMsg = "Add criteria questions";

    await db.collection('criteria').aggregate(
      [
        {
            "$match" : {
                "frameworkCriteriaId" : { $exists : true }
            }
        },
        {
            "$unwind": "$evidences"
        },
        {
            "$unwind": "$evidences.sections"
        },
        {
            "$lookup": {
                "from": "questions",
                "localField": "evidences.sections.questions",
                "foreignField": "_id",
                "as": "evidences.sections.questions"
            }
        },
        {
            "$addFields": {
                "evidences.sections.questions.criteriaId": "$_id"
            }
        },
        {
            "$group": {
                "_id": {
                    "_id": "$_id",
                    "evidences_code": "$evidences.code"
                },
                "name": {
                    "$first": "$name"
                },
                "externalId": {
                    "$first": "$externalId"
                },
                "frameworkCriteriaId": {
                    "$first": "$frameworkCriteriaId"
                },
                "owner": {
                    "$first": "$owner"
                },
                "timesUsed": {
                    "$first": "$timesUsed"
                },
                "weightage": {
                    "$first": "$weightage"
                },
                "description": {
                    "$first": "$description"
                },
                "criteriaType": {
                    "$first": "$criteriaType"
                },
                "score": {
                    "$first": "$score"
                },
                "remarks": {
                    "$first": "$remarks"
                },
                "flag": {
                    "$first": "$flag"
                },
                "resourceType": {
                    "$first": "$resourceType"
                },
                "language": {
                    "$first": "$language"
                },
                "keywords": {
                    "$first": "$keywords"
                },
                "concepts": {
                    "$first": "$concepts"
                },
                "createdFor": {
                    "$first": "$createdFor"
                },
                "rubric": {
                    "$first": "$rubric"
                },
                "evidenceCode": {
                    "$first": "$evidences.code"
                },
                "sections": {
                    "$push": "$evidences.sections"
                }
            }
        },
        {
            "$group": {
                "_id": "$_id._id",
                "name": {
                    "$first": "$name"
                },
                "externalId": {
                    "$first": "$externalId"
                },
                "frameworkCriteriaId": {
                    "$first": "$frameworkCriteriaId"
                },
                "owner": {
                    "$first": "$owner"
                },
                "timesUsed": {
                    "$first": "$timesUsed"
                },
                "weightage": {
                    "$first": "$weightage"
                },
                "description": {
                    "$first": "$description"
                },
                "criteriaType": {
                    "$first": "$criteriaType"
                },
                "score": {
                    "$first": "$score"
                },
                "remarks": {
                    "$first": "$remarks"
                },
                "flag": {
                    "$first": "$flag"
                },
                "resourceType": {
                    "$first": "$resourceType"
                },
                "language": {
                    "$first": "$language"
                },
                "keywords": {
                    "$first": "$keywords"
                },
                "concepts": {
                    "$first": "$concepts"
                },
                "createdFor": {
                    "$first": "$createdFor"
                },
                "rubric": {
                    "$first": "$rubric"
                },
                "evidences": {
                    "$push": {
                        "code": "$evidenceCode",
                        "sections": "$sections"
                    }
                }
            }
        },
        { $out : "criteriaQuestions" }
      ],{ allowDiskUse: true }).toArray();

    return;
  },

  async down(db) {
    // return await db.collection('albums').updateOne({artist: 'The Beatles'}, {$set: {blacklisted: false}});
  }
};
