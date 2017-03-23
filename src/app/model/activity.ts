import { Category } from './category';

export class Activity {
	$key?: string;
	title: string;
	subtitle: string;
	category: Category;
	description: string;
	location: string;
	geoloc: Coords;
	date: string;
	time: string;
	created_uid?: string;
	createdOn?: Date;
	organizer: string;
	contact: string;
	tags: string[];

	constructor() {
		this.tags = [];
	}
}

// TODO: refactor to own model
export class Coords {
	latitude: number;
	longitude: number;
	accuracy: number;

	constructor(latitude: number, longitude: number, accuracy: number) {
		this.latitude = latitude;
		this.longitude = longitude;
		this.accuracy = accuracy;
	}

// R = earth’s radius (mean radius = 6,371km)
// Δlat = lat2− lat1
// Δlong = long2− long1
// a = sin²(Δlat/2) + cos(lat1).cos(lat2).sin²(Δlong/2)
// c = 2.atan2(√a, √(1−a))
// d = R.c

	distance(to: Coords): number {
		const R = 6371;
		const lat1 = this.latitude * Math.PI / 180, lat2 = to.latitude * Math.PI / 180;
		const dLat = lat2 - lat1;
		const dLong = (to.longitude - this.longitude) * Math.PI / 180;
		const a =  Math.pow(Math.sin(dLat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dLong / 2), 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		const d = R * c;
		return d;
	}
}
