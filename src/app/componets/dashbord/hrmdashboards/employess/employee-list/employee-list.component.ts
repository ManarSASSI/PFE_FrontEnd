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
    if (!this.searchQuery) return this.partners;
  
  return this.partners.filter(partner => 
    partner.username.toLowerCase().includes(this.searchQuery.toLowerCase())
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
    const searchName = this.searchQuery.trim();
    console.log('Chargement des partenaires...');
    this.partnerService.getPartners(searchName).subscribe({
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

}
