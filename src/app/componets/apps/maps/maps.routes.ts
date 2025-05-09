import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LeafletComponent } from './leaflet/leaflet.component';

const routes: Routes = [
  {
    path: 'apps/maps',
    children: [
      {
        path: 'leaflet',
        loadComponent: () =>
          import('./leaflet/leaflet.component').then((m) => m.LeafletComponent),
          
    },
    
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MapsRoutingModule {
  static routes = routes;

 }
