import { Component } from '@angular/core';
import { Contrat, EtatExecution } from '../../../shared/models/contrat.model';
import { Observable } from 'rxjs';
import { SuiviContrat } from '../../../shared/models/suivi-contrat.model';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ContratService } from '../../../shared/services/contrat/contrat.service';
import { ToastrService } from 'ngx-toastr';
import { SuiviContratService } from '../../../shared/services/suiviContrat/suivi-contrat.service';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [FormsModule,NgbModule,NgSelectModule,SharedModule,RouterModule,CommonModule],
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.scss'
})
export class ContractListComponent {

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
        // this.chargerDetailsPartenaires();
      },
      (error) => {
        console.error('Error loading contracts:', error);
      }
    );
    }
  
    loadContratCount(): void {
      this.contratService.getContratCount().subscribe({
        next: (count) => this.ContratCount = count,
        error: (err) => console.error('Error loading Contract count', err)
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
        console.error('Error loading history', error);
        this.toastr.error('Error loading history');
        this.modalService.dismissAll(); // Assurer la fermeture en cas d'erreur
    }
  }
  
    click(id:string){
      const data = this.contrats.filter((x: { id: string }) => {
        return x.id != id;
    
      })
      this.contrats = data;
  
  }
  
    deleteContrat(id: number): void {
      if (confirm('Are you sure you want to delete this contract?')) {
        this.contratService.deleteContrat(id).subscribe({
          next: () => {
            this.contrats = this.contrats.filter(p => p.id !== id);
            this.ContratCount--;
            this.generatePageNumbers();
            this.loadContrats();
          },
          error: err =>{
          console.error('Error deleting contrat', err);
          alert('An error occurred while deleting');
          if (err.status === 403) {
            this.toastr.error('You lack permissions to delete contrats');
          }
  
        }
        });
      }
    }

    generatePdf(contratId: number): void {
    this.contratService.generatePdfReport(contratId).subscribe({
        next: (pdfBlob: Blob) => {
            const blobUrl = URL.createObjectURL(pdfBlob);
            
            // Solution compatible avec tous les navigateurs
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `contrat_${contratId}.pdf`;
            
            // Déclenchement du téléchargement
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            
            // Nettoyage
            setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl);
            }, 100);
        },
        error: (err) => {
            this.toastr.error(`Erreur génération PDF: ${err.message}`);
        }
    });
}
  
  //   generatePdf(contratId: number): void {
  //   this.contratService.generatePdfReport(contratId).subscribe({
  //     next: (data: Blob) => {
  //       // Vérification approfondie du blob
  //       if (!(data instanceof Blob)) {
  //         this.toastr.error('Unexpected response format');
  //         return;
  //       }
        
  //       // Création d'un URL object sécurisé
  //       const blobUrl = URL.createObjectURL(data);
        
  //       // Méthode compatible avec tous les navigateurs
  //       const downloadLink = document.createElement('a');
  //       downloadLink.href = blobUrl;
  //       downloadLink.download = `contrat_${contratId}.pdf`;
        
  //       // Déclenchement du téléchargement
  //       document.body.appendChild(downloadLink);
  //       downloadLink.click();
        
  //       // Nettoyage asynchrone
  //       setTimeout(() => {
  //         document.body.removeChild(downloadLink);
  //         URL.revokeObjectURL(blobUrl);
  //       }, 1000);
  //     },
  //     error: (err) => {
  //       // Gestion avancée des erreurs blob
  //       if (err.error instanceof Blob) {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //           const errorMessage = reader.result as string;
  //           this.toastr.error(`Server error: ${errorMessage}`);
  //         };
  //         reader.readAsText(err.error);
  //       } else {
  //         this.toastr.error('Unknown error while generating');
  //       }
  //     }
  //   });
  // }
  
  //   generatePdf(contratId: number): void {
  //   this.contratService.generatePdfReport(contratId).subscribe({
  //     next: (data: Blob) => {
  //       const blob = new Blob([data], { type: 'application/pdf' });
  //       const url = window.URL.createObjectURL(blob);
        
  //       // Solution cross-browser
  //       const a = document.createElement('a');
  //       a.style.display = 'none';
  //       a.href = url;
  //       a.download = `contrat_${contratId}.pdf`;
  //       document.body.appendChild(a);
  //       a.click();
        
  //       // Nettoyage
  //       window.URL.revokeObjectURL(url);
  //       document.body.removeChild(a);
  //     },
  //     error: (err) => {
  //       console.error('Erreur génération PDF', err);
  //       this.toastr.error('Échec génération rapport');
  //     }
  //   });
  // }
  
  
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
          this.toastr.success('Tracking added successfully');
        },
        error: (err) => this.toastr.error('Error adding tracking')
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
