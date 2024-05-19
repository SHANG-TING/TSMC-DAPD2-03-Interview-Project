import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () =>
      import('@portal/feature/dashboard').then((m) => m.dashboardRoutes),
  },
  { path: '**', redirectTo: '' },
];
