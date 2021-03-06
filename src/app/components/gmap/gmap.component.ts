import { Coords } from '../../model/activity';
import { MdDialogRef } from '@angular/material';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'act-gmap',
	templateUrl: './gmap.component.html',
	styleUrls: ['./gmap.component.scss']
})
export class GmapComponent implements OnInit {
	param: any;
	geoloc: Coords = null;
	lat = 61.064846;
	lng = 28.093114;
	zoom = 8;

	marker: Marker = {
		lat: 61.064846,
		lng: 28.093114,
		draggable: true
	};

	constructor(public dialogRef: MdDialogRef<any>) {}

	ngOnInit() {
		// console.log(this.param);
		if (this.param) {
			this.lat = this.param.latitude;
			this.lng = this.param.longitude;

			this.marker.lat = this.param.latitude;
			this.marker.lng = this.param.longitude;
		}
	}

	setGeo() {
		this.marker.lat = this.param.latitude;
		this.marker.lng = this.param.longitude;
	}

	mapClicked($event) {
		this.marker = {
			lat: $event.coords.lat,
			lng: $event.coords.lng,
			draggable: true
		};
		this.geoloc = new Coords(this.marker.lat, this.marker.lng, 1);
	}

	markerDragEnd(m: Marker, $event: MouseEvent) {
		this.geoloc = new Coords(m.lat, m.lng, 1);
	}

}

interface Marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}
