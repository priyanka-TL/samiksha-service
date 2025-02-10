const { ObjectId } = require('mongodb');

const {
    entities,
    entityType,
    userRoleExtension
} = require('./entity_sampleData.js');
let solutionData = [
{
    "_id" : new ObjectId("66f4e62d8ea984c17a5b374a"),
    "externalId" : "606d92fa-42d8-11ec-ac61-26092024-1011-OBSERVATION-TEMPLATE",
    "isReusable" : true,
    "name" : "NISHTHA 2.0 Feedback Form",
    "description" : "NISHTHA 2.0 feedback form",
    "author" : "1",
    "resourceType" : [ 
        "Observations Framework"
    ],
    "language" : [ 
        "English"
    ],
    "keywords" : [ 
        "Framework", 
        "Observation", 
        "Feedback form"
    ],
    "concepts" : [],
    "scoringSystem" : null,
    "levelToScoreMapping" : {
        "L1" : {
            "points" : 100,
            "label" : "Good"
        }
    },
    "themes" : [ 
        {
            "type" : "theme",
            "label" : "theme",
            "name" : "Observation Theme",
            "externalId" : "OB",
            "weightage" : 100,
            "criteria" : [ 
                {
                    "criteriaId" : new ObjectId("66f4e62d8ea984c17a5b3748"),
                    "weightage" : 100
                }
            ]
        }
    ],
    "flattenedThemes" : [],
    "entityType" : "state",
    "type" : "observation",
    "subType" : "",
    "entities" : [],
    "registry" : [],
    "frameworkId" : new ObjectId("66f4e6208ea984c17a5b3744"),
    "frameworkExternalId" : "606d92fa-42d8-11ec-ac61-26092024-1011",
    "noOfRatingLevels" : 1,
    "isRubricDriven" : false,
    "enableQuestionReadOut" : false,
    "updatedBy" : "2",
    "captureGpsLocationAtQuestionLevel" : false,
    "isAPrivateProgram" : false,
    "allowMultipleAssessemts" : false,
    "isDeleted" : false,
    "pageHeading" : "Domains",
    "minNoOfSubmissionsRequired" : 1,
    "rootOrganisations" : [],
    "createdFor" : [],
    "updatedAt" : new Date("2024-09-26T04:42:43.860Z"),
    "createdAt" : new Date("2021-11-11T10:16:02.564Z"),
    "deleted" : false,
    "__v" : 0,
    "evidenceMethods" : {
        "OB" : {
            "externalId" : "OB",
            "tip" : null,
            "name" : "Observation",
            "description" : null,
            "modeOfCollection" : "onfield",
            "canBeNotApplicable" : false,
            "notApplicable" : false,
            "canBeNotAllowed" : false,
            "remarks" : null
        }
    },
    "sections" : {
        "S1" : "Observation Question"
    },
    "status" : "active",
    "scope":{
        "state" : [ 
            entities[0]._id.toString()
        ],
        "roles" : [ 
            "district_education_officer", 
            "TEACHER",
            "state_education_officer", 
        ],
        "entityType" : entityType[0].name
    }
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43dcc"),
    "externalId" : "5b4081c4-a582-11ef-b023-743af4776910-OBSERVATION-TEMPLATE_CHILD",
    "isReusable" : false,
    "name" : "ObservationWithoutRubrics",
    "description" : "Survey Form to understand the challenges that the parents are facing in getting their children enrolled in ELEVATE courses",
    "author" : "162",
    "parentSolutionId" :new ObjectId("673af2bd83466a9d854ac95e"),
    "resourceType" : [
        "Observations Framework"
    ],
    "language" : [
        "English"
    ],
    "keywords" : [
        "Framework",
        "Observation"
    ],
    "concepts" : [

    ],
    "scoringSystem" : null,
    "themes" : [
        {
            "name" : "Observation Theme",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "OB",
            "weightage" : (40),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc5"),
                    "weightage" : (40)
                },
                {
                    "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc4"),
                    "weightage" : (40)
                }
            ]
        }
    ],
    "flattenedThemes" : [

    ],
    "questionSequenceByEcm" : {
        "OB" : {
            "S1" : [
                "Q1_1731916471921-1731916480360",
                "Q2_1731916471921-1731916480363",
                "Q3_1731916471921-1731916480364",
                "Q4_1731916471921-1731916480368",
                "Q5_1731916471921-1731916480369",
                "Q6_1731916471921-1731916480370",
                "Q7_1731916471921-1731916480370",
                "Q8_1731916471921-1731916480372",
                "Q9_1731916471921-1731916480373",
                "Q10_1731916471921-1731916480374",
                "Q11_1731916471921-1731916480375",
                "Q12_1731916471921-1731916480376",
                "Q13_1731916471921-1731916480377",
                "Q14_1731916471921-1731916480378"
            ]
        }
    },
    "entityType" : "state",
    "type" : "observation",
    "subType" : "",
    "entities" : [
        entities[0]._id.toString()
    ],
    "startDate" : new Date("2024-08-20T00:00:00.000+0000"),
    "endDate" : new Date("2029-09-22T00:50:00.000+0000"),
    "status" : "active",
    "evidenceMethods" : {
        "OB" : {
            "externalId" : "OB",
            "tip" : null,
            "name" : "Observation",
            "description" : null,
            "modeOfCollection" : "onfield",
            "canBeNotApplicable" : false,
            "notApplicable" : false,
            "canBeNotAllowed" : false,
            "remarks" : null
        }
    },
    "sections" : {
        "S1" : "Observation Question"
    },
    "registry" : [

    ],
    "frameworkId" : new ObjectId("673af2bc83466a9d854ac956"),
    "frameworkExternalId" : "5b4081c4-a582-11ef-b023-743af4776910",
    "isRubricDriven" : false,
    "enableQuestionReadOut" : false,
    "updatedBy" : "102",
    "captureGpsLocationAtQuestionLevel" : false,
    "creator" : "priyanka",
    "isAPrivateProgram" : false,
    "allowMultipleAssessemts" : true,
    "isDeleted" : false,
    "pageHeading" : "Domains",
    "minNoOfSubmissionsRequired" : (1),
    "rootOrganisations" : [

    ],
    "createdFor" : [
        null
    ],
    "updatedAt" : new Date("2024-11-18T13:30:31.856+0000"),
    "createdAt" : new Date("2024-11-18T07:54:40.619+0000"),
    "deleted" : false,
    "__v" : (0),
    "link" : "42c7d32ac9d0837656aaa6ea2aed34f6",
    "scope" : {
        "state" : [
            entities[0]._id.toString()
        ],
        "roles" : [
            "district_education_officer",
            "user",
            "mentee",
            "session_manager",
            "public",
            "reviewer",
            "state_education_officer"
        ],
        "entityType" : entityType[0].name
    }
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f9d"),
    "externalId" : "dcecf7d8-da26-11ef-99e2-743af4776910-OBSERVATION-TEMPLATE_CHILD",
    "isReusable" : false,
    "name" : "ScoreReportFix",
    "description" : "Observation with rubric (multiplesubmission)",
    "author" : "261",
    "parentSolutionId" : new ObjectId("67934491f6ae00c02d1f5f4c"),
    "resourceType" : [
        "Observations Framework"
    ],
    "language" : [
        "English"
    ],
    "keywords" : [
        "Framework",
        "Observation",
        "Challenges",
        " Enrollment",
        " Parents",
        " Courses"
    ],
    "concepts" : [

    ],
    "scoringSystem" : "pointsBasedScoring",
    "levelToScoreMapping" : {
        "L1" : {
            "points" : (10),
            "label" : "Level 1"
        },
        "L2" : {
            "points" : (20),
            "label" : "Level 2"
        },
        "L3" : {
            "points" : (30),
            "label" : "Level 3"
        }
    },
    "themes" : [
        {
            "name" : "Domain 1",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D1",
            "weightage" : (1),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f84"),
                    "weightage" : (1)
                }
            ],
            "rubric" : {
                "expressionVariables" : {
                    "SCORE" : "D1.sumOfPointsOfAllChildren()"
                },
                "levels" : {
                    "L1" : {
                        "expression" : "(20<=SCORE<=40)"
                    },
                    "L2" : {
                        "expression" : "(40<SCORE<=80)"
                    },
                    "L3" : {
                        "expression" : "(80<SCORE<=100)"
                    }
                }
            }
        },
        {
            "name" : "Domain 2",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D2",
            "weightage" : (1),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f85"),
                    "weightage" : (1)
                },
                {
                    "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f86"),
                    "weightage" : (1)
                }
            ],
            "rubric" : {
                "expressionVariables" : {
                    "SCORE" : "D2.sumOfPointsOfAllChildren()"
                },
                "levels" : {
                    "L1" : {
                        "expression" : "(20<=SCORE<=40)"
                    },
                    "L2" : {
                        "expression" : "(40<SCORE<=80)"
                    },
                    "L3" : {
                        "expression" : "(80<SCORE<=100)"
                    }
                }
            }
        },
        {
            "name" : "Domain 3",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D3",
            "weightage" : (1),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f87"),
                    "weightage" : (1)
                }
            ],
            "rubric" : {
                "expressionVariables" : {
                    "SCORE" : "D3.sumOfPointsOfAllChildren()"
                },
                "levels" : {
                    "L1" : {
                        "expression" : "(20<=SCORE<=40)"
                    },
                    "L2" : {
                        "expression" : "(40<SCORE<=80)"
                    },
                    "L3" : {
                        "expression" : "(80<SCORE<=100)"
                    }
                }
            }
        },
        {
            "name" : "Domain 4",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D4",
            "weightage" : (1),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f88"),
                    "weightage" : (1)
                }
            ],
            "rubric" : {
                "expressionVariables" : {
                    "SCORE" : "D4.sumOfPointsOfAllChildren()"
                },
                "levels" : {
                    "L1" : {
                        "expression" : "(25<=SCORE<=50)"
                    },
                    "L2" : {
                        "expression" : "(50<SCORE<=75)"
                    },
                    "L3" : {
                        "expression" : "(75<SCORE<=100)"
                    }
                }
            }
        }
    ],
    "flattenedThemes" : [
        {
            "name" : "Domain 1",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D1",
            "weightage" : (1),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f84"),
                    "weightage" : (1)
                }
            ],
            "rubric" : {
                "expressionVariables" : {
                    "SCORE" : "D1.sumOfPointsOfAllChildren()"
                },
                "levels" : {
                    "L1" : {
                        "expression" : "(20<=SCORE<=40)"
                    },
                    "L2" : {
                        "expression" : "(40<SCORE<=80)"
                    },
                    "L3" : {
                        "expression" : "(80<SCORE<=100)"
                    }
                }
            },
            "hierarchyLevel" : (0),
            "hierarchyTrack" : [

            ]
        },
        {
            "name" : "Domain 2",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D2",
            "weightage" : (1),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f85"),
                    "weightage" : (1)
                },
                {
                    "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f86"),
                    "weightage" : (1)
                }
            ],
            "rubric" : {
                "expressionVariables" : {
                    "SCORE" : "D2.sumOfPointsOfAllChildren()"
                },
                "levels" : {
                    "L1" : {
                        "expression" : "(20<=SCORE<=40)"
                    },
                    "L2" : {
                        "expression" : "(40<SCORE<=80)"
                    },
                    "L3" : {
                        "expression" : "(80<SCORE<=100)"
                    }
                }
            },
            "hierarchyLevel" : (0),
            "hierarchyTrack" : [

            ]
        },
        {
            "name" : "Domain 3",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D3",
            "weightage" : (1),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f87"),
                    "weightage" : (1)
                }
            ],
            "rubric" : {
                "expressionVariables" : {
                    "SCORE" : "D3.sumOfPointsOfAllChildren()"
                },
                "levels" : {
                    "L1" : {
                        "expression" : "(20<=SCORE<=40)"
                    },
                    "L2" : {
                        "expression" : "(40<SCORE<=80)"
                    },
                    "L3" : {
                        "expression" : "(80<SCORE<=100)"
                    }
                }
            },
            "hierarchyLevel" : (0),
            "hierarchyTrack" : [

            ]
        },
        {
            "name" : "Domain 4",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D4",
            "weightage" : (1),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f88"),
                    "weightage" : (1)
                }
            ],
            "rubric" : {
                "expressionVariables" : {
                    "SCORE" : "D4.sumOfPointsOfAllChildren()"
                },
                "levels" : {
                    "L1" : {
                        "expression" : "(25<=SCORE<=50)"
                    },
                    "L2" : {
                        "expression" : "(50<SCORE<=75)"
                    },
                    "L3" : {
                        "expression" : "(75<SCORE<=100)"
                    }
                }
            },
            "hierarchyLevel" : (0),
            "hierarchyTrack" : [

            ]
        }
    ],
    "questionSequenceByEcm" : {
        "D1_1737704587373" : {
            "SEC1" : [
                "Q1_1737704587373-1737704596488",
                "Q2_1737704587373-1737704596490"
            ]
        },
        "D2_1737704587373" : {
            "SEC2" : [
                "Q5_1737704587373-1737704596491",
                "Q6_1737704587373-1737704596491",
                "Q9_1737704587373-1737704596492"
            ]
        },
        "D3_1737704587373" : {
            "SEC3" : [
                "Q12_1737704587373-1737704596492",
                "Q13_1737704587373-1737704596493"
            ]
        },
        "D4_1737704587373" : {
            "SEC4" : [
                "Q14_1737704587373-1737704596494",
                "Q15_1737704587373-1737704596494"
            ]
        }
    },
    "entityType" : "state",
    "type" : "observation",
    "subType" : "",
    "entities" : [
        entities[0]._id.toString()
    ],
    "startDate" : new Date("2025-01-24T07:43:16.593+0000"),
    "endDate" : new Date("2026-01-24T07:43:16.593+0000"),
    "status" : "active",
    "evidenceMethods" : {
        "D1_1737704587373" : {
            "externalId" : "D1_1737704587373",
            "tip" : null,
            "name" : "Domain 1",
            "description" : null,
            "modeOfCollection" : "onfield",
            "canBeNotApplicable" : "False",
            "notApplicable" : false,
            "canBeNotAllowed" : "False",
            "remarks" : null,
            "sequenceNo" : (1)
        },
        "D2_1737704587373" : {
            "externalId" : "D2_1737704587373",
            "tip" : null,
            "name" : "Domain 2",
            "description" : null,
            "modeOfCollection" : "onfield",
            "canBeNotApplicable" : "True",
            "notApplicable" : false,
            "canBeNotAllowed" : "True",
            "remarks" : null,
            "sequenceNo" : (2)
        },
        "D3_1737704587373" : {
            "externalId" : "D3_1737704587373",
            "tip" : null,
            "name" : "Domain 3",
            "description" : null,
            "modeOfCollection" : "onfield",
            "canBeNotApplicable" : "True",
            "notApplicable" : false,
            "canBeNotAllowed" : "True",
            "remarks" : null,
            "sequenceNo" : (3)
        },
        "D4_1737704587373" : {
            "externalId" : "D4_1737704587373",
            "tip" : null,
            "name" : "Domain 4",
            "description" : null,
            "modeOfCollection" : "onfield",
            "canBeNotApplicable" : "True",
            "notApplicable" : false,
            "canBeNotAllowed" : "True",
            "remarks" : null,
            "sequenceNo" : (4)
        }
    },
    "sections" : {
        "SEC1" : "Planning & Execution",
        "SEC2" : "Data based Governance",
        "SEC3" : "Communication",
        "SEC4" : "Influence"
    },
    "registry" : [

    ],
    "frameworkId" : new ObjectId("67934491f6ae00c02d1f5f3e"),
    "frameworkExternalId" : "dcecf7d8-da26-11ef-99e2-743af4776910",
    "noOfRatingLevels" : (3),
    "isRubricDriven" : true,
    "enableQuestionReadOut" : false,
    "updatedBy" : "261",
    "captureGpsLocationAtQuestionLevel" : false,
    "creator" : "Survey Support",
    "isAPrivateProgram" : false,
    "allowMultipleAssessemts" : false,
    "isDeleted" : false,
    "pageHeading" : "Domains",
    "criteriaLevelReport" : true,
    "minNoOfSubmissionsRequired" : (1),
    "rootOrganisations" : [

    ],
    "createdFor" : [
        null
    ],
    "updatedAt" : new Date("2025-01-24T07:43:17.293+0000"),
    "createdAt" : new Date("2025-01-24T07:43:16.593+0000"),
    "deleted" : false,
    "__v" : (0),
    "link" : "ab1de59e7085e9c446dc719689b2bbb1",
    "scope" : {
        "state" : [
            entities[0]._id.toString()
        ],
        "roles" : [
            "district_education_officer",
            "user",
            "state_education_officer"
        ],
        "entityType" : entityType[0].name
    }
}
]

