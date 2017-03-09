import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'act-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  menuItems = [
    {
      name: "Profile",
      active: true
    },
    {
      name: "Settings",
      active: false
    },
    {
      name: "Messages",
      active: false
    }
  ]

  constructor() { }

  ngOnInit() {
  }

  selectMenuItem(event) {
    for (let item of this.menuItems) {
      item.active = false;
    }
  }

}
