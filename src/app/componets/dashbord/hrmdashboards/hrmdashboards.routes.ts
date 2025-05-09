import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
  {
    path: 'dashboard/hrmdashboards', children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'department',
        loadComponent: () =>
          import('./department/department.component').then((m) => m.DepartmentComponent),
      },
      {
        path: 'awards',
        loadComponent: () =>
          import('./awards/awards.component').then((m) => m.AwardsComponent),
      },
      {
        path: 'notice-board',
        loadComponent: () =>
          import('./notice-board/notice-board.component').then((m) => m.NoticeBoardComponent),
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./settings/settings.component').then((m) => m.SettingsComponent),
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class hrmdashboardRoutingModule {
  static routes = admin;
}
