import { DecimalPipe } from '@angular/common';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { SharedModule } from '../../../../../shared/common/sharedmodule';
import { RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { PartnerService } from '../../../../../shared/services/partner/partner.service';
import { User } from '../../../../../shared/models/user.model';
import { FormsModule } from '@angular/forms';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule,SharedModule,RouterModule,RouterModule,NgSelectModule,FormsModule],
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.scss'],
  // providers: [EmployeeService, DecimalPipe]
})
export class EmployeeListComponent implements OnInit {

  partners: User[] = [];
  partnerCount = 0;
  // @ViewChildren(SortableHeader) headers!: QueryList<SortableHeader>;

// Nouveaux états pour pagination et recherche
  currentPage = 1;
  itemsPerPage = 10;
  searchQuery = '';
  totalPages = 1;
  pageNumbers: number[] = [];

  total$!: Observable<number>;
  
  constructor(private partnerService: PartnerService,private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadPartners();
    this.loadPartnerCount();
  }

  // Méthode pour filtrer et paginer les données
  get filteredPartners(): User[] {
    console.log('Filtering partners:');
    const filtered = this.partners.filter(partner =>
      Object.values(partner).some(value =>
        value?.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
    ));
    
    this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
    this.generatePageNumbers();
    
    return filtered.slice(
      (this.currentPage - 1) * this.itemsPerPage,
      this.currentPage * this.itemsPerPage
    );
  }


  private generatePageNumbers(): void {
    this.pageNumbers = Array.from({length: this.totalPages}, (_, i) => i + 1);
  }

  // Gestion de la pagination
  setPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  prevPage(): void {
    this.setPage(this.currentPage - 1);
  }

  nextPage(): void {
    this.setPage(this.currentPage + 1);
  }

  onItemsPerPageChange(): void {
    this.currentPage = 1;
    this.generatePageNumbers();
  }



  loadPartners(): void {
    console.log('Chargement des partenaires...');
    this.partnerService.getPartners().subscribe({
      next: (partners) => {
        console.log('Partenaires reçus:', partners); // Debug
        this.partners = partners;
      },
      error: (err) => {
        console.error('Error loading partners', err);
      }
    });
  }

  loadPartnerCount(): void {
    this.partnerService.getPartnerCount().subscribe({
      next: (count) => this.partnerCount = count,
      error: (err) => console.error('Error loading partner count', err)
    });
  }


  deletePartner(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      this.partnerService.deletePartner(id).subscribe({
        next: () => {
          this.partners = this.partners.filter(p => p.id !== id);
          this.partnerCount--;
          this.generatePageNumbers();
          this.loadPartners();
        },
        error: err =>{
        console.error('Error deleting partner', err);
        alert('Une erreur est survenue lors de la suppression');
        if (err.status === 403) {
          this.toastr.error('You lack permissions to delete partners');
        }

      }
      });
    }
  }


  // deleteData(id:string){
  //   const data = this.lists.filter((x: { id: string }) => {
  //     return x.id != id;
  
  //   })
  //   this.lists = data;
  // }
  //  lists=[
  //   {
  //     id:"01",
  //     src:"./assets/images/users/10.jpg",
  //     name:"Faith Harris",
  //     mail:"faith@gmail.com",
  //     parid:"#2987",
  //     proj:"Designing Department",
  //     designation:"Web Designer",
  //     phno:"+9685321475",
  //     date:"05-05-2017",
  //     work:"3 yrs 1 mons 13 days"
  //   },
  //   {
  //     id:"02",
  //     src:"./assets/images/users/2.jpg",
  //     name:"Austin Bell",
  //     mail:"austin@gmail.com",
  //     parid:"#4987",
  //     proj:"Development Department",
  //     designation:"Angular Developer",
  //     phno:"+8653217950",
  //     date:"02-01-2018",
  //     work:"3 yrs 0 mons 25 days"
  //   },
  //   {
  //     id:"03",
  //     src:"./assets/images/users/4.jpg",
  //     name:"Maria Bower",
  //     mail:"maria@gmail.com",
  //     parid:"#6729",
  //     proj:"Marketing Department",
  //     designation:"Marketing analyst",
  //     phno:"+9563258417",
  //     date:"02-08-2019",
  //     work:"2 yrs 3 mons 23 days"
  //   },
  //   {
  //     id:"04",
  //     src:"./assets/images/users/5.jpg",
  //     name:"Peter Hill",
  //     mail:"mpeter@gmail.com",
  //     parid:"#2098",
  //     proj:"IT Department",
  //     designation:"Testor",
  //     phno:"+8563249751",
  //     date:"01-01-2020",
  //     work:"1 yrs 0 mons 25 days"
  //   },
  //   {
  //     id:"05",
  //     src:"./assets/images/users/7.jpg",
  //     name:"Victoria Lyman",
  //     mail:"victoria@gmail.com",
  //     parid:"#1025",
  //     proj:"Managers Department",
  //     designation:"General Manager",
  //     phno:"+9635826432",
  //     date:"05-05-2021",
  //     work:"0 yrs 0 mons 20 days"
  //   },
  //   {
  //     id:"06",
  //     src:"./assets/images/users/9.jpg",
  //     name:"Adam Quinn",
  //     mail:"adam@gmail.com",
  //     parid:"#3262",
  //     proj:"Accounts Department",
  //     designation:"Accountant",
  //     phno:"+9685231572",
  //     date:"05-05-2020",
  //     work:"0 yrs 8 mons 20 days"
  //   },
  //   {
  //     id:"07",
  //     src:"./assets/images/users/13.jpg",
  //     name:"Melanie Coleman",
  //     mail:"melanie@gmail.com",
  //     parid:"#3489",
  //     proj:"Application Department",
  //     designation:"App Designer",
  //     phno:"+8635291470",
  //     date:"15-02-2019",
  //     work:"1 yrs 11 mons 10 days"
  //   },
  //   {
  //     id:"08",
  //     src:"./assets/images/users/10.jpg",
  //     name:"Max Wilson",
  //     mail:"max@gmail.com",
  //     parid:"#3698",
  //     proj:"Development Department",
  //     designation:"PHP Developer",
  //     phno:"+9986357240",
  //     date:"05-05-2020",
  //     work:"0 yrs 9 mons 20 days"
  //   },
  //   {
  //     id:"09",
  //     src:"./assets/images/users/11.jpg",
  //     name:"Amelia Russell",
  //     mail:"amelia@gmail.com",
  //     parid:"#5612",
  //     proj:"Designing Department",
  //     designation:"UX Designer",
  //     phno:"+9356982472",
  //     date:"01-05-2018",
  //     work:"2 yrs 9 mons 25 days"
  //   },
  //   {
  //     id:"10",
  //     src:"./assets/images/users/12.jpg",
  //     name:"Justin Metcalfe",
  //     mail:"justin@gmail.com",
  //     parid:"#0245",
  //     proj:"Designing Department",
  //     designation:"web Designer",
  //     phno:"+9685321475",
  //     date:"05-05-2017",
  //     work:"3 yrs 1 mons 13 days"
  //   },
  //  ]
}
