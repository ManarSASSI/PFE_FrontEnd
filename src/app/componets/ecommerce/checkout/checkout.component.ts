import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import {FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BreakpointObserver} from '@angular/cdk/layout';
import {StepperOrientation, MatStepperModule} from '@angular/material/stepper';
import {Observable} from 'rxjs';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AsyncPipe} from '@angular/common';
import { RouterModule } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [RouterModule,SharedModule,MatStepperModule,MatIconModule,MatButtonModule,MatInputModule,MatFormFieldModule,AsyncPipe,ReactiveFormsModule,FormsModule,NgSelectModule],
  templateUrl: './checkout.component.html',
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: {displayDefaultIndicatorType: false},
    },
  ],
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
 fourthFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });
  constructor(private _formBuilder: FormBuilder,private modalService: NgbModal) {}


  Address(content: any) {
    this.modalService.open(content,{ size: 'lg' });

  }
}
