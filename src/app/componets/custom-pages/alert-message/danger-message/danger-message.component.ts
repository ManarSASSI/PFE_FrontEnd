import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-danger-message',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './danger-message.component.html',
  styleUrls: ['./danger-message.component.scss']
})
export class DangerMessageComponent implements OnInit {

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
