import { Component } from '@angular/core';
import { SharedModule } from '../../../../../shared/common/sharedmodule';
import { ShowcodeCardComponent } from '../../../../../shared/common/includes/showcode-card/showcode-card.component';
import * as prismCodeData from '../../../../../shared/prismData/forms/input_group'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-input-groups',
  standalone: true,
  imports: [SharedModule, ShowcodeCardComponent,NgbModule],
  templateUrl: './input-groups.component.html',
  styleUrl: './input-groups.component.scss'
})
export class InputGroupsComponent {
  prismCode = prismCodeData;

}
