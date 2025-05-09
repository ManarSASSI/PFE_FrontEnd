import { Component,OnInit } from '@angular/core';
import { SharedModule } from '../../../../../shared/common/sharedmodule';
import flatpickr from 'flatpickr';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule,FlatpickrDefaults  } from 'angularx-flatpickr';

@Component({
  selector: 'app-date-time-picker',
  standalone: true,
  imports: [SharedModule, FormsModule, FlatpickrModule],
  templateUrl: './date-time-picker.component.html',
  providers: [
    FlatpickrDefaults,
    // ... other providers
  ],
  styleUrl: './date-time-picker.component.scss'
})
export class DateTimePickerComponent {
  inlineDatePicker: boolean = false;
  weekNumbers!: true
  // selectedDate: Date | null = null; 
  flatpickrOptions: any = {
    inline: true,
   
  };
  // flatpickrOptions: FlatpickrOptions;

  constructor() {}

  ngOnInit() {
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
}
