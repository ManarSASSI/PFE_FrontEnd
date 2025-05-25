import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'admin',
    children: [
      {
        path: 'general-settings',
        loadComponent: () =>
          import('./general-settings/general-settings.component').then((m) => m.GeneralSettingsComponent),
          
    },
    {
      path: 'api-settings',
      loadComponent: () =>
        import('./api-settings/api-settings.component').then((m) => m.ApiSettingsComponent),
        
  },
  {
    path: 'role-access',
    loadComponent: () =>
      import('./role-access/role-access.component').then((m) => m.RoleAccessComponent),
      
},
{
    path: 'register-list',
    loadComponent: () =>
    import('./register-list/register-list.component').then((m) => m.RegisterListComponent),  
},
{
    path: 'contract-list',
    loadComponent: () =>
    import('./contract-list/contract-list.component').then((m) => m.ContractListComponent),  
}, 
{
    path: 'dashboard',
    loadComponent: () =>
    import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),  
}, 
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { 
  static routes = routes;

}
