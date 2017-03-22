import { Category } from '../model/category';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FilterService {

	search = new Subject<string>();
	distance = new Subject<number>();
	category = new Subject<Category>();
}

