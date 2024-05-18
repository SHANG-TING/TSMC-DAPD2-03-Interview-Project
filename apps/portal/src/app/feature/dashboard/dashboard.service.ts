import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { GridWidgetData } from '@portal/data-access/models';
import { IDashboardService } from '@portal/shared/interfaces';

@Injectable()
export class DashboardService implements IDashboardService {
  gridFilterChange$ = new BehaviorSubject<Partial<GridWidgetData>>({
    name: '',
  });
  gridSortChange$ = new BehaviorSubject<{
    [key in keyof GridWidgetData]?: 'asc' | 'desc';
  }>({});
}
