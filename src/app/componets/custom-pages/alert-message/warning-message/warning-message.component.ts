import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-warning-message',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './warning-message.component.html',
  styleUrls: ['./warning-message.component.scss']
})
export class WarningMessageComponent implements OnInit {

  constructor(private elementRef:ElementRef) { 
    document.body.classList.add('error-1');
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    const htmlElement =
  this.elementRef.nativeElement.ownerDocument.documentElement;
    document.body.classList.remove('error-1');    
  }
}
