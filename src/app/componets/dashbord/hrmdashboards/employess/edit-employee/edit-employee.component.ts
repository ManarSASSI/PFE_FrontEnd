import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerService } from '../../../../../shared/services/partner/partner.service';
import { User } from '../../../../../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/common/sharedmodule';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [ReactiveFormsModule,SharedModule],
  templateUrl: './edit-employee.component.html',
  styleUrl: './edit-employee.component.scss'
})
export class EditEmployeeComponent implements OnInit {
  partnerForm: FormGroup;
  partnerId: number = 0;
  currentAvatar: string = './assets/images/users/default.png'; // Valeur par défaut
  avatarFile?: File;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private partnerService: PartnerService,
    private toastr: ToastrService
  ) {
    this.partnerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]],
      phone: ['', Validators.pattern(/^[0-9]{8}$/)],
      location: [''],
    });
  }

  ngOnInit(): void {
    this.partnerId = +this.route.snapshot.params['id'];
    this.loadPartnerData();
  }

  loadPartnerData(): void {
    this.partnerService.getPartnerById(this.partnerId).subscribe({
      next: (partner) => {
        console.log('Données reçues:', partner);
        this.currentAvatar = partner.avatar || './assets/images/users/default.png';
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
        this.router.navigate(['/dashboard/hrmdashboards/employees/employee-list']);
      }
    });
  }

  onFileChange(event: any): void {
    if (event.target.files.length > 0) {
      this.avatarFile = event.target.files[0];
      // Preview new avatar
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.currentAvatar = e.target.result;
      };
      reader.readAsDataURL(this.avatarFile!);
    }
  }

  onSubmit(): void {
    if (this.partnerForm.valid) {
      const formData = new FormData();
      formData.append('username', this.partnerForm.get('username')?.value ?? '');
      formData.append('email', this.partnerForm.get('email')?.value ?? '');
      formData.append('phone', this.partnerForm.get('phone')?.value ?? '');
      formData.append('location', this.partnerForm.get('location')?.value ?? '');

      if (this.partnerForm.get('password')?.value) {
        formData.append('password', this.partnerForm.get('password')?.value ?? '');
      }

      if (this.avatarFile) {
        formData.append('avatar', this.avatarFile);
      }

      this.partnerService.updatePartner(this.partnerId, formData).subscribe({
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

  closeForm(): void {
    this.router.navigate(['/dashboard/hrmdashboards/employees/employee-list']);
  }


}
