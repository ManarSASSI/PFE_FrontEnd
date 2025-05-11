import { NgSelectModule } from '@ng-select/ng-select';
import { Component } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContratService } from '../../../../shared/services/contrat/contrat.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Contrat } from '../../../../shared/models/contrat.model';
import { saveAs } from 'file-saver';

interface departmentList {
  id: string;
  name: string;
}

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [NgbModule,NgSelectModule,SharedModule,RouterModule,CommonModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent {

   contrats: any[] = [];
   ContratCount = 0;


   
     currentPage = 1;
     itemsPerPage = 10;
     searchQuery = '';
     totalPages = 1;
     pageNumbers: number[] = [];
   
     total$!: Observable<number>;
  
  constructor(private modalService: NgbModal,private contratService: ContratService,private toastr: ToastrService) { 
  }

  ngOnInit(): void {
    this.loadContrats();
    this.loadContratCount();
  }

  

  // Méthode pour filtrer et paginer les données
    get filteredContrats(): Contrat[] {
      console.log('Filtering contrats:');
      const filtered = this.contrats.filter(contrat =>
        Object.values(contrat).some(value =>
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
  

  loadContrats() {
    this.contratService.getAllContrats().subscribe(
      (data: any[]) => {
        this.contrats = data;
      this.contrats.forEach(contrat => {
        if (contrat.partnerId) {
          this.contratService.getPartnerDetails(contrat.partnerId).subscribe({
            next: (partner) => {
              contrat.partner = partner; 
            },
            error: (err) => console.error('Error loading partner', err)
          });
        }
      });
      },
      (error) => {
        console.error('Erreur lors du chargement des contrats:', error);
      }
    );
  }

  loadContratCount(): void {
    this.contratService.getContratCount().subscribe({
      next: (count) => this.ContratCount = count,
      error: (err) => console.error('Error loading partner count', err)
    });
  }


  open(content1:any) {
    this.modalService.open(content1, { windowClass : 'modalCusSty' })
  }

  click(id:string){
    const data = this.contrats.filter((x: { id: string }) => {
      return x.id != id;
  
    })
    this.contrats = data;

}

  deleteContrat(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce contrat ?')) {
      this.contratService.deleteContrat(id).subscribe({
        next: () => {
          this.contrats = this.contrats.filter(p => p.id !== id);
          this.ContratCount--;
          this.generatePageNumbers();
          this.loadContrats();
        },
        error: err =>{
        console.error('Error deleting contrat', err);
        alert('Une erreur est survenue lors de la suppression');
        if (err.status === 403) {
          this.toastr.error('You lack permissions to delete contrats');
        }

      }
      });
    }
  }

  generatePdf(contratId: number): void {
  this.contratService.generatePdfReport(contratId).subscribe({
    next: (data: Blob) => {
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      // Solution cross-browser
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `contrat_${contratId}.pdf`;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyage
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    error: (err) => {
      console.error('Erreur génération PDF', err);
      this.toastr.error('Échec génération rapport');
    }
  });
}

}
