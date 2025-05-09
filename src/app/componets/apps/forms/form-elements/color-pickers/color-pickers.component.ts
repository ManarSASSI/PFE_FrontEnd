import { Component,ViewChild } from '@angular/core';
import { SharedModule } from '../../../../../shared/common/sharedmodule';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxColorsModule } from 'ngx-colors';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ShowcodeCardComponent } from '../../../../../shared/common/includes/showcode-card/showcode-card.component';
import * as prismCodeData from '../../../../../shared/prismData/color-pickers'

@Component({
  selector: 'app-color-pickers',
  standalone: true,
  imports: [SharedModule,ColorPickerModule,NgxColorsModule,FormsModule,MatIconModule,ShowcodeCardComponent],
  providers: [ NgbModal],
  templateUrl: './color-pickers.component.html',
  styleUrl: './color-pickers.component.scss'
})
export class ColorPickersComponent {
  public color: string = '#2889e9';
  public color1: string = '#2889e9';
  public color2: string = '#e920e9';
 


  public onEventLog(event: string, data: any): void {
  }
 
  constructor() { }
  color3:string = '#EC407A';
  input1: string = "#00897B";
  prismCode = prismCodeData;



}