let criteriaData = [
{
    "_id" : new ObjectId("66f4e5f08ea984c17a5b3741"),
    "externalId" : "PRV_16_09_2024_13_05_163662571997",
    "timesUsed" : 12,
    "weightage" : 20,
    "name" : "Cleanliness",
    "score" : "",
    "remarks" : "",
    "description" : "Cleanliness",
    "resourceType" : [ 
        "Program", 
        "Framework", 
        "Criteria"
    ],
    "language" : [ 
        "English"
    ],
    "keywords" : [ 
        "Keyword 1", 
        "Keyword 2"
    ],
    "concepts" : [ 
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }, 
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }, 
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdFor" : [],
    "rubric" : {
        "name" : "Cleanliness",
        "description" : "Cleanliness",
        "type" : "auto",
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "NA",
                "expression" : ""
            }
        }
    },
    "evidences" : [],
    "flag" : "",
    "criteriaType" : "manual",
    "deleted" : false,
    "updatedAt" : new Date("2024-09-26T04:41:20.008Z"),
    "createdAt" : new Date("2024-09-26T04:41:20.008Z"),
    "__v" : 0
},
{
    "_id" : new ObjectId("66f4e62d8ea984c17a5b3748"),
    "externalId" : "PRV_16_09_2024_13_05_163662571997",
    "timesUsed" : 12,
    "weightage" : 20,
    "name" : "Cleanliness",
    "score" : "",
    "remarks" : "",
    "description" : "Cleanliness",
    "resourceType" : [ 
        "Program", 
        "Framework", 
        "Criteria"
    ],
    "language" : [ 
        "English"
    ],
    "keywords" : [ 
        "Keyword 1", 
        "Keyword 2"
    ],
    "concepts" : [ 
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }, 
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }, 
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdFor" : [],
    "rubric" : {
        "name" : "Cleanliness",
        "description" : "Cleanliness",
        "type" : "auto",
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "NA",
                "expression" : ""
            }
        }
    },
    "evidences" : [ 
        {
            "code" : "OB",
            "sections" : [ 
                {
                    "code" : "S1",
                    "questions" : [ 
                        new ObjectId("66f4e6c78ea984c17a5b3756"), 
                        new ObjectId("66f4e6c78ea984c17a5b375c"), 
                        new ObjectId("66f4e6c78ea984c17a5b3763"), 
                        new ObjectId("66f4e6c78ea984c17a5b3769"), 
                        new ObjectId("66f4e6c78ea984c17a5b376f")
                    ]
                }
            ]
        }
    ],
    "flag" : "",
    "criteriaType" : "manual",
    "frameworkCriteriaId" : new ObjectId("66f4e5f08ea984c17a5b3741"),
    "updatedAt" : new Date("2024-09-26T04:44:55.836Z"),
    "createdAt" : new Date("2024-09-26T04:41:20.008Z"),
    "deleted" : false,
    "__v" : 0
},
{
    "_id" : new ObjectId("66f4e6d98ea984c17a5b3785"),
    "externalId" : "PRV_16_09_2024_13_05_163662571997-1727325913573",
    "timesUsed" : 12,
    "weightage" : 20,
    "name" : "Cleanliness",
    "score" : "",
    "remarks" : "",
    "description" : "Cleanliness",
    "resourceType" : [ 
        "Program", 
        "Framework", 
        "Criteria"
    ],
    "language" : [ 
        "English"
    ],
    "keywords" : [ 
        "Keyword 1", 
        "Keyword 2"
    ],
    "concepts" : [ 
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }, 
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }, 
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdFor" : [],
    "rubric" : {
        "name" : "Cleanliness",
        "description" : "Cleanliness",
        "type" : "auto",
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "NA",
                "expression" : ""
            }
        }
    },
    "evidences" : [ 
        {
            "code" : "OB",
            "sections" : [ 
                {
                    "code" : "S1",
                    "questions" : [ 
                        new ObjectId("66f4e6d98ea984c17a5b3779"), 
                        new ObjectId("66f4e6d98ea984c17a5b377a"), 
                        new ObjectId("66f4e6d98ea984c17a5b377b"), 
                        new ObjectId("66f4e6d98ea984c17a5b377c"), 
                        new ObjectId("66f4e6d98ea984c17a5b377d")
                    ]
                }
            ]
        }
    ],
    "flag" : "",
    "criteriaType" : "manual",
    "frameworkCriteriaId" : new ObjectId("66f4e5f08ea984c17a5b3741"),
    "parentCriteriaId" : new ObjectId("66f4e62d8ea984c17a5b3748"),
    "updatedAt" : new Date("2024-09-26T04:45:13.574Z"),
    "createdAt" : new Date("2024-09-26T04:41:20.008Z"),
    "deleted" : false,
    "__v" : 0
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43dc5"),
    "externalId" : "C2_1731916471921-1731916480523",
    "timesUsed" : (12),
    "weightage" : (20),
    "name" : "Criteria 2",
    "score" : "",
    "remarks" : "",
    "description" : "Criteria 2",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "language" : [
        "English"
    ],
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdFor" : [

    ],
    "rubric" : {
        "name" : "Criteria 2",
        "description" : "Criteria 2",
        "type" : "auto",
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "NA",
                "expression" : ""
            }
        }
    },
    "evidences" : [
        {
            "code" : "OB",
            "sections" : [
                {
                    "code" : "S1",
                    "questions" : [
                       new ObjectId("673af2c0a193a26bc7f43dac"),
                       new ObjectId("673af2c0a193a26bc7f43dad"),
                       new ObjectId("673af2c0a193a26bc7f43dae"),
                       new ObjectId("673af2c0a193a26bc7f43daf"),
                       new ObjectId("673af2c0a193a26bc7f43db0")
                    ]
                }
            ]
        }
    ],
    "flag" : "",
    "criteriaType" : "manual",
    "frameworkCriteriaId" : new ObjectId("673af2bc83466a9d854ac952"),
    "parentCriteriaId" : new ObjectId("673af2bd83466a9d854ac95b"),
    "updatedAt" : new Date("2024-11-18T07:54:40.529+0000"),
    "createdAt" : new Date("2024-11-18T07:54:36.274+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43dc4"),
    "externalId" : "C1_1731916471921-1731916480520",
    "timesUsed" : (12),
    "weightage" : (20),
    "name" : "Criteria 1",
    "score" : "",
    "remarks" : "",
    "description" : "Criteria 1",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "language" : [
        "English"
    ],
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdFor" : [

    ],
    "rubric" : {
        "name" : "Criteria 1",
        "description" : "Criteria 1",
        "type" : "auto",
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "NA",
                "expression" : ""
            }
        }
    },
    "evidences" : [
        {
            "code" : "OB",
            "sections" : [
                {
                    "code" : "S1",
                    "questions" : [
                        new ObjectId("673af2c0a193a26bc7f43da3"),
                        new ObjectId("673af2c0a193a26bc7f43da4"),
                        new ObjectId("673af2c0a193a26bc7f43da5"),
                        new ObjectId("673af2c0a193a26bc7f43da6"),
                        new ObjectId("673af2c0a193a26bc7f43da7"),
                        new ObjectId("673af2c0a193a26bc7f43da8"),
                        new ObjectId("673af2c0a193a26bc7f43da9"),
                        new ObjectId("673af2c0a193a26bc7f43daa"),
                        new ObjectId("673af2c0a193a26bc7f43dab")
                    ]
                }
            ]
        }
    ],
    "flag" : "",
    "criteriaType" : "manual",
    "frameworkCriteriaId" : new ObjectId("673af2bc83466a9d854ac951"),
    "parentCriteriaId" : new ObjectId("673af2bd83466a9d854ac95a"),
    "updatedAt" : new Date("2024-11-18T07:54:40.529+0000"),
    "createdAt" : new Date("2024-11-18T07:54:36.273+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f84"),
    "externalId" : "D1C1_1737704587373-1737704596521",
    "timesUsed" : (12),
    "weightage" : (20),
    "name" : "Planning & Execution",
    "score" : "",
    "remarks" : "",
    "description" : "Planning & Execution",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "language" : [
        "English"
    ],
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdFor" : [

    ],
    "rubric" : {
        "name" : "Planning & Execution",
        "description" : "Planning & Execution",
        "type" : "manual",
        "expressionVariables" : {
            "SCORE" : "67934494f6ae00c02d1f5f84.scoreOfAllQuestionInCriteria()"
        },
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "For eg. There is no furniture in the classrooms for the teacher and the students",
                "expression" : "20<=SCORE<=40"
            },
            "L2" : {
                "level" : "L2",
                "label" : "Level 2",
                "description" : "There is furniture (a chair and table) fot the teachers but no furniture for the students.",
                "expression" : "40<SCORE<=80"
            },
            "L3" : {
                "level" : "L3",
                "label" : "Level 3",
                "description" : "There is furniture for the most of the students and techars but needs repair.",
                "expression" : "80<SCORE<=100"
            }
        }
    },
    "evidences" : [
        {
            "code" : "D1_1737704587373",
            "sections" : [
                {
                    "code" : "SEC1",
                    "questions" : [
                        new ObjectId("67934494f6ae00c02d1f5f6e"),
                        new ObjectId("67934494f6ae00c02d1f5f6f")
                    ]
                }
            ]
        }
    ],
    "flag" : "",
    "criteriaType" : "auto",
    "frameworkCriteriaId" : new ObjectId("67934490f6ae00c02d1f5f33"),
    "parentCriteriaId" : new ObjectId("67934491f6ae00c02d1f5f42"),
    "updatedAt" : new Date("2025-01-24T07:43:16.526+0000"),
    "createdAt" : new Date("2025-01-24T07:43:12.727+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f85"),
    "externalId" : "D2C1_1737704587373-1737704596522",
    "timesUsed" : (12),
    "weightage" : (20),
    "name" : "Data based Governance",
    "score" : "",
    "remarks" : "",
    "description" : "Data based Governance",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "language" : [
        "English"
    ],
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdFor" : [

    ],
    "rubric" : {
        "name" : "Data based Governance",
        "description" : "Data based Governance",
        "type" : "manual",
        "expressionVariables" : {
            "SCORE" : "67934494f6ae00c02d1f5f85.scoreOfAllQuestionInCriteria()"
        },
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "For eg. There is no furniture in the classrooms for the teacher and the students",
                "expression" : "20<=SCORE<=40"
            },
            "L2" : {
                "level" : "L2",
                "label" : "Level 2",
                "description" : "There is furniture (a chair and table) for the teachers but no furniture for the students.",
                "expression" : "40<SCORE<=80"
            },
            "L3" : {
                "level" : "L3",
                "label" : "Level 3",
                "description" : "There is furniture for the most of the students and techars but needs repair.",
                "expression" : "80<SCORE<=100"
            }
        }
    },
    "evidences" : [
        {
            "code" : "D2_1737704587373",
            "sections" : [
                {
                    "code" : "SEC2",
                    "questions" : [
                        new ObjectId("67934494f6ae00c02d1f5f70")
                    ]
                }
            ]
        }
    ],
    "flag" : "",
    "criteriaType" : "auto",
    "frameworkCriteriaId" : new ObjectId("67934490f6ae00c02d1f5f34"),
    "parentCriteriaId" : new ObjectId("67934491f6ae00c02d1f5f43"),
    "updatedAt" : new Date("2025-01-24T07:43:16.526+0000"),
    "createdAt" : new Date("2025-01-24T07:43:12.728+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f86"),
    "externalId" : "D2C2_1737704587373-1737704596523",
    "timesUsed" : (12),
    "weightage" : (20),
    "name" : "Communication",
    "score" : "",
    "remarks" : "",
    "description" : "Communication",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "language" : [
        "English"
    ],
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdFor" : [

    ],
    "rubric" : {
        "name" : "Communication",
        "description" : "Communication",
        "type" : "manual",
        "expressionVariables" : {
            "SCORE" : "67934494f6ae00c02d1f5f86.scoreOfAllQuestionInCriteria()"
        },
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "For eg. There is no furniture in the classrooms for the teacher and the students",
                "expression" : "20<=SCORE<=40"
            },
            "L2" : {
                "level" : "L2",
                "label" : "Level 2",
                "description" : "There is furniture (a chair and table) fot the teachers but no furniture for the students.",
                "expression" : "40<SCORE<=80"
            },
            "L3" : {
                "level" : "L3",
                "label" : "Level 3",
                "description" : "There is furniture for the most of the students and techars but needs repair.",
                "expression" : "80<SCORE<=100"
            }
        }
    },
    "evidences" : [
        {
            "code" : "D2_1737704587373",
            "sections" : [
                {
                    "code" : "SEC2",
                    "questions" : [
                        new ObjectId("67934494f6ae00c02d1f5f71"),
                        new ObjectId("67934494f6ae00c02d1f5f72")
                    ]
                }
            ]
        }
    ],
    "flag" : "",
    "criteriaType" : "auto",
    "frameworkCriteriaId" :new ObjectId("67934490f6ae00c02d1f5f35"),
    "parentCriteriaId" : new ObjectId("67934491f6ae00c02d1f5f44"),
    "updatedAt" : new Date("2025-01-24T07:43:16.526+0000"),
    "createdAt" : new Date("2025-01-24T07:43:12.728+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f87"),
    "externalId" : "D3C1_1737704587373-1737704596524",
    "timesUsed" : (12),
    "weightage" : (20),
    "name" : "Influence",
    "score" : "",
    "remarks" : "",
    "description" : "Influence",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "language" : [
        "English"
    ],
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdFor" : [

    ],
    "rubric" : {
        "name" : "Influence",
        "description" : "Influence",
        "type" : "manual",
        "expressionVariables" : {
            "SCORE" : "67934494f6ae00c02d1f5f87.scoreOfAllQuestionInCriteria()"
        },
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "For eg. There is no furniture in the classrooms for the teacher and the students",
                "expression" : "20<=SCORE<=40"
            },
            "L2" : {
                "level" : "L2",
                "label" : "Level 2",
                "description" : "There is furniture (a chair and table) fot the teachers but no furniture for the students.",
                "expression" : "40<SCORE<=80"
            },
            "L3" : {
                "level" : "L3",
                "label" : "Level 3",
                "description" : "There is furniture for the most of the students and techars but needs repair.",
                "expression" : "80<SCORE<=100"
            }
        }
    },
    "evidences" : [
        {
            "code" : "D3_1737704587373",
            "sections" : [
                {
                    "code" : "SEC3",
                    "questions" : [
                        new ObjectId("67934494f6ae00c02d1f5f73"),
                        new ObjectId("67934494f6ae00c02d1f5f74")
                    ]
                }
            ]
        }
    ],
    "flag" : "",
    "criteriaType" : "auto",
    "frameworkCriteriaId" : new ObjectId("67934490f6ae00c02d1f5f36"),
    "parentCriteriaId" : new ObjectId("67934491f6ae00c02d1f5f45"),
    "updatedAt" : new Date("2025-01-24T07:43:16.526+0000"),
    "createdAt" : new Date("2025-01-24T07:43:12.728+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f88"),
    "externalId" : "D4C1_1737704587373-1737704596525",
    "timesUsed" : (12),
    "weightage" : (20),
    "name" : "Collaboration",
    "score" : "",
    "remarks" : "",
    "description" : "Collaboration",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "language" : [
        "English"
    ],
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdFor" : [

    ],
    "rubric" : {
        "name" : "Collaboration",
        "description" : "Collaboration",
        "type" : "manual",
        "expressionVariables" : {
            "SCORE" : "67934494f6ae00c02d1f5f88.scoreOfAllQuestionInCriteria()"
        },
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "For eg. There is no furniture in the classrooms for the teacher and the students",
                "expression" : "25<=SCORE<=50"
            },
            "L2" : {
                "level" : "L2",
                "label" : "Level 2",
                "description" : "There is furniture (a chair and table) for the teachers but no furniture for the students.",
                "expression" : "50<SCORE<=75"
            },
            "L3" : {
                "level" : "L3",
                "label" : "Level 3",
                "description" : "There is furniture for the most of the students and techars but needs repair.",
                "expression" : "75<SCORE<=100"
            }
        }
    },
    "evidences" : [
        {
            "code" : "D4_1737704587373",
            "sections" : [
                {
                    "code" : "SEC4",
                    "questions" : [
                        new ObjectId("67934494f6ae00c02d1f5f75"),
                        new ObjectId("67934494f6ae00c02d1f5f76")
                    ]
                }
            ]
        }
    ],
    "flag" : "",
    "criteriaType" : "auto",
    "frameworkCriteriaId" : new ObjectId("67934490f6ae00c02d1f5f37"),
    "parentCriteriaId" : new ObjectId("67934491f6ae00c02d1f5f46"),
    "updatedAt" : new Date("2025-01-24T07:43:16.526+0000"),
    "createdAt" : new Date("2025-01-24T07:43:12.728+0000"),
    "deleted" : false,
    "__v" : (0)
}
]


