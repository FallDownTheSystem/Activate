import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MdDialogRef, MdSnackBar, MdSnackBarRef } from '@angular/material';

@Component({
  selector: 'act-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {

  constructor(public dialogRef: MdDialogRef<any>) {

	}

  ngOnInit() {
  }

}
