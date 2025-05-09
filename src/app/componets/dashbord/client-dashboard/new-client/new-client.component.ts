import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { NgSelectModule } from '@ng-select/ng-select';
import flatpickr from 'flatpickr';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { RouterModule } from '@angular/router';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-new-client',
  standalone: true,
  imports: [SharedModule,NgSelectModule,FlatpickrModule,RouterModule],
  templateUrl: './new-client.component.html',
  styleUrls: ['./new-client.component.scss'],
  providers: [
    FlatpickrDefaults,
  ],
})
export class NewClientComponent implements OnInit {

  model!: NgbDateStruct;
  model1!: NgbDateStruct;
  model2!: NgbDateStruct;
  model3!: NgbDateStruct;
  
  active = 1;
  currentRate = 3;

  constructor() { }

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

}
