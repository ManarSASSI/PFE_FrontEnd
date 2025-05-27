import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth/auth.service';
import { FirebaseService } from '../../shared/services/firebase.service';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AppStateService } from '../../shared/services/app-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule ,AngularFireModule,
    AngularFireDatabaseModule,
    AngularFirestoreModule,ToastrModule
],
    providers: [FirebaseService,{ provide: ToastrService, useClass: ToastrService }],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  public showPassword: boolean = false;
  public loginForm: FormGroup;
  public loading = false;
  public submitted = false;

  toggleClass = 'eye-off';
  active="Angular";

  public togglePassword() {
    this.showPassword = !this.showPassword;
    if (this.toggleClass === 'eye') {
      this.toggleClass = 'eye-off';
    } else {
      this.toggleClass = 'eye';
    }
  }


constructor(
  @Inject(DOCUMENT) private document: Document,private elementRef: ElementRef,
 private sanitizer: DomSanitizer,
  public authService: AuthService,
  private router: Router,
  private formBuilder: FormBuilder,
  private renderer: Renderer2,
  // private firebaseService: FirebaseService,
  private toastr: ToastrService ,
  private appStateService: AppStateService,
) {

  this.loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

}
ngOnInit(): void {
  this.loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });
}

ngOnDestroy(): void {
  const htmlElement =
this.elementRef.nativeElement.ownerDocument.documentElement;
  document.body.classList.remove('error-1');    

}
errorMessage = ''; // validation _error handle
_error: { name: string; message: string } = { name: '', message: '' }; // for firbase _error handle

clearErrorMessage() {
  this.errorMessage = '';
  this._error = { name: '', message: '' };
}

  // Accès sécurisé aux contrôles du formulaire
  get formControls(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

login() {

  // // this.disabled = "btn-loading"
  // this.clearErrorMessage();
  // if (this.validateForm(this.email, this.password)) {
  //   this.authservice
  //     .login(this.email, this.password).toPromise()
  //     .then(() => {
  //       this.router.navigate(['/dashboard/hrmdashboards/dashboard']);
  //       console.clear();
  //       this.toastr.success('login successful','dayone', {
  //         timeOut: 3000,
  //         positionClass: 'toast-top-right',
  //       });
  //     })
  //     .catch((_error: any) => {
  //       this._error = _error;
  //       this.router.navigate(['/']);
  //     });
   
  // }
  // else {
  //   this.toastr.error('Invalid details','dayone', {
  //     timeOut: 3000,
  //     positionClass: 'toast-top-right',
  //   });
  // }
}

validateForm(email: string, password: string) {
  if (email.length === 0) {
    this.errorMessage = 'please enter email id';
    return false;
  }

  if (password.length === 0) {
    this.errorMessage = 'please enter password';
    return false;
  }

  if (password.length < 6) {
    this.errorMessage = 'password should be at least 6 char';
    return false;
  }

  this.errorMessage = '';
  return true;
  
}

//angular
// public loginForm!: FormGroup;
public error: any = '';

get form() {
  return this.loginForm.controls;
}

Submit() {

  this.submitted = true;

    // Arrête si le formulaire est invalide
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const email = this.loginForm.get('email')?.value;
    const password = this.loginForm.get('password')?.value;
    
    this.authService.login(email,password)
      .subscribe({
        next: (res) => {
          console.log('Réponse complète:', res);
          
          
          this.router.navigate(['/dashboard/hrmdashboards/dashboard']);
          this.toastr.success('login successful', 'PFE', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        },
        error: error => {
          console.error('Erreur complète:', error);
          this.loading = false;
          let errorMessage = 'Login failed';
          
          if (error.error && error.error.message) {
            errorMessage += ': ' + error.error.message;
          }
          
          this.toastr.error(errorMessage, 'Erreur', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        }
      });
  }

}