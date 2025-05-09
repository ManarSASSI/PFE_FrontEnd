import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { ShowcodeCardComponent } from '../../../../shared/common/includes/showcode-card/showcode-card.component';
import * as prismCodeData from '../../../../shared/prismData/forms/floating_labels'

@Component({
  selector: 'app-floating-labels',
  standalone: true,
  imports: [SharedModule, ShowcodeCardComponent],
  templateUrl: './floating-labels.component.html',
  styleUrl: './floating-labels.component.scss'
})
export class FloatingLabelsComponent {
  prismCode = prismCodeData;

}