let criteriaQuestionsData = [
{
    "_id" : new ObjectId("66f4e62d8ea984c17a5b3748"),
    "__v" : 0,
    "concepts" : [ 
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }, 
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }, 
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdAt" : new Date("2024-09-26T04:44:55.787Z"),
    "createdFor" : [],
    "criteriaType" : "manual",
    "deleted" : false,
    "description" : "Cleanliness",
    "evidences" : [ 
        {
            "code" : "OB",
            "sections" : [ 
                {
                    "code" : "S1",
                    "questions" : [ 
                        {
                            "_id" : new ObjectId("66f4e6c78ea984c17a5b3756"),
                            "externalId" : "N111_23_09_2024_15_40_1636625759433",
                            "question" : [ 
                                "Select the medium of the course consumption PRV", 
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [ 
                                {
                                    "value" : "R1",
                                    "label" : "English"
                                }, 
                                {
                                    "value" : "R2",
                                    "label" : "Telugu"
                                }, 
                                {
                                    "value" : "R3",
                                    "label" : "Urdu"
                                }
                            ],
                            "sliderOptions" : [],
                            "children" : [ 
                                new ObjectId("66f4e6c78ea984c17a5b375c")
                            ],
                            "questionGroup" : [ 
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "1",
                            "weightage" : 1,
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "deleted" : false,
                            "updatedAt" : new Date("2024-09-26T04:44:55.796Z"),
                            "createdAt" : new Date("2024-09-26T04:44:55.777Z"),
                            "__v" : 0,
                            "criteriaId" : new ObjectId("66f4e62d8ea984c17a5b3748")
                        }, 
                        {
                            "_id" : new ObjectId("66f4e6c78ea984c17a5b375c"),
                            "externalId" : "N112_23_09_2024_15_40_1636625759433",
                            "question" : [ 
                                "Select the courses that you have enrolled in PRV 2.0", 
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "multiselect",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : [ 
                                {
                                    "operator" : "===",
                                    "value" : [ 
                                        "R1"
                                    ],
                                    "_id" : new ObjectId("66f4e6c78ea984c17a5b3756")
                                }
                            ],
                            "options" : [ 
                                {
                                    "value" : "R1",
                                    "label" : "AP_Sec_1.Curriculum and Inclusive Classrooms"
                                }, 
                                {
                                    "value" : "R2",
                                    "label" : "AP_Sec_2.ICT in Teaching-Learning and Assessment"
                                }, 
                                {
                                    "value" : "R3",
                                    "label" : "AP_Sec_3.Personal-Social Qualities for Holistic Development"
                                }, 
                                {
                                    "value" : "R4",
                                    "label" : "AP_Sec_4.Art Integrated Learning"
                                }, 
                                {
                                    "value" : "R5",
                                    "label" : "AP_Sec_5. Understanding Secondary Stage Learners"
                                }, 
                                {
                                    "value" : "R6",
                                    "label" : "AP_Sec_6. Health and Well-being"
                                }, 
                                {
                                    "value" : "R7",
                                    "label" : "AP_Sec_7. Integrating Gender in Schooling Processes"
                                }, 
                                {
                                    "value" : "R8",
                                    "label" : "AP_Sec_8. School Leadership: Concepts and Applications"
                                }, 
                                {
                                    "value" : "R9",
                                    "label" : "AP_Sec_9. Vocational Education"
                                }
                            ],
                            "sliderOptions" : [],
                            "children" : [],
                            "questionGroup" : [ 
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "2",
                            "weightage" : 1,
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "deleted" : false,
                            "updatedAt" : new Date("2024-09-26T04:44:55.793Z"),
                            "createdAt" : new Date("2024-09-26T04:44:55.793Z"),
                            "__v" : 0,
                            "criteriaId" : new ObjectId("66f4e62d8ea984c17a5b3748")
                        }, 
                        {
                            "_id" : new ObjectId("66f4e6c78ea984c17a5b3763"),
                            "externalId" : "N113_23_09_2024_15_40_1636625759433",
                            "question" : [ 
                                "Select the courses which you have got the certificate.", 
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "multiselect",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [ 
                                {
                                    "value" : "R1",
                                    "label" : "AP_Sec_1.Curriculum and Inclusive Classrooms"
                                }, 
                                {
                                    "value" : "R2",
                                    "label" : "AP_Sec_2.ICT in Teaching-Learning and Assessment"
                                }, 
                                {
                                    "value" : "R3",
                                    "label" : "AP_Sec_3.Personal-Social Qualities for Holistic Development"
                                }, 
                                {
                                    "value" : "R4",
                                    "label" : "AP_Sec_4.Art Integrated Learning"
                                }, 
                                {
                                    "value" : "R5",
                                    "label" : "AP_Sec_5. Understanding Secondary Stage Learners"
                                }, 
                                {
                                    "value" : "R6",
                                    "label" : "AP_Sec_6. Health and Well-being"
                                }, 
                                {
                                    "value" : "R7",
                                    "label" : "AP_Sec_7. Integrating Gender in Schooling Processes"
                                }, 
                                {
                                    "value" : "R8",
                                    "label" : "AP_Sec_8. School Leadership: Concepts and Applications"
                                }, 
                                {
                                    "value" : "R9",
                                    "label" : "AP_Sec_9. Vocational Education"
                                }
                            ],
                            "sliderOptions" : [],
                            "children" : [],
                            "questionGroup" : [ 
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "3",
                            "weightage" : 1,
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "deleted" : false,
                            "updatedAt" : new Date("2024-09-26T04:44:55.807Z"),
                            "createdAt" : new Date("2024-09-26T04:44:55.807Z"),
                            "__v" : 0,
                            "criteriaId" : new ObjectId("66f4e62d8ea984c17a5b3748")
                        }, 
                        {
                            "_id" : new ObjectId("66f4e6c78ea984c17a5b3769"),
                            "externalId" : "N114_23_09_2024_15_40_1636625759433",
                            "question" : [ 
                                "Select the courses that you have enrolled in PRV 2.0", 
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "multiselect",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [ 
                                {
                                    "value" : "R1",
                                    "label" : "AP_Sec_మాడ్యూలు 1: విద్యా ప్రణాళిక మరియు సహిత తరగతి గదులు"
                                }, 
                                {
                                    "value" : "R2",
                                    "label" : "AP_Sec_మాడ్యూలు 2: బోధన, అభ్యసన, మూల్యాంకనంలో ICT ని సమగ్రపరచడం"
                                }, 
                                {
                                    "value" : "R3",
                                    "label" : "AP_Sec_ మాడ్యూలు 3 : వ్యక్తిగత సామాజిక లక్షణాలను అభివృద్ధి చేయడం"
                                }, 
                                {
                                    "value" : "R4",
                                    "label" : "AP_Sec_మాడ్యూలు 4. కళ ఆధారిత అభ్యసనం"
                                }, 
                                {
                                    "value" : "R5",
                                    "label" : "AP_Sec_మాడ్యూలు 5 : మాధ్యమిక దశలోని విద్యార్థులను అర్థం చేసుకోవడం"
                                }, 
                                {
                                    "value" : "R6",
                                    "label" : "AP_Sec_మాడ్యూలు 6 :ఆరోగ్యం మరియు శ్రేయస్సు"
                                }, 
                                {
                                    "value" : "R7",
                                    "label" : "AP_Sec_మాడ్యూలు 7 : పాఠశాల ప్రక్రియలో లింగభావనను సమగ్ర పరచడం"
                                }, 
                                {
                                    "value" : "R8",
                                    "label" : "AP_Sec_మాడ్యూలు 8 : పాఠశాల నాయకత్వం - భావనలు మరియు అనువర్తనాలు"
                                }, 
                                {
                                    "value" : "R9",
                                    "label" : "AP_Sec_9 వృత్తి విద్య"
                                }
                            ],
                            "sliderOptions" : [],
                            "children" : [],
                            "questionGroup" : [ 
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "2",
                            "weightage" : 1,
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "deleted" : false,
                            "updatedAt" : new Date("2024-09-26T04:44:55.821Z"),
                            "createdAt" : new Date("2024-09-26T04:44:55.821Z"),
                            "__v" : 0,
                            "criteriaId" : new ObjectId("66f4e62d8ea984c17a5b3748")
                        }, 
                        {
                            "_id" : new ObjectId("66f4e6c78ea984c17a5b376f"),
                            "externalId" : "N118_23_09_2024_15_40_1636625759433",
                            "question" : [ 
                                "Give a rating on the reading materials available in the course", 
                                ""
                            ],
                            "tip" : "1 is very bad, 5 is very good",
                            "hint" : "",
                            "responseType" : "slider",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [],
                            "sliderOptions" : [],
                            "children" : [],
                            "questionGroup" : [ 
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [],
                            "validation" : {
                                "required" : true,
                                "max" : "5",
                                "min" : "1"
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "4",
                            "weightage" : 1,
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "deleted" : false,
                            "updatedAt" : new Date("2024-09-26T04:44:55.833Z"),
                            "createdAt" : new Date("2024-09-26T04:44:55.833Z"),
                            "__v" : 0,
                            "criteriaId" : new ObjectId("66f4e62d8ea984c17a5b3748")
                        }
                    ]
                }
            ]
        }
    ],
    "externalId" : "PRV_16_09_2024_13_05_163662571997",
    "flag" : "",
    "frameworkCriteriaId" : new ObjectId("66f4e5f08ea984c17a5b3741"),
    "keywords" : [ 
        "Keyword 1", 
        "Keyword 2"
    ],
    "language" : [ 
        "English"
    ],
    "name" : "Cleanliness",
    "owner" : null,
    "remarks" : "",
    "resourceType" : [ 
        "Program", 
        "Framework", 
        "Criteria"
    ],
    "rubric" : {
        "name" : "Cleanliness",
        "description" : "Cleanliness",
        "type" : "auto",
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "NA",
                "expression" : ""
            }
        }
    },
    "score" : "",
    "showRemarks" : null,
    "timesUsed" : 12,
    "updatedAt" : new Date("2024-09-26T04:44:55.840Z"),
    "weightage" : 20
},
{
    "_id" : new ObjectId("66f4e6d98ea984c17a5b3785"),
    "__v" : 0,
    "concepts" : [ 
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }, 
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }, 
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdAt" : new Date("2024-09-26T04:45:13.578Z"),
    "createdFor" : [],
    "criteriaType" : "manual",
    "deleted" : false,
    "description" : "Cleanliness",
    "evidences" : [ 
        {
            "code" : "OB",
            "sections" : [ 
                {
                    "code" : "S1",
                    "questions" : [ 
                        {
                            "_id" : new ObjectId("66f4e6d98ea984c17a5b3779"),
                            "externalId" : "N111_23_09_2024_15_40_1636625759433-1727325913561",
                            "question" : [ 
                                "Select the medium of the course consumption PRV", 
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [ 
                                {
                                    "value" : "R1",
                                    "label" : "English"
                                }, 
                                {
                                    "value" : "R2",
                                    "label" : "Telugu"
                                }, 
                                {
                                    "value" : "R3",
                                    "label" : "Urdu"
                                }
                            ],
                            "sliderOptions" : [],
                            "children" : [ 
                                new ObjectId("66f4e6d98ea984c17a5b377a")
                            ],
                            "questionGroup" : [ 
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "1",
                            "weightage" : 1,
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("66f4e6c78ea984c17a5b3756"),
                            "updatedAt" : new Date("2024-09-26T04:45:13.565Z"),
                            "createdAt" : new Date("2024-09-26T04:44:55.777Z"),
                            "deleted" : false,
                            "__v" : 0,
                            "criteriaId" : new ObjectId("66f4e6d98ea984c17a5b3785")
                        }, 
                        {
                            "_id" : new ObjectId("66f4e6d98ea984c17a5b377a"),
                            "externalId" : "N112_23_09_2024_15_40_1636625759433-1727325913562",
                            "question" : [ 
                                "Select the courses that you have enrolled in PRV 2.0", 
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "multiselect",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : [ 
                                {
                                    "operator" : "===",
                                    "value" : [ 
                                        "R1"
                                    ],
                                    "_id" : new ObjectId("66f4e6d98ea984c17a5b3779")
                                }
                            ],
                            "options" : [ 
                                {
                                    "value" : "R1",
                                    "label" : "AP_Sec_1.Curriculum and Inclusive Classrooms"
                                }, 
                                {
                                    "value" : "R2",
                                    "label" : "AP_Sec_2.ICT in Teaching-Learning and Assessment"
                                }, 
                                {
                                    "value" : "R3",
                                    "label" : "AP_Sec_3.Personal-Social Qualities for Holistic Development"
                                }, 
                                {
                                    "value" : "R4",
                                    "label" : "AP_Sec_4.Art Integrated Learning"
                                }, 
                                {
                                    "value" : "R5",
                                    "label" : "AP_Sec_5. Understanding Secondary Stage Learners"
                                }, 
                                {
                                    "value" : "R6",
                                    "label" : "AP_Sec_6. Health and Well-being"
                                }, 
                                {
                                    "value" : "R7",
                                    "label" : "AP_Sec_7. Integrating Gender in Schooling Processes"
                                }, 
                                {
                                    "value" : "R8",
                                    "label" : "AP_Sec_8. School Leadership: Concepts and Applications"
                                }, 
                                {
                                    "value" : "R9",
                                    "label" : "AP_Sec_9. Vocational Education"
                                }
                            ],
                            "sliderOptions" : [],
                            "children" : [],
                            "questionGroup" : [ 
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "2",
                            "weightage" : 1,
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("66f4e6c78ea984c17a5b375c"),
                            "updatedAt" : new Date("2024-09-26T04:45:13.565Z"),
                            "createdAt" : new Date("2024-09-26T04:44:55.793Z"),
                            "deleted" : false,
                            "__v" : 0,
                            "criteriaId" : new ObjectId("66f4e6d98ea984c17a5b3785")
                        }, 
                        {
                            "_id" : new ObjectId("66f4e6d98ea984c17a5b377b"),
                            "externalId" : "N113_23_09_2024_15_40_1636625759433-1727325913563",
                            "question" : [ 
                                "Select the courses which you have got the certificate.", 
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "multiselect",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [ 
                                {
                                    "value" : "R1",
                                    "label" : "AP_Sec_1.Curriculum and Inclusive Classrooms"
                                }, 
                                {
                                    "value" : "R2",
                                    "label" : "AP_Sec_2.ICT in Teaching-Learning and Assessment"
                                }, 
                                {
                                    "value" : "R3",
                                    "label" : "AP_Sec_3.Personal-Social Qualities for Holistic Development"
                                }, 
                                {
                                    "value" : "R4",
                                    "label" : "AP_Sec_4.Art Integrated Learning"
                                }, 
                                {
                                    "value" : "R5",
                                    "label" : "AP_Sec_5. Understanding Secondary Stage Learners"
                                }, 
                                {
                                    "value" : "R6",
                                    "label" : "AP_Sec_6. Health and Well-being"
                                }, 
                                {
                                    "value" : "R7",
                                    "label" : "AP_Sec_7. Integrating Gender in Schooling Processes"
                                }, 
                                {
                                    "value" : "R8",
                                    "label" : "AP_Sec_8. School Leadership: Concepts and Applications"
                                }, 
                                {
                                    "value" : "R9",
                                    "label" : "AP_Sec_9. Vocational Education"
                                }
                            ],
                            "sliderOptions" : [],
                            "children" : [],
                            "questionGroup" : [ 
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "3",
                            "weightage" : 1,
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("66f4e6c78ea984c17a5b3763"),
                            "updatedAt" : new Date("2024-09-26T04:45:13.565Z"),
                            "createdAt" : new Date("2024-09-26T04:44:55.807Z"),
                            "deleted" : false,
                            "__v" : 0,
                            "criteriaId" : new ObjectId("66f4e6d98ea984c17a5b3785")
                        }, 
                        {
                            "_id" : new ObjectId("66f4e6d98ea984c17a5b377c"),
                            "externalId" : "N114_23_09_2024_15_40_1636625759433-1727325913563",
                            "question" : [ 
                                "Select the courses that you have enrolled in PRV 2.0", 
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "multiselect",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [ 
                                {
                                    "value" : "R1",
                                    "label" : "AP_Sec_మాడ్యూలు 1: విద్యా ప్రణాళిక మరియు సహిత తరగతి గదులు"
                                }, 
                                {
                                    "value" : "R2",
                                    "label" : "AP_Sec_మాడ్యూలు 2: బోధన, అభ్యసన, మూల్యాంకనంలో ICT ని సమగ్రపరచడం"
                                }, 
                                {
                                    "value" : "R3",
                                    "label" : "AP_Sec_ మాడ్యూలు 3 : వ్యక్తిగత సామాజిక లక్షణాలను అభివృద్ధి చేయడం"
                                }, 
                                {
                                    "value" : "R4",
                                    "label" : "AP_Sec_మాడ్యూలు 4. కళ ఆధారిత అభ్యసనం"
                                }, 
                                {
                                    "value" : "R5",
                                    "label" : "AP_Sec_మాడ్యూలు 5 : మాధ్యమిక దశలోని విద్యార్థులను అర్థం చేసుకోవడం"
                                }, 
                                {
                                    "value" : "R6",
                                    "label" : "AP_Sec_మాడ్యూలు 6 :ఆరోగ్యం మరియు శ్రేయస్సు"
                                }, 
                                {
                                    "value" : "R7",
                                    "label" : "AP_Sec_మాడ్యూలు 7 : పాఠశాల ప్రక్రియలో లింగభావనను సమగ్ర పరచడం"
                                }, 
                                {
                                    "value" : "R8",
                                    "label" : "AP_Sec_మాడ్యూలు 8 : పాఠశాల నాయకత్వం - భావనలు మరియు అనువర్తనాలు"
                                }, 
                                {
                                    "value" : "R9",
                                    "label" : "AP_Sec_9 వృత్తి విద్య"
                                }
                            ],
                            "sliderOptions" : [],
                            "children" : [],
                            "questionGroup" : [ 
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "2",
                            "weightage" : 1,
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("66f4e6c78ea984c17a5b3769"),
                            "updatedAt" : new Date("2024-09-26T04:45:13.565Z"),
                            "createdAt" : new Date("2024-09-26T04:44:55.821Z"),
                            "deleted" : false,
                            "__v" : 0,
                            "criteriaId" : new ObjectId("66f4e6d98ea984c17a5b3785")
                        }, 
                        {
                            "_id" : new ObjectId("66f4e6d98ea984c17a5b377d"),
                            "externalId" : "N118_23_09_2024_15_40_1636625759433-1727325913564",
                            "question" : [ 
                                "Give a rating on the reading materials available in the course", 
                                ""
                            ],
                            "tip" : "1 is very bad, 5 is very good",
                            "hint" : "",
                            "responseType" : "slider",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [],
                            "sliderOptions" : [],
                            "children" : [],
                            "questionGroup" : [ 
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [],
                            "validation" : {
                                "required" : true,
                                "max" : "5",
                                "min" : "1"
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "4",
                            "weightage" : 1,
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("66f4e6c78ea984c17a5b376f"),
                            "updatedAt" : new Date("2024-09-26T04:45:13.565Z"),
                            "createdAt" : new Date("2024-09-26T04:44:55.833Z"),
                            "deleted" : false,
                            "__v" : 0,
                            "criteriaId" : new ObjectId("66f4e6d98ea984c17a5b3785")
                        }
                    ]
                }
            ]
        }
    ],
    "externalId" : "PRV_16_09_2024_13_05_163662571997-1727325913573",
    "flag" : "",
    "frameworkCriteriaId" : new ObjectId("66f4e5f08ea984c17a5b3741"),
    "keywords" : [ 
        "Keyword 1", 
        "Keyword 2"
    ],
    "language" : [ 
        "English"
    ],
    "name" : "Cleanliness",
    "owner" : null,
    "remarks" : "",
    "resourceType" : [ 
        "Program", 
        "Framework", 
        "Criteria"
    ],
    "rubric" : {
        "name" : "Cleanliness",
        "description" : "Cleanliness",
        "type" : "auto",
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "NA",
                "expression" : ""
            }
        }
    },
    "score" : "",
    "showRemarks" : null,
    "timesUsed" : 12,
    "updatedAt" : new Date("2024-09-26T04:45:13.578Z"),
    "weightage" : 20
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43dc5"),
    "__v" : (0),
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdAt" : new Date("2024-11-18T07:54:40.578+0000"),
    "createdFor" : [

    ],
    "criteriaType" : "manual",
    "deleted" : false,
    "description" : "Criteria 2",
    "evidences" : [
        {
            "code" : "OB",
            "sections" : [
                {
                    "code" : "S1",
                    "questions" : [
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43dac"),
                            "externalId" : "Q10_1731916471921-1731916480374",
                            "question" : [
                                "Add the student interview responses",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "matrix",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [

                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "instanceIdentifier" : "Student",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [
                                new ObjectId("673af2c0a193a26bc7f43dad"),
                                new ObjectId("673af2c0a193a26bc7f43dae"),
                                new ObjectId("673af2c0a193a26bc7f43daf"),
                                new ObjectId("673af2c0a193a26bc7f43db0")
                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p2",
                            "questionNumber" : "10",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" :new ObjectId("673af2be83466a9d854ac99e"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.877+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc5")
                        },
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43dad"),
                            "externalId" : "Q11_1731916471921-1731916480375",
                            "question" : [
                                "When did you last take a course on ELEVATE?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "date",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [

                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true,
                                "max" : "",
                                "min" : ""
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "dateFormat" : "DD-MM-YYYY",
                            "autoCapture" : true,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p2",
                            "questionNumber" : "10a",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac9a4"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.895+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc5")
                        },
                        {
                            "_id" :new ObjectId("673af2c0a193a26bc7f43dae"),
                            "externalId" : "Q12_1731916471921-1731916480376",
                            "question" : [
                                "How would you rate the course taken?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "slider",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [

                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true,
                                "max" : "5",
                                "min" : "1"
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p2",
                            "questionNumber" : "10b",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac9ab"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.919+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc5")
                        },
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43daf"),
                            "externalId" : "Q13_1731916471921-1731916480377",
                            "question" : [
                                "How many courses have you taken?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "number",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [

                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true,
                                "IsNumber" : "true"
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p2",
                            "questionNumber" : "10c",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac9b2"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.942+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" :new ObjectId("673af2c0a193a26bc7f43dc5")
                        },
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43db0"),
                            "externalId" : "Q14_1731916471921-1731916480378",
                            "question" : [
                                "Which courses did you go through?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "text",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [

                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "file" : {
                                "required" : true,
                                "type" : [
                                    "image/jpeg",
                                    "docx",
                                    "pdf",
                                    "ppt"
                                ],
                                "minCount" : (0),
                                "maxCount" : (10),
                                "caption" : "FALSE"
                            },
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : false
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p2",
                            "questionNumber" : "10d",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" :new ObjectId("673af2be83466a9d854ac9b9"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.972+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" :new ObjectId("673af2c0a193a26bc7f43dc5")
                        }
                    ]
                }
            ]
        }
    ],
    "externalId" : "C2_1731916471921-1731916480523",
    "flag" : "",
    "frameworkCriteriaId" : new ObjectId("673af2bc83466a9d854ac952"),
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "language" : [
        "English"
    ],
    "name" : "Criteria 2",
    "owner" : null,
    "remarks" : "",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "rubric" : {
        "name" : "Criteria 2",
        "description" : "Criteria 2",
        "type" : "auto",
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "NA",
                "expression" : ""
            }
        }
    },
    "score" : "",
    "showRemarks" : null,
    "timesUsed" : (12),
    "updatedAt" : new Date("2024-11-18T07:54:40.578+0000"),
    "weightage" : (20)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43dc4"),
    "__v" : (0),
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdAt" : new Date("2024-11-18T07:54:40.609+0000"),
    "createdFor" : [

    ],
    "criteriaType" : "manual",
    "deleted" : false,
    "description" : "Criteria 1",
    "evidences" : [
        {
            "code" : "OB",
            "sections" : [
                {
                    "code" : "S1",
                    "questions" : [
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43da3"),
                            "externalId" : "Q1_1731916471921-1731916480360",
                            "question" : [
                                "Enter the date of observation",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "date",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [

                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true,
                                "max" : "",
                                "min" : ""
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "dateFormat" : "DD-MM-YYYY",
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "1",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac966"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.655+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc4")
                        },
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43da4"),
                            "externalId" : "Q2_1731916471921-1731916480363",
                            "question" : [
                                "Which class does your child study in?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "number",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [

                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true,
                                "IsNumber" : "true"
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "2",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" :new ObjectId("673af2be83466a9d854ac96c"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.690+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc4")
                        },
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43da5"),
                            "externalId" : "Q3_1731916471921-1731916480364",
                            "question" : [
                                "Are you currently living in the vicinity of the school?",
                                ""
                            ],
                            "tip" : "Use the name of the locality where the school is",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Yes"
                                },
                                {
                                    "value" : "R2",
                                    "label" : "No"
                                },
                                {
                                    "value" : "R3",
                                    "label" : "a"
                                },
                                {
                                    "value" : "R4",
                                    "label" : "b"
                                },
                                {
                                    "value" : "R5",
                                    "label" : "c"
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [
                                new ObjectId("673af2c0a193a26bc7f43da6")
                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "3",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac972"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.715+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc4")
                        },
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43da6"),
                            "externalId" : "Q4_1731916471921-1731916480368",
                            "question" : [
                                "Are you planning to come back?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "This becomes a risk if the answer is no",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : [
                                {
                                    "operator" : "===",
                                    "value" : [
                                        "R2"
                                    ],
                                    "_id" : new ObjectId("673af2c0a193a26bc7f43da5")
                                }
                            ],
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Yes"
                                },
                                {
                                    "value" : "R2",
                                    "label" : "No"
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : false
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "4",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac978"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.733+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc4")
                        },
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43da7"),
                            "externalId" : "Q5_1731916471921-1731916480369",
                            "question" : [
                                "What type of device is available at home?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "The devices that are available or can be easily arranged in the household.",
                            "responseType" : "multiselect",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : true,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Simple mobile phone without internet/data pack"
                                },
                                {
                                    "value" : "R2",
                                    "label" : "Smart phone with internet/data pack"
                                },
                                {
                                    "value" : "R3",
                                    "label" : "Smart phone without internet/data pack"
                                },
                                {
                                    "value" : "R4",
                                    "label" : "TV"
                                },
                                {
                                    "value" : "R5",
                                    "label" : "Radio"
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "file" : {
                                "required" : true,
                                "type" : [
                                    "image/jpeg",
                                    "docx",
                                    "pdf",
                                    "ppt"
                                ],
                                "minCount" : (0),
                                "maxCount" : (10),
                                "caption" : "FALSE"
                            },
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "5",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac97f"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.757+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc4")
                        },
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43da8"),
                            "externalId" : "Q6_1731916471921-1731916480370",
                            "question" : [
                                "Does the child have a quiet place to study?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : true,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Yes"
                                },
                                {
                                    "value" : "R2",
                                    "label" : "No"
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "6",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac985"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.783+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc4")
                        },
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43da9"),
                            "externalId" : "Q7_1731916471921-1731916480370",
                            "question" : [
                                "Were you able to enrol your child in courses on ELEVATE?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Yes"
                                },
                                {
                                    "value" : "R2",
                                    "label" : "No"
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [
                                new ObjectId("673af2c0a193a26bc7f43daa")
                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "7",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac98b"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.804+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc4")
                        },
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43daa"),
                            "externalId" : "Q8_1731916471921-1731916480372",
                            "question" : [
                                "What are the challenges that you are facing in enrolment?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "multiselect",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : true,
                            "remarks" : "",
                            "visibleIf" : [
                                {
                                    "operator" : "===",
                                    "value" : [
                                        "R2"
                                    ],
                                    "_id" : new ObjectId("673af2c0a193a26bc7f43da9")
                                }
                            ],
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Not able to use the app"
                                },
                                {
                                    "value" : "R2",
                                    "label" : "Not aware of classrooms on DIKSHA"
                                },
                                {
                                    "value" : "R3",
                                    "label" : "Not aware of the enrolment process in the classroom"
                                },
                                {
                                    "value" : "R4",
                                    "label" : "Not aware of enrolment process in the courses"
                                },
                                {
                                    "value" : "R5",
                                    "label" : "Don’t find the courses useful"
                                },
                                {
                                    "value" : "R6",
                                    "label" : "Others"
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "8",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac991"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.827+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc4")
                        },
                        {
                            "_id" : new ObjectId("673af2c0a193a26bc7f43dab"),
                            "externalId" : "Q9_1731916471921-1731916480373",
                            "question" : [
                                "On basis of the responses received above,  do you think this student is a potential drop out?",
                                ""
                            ],
                            "tip" : "Fill this based on the  parents' answers",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : true,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Yes"
                                },
                                {
                                    "value" : "R2",
                                    "label" : "No"
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "9",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac998"),
                            "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
                            "createdAt" : new Date("2024-11-18T07:54:38.854+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("673af2c0a193a26bc7f43dc4")
                        }
                    ]
                }
            ]
        }
    ],
    "externalId" : "C1_1731916471921-1731916480520",
    "flag" : "",
    "frameworkCriteriaId" : new ObjectId("673af2bc83466a9d854ac951"),
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "language" : [
        "English"
    ],
    "name" : "Criteria 1",
    "owner" : null,
    "remarks" : "",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "rubric" : {
        "name" : "Criteria 1",
        "description" : "Criteria 1",
        "type" : "auto",
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "NA",
                "expression" : ""
            }
        }
    },
    "score" : "",
    "showRemarks" : null,
    "timesUsed" : (12),
    "updatedAt" : new Date("2024-11-18T07:54:40.609+0000"),
    "weightage" : (20)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f84"),
    "__v" : (0),
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdAt" : new Date("2025-01-24T07:43:16.550+0000"),
    "createdFor" : [

    ],
    "criteriaType" : "auto",
    "deleted" : false,
    "description" : "Planning & Execution",
    "evidences" : [
        {
            "code" : "D1_1737704587373",
            "sections" : [
                {
                    "code" : "SEC1",
                    "questions" : [
                        {
                            "_id" : new ObjectId("67934494f6ae00c02d1f5f6e"),
                            "externalId" : "Q1_1737704587373-1737704596488",
                            "question" : [
                                "Ms. Reeta is the education officer and has thought of working on the health of the community members through students’ engagement. How should she ensure success?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "text",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [

                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "Planning & Execution",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "1",
                            "weightage" : (0),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5b8b"),
                            "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
                            "createdAt" : new Date("2025-01-24T07:43:14.683+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f84")
                        },
                        {
                            "_id" : new ObjectId("67934494f6ae00c02d1f5f6f"),
                            "externalId" : "Q2_1737704587373-1737704596490",
                            "question" : [
                                "Mr. Hira as the education officer as part of his duties has to channelize and monitor funds. He has realised that the schools do not share their expenses regularly. He may not receive further funds in case he fails to share the project progress and submit the expenses. What do you think he should do?",
                                ""
                            ],
                            "tip" : "Please refer to the response level hints for some observable behaviour examples",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "L: Either does not provide students with comments/prompts about their successes OR the comments provided are simple, evaluative statements (e.g. \"that's correct\")",
                                    "score" : (15)
                                },
                                {
                                    "value" : "R2",
                                    "label" : "Act only when there is a complaint from the senior officials or delay in receiving funds.",
                                    "score" : (25)
                                },
                                {
                                    "value" : "R3",
                                    "label" : "Establish a system of receiving updates much before the deadlines.",
                                    "score" : (75)
                                },
                                {
                                    "value" : "R4",
                                    "label" : "Involve group of parents and community members to collaborate with principals in monitoring the expenses and update Mr. Hira regularly.",
                                    "score" : (100)
                                },
                                {
                                    "value" : "R5",
                                    "label" : "Discuss with principals and understand the reasons behind delay. Ask seniors for suggestions.",
                                    "score" : (50)
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "Planning & Execution",
                            "allowAudioRecording" : false,
                            "page" : "p1",
                            "questionNumber" : "2",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5b91"),
                            "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
                            "createdAt" : new Date("2025-01-24T07:43:14.721+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f84")
                        }
                    ]
                }
            ]
        }
    ],
    "externalId" : "D1C1_1737704587373-1737704596521",
    "flag" : "",
    "frameworkCriteriaId" : new ObjectId("67934490f6ae00c02d1f5f33"),
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "language" : [
        "English"
    ],
    "name" : "Planning & Execution",
    "owner" : null,
    "remarks" : "",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "rubric" : {
        "name" : "Planning & Execution",
        "description" : "Planning & Execution",
        "type" : "manual",
        "expressionVariables" : {
            "SCORE" : "67934494f6ae00c02d1f5f84.scoreOfAllQuestionInCriteria()"
        },
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "For eg. There is no furniture in the classrooms for the teacher and the students",
                "expression" : "20<=SCORE<=40"
            },
            "L2" : {
                "level" : "L2",
                "label" : "Level 2",
                "description" : "There is furniture (a chair and table) fot the teachers but no furniture for the students.",
                "expression" : "40<SCORE<=80"
            },
            "L3" : {
                "level" : "L3",
                "label" : "Level 3",
                "description" : "There is furniture for the most of the students and techars but needs repair.",
                "expression" : "80<SCORE<=100"
            }
        }
    },
    "score" : "",
    "showRemarks" : null,
    "timesUsed" : (12),
    "updatedAt" : new Date("2025-01-24T07:43:16.550+0000"),
    "weightage" : (20)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f85"),
    "__v" : (0),
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdAt" : new Date("2025-01-24T07:43:16.569+0000"),
    "createdFor" : [

    ],
    "criteriaType" : "auto",
    "deleted" : false,
    "description" : "Data based Governance",
    "evidences" : [
        {
            "code" : "D2_1737704587373",
            "sections" : [
                {
                    "code" : "SEC2",
                    "questions" : [
                        {
                            "_id" : new ObjectId("67934494f6ae00c02d1f5f70"),
                            "externalId" : "Q5_1737704587373-1737704596491",
                            "question" : [
                                "One of the important goals set by Ms. Rekha is to improve the performance of the school teachers by sending them for various training workshops. How should she ensure that all teachers get trained uniformly across the district?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Female",
                                    "score" : (20)
                                },
                                {
                                    "value" : "R2",
                                    "label" : "Orient principals, teachers with data of training programs conducted and number of teachers who received training.",
                                    "score" : (100)
                                },
                                {
                                    "value" : "R3",
                                    "label" : "Maintain data for future records.",
                                    "score" : (30)
                                },
                                {
                                    "value" : "R4",
                                    "label" : "Consult data of all training programs attended by teachers and identify gaps in line with the objectives of teacher development.",
                                    "score" : (50)
                                },
                                {
                                    "value" : "R5",
                                    "label" : "Establish a system of conducting regular meetings with principals to analyse data of the training programs that the teachers attended",
                                    "score" : (75)
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "Data based Governance",
                            "allowAudioRecording" : false,
                            "page" : "p2",
                            "questionNumber" : "5",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5b97"),
                            "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
                            "createdAt" : new Date("2025-01-24T07:43:14.737+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f85")
                        }
                    ]
                }
            ]
        }
    ],
    "externalId" : "D2C1_1737704587373-1737704596522",
    "flag" : "",
    "frameworkCriteriaId" :new ObjectId("67934490f6ae00c02d1f5f34"),
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "language" : [
        "English"
    ],
    "name" : "Data based Governance",
    "owner" : null,
    "remarks" : "",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "rubric" : {
        "name" : "Data based Governance",
        "description" : "Data based Governance",
        "type" : "manual",
        "expressionVariables" : {
            "SCORE" : "67934494f6ae00c02d1f5f85.scoreOfAllQuestionInCriteria()"
        },
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "For eg. There is no furniture in the classrooms for the teacher and the students",
                "expression" : "20<=SCORE<=40"
            },
            "L2" : {
                "level" : "L2",
                "label" : "Level 2",
                "description" : "There is furniture (a chair and table) for the teachers but no furniture for the students.",
                "expression" : "40<SCORE<=80"
            },
            "L3" : {
                "level" : "L3",
                "label" : "Level 3",
                "description" : "There is furniture for the most of the students and techars but needs repair.",
                "expression" : "80<SCORE<=100"
            }
        }
    },
    "score" : "",
    "showRemarks" : null,
    "timesUsed" : (12),
    "updatedAt" : new Date("2025-01-24T07:43:16.569+0000"),
    "weightage" : (20)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f86"),
    "__v" : (0),
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdAt" : new Date("2025-01-24T07:43:16.589+0000"),
    "createdFor" : [

    ],
    "criteriaType" : "auto",
    "deleted" : false,
    "description" : "Communication",
    "evidences" : [
        {
            "code" : "D2_1737704587373",
            "sections" : [
                {
                    "code" : "SEC2",
                    "questions" : [
                        {
                            "_id" : new ObjectId("67934494f6ae00c02d1f5f71"),
                            "externalId" : "Q6_1737704587373-1737704596491",
                            "question" : [
                                "There have been few changes in the syllabus. Some of the principals and teachers are anxious as they feel that the syllabus has become difficult. How do you think Mr. Babu should as the education officer handle the situation?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Grade 1",
                                    "score" : (20)
                                },
                                {
                                    "value" : "R2",
                                    "label" : "Call for a meeting with all principals and some teachers and attentively listen to their concerns. Share the maximum information in verbal and written format at the earliest.",
                                    "score" : (40)
                                },
                                {
                                    "value" : "R3",
                                    "label" : "Share all information that he has through meetings",
                                    "score" : (60)
                                },
                                {
                                    "value" : "R4",
                                    "label" : "Listen attentively to all principals and seek various perspectives on how the change could be implemented smoothly.",
                                    "score" : (100)
                                },
                                {
                                    "value" : "R5",
                                    "label" : "Listen to the concerns of a selected group of principals through meetings.",
                                    "score" : (80)
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [
                                new ObjectId("67934494f6ae00c02d1f5f72")
                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "Data based Governance",
                            "allowAudioRecording" : false,
                            "page" : "p2",
                            "questionNumber" : "6",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5b9d"),
                            "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
                            "createdAt" : new Date("2025-01-24T07:43:14.753+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f86")
                        },
                        {
                            "_id" : new ObjectId("67934494f6ae00c02d1f5f72"),
                            "externalId" : "Q9_1737704587373-1737704596492",
                            "question" : [
                                "Due to the pandemic, the progress on various initiatives has been slow. Some of the school principals are not in favour because they feel the burden is already enough due to virtual classes. How would you communicate with them to implement the initiatives?",
                                ""
                            ],
                            "tip" : "Please refer to the response level hints for some observable behaviour examples",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : [
                                {
                                    "operator" : "||",
                                    "value" : [
                                        "R1",
                                        "R2"
                                    ],
                                    "_id" : new ObjectId("67934494f6ae00c02d1f5f71")
                                }
                            ],
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "L: Does not connect what is being taught to other content knowledge or students’ daily lives",
                                    "score" : (20)
                                },
                                {
                                    "value" : "R2",
                                    "label" : "Regularly communicate with school principals to highlight the importance of these projects towards the mutual goal of district development.",
                                    "score" : (40)
                                },
                                {
                                    "value" : "R3",
                                    "label" : "Give examples of those teachers who aren't complaining.",
                                    "score" : (60)
                                },
                                {
                                    "value" : "R4",
                                    "label" : "Develop ownership of district development by involving principals and community members through open workshops.",
                                    "score" : (100)
                                },
                                {
                                    "value" : "R5",
                                    "label" : "Share data about the current status of projects.",
                                    "score" : (80)
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "Data based Governance",
                            "allowAudioRecording" : false,
                            "page" : "p3",
                            "questionNumber" : "9",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5ba3"),
                            "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
                            "createdAt" : new Date("2025-01-24T07:43:14.767+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f86")
                        }
                    ]
                }
            ]
        }
    ],
    "externalId" : "D2C2_1737704587373-1737704596523",
    "flag" : "",
    "frameworkCriteriaId" : new ObjectId("67934490f6ae00c02d1f5f35"),
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "language" : [
        "English"
    ],
    "name" : "Communication",
    "owner" : null,
    "remarks" : "",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "rubric" : {
        "name" : "Communication",
        "description" : "Communication",
        "type" : "manual",
        "expressionVariables" : {
            "SCORE" : "67934494f6ae00c02d1f5f86.scoreOfAllQuestionInCriteria()"
        },
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "For eg. There is no furniture in the classrooms for the teacher and the students",
                "expression" : "20<=SCORE<=40"
            },
            "L2" : {
                "level" : "L2",
                "label" : "Level 2",
                "description" : "There is furniture (a chair and table) fot the teachers but no furniture for the students.",
                "expression" : "40<SCORE<=80"
            },
            "L3" : {
                "level" : "L3",
                "label" : "Level 3",
                "description" : "There is furniture for the most of the students and techars but needs repair.",
                "expression" : "80<SCORE<=100"
            }
        }
    },
    "score" : "",
    "showRemarks" : null,
    "timesUsed" : (12),
    "updatedAt" : new Date("2025-01-24T07:43:16.589+0000"),
    "weightage" : (20)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f87"),
    "__v" : (0),
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdAt" : new Date("2025-01-24T07:43:16.576+0000"),
    "createdFor" : [

    ],
    "criteriaType" : "auto",
    "deleted" : false,
    "description" : "Influence",
    "evidences" : [
        {
            "code" : "D3_1737704587373",
            "sections" : [
                {
                    "code" : "SEC3",
                    "questions" : [
                        {
                            "_id" : new ObjectId("67934494f6ae00c02d1f5f73"),
                            "externalId" : "Q12_1737704587373-1737704596492",
                            "question" : [
                                "The new initiatives by the education department want district education officers to implement ICDS. How would you ensure that the initiatives are implemented across the district?",
                                ""
                            ],
                            "tip" : "",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Ask members from ICDS and principals to volunteer towards the initiative.",
                                    "score" : (20)
                                },
                                {
                                    "value" : "R2",
                                    "label" : "Form a committee of school principals based on their expertise to help you in this project towards implementing ICDS.",
                                    "score" : (50)
                                },
                                {
                                    "value" : "R3",
                                    "label" : "Involve principals, other district officials, and community members with specific roles towards the implementation of the project.",
                                    "score" : (100)
                                },
                                {
                                    "value" : "R4",
                                    "label" : "Create channels for collaboration and appreciate the contribution of each principal towards the project.",
                                    "score" : (75)
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [
                                new ObjectId("67934494f6ae00c02d1f5f74")
                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "Communication",
                            "allowAudioRecording" : false,
                            "page" : "p4",
                            "questionNumber" : "12",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5baa"),
                            "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
                            "createdAt" : new Date("2025-01-24T07:43:14.785+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f87")
                        },
                        {
                            "_id" : new ObjectId("67934494f6ae00c02d1f5f74"),
                            "externalId" : "Q13_1737704587373-1737704596493",
                            "question" : [
                                "As the education officer, you are required to create awareness for Women and Child Welfare in the district. How would you ensure awareness is brought across the district?",
                                ""
                            ],
                            "tip" : "Please refer to the response level hints for some observable behaviour examples",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : [
                                {
                                    "operator" : "===",
                                    "value" : [
                                        "R1"
                                    ],
                                    "_id" : new ObjectId("67934494f6ae00c02d1f5f73")
                                }
                            ],
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Not Applicable",
                                    "score" : (20)
                                },
                                {
                                    "value" : "R2",
                                    "label" : "Decide to develop the project plan yourself being the Education officer.",
                                    "score" : (25)
                                },
                                {
                                    "value" : "R3",
                                    "label" : "Create a network of principals and other officials for sharing ideas and suggestions.",
                                    "score" : (75)
                                },
                                {
                                    "value" : "R4",
                                    "label" : "Include other officials, politicians and influential community members to help you in developing the goals and plan for the project.",
                                    "score" : (100)
                                },
                                {
                                    "value" : "R5",
                                    "label" : "Seek suggestions and consult a committee of only selective principals and teachers as required.",
                                    "score" : (50)
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "Communication",
                            "allowAudioRecording" : false,
                            "page" : "p4",
                            "questionNumber" : "13",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5bb0"),
                            "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
                            "createdAt" : new Date("2025-01-24T07:43:14.802+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f87")
                        }
                    ]
                }
            ]
        }
    ],
    "externalId" : "D3C1_1737704587373-1737704596524",
    "flag" : "",
    "frameworkCriteriaId" : new ObjectId("67934490f6ae00c02d1f5f36"),
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "language" : [
        "English"
    ],
    "name" : "Influence",
    "owner" : null,
    "remarks" : "",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "rubric" : {
        "name" : "Influence",
        "description" : "Influence",
        "type" : "manual",
        "expressionVariables" : {
            "SCORE" : "67934494f6ae00c02d1f5f87.scoreOfAllQuestionInCriteria()"
        },
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "For eg. There is no furniture in the classrooms for the teacher and the students",
                "expression" : "20<=SCORE<=40"
            },
            "L2" : {
                "level" : "L2",
                "label" : "Level 2",
                "description" : "There is furniture (a chair and table) fot the teachers but no furniture for the students.",
                "expression" : "40<SCORE<=80"
            },
            "L3" : {
                "level" : "L3",
                "label" : "Level 3",
                "description" : "There is furniture for the most of the students and techars but needs repair.",
                "expression" : "80<SCORE<=100"
            }
        }
    },
    "score" : "",
    "showRemarks" : null,
    "timesUsed" : (12),
    "updatedAt" : new Date("2025-01-24T07:43:16.576+0000"),
    "weightage" : (20)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f88"),
    "__v" : (0),
    "concepts" : [
        {
            "identifier" : "LPD20100",
            "name" : "Teacher_Performance",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20400",
            "name" : "Instructional_Programme",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        },
        {
            "identifier" : "LPD20200",
            "name" : "Teacher_Empowerment",
            "objectType" : "Concept",
            "relation" : "associatedTo",
            "description" : null,
            "index" : null,
            "status" : null,
            "depth" : null,
            "mimeType" : null,
            "visibility" : null,
            "compatibilityLevel" : null
        }
    ],
    "createdAt" : new Date("2025-01-24T07:43:16.583+0000"),
    "createdFor" : [

    ],
    "criteriaType" : "auto",
    "deleted" : false,
    "description" : "Collaboration",
    "evidences" : [
        {
            "code" : "D4_1737704587373",
            "sections" : [
                {
                    "code" : "SEC4",
                    "questions" : [
                        {
                            "_id" : new ObjectId("67934494f6ae00c02d1f5f75"),
                            "externalId" : "Q14_1737704587373-1737704596494",
                            "question" : [
                                "Mr. Raju has realised that there is an increasing issue of high drop out among girls in your district. How would you handle the situation?",
                                ""
                            ],
                            "tip" : "Please refer to the response level hints for some observable behaviour examples",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "Not Applicable",
                                    "score" : (25)
                                },
                                {
                                    "value" : "R2",
                                    "label" : "Understand the challenges and needs of the school to ensure lesser drop out among girls.",
                                    "score" : (75)
                                },
                                {
                                    "value" : "R3",
                                    "label" : "Engage with school principals and teachers by increasing the emphasis on sanitation as a way to retain girls",
                                    "score" : (50)
                                },
                                {
                                    "value" : "R4",
                                    "label" : "Send them notices and charge them with penalty if they fail to improve the sanitation facilities.",
                                    "score" : (25)
                                },
                                {
                                    "value" : "R5",
                                    "label" : "Involve community members to work along with principals to improve the sanitation and other facilities for girls for better enrolment.",
                                    "score" : (100)
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "Influence",
                            "allowAudioRecording" : false,
                            "page" : "p4",
                            "questionNumber" : "14",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5bb7"),
                            "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
                            "createdAt" : new Date("2025-01-24T07:43:14.820+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f88")
                        },
                        {
                            "_id" : new ObjectId("67934494f6ae00c02d1f5f76"),
                            "externalId" : "Q15_1737704587373-1737704596494",
                            "question" : [
                                "You are working on improving the enrolment of new students in the schools of your district. You need to establish goals for the plan. What will you do?",
                                ""
                            ],
                            "tip" : "Please refer to the response level hints for some observable behaviour examples",
                            "hint" : "",
                            "responseType" : "radio",
                            "value" : "",
                            "isCompleted" : false,
                            "showRemarks" : false,
                            "remarks" : "",
                            "visibleIf" : "",
                            "options" : [
                                {
                                    "value" : "R1",
                                    "label" : "L: Does not model",
                                    "score" : (25)
                                },
                                {
                                    "value" : "R2",
                                    "label" : "Establish a system to involve parents and community members along with principals towards various initiatives of school and community development",
                                    "score" : (75)
                                },
                                {
                                    "value" : "R3",
                                    "label" : "To improve the enrolment, support school principals to themselves collaborate with teachers and community members",
                                    "score" : (100)
                                },
                                {
                                    "value" : "R4",
                                    "label" : "Involve principals and other teachers to help you plan the project",
                                    "score" : (50)
                                },
                                {
                                    "value" : "R5",
                                    "label" : "Seek support from the school principals if you need it",
                                    "score" : (25)
                                }
                            ],
                            "sliderOptions" : [

                            ],
                            "children" : [

                            ],
                            "questionGroup" : [
                                "A1"
                            ],
                            "questionType" : "auto",
                            "modeOfCollection" : "onfield",
                            "usedForScoring" : "",
                            "fileName" : [

                            ],
                            "validation" : {
                                "required" : true
                            },
                            "accessibility" : "No",
                            "canBeNotApplicable" : "false",
                            "instanceQuestions" : [

                            ],
                            "isAGeneralQuestion" : false,
                            "autoCapture" : false,
                            "rubricLevel" : "",
                            "sectionHeader" : "Influence",
                            "allowAudioRecording" : false,
                            "page" : "p4",
                            "questionNumber" : "15",
                            "weightage" : (1),
                            "prefillFromEntityProfile" : false,
                            "entityFieldName" : "",
                            "isEditable" : true,
                            "showQuestionInPreview" : false,
                            "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5bbd"),
                            "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
                            "createdAt" : new Date("2025-01-24T07:43:14.839+0000"),
                            "deleted" : false,
                            "__v" : (0),
                            "criteriaId" : new ObjectId("67934494f6ae00c02d1f5f88")
                        }
                    ]
                }
            ]
        }
    ],
    "externalId" : "D4C1_1737704587373-1737704596525",
    "flag" : "",
    "frameworkCriteriaId" : new ObjectId("67934490f6ae00c02d1f5f37"),
    "keywords" : [
        "Keyword 1",
        "Keyword 2"
    ],
    "language" : [
        "English"
    ],
    "name" : "Collaboration",
    "owner" : null,
    "remarks" : "",
    "resourceType" : [
        "Program",
        "Framework",
        "Criteria"
    ],
    "rubric" : {
        "name" : "Collaboration",
        "description" : "Collaboration",
        "type" : "manual",
        "expressionVariables" : {
            "SCORE" : "67934494f6ae00c02d1f5f88.scoreOfAllQuestionInCriteria()"
        },
        "levels" : {
            "L1" : {
                "level" : "L1",
                "label" : "Level 1",
                "description" : "For eg. There is no furniture in the classrooms for the teacher and the students",
                "expression" : "25<=SCORE<=50"
            },
            "L2" : {
                "level" : "L2",
                "label" : "Level 2",
                "description" : "There is furniture (a chair and table) for the teachers but no furniture for the students.",
                "expression" : "50<SCORE<=75"
            },
            "L3" : {
                "level" : "L3",
                "label" : "Level 3",
                "description" : "There is furniture for the most of the students and techars but needs repair.",
                "expression" : "75<SCORE<=100"
            }
        }
    },
    "score" : "",
    "showRemarks" : null,
    "timesUsed" : (12),
    "updatedAt" : new Date("2025-01-24T07:43:16.583+0000"),
    "weightage" : (20)
}
]

