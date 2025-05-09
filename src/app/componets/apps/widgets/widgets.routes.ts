import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
  {
    path: 'apps/widgets',
    children: [
      {
        path: 'widgets',
        loadComponent: () =>
          import('./widgets/widgets.component').then((m) => m.WidgetsComponent),
          
    },
    {
      path: 'chart-widgets',
      loadComponent: () =>
        import('./chart-widgets/chart-widgets.component').then((m) => m.ChartWidgetsComponent),
        
  },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WidgetsRoutingModule { 
  static routes = routes;

}
