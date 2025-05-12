import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  resetPasswordForm: FormGroup;
  token: string;
  showPassword = false;
  isLoading = false;

   constructor(private fb: FormBuilder,private authService: AuthService,
         private router: Router,
         private toastr: ToastrService,
         private route: ActivatedRoute
     ) {

        this.token = this.route.snapshot.params['token'];
        this.resetPasswordForm = this.fb.group({
        newPassword: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
         })
       } 
  hasUppercase(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && /[A-Z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.resetPasswordForm.get('newPassword')?.value;
    return password && /[@$!%*?&]/.test(password);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }


  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      console.log('Form invalid:', this.resetPasswordForm.errors);
      return;
    }

    this.isLoading = true;

    const formData = {
      token: this.token,
      newPassword: this.resetPasswordForm.value.newPassword
    };

    console.log('Sending restEmail data:', formData); // Add this line

    this.authService.resetPassword(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/auth/login']);
        this.toastr.success('Reset Password successful', 'PFE', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Full error response:', error);
        
        let errorMessage = 'Reset failed. Please try again.';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.status === 400) {
          errorMessage = 'Validation error. Please check your inputs.';
        } 
        this.toastr.error(errorMessage);
      }
    });
  }

}
