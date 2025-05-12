import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-email',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,RouterModule],
  templateUrl: './reset-email.component.html',
  styleUrl: './reset-email.component.scss'
})
export class ResetEmailComponent {
  resetEmailForm: FormGroup;
  isLoading = false;


  constructor(private fb: FormBuilder,private authService: AuthService,
      private router: Router,
      private toastr: ToastrService
  ) {
  
      this.resetEmailForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
      })
    }

  onSubmit() {
    if (this.resetEmailForm.invalid) {
      console.log('Form invalid:', this.resetEmailForm.errors);
      return;
    }

    this.isLoading = true;

    const formData = {
      email: this.resetEmailForm.value.email,
    };

    console.log('Sending restEmail data:', formData); // Add this line

    this.authService.resetEmail(formData).subscribe({
      next: (response) => {
        this.isLoading = false;
        // this.toastr.success('Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
        this.toastr.success('Send Email successful', 'PFE', {
          timeOut: 3000,
          positionClass: 'toast-top-right',
        });
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Full error response:', error);
        
        let errorMessage = 'Reset failed. Please try again.';
        
        // Cas où le backend renvoie du texte (erreur de parsing)
  if (error.error instanceof ErrorEvent) {
    // Erreur côté client
    errorMessage = `Erreur: ${error.error.message}`;
  } else if (typeof error.error === 'string') {
    // Le message est dans error.error (texte brut)
    errorMessage = error.error;
  } else if (error.status === 200) {
    // Réponse 200 avec texte (géré via responseType: 'text')
    errorMessage = 'Email envoyé avec succès (mais le parsing a échoué)';
  }
        this.toastr.error(errorMessage);
      }
    });
  }
}
