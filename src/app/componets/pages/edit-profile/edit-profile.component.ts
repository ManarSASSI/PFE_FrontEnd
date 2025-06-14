import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { UserService } from '../../../shared/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../shared/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,SharedModule,NgSelectModule,RouterModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  editForm: FormGroup;
  userData: any;
  // selectedFile: File | null = null;
  // avatarFile?: File;
  userId: number = 0;
  currentUser: any;

  constructor( private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    this.userId = this.currentUser.id;

      this.editForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email] ],
      phone: ['',[
        Validators.required, 
        Validators.pattern(/^\+?[\d\s-]{10,}$/)
      ]],
      password: ['', [
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      location: [''],
    });
     }

  ngOnInit(): void {
    this.loadUserData();
  }


  loadUserData(): void {
    this.userService.getUserById(this.userId).subscribe({
      next: (user) => {
        console.log('Données reçues:', user);

        this.editForm.patchValue({
          username: user.username,
          email: user.email,
          phone: user.phone,
          location: user.location
        });
        console.log('Valeurs du formulaire:', this.editForm.value);
      },
      error: (err) => {
        this.toastr.error('Failed to load partner data');
      }
    })
    // this.userData = this.authService.getCurrentUserValue();
    // if (this.userData) {
    //   this.userId = this.userData.id;
    //   this.editForm.patchValue({
    //     username: this.userData.username,
    //     email: this.userData.email,
    //     phone: this.userData.phone,
    //     location: this.userData.location
    //   });
    //   console.log('Valeurs du formulaire:', this.editForm.value);
    // }
  }

 onSubmit(): void {
    if (this.editForm.valid) {
      const userData = {
      username: this.editForm.get('username')?.value,
      email: this.editForm.get('email')?.value,
      phone: this.editForm.get('phone')?.value,
      location: this.editForm.get('location')?.value,
      // Envoyer le mot de passe seulement s'il est rempli
      ...(this.editForm.get('password')?.value && { 
        password: this.editForm.get('password')?.value 
      })
      // const formData = new FormData();
      // formData.append('username', this.editForm.get('username')?.value ?? '');
      // formData.append('email', this.editForm.get('email')?.value ?? '');
      // formData.append('phone', this.editForm.get('phone')?.value ?? '');
      // formData.append('location', this.editForm.get('location')?.value ?? '');

      // // if (this.avatarFile) {
      // //   formData.append('avatar', this.avatarFile);
      // // }
    }
      this.userService.updateUser(this.userId, userData).subscribe({
        next: (updatedUser) => {
          // Mettre à jour le localStorage avec les nouvelles données
        localStorage.setItem('currentUser', JSON.stringify({
          ...this.currentUser,
          ...updatedUser // Utilisez les données retournées par l'API
        }));
        
        // Mettre à jour la variable locale
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);


          this.toastr.success('User updated successfully');
          if(this.currentUser.role === 'PARTNER'){
              this.router.navigate(['/dashboard/employee-dashboard/dashboard']);
          }else if(this.currentUser.role === 'MANAGER'){
              this.router.navigate(['/dashboard/hrmdashboards/dashboard']);
          }else{
              this.router.navigate(['/admin/role-access']);
          }
        },
        error: (err) => {
          this.toastr.error('Error updating user');
          console.error('Update error:', err);
        }
      });
    }
  }
  onCancel(): void {
    if(this.currentUser.role === 'PARTNER'){
      this.router.navigate(['/dashboard/employee-dashboard/dashboard']);
    }else if(this.currentUser.role === 'MANAGER'){
      this.router.navigate(['/dashboard/hrmdashboards/dashboard']);
    }else{
      this.router.navigate(['/admin/role-access']);
    }
    
  }

  // onFileChange(event: any) {
  //   if (event.target.files.length > 0) {
  //     const file = event.target.files[0];
  //     this.editForm.patchValue({
  //       avatar: file
  //     });
  //   }
  // }


}
