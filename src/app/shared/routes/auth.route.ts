
import { NgModule } from '@angular/core';
import {   RouterModule, Routes } from '@angular/router';
import { ErrorRoutingModule } from '../../../app/componets/custom-pages/error/error.routes';
import { AlertMessageRoutingModule } from '../../../app/componets/custom-pages/alert-message/alert-message.routes';

export const authen: Routes = [
  {
    path: 'auth',  // Ajoutez un segment parent comme 'auth'
    children: [
      {
        path: 'register',
        loadComponent: () =>
          import('../../authentication/register/register.component').then((m) => m.RegisterComponent),
      },  
      {
        path: 'login',
        loadComponent: () =>
          import('../../authentication/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'resetEmail',
        loadComponent: () =>
          import('../../authentication/reset-email/reset-email.component').then((m) => m.ResetEmailComponent),
      },
      {
        path: 'resetPassword/:token',
        loadComponent: () =>
          import('../../authentication/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
      },
      ...ErrorRoutingModule.routes,
      ...AlertMessageRoutingModule.routes,
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(authen)],
  exports: [RouterModule]
})
export class AuthenticationsRoutingModule { }