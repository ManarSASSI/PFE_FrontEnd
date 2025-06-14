import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'dashboard/employee-dashboard',
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
          
      },
      {
        path: 'attendance',
        loadComponent: () =>
          import('./attendance/attendance.component').then((m) => m.AttendanceComponent),
          
      },
      {
        path: 'view-contract',
        loadComponent: () =>
          import('./view-contrat/view-contrat.component').then((m) => m.ViewContratComponent),
          
      },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeDashboardRoutingModule { 
  static routes = routes;

}
