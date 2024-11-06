const { ObjectId } = require('mongodb');

const {
    entities,
    entityType,
    userRoleExtension
} = require('./entity_sampleData.js');
const {getEndDate}= require('./common')
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
    "entityType" : "school",
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
    "_id" : new ObjectId("66f4e6d98ea984c17a5b3789"),
    "externalId" : "606d92fa-42d8-11ec-ac61-26092024-1011-OBSERVATION-TEMPLATE-1727325913582",
    "isReusable" : false,
    "name" : "Shiksha 2.0 Feedback Form",
    "description" : "Sikshka 2.0 Feedback Form",
    "author" : "1",
    "parentSolutionId" : new ObjectId("66f4e62d8ea984c17a5b374a"),
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
                    "criteriaId" : new ObjectId("66f4e6d98ea984c17a5b3785"),
                    "weightage" : 100
                }
            ]
        }
    ],
    "flattenedThemes" : [],
    "entityType" : "school",
    "type" : "survey",
    "subType" : "",
    "entities" : [],
    "startDate" : new Date("2022-08-25T18:29:59"),
    "endDate" : getEndDate("2025-06-15 18:50:00"),
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
    "updatedAt" : new Date("2024-09-26T04:45:13.585Z"),
    "createdAt" : new Date("2024-09-26T04:45:13.581Z"),
    "deleted" : false,
    "__v" : 0,
    "link" : "8f563917c4f3bfa2e179a960af2360be",
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
}
]


let observationSubmissionData = [
    {
        "_id" : new ObjectId("66f4e7dd8ea984c17a5b37a0"),
        "observationId" : new ObjectId("66f4e6e58ea984c17a5b378f"),
        "createdBy" : "2",
        "status" : "started",
        "evidencesStatus" : [ 
            {
                "externalId" : "OB",
                "tip" : null,
                "name" : "Observation",
                "description" : null,
                "modeOfCollection" : "onfield",
                "canBeNotApplicable" : false,
                "notApplicable" : false,
                "canBeNotAllowed" : false,
                "remarks" : null,
                "startTime" : "",
                "endTime" : "",
                "isSubmitted" : false,
                "submissions" : []
            }
        ],
        "evidences" : {
            "OB" : {
                "externalId" : "OB",
                "tip" : null,
                "name" : "Observation",
                "description" : null,
                "modeOfCollection" : "onfield",
                "canBeNotApplicable" : false,
                "notApplicable" : false,
                "canBeNotAllowed" : false,
                "remarks" : null,
                "startTime" : "",
                "endTime" : "",
                "isSubmitted" : false,
                "submissions" : []
            }
        },
        "criteria" : [ 
            {
                "_id" : new ObjectId("66f4e6d98ea984c17a5b3785"),
                "__v" : 0,
                "createdAt" : new Date("2024-09-26T04:45:13.578Z"),
                "criteriaType" : "manual",
                "deleted" : false,
                "description" : "Cleanliness",
                "externalId" : "PRV_16_09_2024_13_05_163662571997-1727325913573",
                "flag" : "",
                "frameworkCriteriaId" : new ObjectId("66f4e5f08ea984c17a5b3741"),
                "name" : "Cleanliness",
                "owner" : null,
                "remarks" : "",
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
                "weightage" : 100
            }
        ],
        "themes" : [],
        "entityExternalId" : "",
        "observationInformation" : {
            "name" : "dev_testing",
            "description" : "dev testing",
            "createdBy" : "2",
            "frameworkId" : new ObjectId("66f4e6208ea984c17a5b3744"),
            "frameworkExternalId" : "606d92fa-42d8-11ec-ac61-26092024-1011",
            "solutionId" : new ObjectId("66f4e6d98ea984c17a5b3789"),
            "solutionExternalId" : "606d92fa-42d8-11ec-ac61-26092024-1011-OBSERVATION-TEMPLATE-1727325913582",
            "startDate" : new Date("2024-08-25T18:29:59"),
            "endDate" : getEndDate("2025-06-15 18:50:00"),
            "status" : "published",
            "entityType" : "school",
            "createdFor" : [ 
                "2"
            ],
            "rootOrganisations" : [],
            "isAPrivateProgram" : false,
            "link" : "8f563917c4f3bfa2e179a960af2360be",
            "updatedAt" : new Date("2024-09-26T04:45:25.003Z"),
            "createdAt" : new Date("2024-09-26T04:45:13.581Z")
        },
        "feedback" : [],
        "solutionId" : new ObjectId("66f4e6d98ea984c17a5b3789"),
        "solutionExternalId" : "606d92fa-42d8-11ec-ac61-26092024-1011-OBSERVATION-TEMPLATE-1727325913582",
        "submissionsUpdatedHistory" : [],
        "entityType" : "school",
        "submissionNumber" : 1,
        "pointsBasedMaxScore" : 0,
        "pointsBasedScoreAchieved" : 0,
        "pointsBasedPercentageScore" : 0,
        "isAPrivateProgram" : false,
        "scoringSystem" : null,
        "isRubricDriven" : false,
        "deleted" : false,
        "title" : "Observation 1",
        "updatedAt" : new Date("2024-09-26T04:49:33.266Z"),
        "createdAt" : new Date("2024-09-26T04:49:33.266Z"),
        "__v" : 0
    }
]



let observationData = [
    {
        "_id" : new ObjectId("66f4e6e58ea984c17a5b378f"),
        "name" : "dev_testing",
        "description" : "dev testing",
        "createdBy" : "2",
        "frameworkId" : new ObjectId("66f4e6208ea984c17a5b3744"),
        "frameworkExternalId" : "606d92fa-42d8-11ec-ac61-26092024-1011",
        "solutionId" : new ObjectId("66f4e6d98ea984c17a5b3789"),
        "solutionExternalId" : "606d92fa-42d8-11ec-ac61-26092024-1011-OBSERVATION-TEMPLATE-1727325913582",
        "startDate" :new Date("2023-08-25T18:29:59"),
        "endDate" :getEndDate("2025-06-15 18:50:00"),
        "status" : "published",
        "entityType" : "school",
        "entities" : [ 
            null, 
            "5fd1f497e84a88170cfa85a2"
        ],
        "createdFor" : [ 
            "2"
        ],
        "rootOrganisations" : [],
        "isAPrivateProgram" : false,
        "link" : "8f563917c4f3bfa2e179a960af2360be",
        "updatedAt" : new Date("2024-09-26T04:45:25.003Z"),
        "createdAt" : new Date("2024-09-26T04:45:13.581Z"),
        "deleted" : false,
        "__v" : 0
    }
]

module.exports = {
    solutionData,
    criteriaData,
    questionsData,
    criteriaQuestionsData,
    frameworkData,
    observationSubmissionData,
    observationData
}