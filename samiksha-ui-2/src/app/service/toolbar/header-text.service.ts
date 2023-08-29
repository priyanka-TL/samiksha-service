import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class HeaderTextService {
  text = new Subject<any>();
  constructor() {}

  setHeader(val) {
    this.text.next(val);
  }
}
