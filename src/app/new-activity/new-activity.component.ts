import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'act-new-activity',
  templateUrl: './new-activity.component.html',
  styleUrls: ['./new-activity.component.scss']
})
export class NewActivityComponent implements OnInit {

    form: FormGroup;

    categories;
    selectedValue;
    
    constructor(fb: FormBuilder) {
      this.categories = [
        "Sports", 
        "Computers",
        "Music",
        "Art",
        "Wine",
        "Cheese",
      ];
      this.form = fb.group({
        "name": ["", Validators.required],
        "category": ["", Validators.required],
        "location":"",
        "description":["", Validators.required],
        "time":["", Validators.required],
        "date":["", Validators.required],
        "organizer": "",
        "contact":["", Validators.required],
      });
    }
    onSubmit() {
      console.log("model-based form submitted");
      //console.log(this.form);
    }
    cancel() {
      console.log("cancel new activity");
    }

  ngOnInit() {

  }
}
