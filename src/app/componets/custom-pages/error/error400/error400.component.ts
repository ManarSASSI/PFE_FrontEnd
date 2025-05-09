import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error400',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './error400.component.html',
  styleUrls: ['./error400.component.scss']
})
export class Error400Component implements OnInit {

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
