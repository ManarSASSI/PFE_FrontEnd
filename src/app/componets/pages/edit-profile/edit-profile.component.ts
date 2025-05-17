import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { NgSelectModule } from '@ng-select/ng-select';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../shared/services/auth/auth.service';
import { UserService } from '../../../shared/services/user/user.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [SharedModule,NgSelectModule,RouterModule],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {
  editForm: FormGroup;
  userData: any;
  selectedFile: File | null = null;
  avatarFile?: File;
  userId: number = 0;

  constructor( private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router) {
      this.editForm = this.fb.group({
      username: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phone: [''],
      location: [''],
      avatar: ['']
    });
     }

  ngOnInit(): void {
    this.loadUserData();
  }


  loadUserData(): void {
    this.userData = this.authService.getCurrentUserValue();
    if (this.userData) {
      this.userId = this.userData.id;
      this.editForm.patchValue({
        username: this.userData.username,
        email: this.userData.email,
        phone: this.userData.phone,
        location: this.userData.location
      });
      console.log('Valeurs du formulaire:', this.editForm.value);
    }
  }

 onSubmit(): void {
    if (this.editForm.valid) {
      const formData = new FormData();
      formData.append('username', this.editForm.get('username')?.value ?? '');
      formData.append('email', this.editForm.get('email')?.value ?? '');
      formData.append('phone', this.editForm.get('phone')?.value ?? '');
      formData.append('location', this.editForm.get('location')?.value ?? '');

      if (this.avatarFile) {
        formData.append('avatar', this.avatarFile);
      }

      this.userService.updateUser(this.userId, formData).subscribe({
        next: () => {
          this.toastr.success('Partner updated successfully');
          this.router.navigate(['/dashboard/hrmdashboards/employees/employee-list']);
        },
        error: (err) => {
          this.toastr.error('Error updating partner');
          console.error('Update error:', err);
        }
      });
    }
  }
  onCancel(): void {
    if(this.userData.role === 'PARTNER'){
      this.router.navigate(['/dashboard/employee-dashboard/dashboard']);
    }else{
      this.router.navigate(['/dashboard/hrmdashboards/dashboard']);
    }
    
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.editForm.patchValue({
        avatar: file
      });
    }
  }


}
