import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./feature/dashboard/dashboard.component').then(
        (c) => c.DashboardComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
