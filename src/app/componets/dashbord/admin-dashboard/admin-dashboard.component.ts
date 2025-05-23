import { Component } from '@angular/core';
import { Contrat } from '../../../shared/models/contrat.model';
import { PartnerService } from '../../../shared/services/partner/partner.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContratService } from '../../../shared/services/contrat/contrat.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent {

  totalPartners: number = 0;
    totalProjects: number = 0;
    recentContrats: Contrat[] = [];
    contratStats: any = {};
    recentActivities: any[] = [];
  
    chartOptions: any;
    chartOptions1: any;
    chartOptions2: any;
  
    constructor(private modalService:NgbModal,private contratService: ContratService,
      private partnerService: PartnerService, private route: Router ){
      // this.futureDate.setDate(this.futureDate.getDate() + 2);
    }
  
    ngOnInit() : void{
      const manager = JSON.parse(localStorage.getItem('currentUser')!);
    if (!manager) {
      // Redirection vers la page de login si non authentifié
      this.route.navigate(['/auth/login']);
      return;
    }
      this.loadDashboardData();
      this.initializeCharts();
    }
  
    getCountByType(type: string): number {
    if (!this.recentContrats) return 0;
    return this.recentContrats.filter(c => c.typeContrat === type).length;
  }
  
    loadDashboardData(): void {
      const manager = JSON.parse(localStorage.getItem('currentUser')!);
   
      this.partnerService.getPartnerCountByManager(manager.id).subscribe({
      next: count => {
        this.totalPartners = count;
        console.log('Total partners loaded:', count);
      },
      error: err => console.error('Error loading partners count:', err)
      });
  
      this.contratService.getContratsByManager(manager.id).subscribe({
        next: (contrats) => {
        console.log('Contrats loaded:', contrats);
        this.totalProjects = contrats.length;
        this.recentContrats = contrats.slice(0, 5); 
        this.calculateContratStats(contrats);
        this.prepareRecentActivities(contrats);
  
        this.updateChartsWithRealData();
      },
        error: (err) => {
          console.error('Erreur chargement contrats:', err);
  
        }
      });
    }
  
  
    prepareRecentActivities(contrats: Contrat[]): void {
      this.recentActivities = contrats
        .sort((a, b) => new Date(b.dateDebut).getTime() - new Date(a.dateDebut).getTime())
        .slice(0, 4)
        .map(contrat => ({
          type: 'Contrat ' + contrat.typeContrat,
          date: contrat.dateDebut,
          details: `${contrat.objetContrat} - ${contrat.partner.username}`,
          status: contrat.etatExecution
        }));
    }
  
    calculateContratStats(contrats: Contrat[]): void {
      const now = new Date();
      const active = contrats.filter(c => new Date(c.dateFin) > now).length;
      const expired = contrats.filter(c => new Date(c.dateFin) <= now).length;
      const warning = contrats.filter(c => {
        const endDate = new Date(c.dateFin);
        const diffTime = endDate.getTime() - now.getTime();
        const diffDays = diffTime / (1000 * 3600 * 24);
        return diffDays > 0 && diffDays <= 30; // Moins de 30 jours restants
      }).length;
  
      this.contratStats = {
        active,
        expired,
        warning,
        total: contrats.length
      };
  
      this.updateChartsWithRealData();
    }
  
    initializeCharts(): void {
      
      this.chartOptions = {
      series: [{ data: [] }],
      chart: { type: 'line', height: 350 }
    };
    
    this.chartOptions1 = {
      series: [{ data: [] }],
      chart: { type: 'bar', height: 350 }
    };
    
    this.chartOptions2 = {
      series: [],
      chart: { type: 'donut', height: 350 }
    };
    }
  
  
    updateChartsWithRealData(): void {
      // Graphique à barres (statut des contrats)
      this.chartOptions1 = {
        series: [{
          name: 'Actifs',
          data: [this.contratStats.active]
        }, {
          name: 'Expirés',
          data: [this.contratStats.expired]
        }, {
          name: 'En alerte',
          data: [this.contratStats.warning]
        }],
        chart: {
          type: 'bar',
          height: 320,
          stacked: true,
          toolbar: { show: true },
          zoom: { enabled: true },
        },
        grid: { borderColor: '#f1f1f1', strokeDashArray: 3 },
        colors: ["var(--primary-color)", "rgb(254, 127, 0)", "rgba(var(--primary-rgb), 0.3)"],
        legend: { show: false },
        plotOptions: {
          bar: {
            columnWidth: "15%",
            borderRadius: 2,
          }
        },
        dataLabels: { enabled: false },
        xaxis: { categories: ['Statut'] },
        fill: { opacity: 1 }
      };
  
      // Graphique circulaire (répartition)
      this.chartOptions2 = {
        series: [this.contratStats.active, this.contratStats.expired, this.contratStats.warning],
        labels: ["Actifs", "Expirés", "En alerte"],
        chart: {
          height: 330,
          type: 'donut',
          toolbar: { show: false },
        },
        dataLabels: { enabled: false },
        legend: {
          show: true,
          position: "bottom",
          horizontalAlign: "center",
          offsetY: 8,
          markers: {
            width: 12,
            height: 12,
            strokeWidth: 0,
            strokeColor: '#fff',
            radius: 4,
          }
        },
        stroke: {
          show: true,
          curve: 'smooth',
          lineCap: 'round',
          colors: ["#fff"],
          width: 0,
          dashArray: 0,
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: '80%',
              background: 'transparent',
              labels: {
                show: true,
                name: { show: true, fontSize: '20px', color: '#495057', offsetY: -13 },
                value: { show: true, fontSize: '30px', fontWeight: 500, offsetY: 8 },
                total: { show: true, showAlways: true, label: 'Total', fontSize: '18px', fontWeight: 400 }
              }
            }
          }
        },
        colors: ["var(--primary-color)", "rgba(254, 127, 0, 1)", "#ffc107"]
      };
    }
  
  
    getActivityClass(activity: any): string {
      // Customize this based on your activity types
      switch(activity.type) {
        case 'Nouveau contrat ajouté':
          return 'primary';
        case 'Alerte d\'échéance':
          return 'success';
        case 'Modification de contrat':
          return 'pink';
        case 'Paiement reçu':
          return 'warning';
        default:
          return 'primary';
      }
    }
  
    formatDate(dateString: string): string {
      if (!dateString) return '';
      
      const date = new Date(dateString);
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  
  
    
    // futureDate = new Date();
  
  
  //   timerInterval:any;
  
  //   days!: number;
  //   hours!: number;
  //   mins!: number;
  //   secs!: number;
  
  
  //   updateTimer() {
  //     const currentDate = new Date();
  //     const timeDifference = this.futureDate.getTime() - currentDate.getTime();
      
  //     if (timeDifference > 0) {
  //       this.days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  //       this.hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  //       this.mins = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  //       this.secs = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
  //         this.futureDate.setSeconds(this.futureDate.getSeconds() - 1); // Decrease future date by one second
  //     } else {
  //         clearInterval(this.timerInterval);
  //     }
  // }

}
