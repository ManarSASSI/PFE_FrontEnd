import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error500',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './error500.component.html',
  styleUrls: ['./error500.component.scss']
})
export class Error500Component implements OnInit {

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
