import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { ShowcodeCardComponent } from '../../../../shared/common/includes/showcode-card/showcode-card.component';
import * as prismCodeData from '../../../../shared/prismData/forms/validations'
import { NgSelectModule } from '@ng-select/ng-select';
@Component({
  selector: 'app-validations',
  standalone: true,
  imports: [SharedModule,ShowcodeCardComponent,NgSelectModule],
  templateUrl: './validations.component.html',
  styleUrl: './validations.component.scss'
})
export class ValidationsComponent {
  prismCode = prismCodeData;

}
