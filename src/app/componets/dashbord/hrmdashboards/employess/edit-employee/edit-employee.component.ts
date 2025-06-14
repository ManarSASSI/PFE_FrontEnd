import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PartnerService } from '../../../../../shared/services/partner/partner.service';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/common/sharedmodule';
import { UserService } from '../../../../../shared/services/user/user.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule,SharedModule,RouterModule,NgSelectModule,FormsModule,ReactiveFormsModule,SharedModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss'
})
export class EditEmployeeComponent implements OnInit {
  partnerForm: FormGroup;
  partnerId: number = 0;
  // currentAvatar: string = './assets/images/users/default.png'; // Valeur par défaut
  // avatarFile?: File;
  currentUser: any;
  userId?: number;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private partnerService: PartnerService,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    this.userId = this.currentUser.id;

    this.partnerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      phone: ['',[
        Validators.required, 
        Validators.pattern(/^\+?[\d\s-]{10,}$/)
  ]],
      location: [''],
    });
  }

  ngOnInit(): void {
    this.partnerId = +this.route.snapshot.params['id'];
    this.loadPartnerData();

    console.log(this.currentUser.role);
  }

  loadPartnerData(): void {
    this.userService.getUserById(this.partnerId).subscribe({
      next: (partner) => {
        console.log('Données reçues:', partner);
        // this.currentAvatar = partner.avatar || './assets/images/users/default.png';
        this.partnerForm.patchValue({
          username: partner.username,
          email: partner.email,
          phone: partner.phone,
          location: partner.location
        });
        console.log('Valeurs du formulaire:', this.partnerForm.value);
      },
      error: (err) => {
        this.toastr.error('Failed to load partner data');
        if(this.currentUser.role === 'MANAGER'){
          this.router.navigate(['/dashboard/hrmdashboards/employees/employee-list']); 
        }else{ 
          this.router.navigate(['/admin/role-access']);
        }
      }
    });
    
  }

  

  handleImageError(event: Event) {
  const img = event.target as HTMLImageElement;
  img.src = './assets/images/users/default.png';
  img.onerror = null;
}

  onSubmit(): void {
    if (this.partnerForm.valid) {
    console.log('Données envoyées:', this.partnerForm.value);
    const userData = {
    username: this.partnerForm.get('username')?.value,
    email: this.partnerForm.get('email')?.value,
    phone: this.partnerForm.get('phone')?.value,
    location: this.partnerForm.get('location')?.value,
    password: this.partnerForm.get('password')?.value || null
    };
    // formData.append('data', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
    // if (this.avatarFile) {
    // formData.append('avatar', this.avatarFile, this.avatarFile.name);
    
    // formData.append('username', this.partnerForm.get('username')?.value || '');
    // formData.append('email', this.partnerForm.get('email')?.value || '');
    // formData.append('phone', this.partnerForm.get('phone')?.value || '');
    // formData.append('location', this.partnerForm.get('location')?.value || '');

    // if (this.partnerForm.get('password')?.value) {
    //   formData.append('password', this.partnerForm.get('password')?.value);
    // }

     // Le nom DOIT être "avatar"
  // }
    // formData.forEach((value, key) => {
    //    console.log(key, value);
    // });

      this.userService.updateUser(this.partnerId, userData).subscribe({
        next: () => {
          this.toastr.success('User updated successfully');
        if(this.currentUser.role === 'MANAGER'){
           this.router.navigate(['/dashboard/hrmdashboards/employees/employee-list']);
        }else{
          this.router.navigate(['/admin/role-access']);
        }
        },
        error: (err) => {
          this.toastr.error('Error updating user');
          console.error('Update error:', err);
        }
      })

      // this.partnerService.updatePartner(this.partnerId, formData).subscribe({
      //   next: () => {
      //     this.toastr.success('Partner updated successfully');
      //     if(this.currentUser.role === 'MANAGER'){
      //     this.router.navigate(['/dashboard/hrmdashboards/employees/employee-list']);
      //   }else{
      //     this.router.navigate(['/admin/role-access']);
      //   }
      //   },
      //   error: (err) => {
      //     this.toastr.error('Error updating partner');
      //     console.error('Update error:', err);
      //   }
      // });
    }
  }

  closeForm(): void {
    if(this.currentUser.role === 'MANAGER'){
        this.router.navigate(['/dashboard/hrmdashboards/employees/employee-list']);
    }else{
        this.router.navigate(['/admin/role-access']);
    }
  }
}
