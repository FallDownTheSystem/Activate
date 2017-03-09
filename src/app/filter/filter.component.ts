import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'act-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  value=30;
  categories = [
    "Sports", 
    "Computers",
    "Music",
    "Art",
    "Wine",
    "Cheese",
  ]

  constructor() { }

  ngOnInit() {
  }

  onFilterSubmit(f) {
    console.log("Apply Filter");
    // TODO: Close sidenav from here
  }
}
