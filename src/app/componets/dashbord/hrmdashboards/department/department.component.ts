import { NgSelectModule } from '@ng-select/ng-select';
import { Component } from '@angular/core';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ContratService } from '../../../../shared/services/contrat/contrat.service';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, Observable } from 'rxjs';
import { Contrat } from '../../../../shared/models/contrat.model';
import { saveAs } from 'file-saver';
import { FormsModule } from '@angular/forms';
import { SuiviContrat } from '../../../../shared/models/suivi-contrat.model';
import { SuiviContratService } from '../../../../shared/services/suiviContrat/suivi-contrat.service';
import { EtatExecution } from '../../../../shared/models/contrat.model';

interface departmentList {
  id: string;
  name: string;
}

@Component({
  selector: 'app-department',
  standalone: true,
  imports: [FormsModule,NgbModule,NgSelectModule,SharedModule,RouterModule,CommonModule],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss'
})
export class DepartmentComponent {


    EtatExecution = EtatExecution;
     contrats: any[] = [];
     ContratCount = 0;
     selectedType: Contrat['typeContrat'] | '' = '';

   
     currentPage = 1;
     itemsPerPage = 10;
     searchQuery = '';
     totalPages = 1;
     pageNumbers: number[] = [];
   
     total$!: Observable<number>;

    selectedContrat: Contrat | null = null;
    historiqueSuivi: SuiviContrat[] = [];
    newSuivi: Partial<SuiviContrat> = {
      etatExecution: EtatExecution.EN_COURS,
      commentaire: '',
      action:'',
    };
  
  constructor(private modalService: NgbModal,private contratService: ContratService,private toastr: ToastrService, private suiviService: SuiviContratService) { 
  }

  ngOnInit(): void {
    this.loadContrats();
    this.loadContratCount();
  }

  onTypeChange(): void {
    this.currentPage = 1;
    this.generatePageNumbers();
  }


  onSearchChange(): void {
    this.currentPage = 1;
    this.generatePageNumbers();
  }

  

  // Méthode pour filtrer et paginer les données
    get filteredContrats(): Contrat[] {
      let filtered = this.contrats;

      // Filtrage par type
      if (this.selectedType) {
        filtered = filtered.filter(c => c.typeContrat === this.selectedType);
      }

      // Filtrage par recherche
      filtered = filtered.filter(c =>
        Object.values(c).some(value =>
          value?.toString().toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      );

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


  async open(content: any, contrat: Contrat) {
      try {
    this.selectedContrat = contrat;
    this.historiqueSuivi = []; // Réinitialiser l'historique avant chargement
    
    const modalRef = this.modalService.open(content, { 
      size: 'lg',
      backdrop: 'static'
    });

    const response = await this.suiviService.getHistorique(contrat.id).toPromise();
    
    // Filtrer les entrées nulles et trier par date
    this.historiqueSuivi = (response || [])
      .filter(s => s !== null && s.dateSuivi !== null)
      .sort((a, b) => new Date(b.dateSuivi).getTime() - new Date(a.dateSuivi).getTime());
    } catch (error) {
      console.error('Erreur chargement historique', error);
      this.toastr.error('Erreur de chargement de l\'historique');
      this.modalService.dismissAll(); // Assurer la fermeture en cas d'erreur
  }

  //   try {
  //         this.selectedContrat = contrat;
  //         this.modalService.open(content, { size: 'lg' });
  //         const response = await this.suiviService.getHistorique(contrat.id).toPromise();
  //         this.historiqueSuivi = response || []; // Gestion du undefined
  //        } catch (error) {
  //         console.error('Erreur chargement historique', error);
  //         this.toastr.error('Erreur de chargement de l\'historique');
  // } 
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


addSuivi() {
  if (this.selectedContrat && this.newSuivi.etatExecution) {
    this.suiviService.ajouterSuivi(this.selectedContrat.id, this.newSuivi as SuiviContrat).subscribe({
      next: (suiviResult) => {
        // Mise à jour de l'historique
        this.historiqueSuivi = [suiviResult, ...this.historiqueSuivi];
        this.historiqueSuivi = [...this.historiqueSuivi];
        this.resetSuivi();
        // Mise à jour de l'état dans la liste des contrats
        const index = this.contrats.findIndex(c => c.id === this.selectedContrat!.id);
        if (index > -1) {
          this.contrats[index].etatExecution = suiviResult.etatExecution;
        }        
        this.resetSuivi();
        this.toastr.success('Suivi ajouté avec succès');
      },
      error: (err) => this.toastr.error('Erreur lors de l\'ajout du suivi')
    });
  }
} 

resetSuivi() {
  this.newSuivi = { 
    etatExecution: EtatExecution.EN_COURS,
    commentaire: '' 
  };
}

}
