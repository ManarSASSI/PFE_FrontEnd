import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SwiperModule, } from 'swiper/angular';
import flatpickr from 'flatpickr';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import SwiperCore, {

  Scrollbar,
  A11y,
  Virtual,
  Zoom,
  Autoplay,
  Thumbs,
  Mousewheel,
  
 
} from 'swiper';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Router, RouterModule } from '@angular/router';
import { ContratService } from '../../../../shared/services/contrat/contrat.service';
import { PartnerService } from '../../../../shared/services/partner/partner.service';
import { Contrat } from '../../../../shared/models/contrat.model';
import { User } from '../../../../shared/models/user.model';

SwiperCore.use([

  Scrollbar,
  A11y,
  Virtual,
  Mousewheel,
  Zoom,
  Autoplay,
  Thumbs,

]);
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,SharedModule,NgApexchartsModule,SwiperModule,NgbModule,RouterModule,FlatpickrModule,NgApexchartsModule],
  providers:[FlatpickrDefaults],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  totalPartners: number = 0;
  totalProjects: number = 0;
  recentContrats: Contrat[] = [];
  contratStats: any = {};
  recentActivities: any[] = [];

  monthlyPartners: number[] = [];
  monthlyProjects: number[] = [];

  chartOptions: any;
  chartOptions1: any;
  chartOptions2: any;
  chartOptions3: any;

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

    this.partnerService.getMonthlyPartnersCount(manager.id).subscribe({
    next: counts => {
      console.log('Monthly Partners Data:', counts); 
      this.monthlyPartners = this.normalizeMonthlyData(counts);
      this.updateChartData();
    },
    error: err => console.error('Error loading partners monthly:', err)
  });

  this.contratService.getMonthlyContratsCount(manager.id).subscribe({
    next: counts => {
      console.log('Monthly Projects Data:', counts); 
      this.monthlyProjects = this.normalizeMonthlyData(counts);
      this.updateChartData();
    },
    error: err => console.error('Error loading contracts monthly:', err)
  });
  }

  private normalizeMonthlyData(data: number[]): number[] {
  const normalized = new Array(12).fill(0);
  if (data && data.length === 12) {
    return [...data];
  }
  // Si les données sont partielles, les répartir correctement
  data?.forEach((val, index) => {
    if (index < 12) normalized[index] = val;
  });
  return normalized;
 }

  updateChartData(): void {
  if (this.monthlyPartners.length === 0 || this.monthlyProjects.length === 0) return;

  this.chartOptions = {
    series: [{
      name: "Total Projects", 
      data: this.monthlyProjects,
      dashArray: [5, 5]
    }],
    chart: {
      height: 325,
      type: 'line',
      zoom: { enabled: false },
      toolbar: { show: false },
      dropShadow: {
        enabled: true,
        top: 5,
        left: 0,
        blur: 3,
        color: '#000',
        opacity: 0.1
      }
    },
    dataLabels: { enabled: false },
    legend: { show: false },
    stroke: {
      curve: 'smooth',
      width: 3,
      dashArray: [0, 5]
    },
    grid: {
      borderColor: '#f2f6f7'
    },
    colors: ["var(--primary-color)", "rgba(var(--primary-rgb), 0.2)"],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      axisBorder: {
        show: false,
        color: 'rgba(119, 119, 142, 0.05)'
      },
      axisTicks: {
        show: true,
        color: 'rgba(119, 119, 142, 0.05)',
        width: 6
      },
      labels: {
        rotate: -90
      }
    },
    yaxis: {
      title: {
        text: '',
        style: {
          color: '#adb5be',
          fontSize: '14px',
          fontFamily: 'poppins, sans-serif'
        }
      }
    }
  };
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
  let active = 0;
  let expired = 0;
  let warning = 0;

  contrats.forEach(c => {
    const endDate = new Date(c.dateFin);
    
    if (endDate <= now) {
      expired++;
    } else {
      const diffTime = endDate.getTime() - now.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);
      
      if (diffDays <= 30) {
        warning++;
      } else {
        active++;
      }
    }
  });

  this.contratStats = {
    active,
    expired,
    warning,
    total: contrats.length
  };

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

  this.chartOptions3 = {
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

    // Graphique circulaire pour les types de contrat
        this.chartOptions3 = {
            series: [
                this.getCountByType('SERVICE'),
                this.getCountByType('TRAVAUX'),
                this.getCountByType('CONTINU')
            ],
            labels: ["Service", "Travaux", "Continu"],
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
                            total: { 
                                show: true, 
                                showAlways: true, 
                                label: 'Total', 
                                fontSize: '18px', 
                                fontWeight: 400,
                                formatter: function (w: any) {
                                    return w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0).toString();
                                }
                            }
                        }
                    }
                }
            },
            colors: ["#4361ee", "#ffab00", "#38cb89"] // Couleurs pour chaque type
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

}
