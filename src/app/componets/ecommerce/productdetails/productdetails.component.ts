import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { RouterModule } from '@angular/router';
import { GalleryModule, Image } from '@ks89/angular-modal-gallery';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-productdetails',
  standalone: true,
  imports: [SharedModule,RouterModule,GalleryModule,NgbModule],
  templateUrl: './productdetails.component.html',
  styleUrl: './productdetails.component.scss'
})
export class ProductdetailsComponent {
  isCollapsed:boolean=false;
  thumbsSwiper: any;
  setThumbsSwiper(swiper: any) {
    this.thumbsSwiper = swiper;
  }
  dotsConfig!: false;

  imagesRect: Image[] = [

    new Image( 0, { img: './assets/images/ecommerce/png/5.png', },
      { img: './assets/images/ecommerce/png/5.png',
    }
    ),
    new Image(1, { img: './assets/images/ecommerce/png/6.png' }),
    new Image(
      2,
      {
        img: './assets/images/ecommerce/png/4.png',
       
      },
      {
        img: './assets/images/ecommerce/png/4.png',
     
      }
    ),
    new Image(
      3,
      {
        img: './assets/images/ecommerce/png/3.png',
       
      },
      { img: './assets/images/ecommerce/png/3.png',
      }
    ),
   
  ];
}
