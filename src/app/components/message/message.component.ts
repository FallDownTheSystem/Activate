import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'act-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {


	messages = [
		{
			user: "Owner",
			owner: true,
			timestamp: "2017-02-02 - 12:00",
			message: "asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd \
			 asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd"
		},
		{
			user: "Someone else else",
			owner: false,
			timestamp: "2017-02-02 - 13:00",
			message: "asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd "
		},
		{
			user: "Someone",
			owner: false,
			timestamp: "2017-02-02 - 13:13",
			message: "asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd "
		},
		{
			user: "Someone",
			owner: false,
			timestamp: "2017-02-02 - 13:13",
			message: "asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd "
		},
		{
			user: "Someone",
			owner: false,
			timestamp: "2017-02-02 - 13:13",
			message: "asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd "
		},
		{
			user: "Someone",
			owner: false,
			timestamp: "2017-02-02 - 13:13",
			message: "asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd "
		},
		{
			user: "Someone",
			owner: false,
			timestamp: "2017-02-02 - 13:13",
			message: "asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd "
		},
		{
			user: "Someone",
			owner: false,
			timestamp: "2017-02-02 - 13:13",
			message: "asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd asd asd asdasd asdasdasd "
		},
	]

  constructor() { }

  ngOnInit() {
  }

}
