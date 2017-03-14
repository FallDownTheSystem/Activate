import { Category } from './category';

export class Activity {
	id: number;
	title: string;
	subtitle: string;
	category: Category;
	description: string;
	location: string;
	gpsloc: string;
	date: string;
	time: string;
	created_uid?: string;
	createdOn?: Date;
	organizer: string;
	contact: string;
	tags: string[];
}
