import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { FirebaseService } from '../../shared/services/firebase.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AppStateService } from '../../shared/services/app-state.service';
import { DOCUMENT } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule,NgbModule,FormsModule,ReactiveFormsModule ,AngularFireModule,
      AngularFireDatabaseModule,
      AngularFirestoreModule,ToastrModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  constructor(private fb: FormBuilder,private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
) {

    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[\d\s-]{10,}$/)]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      role: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validator: this.passwordMatchValidator });
  }

  hasUppercase(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && /[A-Z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.registerForm.get('password')?.value;
    return password && /[@$!%*?&]/.test(password);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;
      if (password !== confirmPassword) {
        formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
      } else {
        formGroup.get('confirmPassword')?.setErrors(null);
      return null;
      }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      console.log('Form invalid:', this.registerForm.errors);
      return;
    }

    this.isLoading = true;

    const formData = {
      username: this.registerForm.value.userName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      confirmPassword: this.registerForm.value.confirmPassword, // Make sure this matches backend
      role: this.registerForm.value.role // Ajout du rôle dans les données envoyées
    };

    console.log('Sending registration data:', formData); // Add this line

    this.authService.register(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        // this.toastr.success('Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
        this.toastr.success('Registration successful', 'PFE', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Full error response:', error);
        
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Validation error. Please check your inputs.';
        } else if (error.status === 409) {
          errorMessage = 'Email already exists. Please use a different email.';
        }
        
        this.toastr.error(errorMessage);
      }
    });
  }
}
