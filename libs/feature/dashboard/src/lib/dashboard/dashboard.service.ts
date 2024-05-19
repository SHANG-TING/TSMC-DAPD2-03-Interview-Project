import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import {
  GridFilterData,
  GridSortData,
  IDashboardService,
} from '@portal/shared/interfaces';

@Injectable()
export class DashboardService implements IDashboardService {
  gridFilterChange$ = new BehaviorSubject<GridFilterData>({
    name: '',
  });
  gridSortChange$ = new BehaviorSubject<GridSortData>({});
}
