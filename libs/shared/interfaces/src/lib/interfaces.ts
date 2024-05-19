import { BehaviorSubject } from 'rxjs';

import { GridWidgetData } from '@portal/data-access/models';

export type GridFilterData = Partial<GridWidgetData>;
export type GridSortData = {
  [key in keyof GridWidgetData]?: 'asc' | 'desc';
};

export interface IDashboardService {
  gridFilterChange$: BehaviorSubject<GridFilterData>;
  gridSortChange$: BehaviorSubject<GridSortData>;
}

export interface ThirdWidgetElement extends HTMLElement {
  dashboardService: IDashboardService;
}
