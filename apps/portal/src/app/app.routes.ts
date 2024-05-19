import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('@portal/feature/dashboard').then((m) => m.DashboardComponent),
  },
  { path: '**', redirectTo: '' },
];
