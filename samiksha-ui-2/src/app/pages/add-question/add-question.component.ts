import { Component, OnInit, Inject } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Router } from "@angular/router";
import { HeaderTextService } from "../../service/toolbar/header-text.service";
import { ApiService } from "../../service/api/api.service";
import { CriteriaComponent } from "../criteria/criteria.component";

@Component({
  selector: "sl-add-question",
  templateUrl: "./add-question.component.html",
  styleUrls: ["./add-question.component.scss"]
})
export class AddQuestionComponent implements OnInit {
  question: any;
  evidences: any;
  DCPCRevidences:any;
  sections: any;
  criteriaQuestions: any;
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;
   rubricLevel = ['L1','L2','L3'];
  toppings = new FormControl();
  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private _router: Router,
    private headerTextService: HeaderTextService
  ) {
    this.reset();
  }



  openDialog(result: any): void {
    let self = this;
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: "75%",
      height: "80%",
      data: result.result,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      self.reset();
    });
  }
  reset() {
    let self = this;
    this.apiService
      .reqHandler("getCriteriaAndQuestion", undefined)
      .then(result => {
        self.criteriaQuestions = result;
       
      });
    this.question = {
      question: ["", ""],
      tip: "",
      externalId:"",
      parentId:"",
      instanceParentId:"",
      options: [{ value: "", label: "" }],
      visibleIf: [{}],
      rubricLevel: "",
      file: {
        required: false,
        type: ["image/jpeg"],
        minCount: 1,
        maxCount: 0,
        caption: false
      },
      responseType: "",
      validation: { required: true },
      children: [],
      fileName: [],
      showRemarks: false,
      isCompleted: false,
      remarks: "",
      value: "",
      canBeNotApplicable: false,
      notApplicable: "",
      usedForScoring: "",
      modeOfCollection: "onfield",
      questionType: "auto",
      questionGroup: ["A1"],
      accessibility: "local",
      payload: {
        criteriaId: "",
        evidenceId: "",
        section: ""
      }
    };
  }
 _filter(value: string): string[] {
   if( this.criteriaQuestions){
    const filterValue = value.toLowerCase();
    console.log(filterValue)
    return this.criteriaQuestions.result.criteria.filter(option => 
      option['name'].toLowerCase().includes(filterValue)
      );
   }
   
  }
  ngOnInit() {
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
  
  
    this.headerTextService.setHeader("Add Questions");

    this.evidences = [
        {
          externalId: "DA",
          tip: "Give the school leader the list of documents to be kept ready, and once they are given - begin the analysis",
          name: "Documentary Analysis",
          description: "Give the school leader the list of documents to be kept ready, and once they are given - begin the analysis",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: false
        },
        {
          externalId: "SW",
          tip: "Conduct a school walkthrough first and then enter the data",
          name: "School Walkthrough (Observations)",
          description: "Conduct a school walkthrough first and then enter the data",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: false
        },
        {
          externalId: "PI",
          tip: "Conduct principal interview on the first or second day, before the coordinator interview",
          name: "Principal Interview",
          description: "Conduct principal interview on the first or second day, before the coordinator interview",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: false
        },
        {
          externalId: "CO",
          tip: "Conduct 3 pop-in observations of 10 minutes each for all teachers",
          name: "Classroom Observation",
          description: "Conduct 3 pop-in observations of 10 minutes each for all teachers",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: false
        },
        {
          externalId: "TI",
          tip: "Conduct teacher interviews for 25% of teachers across sections or 10 teachers, whichever is greater",
          name: "Teacher Interview",
          description: "Conduct teacher interviews for 25% of teachers across sections or 10 teachers, whichever is greater",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: false
        },
        {
          externalId: "AC3",
          tip: "",
          name: "Assessment Class 3",
          description: "",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: true
        },
        {
          externalId: "AC5",
          tip: "",
          name: "Assessment Class 5",
          description: "",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: true
        },
        {
          externalId: "AC8",
          tip: "",
          name: "Assessment Class 8",
          description: "",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: true
        },
        {
          externalId: "PAI",
          tip: "Approach parents when they are dropping children to the school or are waiting to pick children up from the school. Ask the following questions for 7-8 parents",
          name: "Parent Interview",
          description: "Approach parents when they are dropping children to the school or are waiting to pick children up from the school. Ask the following questions for 7-8 parents",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: false
        },
        {
          externalId: "COI",
          tip: "Conduct coordinator interview on the second or third day, after the principal interview",
          name: "Coordinator Interview",
          description: "Conduct coordinator interview on the second or third day, after the principal interview",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: false
        },
        {
          externalId: "SFGD",
          tip: "1 group (7-8 students from 4th and 5th)",
          name: "Student Focused Group Discussions",
          description: "1 group (7-8 students from 4th and 5th)",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: false
        },
        {
          externalId: "TFGD",
          tip: "3 (primary, middle, high)",
          name: "Teacher Focused Group Discussions",
          description: "3 (primary, middle, high)",
          startTime: "",
          endTime: "",
          isSubmitted: false,
          sections: [],
          modeOfCollection: "onfield",
          canBeNotApplicable: false
        }
      
    ];

    
    this.DCPCRevidences = [
      {
        externalId: "AC3",
        tip: "Some tip at evidence level.",
        name: "Assessment - Class 3",
        description: "Some description about evidence",
        startTime: "",
        endTime: "",
        isSubmitted: false,
        sections: [],
        modeOfCollection: "onfield",
        canBeNotApplicable: true
      },
      {
        externalId: "AC5",
        tip: "Some tip at evidence level.",
        name: "Assessment - Class 5",
        description: "Some description about evidence",
        startTime: "",
        endTime: "",
        isSubmitted: false,
        sections: [],
        modeOfCollection: "onfield",
        canBeNotApplicable: true
      },
      {
        externalId: "AC8",
        tip: "Some tip at evidence level.",
        name: "Assessment - Class 8",
        description: "Some description about evidence",
        startTime: "",
        endTime: "",
        isSubmitted: false,
        sections: [],
        modeOfCollection: "onfield",
        canBeNotApplicable: true
      },
      {
        externalId: "BL",
        tip: "Some tip at evidence level.",
        name: "Book Look",
        description: "Some description about evidence",
        startTime: "",
        endTime: "",
        isSubmitted: false,
        sections: [],
        modeOfCollection: "onfield",
        canBeNotApplicable: true
      },
      {
        externalId: "CO",
        tip: "Some tip at evidence level.",
        name: "Classroom Observation",
        description: "Some description about evidence",
        startTime: "",
        endTime: "",
        isSubmitted: false,
        sections: [],
        modeOfCollection: "onfield",
        canBeNotApplicable: true
      },
      {
        externalId: "LW",
        tip: "Some tip at evidence level.",
        name: "Learning Walk",
        description: "Some description about evidence",
        startTime: "",
        endTime: "",
        isSubmitted: false,
        sections: [],
        modeOfCollection: "onfield",
        canBeNotApplicable: true
      },
      {
        externalId: "PAI",
        tip: "Some tip at evidence level.",
        name: "Parent Interview",
        description: "Some description about evidence",
        startTime: "",
        endTime: "",
        isSubmitted: false,
        sections: [],
        modeOfCollection: "onfield",
        canBeNotApplicable: true
      },
      {
        externalId: "PI",
        tip: "Some tip at evidence level.",
        name: "Principal Interview",
        description: "Some description about evidence",
        startTime: "",
        endTime: "",
        isSubmitted: false,
        sections: [],
        modeOfCollection: "onfield",
        canBeNotApplicable: true
      },
      {
        externalId: "SI",
        tip: "Some tip at evidence level.",
        name: "Student Interview",
        description: "Some description about evidence",
        startTime: "",
        endTime: "",
        isSubmitted: false,
        sections: [],
        modeOfCollection: "onfield",
        canBeNotApplicable: true
      },
      {
        externalId: "TI",
        tip: "Some tip at evidence level.",
        name: "Teacher Interview",
        description: "Some description about evidence",
        startTime: "",
        endTime: "",
        isSubmitted: false,
        sections: [],
        modeOfCollection: "onfield",
        canBeNotApplicable: true
      }
    ];

    // this.DCPCRsections = [
    //   { name: "Survey Questions", questions: [] },
    //   { name: "Data to be Filled", questions: [] },
    //   { name: "Group Interview", questions: [] },
    //   { name: "Individual Interview", questions: [] }
    // ];

    this.sections = [
      { name: "Survey Questions", questions: [] },
      { name: "Reading Fluency - English", questions: [] },
      { name: "Reading Comprehension", questions: [] },
      { name: "Math Assessment", questions: [] }
    ];
  }

  transform(items: any[], field: string, value: string): any[] {
    if (!items) return [];
    return items.filter(it => it[field] == value);
  }

  searchCriteria(value) {
    //console.log(value);
  }

  addOption() {
    this.question.options.push({ value: "", label: "" });
  }
  removeOption(i) {
    if (i > -1) {
      this.question.options.splice(i, 1);
    }
  }

  save(): void {
    this.question.file = this.question.file.required ? this.question.file : ""

    console.log(this.question)
    this.apiService
      .reqHandler("saveQuestion", this.question)
      .then(result => {
        //console.log(result);

        this.openDialog(result);
      })
      .catch(error => {
        alert(error.message)
        //console.error(error);
      });
  }

  cancel(): void {
    this.reset();
  }

  questionType(type) {
    // console.log(
    //   this.question.responseType,
    //   ["multiselect", "radio"].indexOf(this.question.responseType) > -1
    // );

    if (type != "matrix") {
      delete this.question.instanceIdentifier;
      delete this.question.noOfInstances;
      delete this.question.notApplicable;
      delete this.question.instanceQuestions;

      if (["radio", "multiselect"].indexOf(type) == -1) {
        delete this.question.options;
      } else {
        this.question.options = [{ value: "", label: "" }];
      }
    } else {
      delete this.question.options;
    }
  }
}

@Component({
  selector: "question-dialog",
  templateUrl: "question-dialog.html",
  styleUrls: ["./question-dialog.scss"]
})
export class DialogOverviewExampleDialog implements OnInit {
  criteria: any;
  questions: any;
  isNumber: boolean;
  oldParent: string;
  typeList: string[] = ["image/jpeg"];

  // sections: any = [];

  ngOnInit(): void {
    // //console.log(this.question, this.criteria);
  }

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public question: any
  ) {
    //console.log(this.question);
  }

  save(): void {
    alert("ID Copied");
    this.dialogRef.close(this.question);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
