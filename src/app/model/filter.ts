import { Coords } from './activity';
import { Category } from './category';

export class Filter {
	search: string;
	distance: number;
	category: Category;
	geoloc: Coords;
}
