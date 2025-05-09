import { Component } from '@angular/core';
import { SharedModule } from '../../../../../shared/common/sharedmodule';
import { ShowcodeCardComponent } from '../../../../../shared/common/includes/showcode-card/showcode-card.component';
import * as prismCodeData from '../../../../../shared/prismData/forms/inputs'

@Component({
  selector: 'app-inputs',
  standalone: true,
  imports: [SharedModule, ShowcodeCardComponent],
  templateUrl: './inputs.component.html',
  styleUrl: './inputs.component.scss'
})
export class InputsComponent {
  prismCode = prismCodeData;

}
