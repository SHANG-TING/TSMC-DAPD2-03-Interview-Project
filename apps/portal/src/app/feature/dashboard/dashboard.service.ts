import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { GridWidgetData } from '@portal/data-access/models';

@Injectable()
export class DashboardService {
  gridFilterChange$ = new BehaviorSubject<Partial<GridWidgetData>>({
    name: '',
  });
}
