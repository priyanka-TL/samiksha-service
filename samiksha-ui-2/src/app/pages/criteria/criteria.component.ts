import { Component, OnInit, ViewContainerRef, Inject } from "@angular/core";
import { ApiService } from "../../service/api/api.service";
import { NavigationComponent } from "../../components/navigation/navigation.component";
import { HeaderTextService } from "../../service/toolbar/header-text.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";

@Component({
  selector: "sl-criteria",
  templateUrl: "./criteria.component.html",
  styleUrls: ["./criteria.component.scss"]
})
export class CriteriaComponent implements OnInit {
  evidencesSelected: string[];
  sectionsSelected: any = {};
  levelsSelected: string[];
  evidences: any[];
  sections: any[];
  levels: any;
  criteria: any;
  levelArray = [1,2,3,4,5,6,7,8,9,10]
  constructor(
    private api: ApiService,
    private navigationComponent: NavigationComponent,
    public dialog: MatDialog,
    private headerTextService: HeaderTextService
  ) {}

  testClick() {}

  submitCriteria() {
    //console.log(this.criteria)
    let self = this;
    let criteria = JSON.parse(localStorage.getItem("criteria"));

    this.api
      .reqHandler("createCriteria", this.criteria)
      .then((result: any) => {
        if (result.status == 200) {
          // alert(result.message + "\nCriteria ID:" + result.result._id);
          this.openDialog(result.result);

          self.resetCriteria();
          self.evidencesSelected = [];
          self.sectionsSelected = [];
          self.levelsSelected = [];
        }
      })
      .catch(error => {
        //console.log(error);
      });

    console.log("Criteria submitted");
  }

  pushEvidence(obj) {
    //console.log(typeof obj, obj);
    this.criteria.evidences = [];
    obj.forEach(i => {
      this.criteria.evidences.push(this.evidences[i]);
    });
  }

  pushEvidenceSections(ei, obj) {
    //console.log(typeof obj, ei, obj);
    this.criteria.evidences[ei].sections = [];
    obj.forEach(i => {
      this.criteria.evidences[ei].sections.push(this.sections[i]);
    });
  }

  saveCriteria() {
    this.criteria.rubric.name = this.criteria.name;
    this.criteria.rubric.description = this.criteria.description;
    this.criteria.rubric.type = this.criteria.criteriaType;

    localStorage.setItem("criteria", JSON.stringify(this.criteria));
    localStorage.setItem(
      "evidencesSelected",
      JSON.stringify(this.evidencesSelected)
    );
    localStorage.setItem(
      "sectionsSelected",
      JSON.stringify(this.sectionsSelected)
    );
    localStorage.setItem("levelsSelected", JSON.stringify(this.levelsSelected));

    // alert("Criteria Saved");
    if (confirm("Confirm Submission")) {
      this.submitCriteria();
    }
  }

  pushLevels(obj) {
    //console.log(typeof obj, obj);
    this.criteria.rubric.levels = [];
    obj.forEach(i => {
      this.criteria.rubric.levels.push(this.levels[i]);
    });
  }

  ngOnInit() {
    this.headerTextService.setHeader("Criteria");
    this.resetCriteria();
  }

  resetCriteria() {
    this.criteria = {
      externalId: "",
      owner: "",
      timesUsed: 12,
      weightage: 20,
      remarks: "",
      name: "",
      description: "",
      criteriaType: "auto",
      score: "",
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
      flag: "",
      createdFor: ["0125747659358699520", "0125748495625912324"],
      rubric: {
        levels: [
          {
            level: "L1",
            label: "Level 1",
            description: "",
            expression: "",
            expressionVariables: []
          },
          {
            level: "L2",
            label: "Level 2",
            description: "",
            expression: "",
            expressionVariables: []
          },
          {
            level: "L3",
            label: "Level 3",
            description: "",
            expression: "",
            expressionVariables: []
          }
        ]
      },
      evidences: []
    };
    [
      "criteria",
      "questions",
      "evidencesSelected",
      "sectionsSelected",
      "levelsSelected"
    ].forEach(key => {
      localStorage.removeItem(key);
    });
  }

  openDialog(data): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog2, {
      width: "80%",
      height: "80%",
      data: data,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      // //console.log(result);
      this.resetCriteria();
    });
  }

  changeLevelOfRubric(numberOfLevel){
    this.criteria.rubric.levels = [];
    let index = 1;
    while ( numberOfLevel >= index){
      this.criteria.rubric.levels.push(
        {
          level: `L${index}`,
          label: `Level ${index}`,
          description: "",
          expression: "",
          expressionVariables: []
        }
      );
      index++;
    }


  }
}

@Component({
  selector: "success-dialog",
  templateUrl: "successful-dialog.html",
  styleUrls: ["./successful-dialog.scss"]
})
export class DialogOverviewExampleDialog2 implements OnInit {
  // sections: any = [];

  ngOnInit(): void {
    // //console.log(this.question, this.criteria);
  }

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog2>,
    @Inject(MAT_DIALOG_DATA) public criteria: any
  ) {
    // //console.log("oldParent--->", this.oldParent);
  }

  save(): void {
    alert("ID Copied");
    this.dialogRef.close(this.criteria);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
