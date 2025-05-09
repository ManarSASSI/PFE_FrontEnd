import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
const DATA=[
  {
    id:'1',
    img:"./assets/images/ecommerce/1.jpg" ,
    name:'Flower Vase',
    price:' $229',
    rating:'4.2',
    pricecross:'$1,799',
    description:"Atti's Home Decor",
    persentage:'72%'
  },
  {
   id:'2',
    img:"./assets/images/ecommerce/2.jpg" ,
    name:'Wooden chair',
    price:' $599',
    rating:'4.0',
    pricecross:'$2,499',
    description:'Modern Design Chair', 
    persentage:'75%'

  },
  {
    id:'3',
    img:"./assets/images/ecommerce/3.jpg" ,
    name:'Wrist Watch',
    price:' $1,199',
    rating:'4.5',
    pricecross:'$3,299',
    description:'Branded Watches for Men',
    persentage:'62%'

  },
  {
    id:'4',
    img:"./assets/images/ecommerce/4.jpg" ,
    name:'Medium Table',
    price:' $349',
    rating:'4.2',
    pricecross:'$1,299',
    description:'Easy Single Wooden Table', 
    persentage:'60%'

  },
  {
    id:'5',
    img:"./assets/images/ecommerce/5.jpg" ,
    name:'Cup',
    price:' $1,899',
    rating:'4.5',
    pricecross:'$3,799',
    description:'Solid Coffee Cup',
    persentage:'50%'

  },
  {
    id:'6',
    img:"./assets/images/ecommerce/6.jpg" ,
    name:'Kurti',
    price:' $1,499',
    rating:'4.1',
    pricecross:'$2,499',
    description:'Fashion Long Kurti',
    persentage:'38%'
  },
  {
    id:'7',
    img:"./assets/images/ecommerce/7.jpg" ,
    name:'Digital Camera',
    price:' $299',
    rating:'4.4',
    pricecross:'$399',
    description:'1050mp Camera',
    persentage:'72%'
  },
  {
    id:'8',
    img:"./assets/images/ecommerce/8.jpg" ,
    name:'Ear Buds',
    price:' $1,899',
    rating:'3.8',
    pricecross:'$3,299',
    description:'Branded New featured sets',
    persentage:'72%'
  },

]
@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [SharedModule,RouterModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {
  items=DATA
  
 ConformAlert(id:string) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You want to remove from wishlist",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Remove',
    })
    .then((willDelete: any) => {
      if (willDelete) {
       const data = this.items.filter((x: { id: string }) => x.id !== id);
       this.items = data;
        Swal.fire("Deleted!", "Item removed from wishlist", "success");
      }
      else {
       
        Swal.fire("Cancelled", "Your item is safe :)", "info");
     }
    });
     }
 

  Clear = () => {
    this.items = [];
  };
}
