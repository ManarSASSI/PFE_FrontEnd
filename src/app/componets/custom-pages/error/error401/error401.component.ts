import { Component, ElementRef, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-error401',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './error401.component.html',
  styleUrls: ['./error401.component.scss']
})
export class Error401Component implements OnInit {

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
