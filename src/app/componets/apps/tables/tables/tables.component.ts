import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import * as prismCodeData from '../../../../shared/prismData/tables';
import { ShowcodeCardComponent } from '../../../../shared/common/includes/showcode-card/showcode-card.component';

@Component({
  selector: 'app-tables',
  standalone: true,
  imports: [SharedModule, ShowcodeCardComponent],
  templateUrl: './tables.component.html',
  styleUrl: './tables.component.scss'
})
export class TablesComponent {
  prismCode = prismCodeData;

}
