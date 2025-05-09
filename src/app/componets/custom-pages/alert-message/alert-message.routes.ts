import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'alert',
    children: [
      {
        path: 'success-message',
        loadComponent: () =>
          import('./success-message/success-message.component').then((m) => m.SuccessMessageComponent),  
    },
    {
      path: 'danger-message',
      loadComponent: () =>
        import('./danger-message/danger-message.component').then((m) => m.DangerMessageComponent),
        },
        {
          path: 'warning-message',
          loadComponent: () =>
            import('./warning-message/warning-message.component').then((m) => m.WarningMessageComponent),
            },
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertMessageRoutingModule { 
  static routes = routes;

}
