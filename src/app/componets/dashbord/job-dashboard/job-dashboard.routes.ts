import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';



const routes: Routes = [
  {
    path: 'dashboard/job-dashboard',
    children: [
      {
        path: 'job-lists',
        loadComponent: () =>
          import('./job-lists/job-lists.component').then((m) => m.JobListsComponent),
          
      },
      {
        path: 'apply-job',
        loadComponent: () =>
          import('./apply-job/apply-job.component').then((m) => m.ApplyJobComponent),
          
      },
      {
        path: 'new-job',
        loadComponent: () =>
          import('./new-job/new-job.component').then((m) => m.NewJobComponent),
          
      },
      {
        path: 'user-profile',
        loadComponent: () =>
          import('./user-profile/user-profile.component').then((m) => m.UserProfileComponent),
          
      },

      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JobDashboardRoutingModule {
  static routes = routes;

 }
