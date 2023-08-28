import { Component, OnInit } from "@angular/core";
// import { Validators, FormGroup, FormArray, FormBuilder } from "@angular/forms";
@Component({
  selector: "sl-add-criteria",
  templateUrl: "./add-criteria.component.html",
  styleUrls: ["./add-criteria.component.scss"]
})
export class AddCriteriaComponent implements OnInit {
  // criteriaForm: any;
  public criteriaForm: any;

  constructor() {}

  ngOnInit() {
    this.criteriaForm = {
      externalId: "007",
      owner: "a082787f-8f8f-42f2-a706-35457ca6f1fd",
      timesUsed: 12,
      weightage: 20,
      name: "Availability of leadership",
      description: "Availability of leadership",
      criteriaType: "auto/manual",
      score: "L1/L2/L3/L4",
      resourceType: ["Program", "Framework", "Criteria"],
      language: ["English"],
      keywords: ["Keyword 1", "Keyword 2"],
      concepts: [
        {
          identifier: "LPD20100",
          name: "Teacher_Performance",
          objectType: "Concept",
          relation: "associatedTo",
          description: null,
          index: null,
          status: null,
          depth: null,
          mimeType: null,
          visibility: null,
          compatibilityLevel: null
        },
        {
          identifier: "LPD20400",
          name: "Instructional_Programme",
          objectType: "Concept",
          relation: "associatedTo",
          description: null,
          index: null,
          status: null,
          depth: null,
          mimeType: null,
          visibility: null,
          compatibilityLevel: null
        },
        {
          identifier: "LPD20200",
          name: "Teacher_Empowerment",
          objectType: "Concept",
          relation: "associatedTo",
          description: null,
          index: null,
          status: null,
          depth: null,
          mimeType: null,
          visibility: null,
          compatibilityLevel: null
        }
      ],
      rubric: {
        type: "auto",
        name: "",
        levels: [
          {
            level: "",
            label: "",
            description: "",
            expression: "",
            expressionVariables: []
          }
        ]
      },
      evidences: [
        {
          _id: "EVID01",
          externalId: "PI",
          tip: "Some tip at evidence level.",
          name: "Principal interview",
          description: "Some description about evidence",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [
            {
              _id: "SQ01",
              name: "Survey Questions",
              questions: [
                {
                  _id: "QIDA01",
                  externalId: "LW/SS/01",
                  question: [
                    "Are there any unnamed bottles lying around that may be harmful ? "
                  ],
                  tip: "Some tip at question level.",
                  responseType: "radio",
                  value: "",
                  isCompleted: false,
                  showRemarks: true,
                  remarks: "",
                  visibleIf: "",
                  children: [],
                  file: "",
                  fileName: [],
                  options: [
                    {
                      value: "R1",
                      label: "Yes"
                    },
                    {
                      value: "R2",
                      label: "No"
                    }
                  ],
                  validation: {
                    required: true
                  },
                  questionType: "manual",
                  modeOfCollection: "onfield",
                  usedForScoring: "",
                  questionGroup: ["ALL"],
                  payload: {
                    criteriaId: "5b98f3b19f664f7e1ae74988"
                  }
                },
                {
                  _id: "QIDA02",
                  externalId: "BL/SS/23",
                  question: [
                    "Contents of first aid box within expiry date include: (Tick mark all that are applicable)"
                  ],
                  tip: "Some tip at question level.",
                  responseType: "multiselect",
                  value: "",
                  isCompleted: false,
                  visibleIf: "",
                  children: [],
                  showRemarks: false,
                  remarks: "",
                  file: {
                    required: true,
                    type: ["image/jpeg"],
                    caption: false,
                    minCount: 1,
                    maxCount: 0
                  },
                  fileName: [],
                  options: [
                    {
                      value: "R1",
                      label: "Cotton"
                    },
                    {
                      value: "R2",
                      label: "Bandage"
                    },
                    {
                      value: "R3",
                      label:
                        "Antiseptic liquid such as Dettol / Betadine/ spirit"
                    },
                    {
                      value: "R4",
                      label:
                        "Antiseptic ointment/ cream/ powder such as betadine, povidone/ iodine"
                    },
                    {
                      value: "R5",
                      label:
                        "Thermometer First aid box is incomplete and contents are expired"
                    }
                  ],
                  validation: {
                    required: true
                  },
                  questionType: "manual",
                  modeOfCollection: "onfield",
                  usedForScoring: "",
                  questionGroup: ["GOVT", "PRIVATE"],
                  payload: {
                    criteriaId: "5b98f3b19f664f7e1ae74988"
                  }
                }
              ]
            },
            {
              _id: "DF01",
              name: "Data to be Filled",
              questions: [
                {
                  _id: "QIDA03",
                  externalId: "BL/TL",
                  question: [
                    "What is the date of last white wash / painting of whole school?"
                  ],
                  tip: "Some tip at question level.",
                  responseType: "date",
                  value: "",
                  isCompleted: false,
                  visibleIf: "",
                  children: [],
                  showRemarks: false,
                  remarks: "",
                  file: {
                    required: true,
                    type: ["image/jpeg"],
                    caption: false,
                    minCount: 1,
                    maxCount: 0
                  },
                  fileName: [],
                  validation: {
                    required: true
                  },
                  questionType: "auto",
                  modeOfCollection: "onfield",
                  usedForScoring:
                    "Hold multiple option value, input value, date, avg of instances, majority of instances",
                  group: ["PRIVATE"],
                  payload: {
                    criteriaId: "5b98f3b19f664f7e1ae74988"
                  }
                }
              ]
            }
          ]
        }
      ],
      createdFor: ["0125747659358699520", "0125748495625912324"]
    }; //manual //manual //manual //manual
  }

  addLevel() {
    const obj = {
      level: "",
      label: "",
      description: "",
      expression: "",
      expressionVariables: []
    };
    this.criteriaForm.rubric.levels.push(obj);
  }
  removeLevel(i) {
    if (i > -1) {
      this.criteriaForm.rubric.levels.splice(i, 1);
    }
  }
  submit() {}
}
