import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const admin: Routes = [
 {path:'apps/icons',children:[ {
  path: 'icons',
  loadComponent: () =>
    import('./icons/icons.component').then((m) => m.IconsComponent),
  
},
]}
];
@NgModule({
  imports: [RouterModule.forChild(admin)],
  exports: [RouterModule],
})
export class iconsRoutingModule {
  static routes = admin;
}