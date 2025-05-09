import { NgSelectModule } from '@ng-select/ng-select';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NouisliderModule } from 'ng2-nouislider';

import { NgbCollapseModule, NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/common/sharedmodule';
const DATA=[
  {
    id:'1',
    img:"./assets/images/ecommerce/png/1.png" ,
    name:'Dapzem & Co',
    price:' $229',
    rating:'4.2',
    pricecross:'$1,799',
    description:'Branded hoodie ethnic style',
    persentage:'72%'
  },
  {
   id:'2',
    img:"./assets/images/ecommerce/jpg/10.jpg" ,
    name:'Aus Polo Assn',
    price:' $1,899',
    rating:'4.5',
    pricecross:'$3,799',
    description:'Snow jacket with low pockets', 
    persentage:'50%'

  },
  {
    id:'3',
    img:"./assets/images/ecommerce/png/3.png" ,
    name:'Jimmy Lolfiger',
    price:' $1,199',
    rating:'4.5',
    pricecross:'$3,299',
    description:'Unisex jacket for men & women',
    persentage:'62%'

  },
  {
    id:'4',
    img:"./assets/images/ecommerce/jpg/13.jpg" ,
    name:'BMW',
    price:' $1,499',
    rating:'4.1',
    pricecross:'$2,499',
    description:'Ethnic wear jackets form BMW', 
    persentage:'38%'

  },
  {
    id:'5',
    img:"./assets/images/ecommerce/jpg/15.jpg" ,
    name:'Denim Corporation',
    price:' $299',
    rating:'4.1',
    pricecross:'$399',
    description:'Flap pockets denim jackets for men',
    persentage:'35%'

  },
  {
    id:'6',
    img:"./assets/images/ecommerce/png/2.png" ,
    name:'Denim Winjo',
    price:' $599',
    rating:'4.0',
    pricecross:'$2,499',
    description:'Vintage pure leather Jacket',
    persentage:'75%'
  },
  {
    id:'7',
    img:"./assets/images/ecommerce/jpg/16.jpg" ,
    name:'Pufa',
    price:' $2,399',
    rating:'3.8',
    pricecross:'$5,699',
    description:'Ergonic designed full sleeve coat',
    persentage:'72%'
  },
  {
    id:'8',
    img:"./assets/images/ecommerce/png/9.png" ,
    name:'Louie Phillippe',
    price:' $1,899',
    rating:'4.0',
    pricecross:'$3,299',
    description:'Ergonic green colored full sleeve jacket',
    persentage:'72%'
  },
  {
    id:'9',
    img:"./assets/images/ecommerce/png/4.png" ,
    name:'Bluberry Co.In',
    price:' $349',
    rating:'4.2',
    pricecross:'$2,299',
    description:'Full sleeve white hoodie',
    persentage:'60%'
  },
  {
    id:'10',
    img:"./assets/images/ecommerce/jpg/18.jpg" ,
    name:'Blueberry & Co',
    price:' $499',
    rating:'4.0',
    pricecross:'$799',
    description:'Light colored sweater form blueberry',
    persentage:'60%'
  },
  {
    id:'11',
    img:"./assets/images/ecommerce/png/10.png" ,
    name:'Denim Corp',
    price:'$2,499',
    rating:'4.1',
    pricecross:'$4,999',
    description:'beautiful brown colored snow jacket',
    persentage:'70%'
  },
  {
    id:'12',
    img:"./assets/images/ecommerce/jpg/14.jpg" ,
    name:'Garage & Co',
    price:'$249',
    rating:'4.3',
    pricecross:'$1,299',
    description:'Full sleeve sweat shirt',
    persentage:'70%'
  },
]
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [SharedModule,NgSelectModule, RouterModule, NouisliderModule, NgbCollapseModule, FormsModule, NgbDropdownModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products=DATA
  public someRange: number[] = [0.00, 10000.00];
  isCollapsed=true;
  isCollapsed1=true;
  isCollapsed3=true;
collapse1: any;
}
