
module.exports = class insightsHelper {

    static generate(submissionId) {

        return new Promise(async (resolve, reject) => {
            try {
          
                let submissionsQueryObject = {
                  _id: submissionId,
                  ratingCompletedAt : {$exists : true}
                }
          
                let submissionsProjectionObject = {
                  entityId: 1,
                  programId: 1,
                  "criteria.name": 1,
                  "criteria.score": 1,
                  "criteria._id": 1,
                  entityExternalId: 1,
                  "entityInformation.name" : 1,
                  programExternalId: 1,
                  createdAt: 1,
                  completedDate: 1,
                  ratingCompletedAt : 1,
                  solutionId: 1,
                  solutionExternalId: 1
                }
          
                let submissionDocument = await database.models.submissions.findOne(
                  submissionsQueryObject,
                  submissionsProjectionObject
                ).lean();
                
                if(!submissionDocument._id) {
                  throw messageConstants.apiResponses.SUBMISSION_NOT_FOUND;
                }
          
                let solutionDocument = await database.models.solutions.findOne(
                  {_id : submissionDocument.solutionId},
                  {themes : 1, scoringSystem : 1, levelToScoreMapping : 1,criteriaLevelReport : 1}
                );
          
                if(!solutionDocument._id) {
                  throw messageConstants.apiResponses.SOLUTION_NOT_FOUND;
                }
                
                let criteriaScore = _.keyBy(submissionDocument.criteria, '_id')
          
                let scoreThemes =  function (themes,levelToScoreMapping,criteriaScore,hierarchyLevel = 0,hierarchyTrack = [],themeScores = [],criteriaScores = []) {
                  
                  themes.forEach(theme => {
                    if (theme.children) {
                      theme.hierarchyLevel = hierarchyLevel
                      theme.hierarchyTrack = hierarchyTrack
          
                      let hierarchyTrackToUpdate = [...hierarchyTrack]
                      hierarchyTrackToUpdate.push(_.pick(theme,["type","label","externalId","name"]))
          
                      scoreThemes(theme.children,levelToScoreMapping,criteriaScore,hierarchyLevel+1,hierarchyTrackToUpdate,themeScores,criteriaScores)
                      let themeScore = 0
                      let criteriaLevelCount = {}
                      for(var k in levelToScoreMapping) criteriaLevelCount[k]=0;
                      let criteriaScoreNotAvailable = false
          
                      theme.children.forEach(subTheme => {
                        if(subTheme.score == "NA") {
                          criteriaScoreNotAvailable = true
                        } else {
                          if(subTheme.score) {
                            themeScore += (subTheme.weightage * subTheme.score / 100 )
                          }
                          if(subTheme.criteriaLevelCount) {
                            Object.keys(subTheme.criteriaLevelCount).forEach(level => {
                              criteriaLevelCount[level] += subTheme.criteriaLevelCount[level]
                            })
                          }
                        }
                      })
                      theme.score = (!criteriaScoreNotAvailable) ? themeScore.toFixed(2) : "NA"
                      theme.criteriaLevelCount = criteriaLevelCount
          
                      themeScores.push(_.omit(theme,["children"]))
                    } else {
          
                      theme.hierarchyLevel = hierarchyLevel
                      theme.hierarchyTrack = hierarchyTrack
          
                      let hierarchyTrackToUpdate = [...hierarchyTrack]
                      hierarchyTrackToUpdate.push(_.pick(theme,["type","label","externalId","name"]))
          
                      let criteriaScoreArray = new Array
                      let themeScore = 0
                      let criteriaLevelCount = {}
                      for(var k in levelToScoreMapping) criteriaLevelCount[k]=0;
                      let criteriaScoreNotAvailable = false
                      theme.criteria.forEach(criteria => {
                        if(criteriaScore[criteria.criteriaId.toString()]) {
                          criteriaScoreArray.push({
                            name : criteriaScore[criteria.criteriaId.toString()].name,
                            level : criteriaScore[criteria.criteriaId.toString()].score,
                            score : levelToScoreMapping[criteriaScore[criteria.criteriaId.toString()].score] ? levelToScoreMapping[criteriaScore[criteria.criteriaId.toString()].score].points : "NA",
                            weight : criteria.weightage,
                            hierarchyLevel : hierarchyLevel+1,
                            hierarchyTrack : hierarchyTrackToUpdate
                          })
                          if(criteriaScoreArray[criteriaScoreArray.length - 1].score == "NA") {
                            criteriaScoreNotAvailable = true
                          } else {
                            themeScore += (criteria.weightage * levelToScoreMapping[criteriaScore[criteria.criteriaId.toString()].score].points / 100 )
                            criteriaLevelCount[criteriaScore[criteria.criteriaId.toString()].score] += 1
                          }
                        }
                      })
                      theme.criteria = criteriaScoreArray
                      theme.score = (!criteriaScoreNotAvailable) ? themeScore.toFixed(2) : "NA"
                      theme.criteriaLevelCount = criteriaLevelCount
          
                      criteriaScores.push(...criteriaScoreArray)
                      themeScores.push(_.omit(theme,["criteria"]))
                    }
                  })
          
                  return {
                    themeScores : themeScores,
                    criteriaScores: criteriaScores
                  }
                }
          
                let themeAndCriteriaScores = scoreThemes(solutionDocument.themes,solutionDocument.levelToScoreMapping,criteriaScore,0,[])
                _.merge(submissionDocument,themeAndCriteriaScores)
          
                submissionDocument.submissionId = submissionDocument._id
                submissionDocument.entityName = submissionDocument.entityInformation.name
                _.merge(submissionDocument, _.omit(solutionDocument,["themes"]))
          
                let score = 0
                let criteriaLevelCount = {}
                for(var k in solutionDocument.levelToScoreMapping) criteriaLevelCount[k]=0;
                let criteriaScoreNotAvailable = false
          
                solutionDocument.themes.forEach(theme => {
                  if(theme.score == "NA") {
                    criteriaScoreNotAvailable = true
                  } else {
                    if(theme.score) {
                      score += (theme.weightage * theme.score / 100 )
                    }
                    if(theme.criteriaLevelCount) {
                      Object.keys(theme.criteriaLevelCount).forEach(level => {
                        criteriaLevelCount[level] += theme.criteriaLevelCount[level]
                      })
                    }
                  }
                })
                
                submissionDocument.score = (!criteriaScoreNotAvailable) ? score.toFixed(2) : "NA"
                submissionDocument.criteriaLevelCount = criteriaLevelCount
          
                submissionDocument.submissionStartedAt = submissionDocument.createdAt
                submissionDocument.submissionCompletedAt = submissionDocument.completedDate
          
                delete submissionDocument.createdAt
                delete submissionDocument._id
                delete submissionDocument.updatedAt
          
                await database.models.insights.findOneAndUpdate(
                  {submissionId : submissionDocument.submissionId},
                  _.pick(submissionDocument,Object.keys(database.models.insights.schema.paths)),
                  {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    returnNewDocument: true
                  }
                );
          
                return resolve({message : messageConstants.apiResponses.INSIGHTS_FETCHED});
          
          
              } catch (error) {
                return reject(error);
              }

        })

    }


    static insightsDocument(programId,entityIds) {

        return new Promise(async (resolve, reject) => {
            try {

                let insightDocument = await database.models.insights.find(
                    {
                        programExternalId: programId,
                        entityId: {$in:entityIds}
                    },
                    {
                        entityId: 1,
                        solutionId: 1
                    }
                ).lean()
          
                return resolve(insightDocument);
          
          
              } catch (error) {
                return reject(error);
              }

        })

    }


};