import { Component, OnInit } from '@angular/core';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import flatpickr from 'flatpickr';
import { Router, RouterModule } from '@angular/router';
import jsonDoc from '../../../../shared/data/editor';
import { FormControl, FormGroup } from '@angular/forms';
import { NgxEditorModule, Validators, Editor, Toolbar } from 'ngx-editor';
import { User, Role } from '../../../../shared/models/user.model';
import { ContratService } from '../../../../shared/services/contrat/contrat.service';
import { Contrat } from '../../../../shared/models/contrat.model';
import { PartnerService } from '../../../../shared/services/partner/partner.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

export function minValue(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    return value !== null && value < min ? { min: { required: min } } : null;
  };
}

@Component({
  selector: 'app-new-project',
  standalone: true,
  imports: [SharedModule,NgSelectModule,NgxEditorModule,FormsModule,ReactiveFormsModule,FlatpickrModule,RouterModule],
  providers:[FlatpickrDefaults],
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {
  contratForm = this.fb.group({
    objetContrat: ['', Validators.required],
    typeContrat: ['SERVICE', Validators.required],
    departement: ['', Validators.required],
    partnerId: [undefined, Validators.required],
    montant: [null, [Validators.required, minValue(0)]],
    dateDebut: ['', Validators.required],
    dateFin: ['', Validators.required],
    status: ['NOUVEAU', Validators.required],
    commentaire: ['', Validators.required],
    etatExecution: ['EN_COURS', Validators.required],
    penaliteParJour: [null, [Validators.required, minValue(0)]]
  });

  partners: User[] = [];

  flatpickrOptions = { dateFormat: 'Y-m-d' };

  editor!: Editor;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];
  
  constructor(private fb: FormBuilder,
    private contratService: ContratService,
    private partnerService: PartnerService,private router: Router,private toastr: ToastrService) { 
      this.loadPartners();
    }

  ngOnInit() {
    this.initializeForm();
    this.loadPartners();
    this.editor = new Editor();
    };  

  initializeForm(): void {
    
  }  


  loadPartners(): void {
    this.partnerService.getPartners().subscribe({
    next: (partners) => this.partners = partners,
    error: (error) => console.error('Erreur', error)
  });
  }

  onSubmit(): void {
    if (this.contratForm.invalid) {
      console.log('Form invalid:', this.contratForm.errors);
      return;
    }
    if (this.contratForm.valid) {
      const manager = JSON.parse(localStorage.getItem('currentUser')!);
      console.log("managerId :"+ manager.id)
      const formData: Contrat = {
        ...this.contratForm.value,
        createdById: manager.id,
        heureDebutSemaine: '08:00',
        heureFinSemaine: '18:00',
        joursRetard: 0,
        alerteExpirationEnvoyee: false
      } as Contrat;

      this.contratService.createContrat(formData).subscribe({
        next: (response) => {
          this.router.navigate(['/dashboard/hrmdashboards/department']);
          this.toastr.success('addition successful', 'Contract', {
            timeOut: 3000,
            positionClass: 'toast-top-right',
          });
        },
        error: (error) => {
          console.error('Erreur lors de ajout du contrat', error);
          // Gestion des erreurs (à adapter selon votre besoin)
          let errorMessage = 'Addition failed. Please try again.';
        
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
    

  closeForm(): void {
    this.router.navigate(['/dashboard/hrmdashboards/department']);
  }

  ngOnDestroy() {
      this.editor.destroy();
  }

}