let questionsData = [

{
    "_id" : new ObjectId("66f4e6c78ea984c17a5b3756"),
    "externalId" : "N111_23_09_2024_15_40_1636625759433",
    "question" : [ 
        "Select the medium of the course consumption PRV", 
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [ 
        {
            "value" : "R1",
            "label" : "English"
        }, 
        {
            "value" : "R2",
            "label" : "Telugu"
        }, 
        {
            "value" : "R3",
            "label" : "Urdu"
        }
    ],
    "sliderOptions" : [],
    "children" : [ 
        new ObjectId("66f4e6c78ea984c17a5b375c")
    ],
    "questionGroup" : [ 
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "1",
    "weightage" : 1,
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "deleted" : false,
    "updatedAt" : new Date("2024-09-26T04:44:55.796Z"),
    "createdAt" : new Date("2024-09-26T04:44:55.777Z"),
    "__v" : 0
},
{
    "_id" : new ObjectId("66f4e6c78ea984c17a5b375c"),
    "externalId" : "N112_23_09_2024_15_40_1636625759433",
    "question" : [ 
        "Select the courses that you have enrolled in PRV 2.0", 
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "multiselect",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : [ 
        {
            "operator" : "===",
            "value" : [ 
                "R1"
            ],
            "_id" : new ObjectId("66f4e6c78ea984c17a5b3756")
        }
    ],
    "options" : [ 
        {
            "value" : "R1",
            "label" : "AP_Sec_1.Curriculum and Inclusive Classrooms"
        }, 
        {
            "value" : "R2",
            "label" : "AP_Sec_2.ICT in Teaching-Learning and Assessment"
        }, 
        {
            "value" : "R3",
            "label" : "AP_Sec_3.Personal-Social Qualities for Holistic Development"
        }, 
        {
            "value" : "R4",
            "label" : "AP_Sec_4.Art Integrated Learning"
        }, 
        {
            "value" : "R5",
            "label" : "AP_Sec_5. Understanding Secondary Stage Learners"
        }, 
        {
            "value" : "R6",
            "label" : "AP_Sec_6. Health and Well-being"
        }, 
        {
            "value" : "R7",
            "label" : "AP_Sec_7. Integrating Gender in Schooling Processes"
        }, 
        {
            "value" : "R8",
            "label" : "AP_Sec_8. School Leadership: Concepts and Applications"
        }, 
        {
            "value" : "R9",
            "label" : "AP_Sec_9. Vocational Education"
        }
    ],
    "sliderOptions" : [],
    "children" : [],
    "questionGroup" : [ 
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "2",
    "weightage" : 1,
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "deleted" : false,
    "updatedAt" : new Date("2024-09-26T04:44:55.793Z"),
    "createdAt" : new Date("2024-09-26T04:44:55.793Z"),
    "__v" : 0
},
{
    "_id" : new ObjectId("66f4e6c78ea984c17a5b3763"),
    "externalId" : "N113_23_09_2024_15_40_1636625759433",
    "question" : [ 
        "Select the courses which you have got the certificate.", 
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "multiselect",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [ 
        {
            "value" : "R1",
            "label" : "AP_Sec_1.Curriculum and Inclusive Classrooms"
        }, 
        {
            "value" : "R2",
            "label" : "AP_Sec_2.ICT in Teaching-Learning and Assessment"
        }, 
        {
            "value" : "R3",
            "label" : "AP_Sec_3.Personal-Social Qualities for Holistic Development"
        }, 
        {
            "value" : "R4",
            "label" : "AP_Sec_4.Art Integrated Learning"
        }, 
        {
            "value" : "R5",
            "label" : "AP_Sec_5. Understanding Secondary Stage Learners"
        }, 
        {
            "value" : "R6",
            "label" : "AP_Sec_6. Health and Well-being"
        }, 
        {
            "value" : "R7",
            "label" : "AP_Sec_7. Integrating Gender in Schooling Processes"
        }, 
        {
            "value" : "R8",
            "label" : "AP_Sec_8. School Leadership: Concepts and Applications"
        }, 
        {
            "value" : "R9",
            "label" : "AP_Sec_9. Vocational Education"
        }
    ],
    "sliderOptions" : [],
    "children" : [],
    "questionGroup" : [ 
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "3",
    "weightage" : 1,
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "deleted" : false,
    "updatedAt" : new Date("2024-09-26T04:44:55.807Z"),
    "createdAt" : new Date("2024-09-26T04:44:55.807Z"),
    "__v" : 0
},
{
    "_id" : new ObjectId("66f4e6c78ea984c17a5b3769"),
    "externalId" : "N114_23_09_2024_15_40_1636625759433",
    "question" : [ 
        "Select the courses that you have enrolled in PRV 2.0", 
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "multiselect",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [ 
        {
            "value" : "R1",
            "label" : "AP_Sec_మాడ్యూలు 1: విద్యా ప్రణాళిక మరియు సహిత తరగతి గదులు"
        }, 
        {
            "value" : "R2",
            "label" : "AP_Sec_మాడ్యూలు 2: బోధన, అభ్యసన, మూల్యాంకనంలో ICT ని సమగ్రపరచడం"
        }, 
        {
            "value" : "R3",
            "label" : "AP_Sec_ మాడ్యూలు 3 : వ్యక్తిగత సామాజిక లక్షణాలను అభివృద్ధి చేయడం"
        }, 
        {
            "value" : "R4",
            "label" : "AP_Sec_మాడ్యూలు 4. కళ ఆధారిత అభ్యసనం"
        }, 
        {
            "value" : "R5",
            "label" : "AP_Sec_మాడ్యూలు 5 : మాధ్యమిక దశలోని విద్యార్థులను అర్థం చేసుకోవడం"
        }, 
        {
            "value" : "R6",
            "label" : "AP_Sec_మాడ్యూలు 6 :ఆరోగ్యం మరియు శ్రేయస్సు"
        }, 
        {
            "value" : "R7",
            "label" : "AP_Sec_మాడ్యూలు 7 : పాఠశాల ప్రక్రియలో లింగభావనను సమగ్ర పరచడం"
        }, 
        {
            "value" : "R8",
            "label" : "AP_Sec_మాడ్యూలు 8 : పాఠశాల నాయకత్వం - భావనలు మరియు అనువర్తనాలు"
        }, 
        {
            "value" : "R9",
            "label" : "AP_Sec_9 వృత్తి విద్య"
        }
    ],
    "sliderOptions" : [],
    "children" : [],
    "questionGroup" : [ 
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "2",
    "weightage" : 1,
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "deleted" : false,
    "updatedAt" : new Date("2024-09-26T04:44:55.821Z"),
    "createdAt" : new Date("2024-09-26T04:44:55.821Z"),
    "__v" : 0
},
{
    "_id" : new ObjectId("66f4e6c78ea984c17a5b376f"),
    "externalId" : "N118_23_09_2024_15_40_1636625759433",
    "question" : [ 
        "Give a rating on the reading materials available in the course", 
        ""
    ],
    "tip" : "1 is very bad, 5 is very good",
    "hint" : "",
    "responseType" : "slider",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [],
    "sliderOptions" : [],
    "children" : [],
    "questionGroup" : [ 
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [],
    "validation" : {
        "required" : true,
        "max" : "5",
        "min" : "1"
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "4",
    "weightage" : 1,
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "deleted" : false,
    "updatedAt" : new Date("2024-09-26T04:44:55.833Z"),
    "createdAt" : new Date("2024-09-26T04:44:55.833Z"),
    "__v" : 0
},
{
    "_id" : new ObjectId("66f4e6d98ea984c17a5b377b"),
    "externalId" : "N113_23_09_2024_15_40_1636625759433-1727325913563",
    "question" : [ 
        "Select the courses which you have got the certificate.", 
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "multiselect",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [ 
        {
            "value" : "R1",
            "label" : "AP_Sec_1.Curriculum and Inclusive Classrooms"
        }, 
        {
            "value" : "R2",
            "label" : "AP_Sec_2.ICT in Teaching-Learning and Assessment"
        }, 
        {
            "value" : "R3",
            "label" : "AP_Sec_3.Personal-Social Qualities for Holistic Development"
        }, 
        {
            "value" : "R4",
            "label" : "AP_Sec_4.Art Integrated Learning"
        }, 
        {
            "value" : "R5",
            "label" : "AP_Sec_5. Understanding Secondary Stage Learners"
        }, 
        {
            "value" : "R6",
            "label" : "AP_Sec_6. Health and Well-being"
        }, 
        {
            "value" : "R7",
            "label" : "AP_Sec_7. Integrating Gender in Schooling Processes"
        }, 
        {
            "value" : "R8",
            "label" : "AP_Sec_8. School Leadership: Concepts and Applications"
        }, 
        {
            "value" : "R9",
            "label" : "AP_Sec_9. Vocational Education"
        }
    ],
    "sliderOptions" : [],
    "children" : [],
    "questionGroup" : [ 
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "3",
    "weightage" : 1,
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("66f4e6c78ea984c17a5b3763"),
    "updatedAt" : new Date("2024-09-26T04:45:13.565Z"),
    "createdAt" : new Date("2024-09-26T04:44:55.807Z"),
    "deleted" : false,
    "__v" : 0
},
{
    "_id" : new ObjectId("66f4e6d98ea984c17a5b3779"),
    "externalId" : "N111_23_09_2024_15_40_1636625759433-1727325913561",
    "question" : [ 
        "Select the medium of the course consumption PRV", 
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [ 
        {
            "value" : "R1",
            "label" : "English"
        }, 
        {
            "value" : "R2",
            "label" : "Telugu"
        }, 
        {
            "value" : "R3",
            "label" : "Urdu"
        }
    ],
    "sliderOptions" : [],
    "children" : [ 
        new ObjectId("66f4e6d98ea984c17a5b377a")
    ],
    "questionGroup" : [ 
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "1",
    "weightage" : 1,
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("66f4e6c78ea984c17a5b3756"),
    "updatedAt" : new Date("2024-09-26T04:45:13.565Z"),
    "createdAt" : new Date("2024-09-26T04:44:55.777Z"),
    "deleted" : false,
    "__v" : 0
},
{
    "_id" : new ObjectId("66f4e6d98ea984c17a5b377d"),
    "externalId" : "N118_23_09_2024_15_40_1636625759433-1727325913564",
    "question" : [ 
        "Give a rating on the reading materials available in the course", 
        ""
    ],
    "tip" : "1 is very bad, 5 is very good",
    "hint" : "",
    "responseType" : "slider",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [],
    "sliderOptions" : [],
    "children" : [],
    "questionGroup" : [ 
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [],
    "validation" : {
        "required" : true,
        "max" : "5",
        "min" : "1"
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "4",
    "weightage" : 1,
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("66f4e6c78ea984c17a5b376f"),
    "updatedAt" : new Date("2024-09-26T04:45:13.565Z"),
    "createdAt" : new Date("2024-09-26T04:44:55.833Z"),
    "deleted" : false,
    "__v" : 0
},
{
    "_id" : new ObjectId("66f4e6d98ea984c17a5b377a"),
    "externalId" : "N112_23_09_2024_15_40_1636625759433-1727325913562",
    "question" : [ 
        "Select the courses that you have enrolled in PRV 2.0", 
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "multiselect",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : [ 
        {
            "operator" : "===",
            "value" : [ 
                "R1"
            ],
            "_id" : new ObjectId("66f4e6d98ea984c17a5b3779")
        }
    ],
    "options" : [ 
        {
            "value" : "R1",
            "label" : "AP_Sec_1.Curriculum and Inclusive Classrooms"
        }, 
        {
            "value" : "R2",
            "label" : "AP_Sec_2.ICT in Teaching-Learning and Assessment"
        }, 
        {
            "value" : "R3",
            "label" : "AP_Sec_3.Personal-Social Qualities for Holistic Development"
        }, 
        {
            "value" : "R4",
            "label" : "AP_Sec_4.Art Integrated Learning"
        }, 
        {
            "value" : "R5",
            "label" : "AP_Sec_5. Understanding Secondary Stage Learners"
        }, 
        {
            "value" : "R6",
            "label" : "AP_Sec_6. Health and Well-being"
        }, 
        {
            "value" : "R7",
            "label" : "AP_Sec_7. Integrating Gender in Schooling Processes"
        }, 
        {
            "value" : "R8",
            "label" : "AP_Sec_8. School Leadership: Concepts and Applications"
        }, 
        {
            "value" : "R9",
            "label" : "AP_Sec_9. Vocational Education"
        }
    ],
    "sliderOptions" : [],
    "children" : [],
    "questionGroup" : [ 
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "2",
    "weightage" : 1,
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("66f4e6c78ea984c17a5b375c"),
    "updatedAt" : new Date("2024-09-26T04:45:13.565Z"),
    "createdAt" : new Date("2024-09-26T04:44:55.793Z"),
    "deleted" : false,
    "__v" : 0
},
{
    "_id" : new ObjectId("66f4e6d98ea984c17a5b377c"),
    "externalId" : "N114_23_09_2024_15_40_1636625759433-1727325913563",
    "question" : [ 
        "Select the courses that you have enrolled in PRV 2.0", 
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "multiselect",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [ 
        {
            "value" : "R1",
            "label" : "AP_Sec_మాడ్యూలు 1: విద్యా ప్రణాళిక మరియు సహిత తరగతి గదులు"
        }, 
        {
            "value" : "R2",
            "label" : "AP_Sec_మాడ్యూలు 2: బోధన, అభ్యసన, మూల్యాంకనంలో ICT ని సమగ్రపరచడం"
        }, 
        {
            "value" : "R3",
            "label" : "AP_Sec_ మాడ్యూలు 3 : వ్యక్తిగత సామాజిక లక్షణాలను అభివృద్ధి చేయడం"
        }, 
        {
            "value" : "R4",
            "label" : "AP_Sec_మాడ్యూలు 4. కళ ఆధారిత అభ్యసనం"
        }, 
        {
            "value" : "R5",
            "label" : "AP_Sec_మాడ్యూలు 5 : మాధ్యమిక దశలోని విద్యార్థులను అర్థం చేసుకోవడం"
        }, 
        {
            "value" : "R6",
            "label" : "AP_Sec_మాడ్యూలు 6 :ఆరోగ్యం మరియు శ్రేయస్సు"
        }, 
        {
            "value" : "R7",
            "label" : "AP_Sec_మాడ్యూలు 7 : పాఠశాల ప్రక్రియలో లింగభావనను సమగ్ర పరచడం"
        }, 
        {
            "value" : "R8",
            "label" : "AP_Sec_మాడ్యూలు 8 : పాఠశాల నాయకత్వం - భావనలు మరియు అనువర్తనాలు"
        }, 
        {
            "value" : "R9",
            "label" : "AP_Sec_9 వృత్తి విద్య"
        }
    ],
    "sliderOptions" : [],
    "children" : [],
    "questionGroup" : [ 
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "2",
    "weightage" : 1,
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("66f4e6c78ea984c17a5b3769"),
    "updatedAt" : new Date("2024-09-26T04:45:13.565Z"),
    "createdAt" : new Date("2024-09-26T04:44:55.821Z"),
    "deleted" : false,
    "__v" : 0
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43da3"),
    "externalId" : "Q1_1731916471921-1731916480360",
    "question" : [
        "Enter the date of observation",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "date",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [

    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true,
        "max" : "",
        "min" : ""
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "dateFormat" : "DD-MM-YYYY",
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "1",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac966"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.655+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43da4"),
    "externalId" : "Q2_1731916471921-1731916480363",
    "question" : [
        "Which class does your child study in?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "number",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [

    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true,
        "IsNumber" : "true"
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "2",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac96c"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.690+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43da5"),
    "externalId" : "Q3_1731916471921-1731916480364",
    "question" : [
        "Are you currently living in the vicinity of the school?",
        ""
    ],
    "tip" : "Use the name of the locality where the school is",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [
        {
            "value" : "R1",
            "label" : "Yes"
        },
        {
            "value" : "R2",
            "label" : "No"
        },
        {
            "value" : "R3",
            "label" : "a"
        },
        {
            "value" : "R4",
            "label" : "b"
        },
        {
            "value" : "R5",
            "label" : "c"
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [
        new ObjectId("673af2c0a193a26bc7f43da6")
    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "3",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac972"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.715+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43da6"),
    "externalId" : "Q4_1731916471921-1731916480368",
    "question" : [
        "Are you planning to come back?",
        ""
    ],
    "tip" : "",
    "hint" : "This becomes a risk if the answer is no",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : [
        {
            "operator" : "===",
            "value" : [
                "R2"
            ],
            "_id" :new ObjectId("673af2c0a193a26bc7f43da5")
        }
    ],
    "options" : [
        {
            "value" : "R1",
            "label" : "Yes"
        },
        {
            "value" : "R2",
            "label" : "No"
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : false
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "4",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac978"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.733+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43da7"),
    "externalId" : "Q5_1731916471921-1731916480369",
    "question" : [
        "What type of device is available at home?",
        ""
    ],
    "tip" : "",
    "hint" : "The devices that are available or can be easily arranged in the household.",
    "responseType" : "multiselect",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : true,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [
        {
            "value" : "R1",
            "label" : "Simple mobile phone without internet/data pack"
        },
        {
            "value" : "R2",
            "label" : "Smart phone with internet/data pack"
        },
        {
            "value" : "R3",
            "label" : "Smart phone without internet/data pack"
        },
        {
            "value" : "R4",
            "label" : "TV"
        },
        {
            "value" : "R5",
            "label" : "Radio"
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "file" : {
        "required" : true,
        "type" : [
            "image/jpeg",
            "docx",
            "pdf",
            "ppt"
        ],
        "minCount" : (0),
        "maxCount" : (10),
        "caption" : "FALSE"
    },
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "5",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac97f"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.757+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43da8"),
    "externalId" : "Q6_1731916471921-1731916480370",
    "question" : [
        "Does the child have a quiet place to study?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : true,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [
        {
            "value" : "R1",
            "label" : "Yes"
        },
        {
            "value" : "R2",
            "label" : "No"
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "6",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac985"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.783+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43da9"),
    "externalId" : "Q7_1731916471921-1731916480370",
    "question" : [
        "Were you able to enrol your child in courses on ELEVATE?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [
        {
            "value" : "R1",
            "label" : "Yes"
        },
        {
            "value" : "R2",
            "label" : "No"
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [
        new ObjectId("673af2c0a193a26bc7f43daa")
    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "7",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac98b"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.804+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43daa"),
    "externalId" : "Q8_1731916471921-1731916480372",
    "question" : [
        "What are the challenges that you are facing in enrolment?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "multiselect",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : true,
    "remarks" : "",
    "visibleIf" : [
        {
            "operator" : "===",
            "value" : [
                "R2"
            ],
            "_id" : new ObjectId("673af2c0a193a26bc7f43da9")
        }
    ],
    "options" : [
        {
            "value" : "R1",
            "label" : "Not able to use the app"
        },
        {
            "value" : "R2",
            "label" : "Not aware of classrooms on DIKSHA"
        },
        {
            "value" : "R3",
            "label" : "Not aware of the enrolment process in the classroom"
        },
        {
            "value" : "R4",
            "label" : "Not aware of enrolment process in the courses"
        },
        {
            "value" : "R5",
            "label" : "Don’t find the courses useful"
        },
        {
            "value" : "R6",
            "label" : "Others"
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "8",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac991"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.827+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43dab"),
    "externalId" : "Q9_1731916471921-1731916480373",
    "question" : [
        "On basis of the responses received above,  do you think this student is a potential drop out?",
        ""
    ],
    "tip" : "Fill this based on the  parents' answers",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : true,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [
        {
            "value" : "R1",
            "label" : "Yes"
        },
        {
            "value" : "R2",
            "label" : "No"
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "9",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac998"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.854+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43dac"),
    "externalId" : "Q10_1731916471921-1731916480374",
    "question" : [
        "Add the student interview responses",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "matrix",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [

    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "instanceIdentifier" : "Student",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [
        new ObjectId("673af2c0a193a26bc7f43dad"),
        new ObjectId("673af2c0a193a26bc7f43dae"),
        new ObjectId("673af2c0a193a26bc7f43daf"),
        new ObjectId("673af2c0a193a26bc7f43db0")
    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p2",
    "questionNumber" : "10",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac99e"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.877+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43dad"),
    "externalId" : "Q11_1731916471921-1731916480375",
    "question" : [
        "When did you last take a course on ELEVATE?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "date",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [

    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true,
        "max" : "",
        "min" : ""
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "dateFormat" : "DD-MM-YYYY",
    "autoCapture" : true,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p2",
    "questionNumber" : "10a",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac9a4"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.895+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43dae"),
    "externalId" : "Q12_1731916471921-1731916480376",
    "question" : [
        "How would you rate the course taken?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "slider",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [

    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true,
        "max" : "5",
        "min" : "1"
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p2",
    "questionNumber" : "10b",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac9ab"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.919+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43daf"),
    "externalId" : "Q13_1731916471921-1731916480377",
    "question" : [
        "How many courses have you taken?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "number",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [

    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true,
        "IsNumber" : "true"
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p2",
    "questionNumber" : "10c",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac9b2"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.942+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("673af2c0a193a26bc7f43db0"),
    "externalId" : "Q14_1731916471921-1731916480378",
    "question" : [
        "Which courses did you go through?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "text",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [

    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "file" : {
        "required" : true,
        "type" : [
            "image/jpeg",
            "docx",
            "pdf",
            "ppt"
        ],
        "minCount" : (0),
        "maxCount" : (10),
        "caption" : "FALSE"
    },
    "fileName" : [

    ],
    "validation" : {
        "required" : false
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "",
    "allowAudioRecording" : false,
    "page" : "p2",
    "questionNumber" : "10d",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("673af2be83466a9d854ac9b9"),
    "updatedAt" : new Date("2024-11-18T07:54:40.382+0000"),
    "createdAt" : new Date("2024-11-18T07:54:38.972+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f6e"),
    "externalId" : "Q1_1737704587373-1737704596488",
    "question" : [
        "Ms. Reeta is the education officer and has thought of working on the health of the community members through students’ engagement. How should she ensure success?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "text",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [

    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "Planning & Execution",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "1",
    "weightage" : (0),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5b8b"),
    "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
    "createdAt" : new Date("2025-01-24T07:43:14.683+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f6f"),
    "externalId" : "Q2_1737704587373-1737704596490",
    "question" : [
        "Mr. Hira as the education officer as part of his duties has to channelize and monitor funds. He has realised that the schools do not share their expenses regularly. He may not receive further funds in case he fails to share the project progress and submit the expenses. What do you think he should do?",
        ""
    ],
    "tip" : "Please refer to the response level hints for some observable behaviour examples",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [
        {
            "value" : "R1",
            "label" : "L: Either does not provide students with comments/prompts about their successes OR the comments provided are simple, evaluative statements (e.g. \"that's correct\")",
            "score" : (15)
        },
        {
            "value" : "R2",
            "label" : "Act only when there is a complaint from the senior officials or delay in receiving funds.",
            "score" : (25)
        },
        {
            "value" : "R3",
            "label" : "Establish a system of receiving updates much before the deadlines.",
            "score" : (75)
        },
        {
            "value" : "R4",
            "label" : "Involve group of parents and community members to collaborate with principals in monitoring the expenses and update Mr. Hira regularly.",
            "score" : (100)
        },
        {
            "value" : "R5",
            "label" : "Discuss with principals and understand the reasons behind delay. Ask seniors for suggestions.",
            "score" : (50)
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "Planning & Execution",
    "allowAudioRecording" : false,
    "page" : "p1",
    "questionNumber" : "2",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5b91"),
    "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
    "createdAt" : new Date("2025-01-24T07:43:14.721+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f70"),
    "externalId" : "Q5_1737704587373-1737704596491",
    "question" : [
        "One of the important goals set by Ms. Rekha is to improve the performance of the school teachers by sending them for various training workshops. How should she ensure that all teachers get trained uniformly across the district?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [
        {
            "value" : "R1",
            "label" : "Female",
            "score" : (20)
        },
        {
            "value" : "R2",
            "label" : "Orient principals, teachers with data of training programs conducted and number of teachers who received training.",
            "score" : (100)
        },
        {
            "value" : "R3",
            "label" : "Maintain data for future records.",
            "score" : (30)
        },
        {
            "value" : "R4",
            "label" : "Consult data of all training programs attended by teachers and identify gaps in line with the objectives of teacher development.",
            "score" : (50)
        },
        {
            "value" : "R5",
            "label" : "Establish a system of conducting regular meetings with principals to analyse data of the training programs that the teachers attended",
            "score" : (75)
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "Data based Governance",
    "allowAudioRecording" : false,
    "page" : "p2",
    "questionNumber" : "5",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5b97"),
    "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
    "createdAt" : new Date("2025-01-24T07:43:14.737+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f71"),
    "externalId" : "Q6_1737704587373-1737704596491",
    "question" : [
        "There have been few changes in the syllabus. Some of the principals and teachers are anxious as they feel that the syllabus has become difficult. How do you think Mr. Babu should as the education officer handle the situation?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [
        {
            "value" : "R1",
            "label" : "Grade 1",
            "score" : (20)
        },
        {
            "value" : "R2",
            "label" : "Call for a meeting with all principals and some teachers and attentively listen to their concerns. Share the maximum information in verbal and written format at the earliest.",
            "score" : (40)
        },
        {
            "value" : "R3",
            "label" : "Share all information that he has through meetings",
            "score" : (60)
        },
        {
            "value" : "R4",
            "label" : "Listen attentively to all principals and seek various perspectives on how the change could be implemented smoothly.",
            "score" : (100)
        },
        {
            "value" : "R5",
            "label" : "Listen to the concerns of a selected group of principals through meetings.",
            "score" : (80)
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [
        new ObjectId("67934494f6ae00c02d1f5f72")
    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "Data based Governance",
    "allowAudioRecording" : false,
    "page" : "p2",
    "questionNumber" : "6",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5b9d"),
    "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
    "createdAt" : new Date("2025-01-24T07:43:14.753+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f72"),
    "externalId" : "Q9_1737704587373-1737704596492",
    "question" : [
        "Due to the pandemic, the progress on various initiatives has been slow. Some of the school principals are not in favour because they feel the burden is already enough due to virtual classes. How would you communicate with them to implement the initiatives?",
        ""
    ],
    "tip" : "Please refer to the response level hints for some observable behaviour examples",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : [
        {
            "operator" : "||",
            "value" : [
                "R1",
                "R2"
            ],
            "_id" : new ObjectId("67934494f6ae00c02d1f5f71")
        }
    ],
    "options" : [
        {
            "value" : "R1",
            "label" : "L: Does not connect what is being taught to other content knowledge or students’ daily lives",
            "score" : (20)
        },
        {
            "value" : "R2",
            "label" : "Regularly communicate with school principals to highlight the importance of these projects towards the mutual goal of district development.",
            "score" : (40)
        },
        {
            "value" : "R3",
            "label" : "Give examples of those teachers who aren't complaining.",
            "score" : (60)
        },
        {
            "value" : "R4",
            "label" : "Develop ownership of district development by involving principals and community members through open workshops.",
            "score" : (100)
        },
        {
            "value" : "R5",
            "label" : "Share data about the current status of projects.",
            "score" : (80)
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "Data based Governance",
    "allowAudioRecording" : false,
    "page" : "p3",
    "questionNumber" : "9",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5ba3"),
    "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
    "createdAt" : new Date("2025-01-24T07:43:14.767+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f73"),
    "externalId" : "Q12_1737704587373-1737704596492",
    "question" : [
        "The new initiatives by the education department want district education officers to implement ICDS. How would you ensure that the initiatives are implemented across the district?",
        ""
    ],
    "tip" : "",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [
        {
            "value" : "R1",
            "label" : "Ask members from ICDS and principals to volunteer towards the initiative.",
            "score" : (20)
        },
        {
            "value" : "R2",
            "label" : "Form a committee of school principals based on their expertise to help you in this project towards implementing ICDS.",
            "score" : (50)
        },
        {
            "value" : "R3",
            "label" : "Involve principals, other district officials, and community members with specific roles towards the implementation of the project.",
            "score" : (100)
        },
        {
            "value" : "R4",
            "label" : "Create channels for collaboration and appreciate the contribution of each principal towards the project.",
            "score" : (75)
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [
        new ObjectId("67934494f6ae00c02d1f5f74")
    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "Communication",
    "allowAudioRecording" : false,
    "page" : "p4",
    "questionNumber" : "12",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" :new ObjectId("67934492e09dcbb0bd5e5baa"),
    "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
    "createdAt" : new Date("2025-01-24T07:43:14.785+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f74"),
    "externalId" : "Q13_1737704587373-1737704596493",
    "question" : [
        "As the education officer, you are required to create awareness for Women and Child Welfare in the district. How would you ensure awareness is brought across the district?",
        ""
    ],
    "tip" : "Please refer to the response level hints for some observable behaviour examples",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : [
        {
            "operator" : "===",
            "value" : [
                "R1"
            ],
            "_id" :new ObjectId("67934494f6ae00c02d1f5f73")
        }
    ],
    "options" : [
        {
            "value" : "R1",
            "label" : "Not Applicable",
            "score" : (20)
        },
        {
            "value" : "R2",
            "label" : "Decide to develop the project plan yourself being the Education officer.",
            "score" : (25)
        },
        {
            "value" : "R3",
            "label" : "Create a network of principals and other officials for sharing ideas and suggestions.",
            "score" : (75)
        },
        {
            "value" : "R4",
            "label" : "Include other officials, politicians and influential community members to help you in developing the goals and plan for the project.",
            "score" : (100)
        },
        {
            "value" : "R5",
            "label" : "Seek suggestions and consult a committee of only selective principals and teachers as required.",
            "score" : (50)
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "Communication",
    "allowAudioRecording" : false,
    "page" : "p4",
    "questionNumber" : "13",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5bb0"),
    "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
    "createdAt" : new Date("2025-01-24T07:43:14.802+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f75"),
    "externalId" : "Q14_1737704587373-1737704596494",
    "question" : [
        "Mr. Raju has realised that there is an increasing issue of high drop out among girls in your district. How would you handle the situation?",
        ""
    ],
    "tip" : "Please refer to the response level hints for some observable behaviour examples",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [
        {
            "value" : "R1",
            "label" : "Not Applicable",
            "score" : (25)
        },
        {
            "value" : "R2",
            "label" : "Understand the challenges and needs of the school to ensure lesser drop out among girls.",
            "score" : (75)
        },
        {
            "value" : "R3",
            "label" : "Engage with school principals and teachers by increasing the emphasis on sanitation as a way to retain girls",
            "score" : (50)
        },
        {
            "value" : "R4",
            "label" : "Send them notices and charge them with penalty if they fail to improve the sanitation facilities.",
            "score" : (25)
        },
        {
            "value" : "R5",
            "label" : "Involve community members to work along with principals to improve the sanitation and other facilities for girls for better enrolment.",
            "score" : (100)
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "Influence",
    "allowAudioRecording" : false,
    "page" : "p4",
    "questionNumber" : "14",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5bb7"),
    "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
    "createdAt" : new Date("2025-01-24T07:43:14.820+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934494f6ae00c02d1f5f76"),
    "externalId" : "Q15_1737704587373-1737704596494",
    "question" : [
        "You are working on improving the enrolment of new students in the schools of your district. You need to establish goals for the plan. What will you do?",
        ""
    ],
    "tip" : "Please refer to the response level hints for some observable behaviour examples",
    "hint" : "",
    "responseType" : "radio",
    "value" : "",
    "isCompleted" : false,
    "showRemarks" : false,
    "remarks" : "",
    "visibleIf" : "",
    "options" : [
        {
            "value" : "R1",
            "label" : "L: Does not model",
            "score" : (25)
        },
        {
            "value" : "R2",
            "label" : "Establish a system to involve parents and community members along with principals towards various initiatives of school and community development",
            "score" : (75)
        },
        {
            "value" : "R3",
            "label" : "To improve the enrolment, support school principals to themselves collaborate with teachers and community members",
            "score" : (100)
        },
        {
            "value" : "R4",
            "label" : "Involve principals and other teachers to help you plan the project",
            "score" : (50)
        },
        {
            "value" : "R5",
            "label" : "Seek support from the school principals if you need it",
            "score" : (25)
        }
    ],
    "sliderOptions" : [

    ],
    "children" : [

    ],
    "questionGroup" : [
        "A1"
    ],
    "questionType" : "auto",
    "modeOfCollection" : "onfield",
    "usedForScoring" : "",
    "fileName" : [

    ],
    "validation" : {
        "required" : true
    },
    "accessibility" : "No",
    "canBeNotApplicable" : "false",
    "instanceQuestions" : [

    ],
    "isAGeneralQuestion" : false,
    "autoCapture" : false,
    "rubricLevel" : "",
    "sectionHeader" : "Influence",
    "allowAudioRecording" : false,
    "page" : "p4",
    "questionNumber" : "15",
    "weightage" : (1),
    "prefillFromEntityProfile" : false,
    "entityFieldName" : "",
    "isEditable" : true,
    "showQuestionInPreview" : false,
    "createdFromQuestionId" : new ObjectId("67934492e09dcbb0bd5e5bbd"),
    "updatedAt" : new Date("2025-01-24T07:43:16.495+0000"),
    "createdAt" : new Date("2025-01-24T07:43:14.839+0000"),
    "deleted" : false,
    "__v" : (0)
}
]


let frameworkData = [
{
    "_id" : new ObjectId("66f4e6208ea984c17a5b3744"),
    "externalId" : "606d92fa-42d8-11ec-ac61-26092024-1011",
    "name" : "NISHTHA 2.0 Feedback Form",
    "description" : "NISHTHA 2.0 feedback form",
    "author" : "",
    "parentId" : null,
    "resourceType" : [ 
        "Observations Framework"
    ],
    "language" : [ 
        "English"
    ],
    "keywords" : [ 
        "Framework", 
        "Observation", 
        "Feedback form"
    ],
    "concepts" : [],
    "createdFor" : [],
    "scoringSystem" : null,
    "levelToScoreMapping" : {
        "L1" : {
            "points" : 100,
            "label" : "Good"
        }
    },
    "themes" : [ 
        {
            "type" : "theme",
            "label" : "theme",
            "name" : "Observation Theme",
            "externalId" : "OB",
            "weightage" : 100,
            "criteria" : [ 
                {
                    "criteriaId" : "66f4e5f08ea984c17a5b3741",
                    "weightage" : 100
                }
            ]
        }
    ],
    "noOfRatingLevels" : 1,
    "isRubricDriven" : false,
    "updatedBy" : "INITIALIZE",
    "isDeleted" : false,
    "entityTypeId" : new ObjectId("5f32d8228e0dc83124040567"),
    "entityType" : "school",
    "rootOrganisations" : [],
    "updatedAt" : new Date("2024-09-26T04:42:08.974Z"),
    "createdAt" : new Date("2021-11-11T10:16:02.564Z"),
    "deleted" : false,
    "__v" : 0
},
{
    "_id" : new ObjectId("673af2bc83466a9d854ac956"),
    "externalId" : "5b4081c4-a582-11ef-b023-743af4776910",
    "name" : "ObservationWithoutRubrics",
    "description" : "Survey Form to understand the challenges that the parents are facing in getting their children enrolled in ELEVATE courses ",
    "author" : null,
    "parentId" : null,
    "resourceType" : [
        "Observations Framework"
    ],
    "language" : [
        "English"
    ],
    "keywords" : [
        "Framework",
        "Observation"
    ],
    "concepts" : [

    ],
    "createdFor" : [
        null
    ],
    "scoringSystem" : null,
    "themes" : [
        {
            "name" : "Observation Theme",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "OB",
            "weightage" : (40),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("673af2bc83466a9d854ac952"),
                    "weightage" : (40)
                },
                {
                    "criteriaId" : new ObjectId("673af2bc83466a9d854ac951"),
                    "weightage" : (40)
                }
            ]
        }
    ],
    "isRubricDriven" : false,
    "updatedBy" : "INITIALIZE",
    "isDeleted" : false,
    "entityTypeId" : null,
    "entityType" : "school",
    "rootOrganisations" : [

    ],
    "updatedAt" : new Date("2024-11-18T07:54:37.192+0000"),
    "createdAt" : new Date("2024-11-18T13:24:36.705+0000"),
    "deleted" : false,
    "__v" : (0)
},
{
    "_id" : new ObjectId("67934491f6ae00c02d1f5f3e"),
    "externalId" : "dcecf7d8-da26-11ef-99e2-743af4776910",
    "name" : "ScoreReportFix",
    "description" : "Observation with rubric (multiplesubmission)",
    "author" : null,
    "parentId" : null,
    "resourceType" : [
        "Observations Framework"
    ],
    "language" : [
        "English"
    ],
    "keywords" : [
        "Framework",
        "Observation",
        "Challenges",
        " Enrollment",
        " Parents",
        " Courses"
    ],
    "concepts" : [

    ],
    "createdFor" : [
        null
    ],
    "scoringSystem" : "pointsBasedScoring",
    "levelToScoreMapping" : {
        "L1" : {
            "points" : (10),
            "label" : "Level 1"
        },
        "L2" : {
            "points" : (20),
            "label" : "Level 2"
        },
        "L3" : {
            "points" : (30),
            "label" : "Level 3"
        }
    },
    "themes" : [
        {
            "name" : "Domain 1",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D1",
            "weightage" : (40),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934490f6ae00c02d1f5f33"),
                    "weightage" : (40)
                }
            ]
        },
        {
            "name" : "Domain 2",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D2",
            "weightage" : (40),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934490f6ae00c02d1f5f34"),
                    "weightage" : (40)
                },
                {
                    "criteriaId" : new ObjectId("67934490f6ae00c02d1f5f35"),
                    "weightage" : (40)
                }
            ]
        },
        {
            "name" : "Domain 3",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D3",
            "weightage" : (40),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934490f6ae00c02d1f5f36"),
                    "weightage" : (40)
                }
            ]
        },
        {
            "name" : "Domain 4",
            "type" : "theme",
            "label" : "theme",
            "externalId" : "D4",
            "weightage" : (40),
            "criteria" : [
                {
                    "criteriaId" : new ObjectId("67934490f6ae00c02d1f5f37"),
                    "weightage" : (40)
                }
            ]
        }
    ],
    "noOfRatingLevels" : (3),
    "isRubricDriven" : true,
    "updatedBy" : "INITIALIZE",
    "isDeleted" : false,
    "entityTypeId" : null,
    "entityType" : "school",
    "rootOrganisations" : [

    ],
    "updatedAt" : new Date("2025-01-24T07:43:13.349+0000"),
    "createdAt" : new Date("2025-01-24T13:13:12.190+0000"),
    "deleted" : false,
    "__v" : (0)
}
]




module.exports = {
    solutionData,
    criteriaData,
    questionsData,
    criteriaQuestionsData,
    frameworkData,
}