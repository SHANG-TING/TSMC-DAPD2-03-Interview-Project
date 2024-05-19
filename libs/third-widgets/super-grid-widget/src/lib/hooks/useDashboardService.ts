import { ThirdWidgetElement } from '@portal/shared/interfaces';

export const useDashboardService = (container: ShadowRoot) => {
  const host = container.host as ThirdWidgetElement;
  return host.dashboardService;
};
