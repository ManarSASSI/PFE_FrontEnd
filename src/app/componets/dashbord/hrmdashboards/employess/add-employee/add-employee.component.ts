import { NgCircleProgressModule } from 'ng-circle-progress';
import { Component, OnInit } from '@angular/core';
import { NgbDateStruct, NgbModule, NgbRatingConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../../../shared/common/sharedmodule';
import { Router, RouterModule } from '@angular/router';
import flatpickr from 'flatpickr';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PartnerService } from '../../../../../shared/services/partner/partner.service';
import { AuthService } from '../../../../../shared/services/auth/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [ReactiveFormsModule,NgbModule,NgSelectModule,NgCircleProgressModule,SharedModule,RouterModule,FlatpickrModule,],
  providers:[FlatpickrDefaults],
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  
  model!: NgbDateStruct;
  model1!: NgbDateStruct;
  model2!: NgbDateStruct;
  model3!: NgbDateStruct;

  active = 1;
  currentRate = 3;

  partnerForm: FormGroup;

  constructor(config: NgbRatingConfig, private fb: FormBuilder,private partnerService: PartnerService,private authService: AuthService,private router: Router,private toastr: ToastrService) {
    // customize default values of ratings used by this component tree
    config.max = 5;
    this.partnerForm = this.fb.group({
  username: ['', Validators.required],
  email: ['', [Validators.required, Validators.email]],
  password: ['', [
    Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
  ]],
  phone: ['', [
    Validators.required, 
    Validators.pattern(/^\+?[\d\s-]{10,}$/)
  ]],
  location: ['', Validators.required],
  avatar: [null]
});
  }
  ngOnInit(): void {
    this.flatpickrOptions = {
     enableTime: true,
       noCalendar: true,
       dateFormat: 'H:i',
     };
 
     flatpickr('#inlinetime', this.flatpickrOptions);
 
       this.flatpickrOptions = {
         enableTime: true,
         dateFormat: 'Y-m-d H:i', // Specify the format you want
         defaultDate: '2023-11-07 14:30', // Set the default/preloaded time (adjust this to your desired time)
       };
 
       flatpickr('#pretime', this.flatpickrOptions);
   }
   
   inlineDatePicker: boolean = false;
   weekNumbers!: true
   // selectedDate: Date | null = null; 
   flatpickrOptions: any = {
     inline: true,
    
   };


   onFileChange(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.partnerForm.patchValue({
        avatar: file
      });
    }
  }


  onSubmit() {
    if (this.partnerForm.invalid) {
      console.log('Form invalid:', this.partnerForm.errors);
      return;
    }
    if (this.partnerForm.valid) {
      const formData = new FormData();
      Object.keys(this.partnerForm.value).forEach(key => {
        if (key === 'avatar' && this.partnerForm.get(key)?.value) {
          formData.append(key, this.partnerForm.get(key)?.value);
        } else {
          formData.append(key, this.partnerForm.get(key)?.value);
        }
        console.log('Avatar value:', this.partnerForm.get('avatar')?.value);
        for (let pair of (formData as any).entries()) {
            console.log(pair[0] + ', ' + pair[1]);
          }
      });
      // Utilisation du PartnerService pour créer le partenaire
      this.partnerService.createPartner(formData).subscribe({
        next: (response) => {
          this.router.navigate(['/dashboard/hrmdashboards/employees/employee-list']);
          this.toastr.success('Registration successful', 'PFE', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        },
        error: (error) => {
          console.error('Erreur lors de la création du partenaire', error);
          // Gestion des erreurs (à adapter selon votre besoin)
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

  closeForm() {
    this.router.navigate(['/dashboard/hrmdashboards/employees/employee-list']);
}


}
