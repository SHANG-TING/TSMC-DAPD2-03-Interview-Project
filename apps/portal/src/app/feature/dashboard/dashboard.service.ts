import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { GridWidgetData } from '../../shared/ui/gridbox/gridbox.interface';

@Injectable()
export class DashboardService {
  gridFilterChange$ = new BehaviorSubject<Partial<GridWidgetData>>({
    name: '',
  });
}
