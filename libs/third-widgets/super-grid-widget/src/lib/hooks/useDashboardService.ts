import { IDashboardService } from '@portal/shared/interfaces';

export const useDashboardService = (container: ShadowRoot) => {
  const host = container.host as HTMLElement & {
    dashboardService: IDashboardService;
  };
  return host.dashboardService;
};
