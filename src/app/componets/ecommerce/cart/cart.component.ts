import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
const DATA=[
  {
    id:'1',
    img:"./assets/images/ecommerce/1.jpg" ,
    name:'Flower Pot',
    price:'$ 122.21',
    total:"$ 122.21",
    quantity:'1',
  },
  {
   id:'2',
    img:"./assets/images/ecommerce/6.jpg" ,
    name:'Kurtis',
    price:'$ 20.63',
    total:'$ 41.26',
    quantity:'2',
  },
  {
    id:'3',
     img:"./assets/images/ecommerce/2.jpg" ,
     name:'Sofa Chiar',
     price:'$ 40.63',
     total:'$ 40.63',
     quantity:'1',
   },
  {
    id:'4',
    img:"./assets/images/ecommerce/4.jpg" ,
    name:'Table',
    price:"$ 60.63",
    total:'$ 60.63',
    quantity:'1',

  },
  {
    id:'5',
    img:"./assets/images/ecommerce/5.jpg" ,
    name:"Cup",
    price:"$ 63,830.43",
    total:' $498',
    quantity:'1',
    status:false

  },

]
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [SharedModule, FormsModule, RouterModule,NgbModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  constructor() {}
  products = DATA;
  ConformAlert(id:string) {
  
         const data = this.products.filter((x: { id: string }) => x.id !== id);
         this.products = data;
         
     
     }
  
  Clear = () => {
    this.products = [];
  };

 
  decreaseQuantity(product: any) {
    if (product.quantity > 1) {
      product.quantity--; 
      
    }
  }

  increaseQuantity(product: any) {
    product.quantity++; 

 
  }
}
