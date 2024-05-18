import { useEffect, useState } from 'react';

import { Subscription } from 'rxjs';

import {
  GridFilterData,
  GridSortData,
  IDashboardService,
} from '@portal/shared/interfaces';

export const useGridSettings = (dashboardService: IDashboardService) => {
  const [filterData, setFilterData] = useState<GridFilterData>({});
  const [sortOrderData, setSortOrderData] = useState<GridSortData>({});

  useEffect(() => {
    const subscription = new Subscription();

    subscription.add(
      dashboardService.gridFilterChange$.subscribe(setFilterData)
    );
    subscription.add(
      dashboardService.gridSortChange$.subscribe(setSortOrderData)
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [dashboardService.gridFilterChange$, dashboardService.gridSortChange$]);

  return { filterData, sortOrderData };
};
