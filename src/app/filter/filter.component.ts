import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'act-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  value=30;

  constructor() { }

  ngOnInit() {
  }

}
