import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'sl-rubric',
  templateUrl: './rubric.component.html',
  styleUrls: ['./rubric.component.scss'],
})
export class RubricComponent implements OnInit {
  rubricForm: any;
  constructor() {}

  ngOnInit() {
    this.rubricForm = {};
  }
}
