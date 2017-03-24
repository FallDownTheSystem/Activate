import { Filter } from '../model/filter';
import { Category } from '../model/category';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class FilterService {

	filter = new Subject<Filter>();
}
