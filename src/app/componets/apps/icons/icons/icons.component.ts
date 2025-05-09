import { Component, ElementRef } from '@angular/core';

import { SharedModule } from '../../../../shared/common/sharedmodule';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-icons',
  standalone: true,
  imports: [SharedModule,NgbModule],
  templateUrl: './icons.component.html',
  styleUrl: './icons.component.scss'
})
export class IconsComponent {
  constructor(private elementRef : ElementRef){

  }
 ngOninit(){

 }
}
