import { Coords } from '../../model/activity';
import { MdDialogRef } from '@angular/material';
import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MapsAPILoader } from 'angular2-google-maps/core';

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

  searchControl: FormControl;
  
  @ViewChild("search")
  public searchElementRef: ElementRef;

	constructor(public dialogRef: MdDialogRef<any>,
							private mapsAPILoader: MapsAPILoader,
							private ngZone: NgZone) {}

	ngOnInit() {

    this.searchControl = new FormControl();
    this.mapsAPILoader.load().then(() => {
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: []
      });

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
  
          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.lat = this.marker.lat = place.geometry.location.lat();
          this.lng = this.marker.lng = place.geometry.location.lng();
					this.geoloc = new Coords(this.marker.lat, this.marker.lng, 1);
					this.searchControl.reset();
					
        });
      });
    });

		// console.log(this.param);
		if (this.param) {
			this.lat = this.param.latitude;
			this.lng = this.param.longitude;

			this.marker.lat = this.param.latitude;
			this.marker.lng = this.param.longitude;
		}
		// Fixes bug where you need to click map to register manual location
		this.geoloc = new Coords(this.marker.lat, this.marker.lng, 1);
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
