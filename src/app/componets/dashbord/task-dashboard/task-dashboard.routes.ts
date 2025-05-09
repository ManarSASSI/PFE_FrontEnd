import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompletedTasksComponent } from './completed-tasks/completed-tasks.component';
import { NewTasksComponent } from './new-tasks/new-tasks.component';
import { TaskBoardComponent } from './task-board/task-board.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ViewTasksComponent } from './view-tasks/view-tasks.component';

const routes: Routes = [
  {
    path: 'dashboard/task-dashboard',
    children: [
      {
        path: 'completed-tasks',
        loadComponent: () =>
          import('./completed-tasks/completed-tasks.component').then((m) => m.CompletedTasksComponent),
          
      },
      {
        path: 'view-tasks',
        loadComponent: () =>
          import('./view-tasks/view-tasks.component').then((m) => m.ViewTasksComponent),
          
      },
      {
        path: 'task-board',
        loadComponent: () =>
          import('./task-board/task-board.component').then((m) => m.TaskBoardComponent),
          
      },
      {
        path: 'new-task',
        loadComponent: () =>
          import('./new-tasks/new-tasks.component').then((m) => m.NewTasksComponent),
          
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
export class TaskDashboardRoutingModule { 
  static routes = routes;

}
