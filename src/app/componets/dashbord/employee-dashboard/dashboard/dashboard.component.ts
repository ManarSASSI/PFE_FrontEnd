import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarModule, CalendarView } from 'angular-calendar';
import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
// import { DlDateTimePickerChange } from 'angular-bootstrap-datetimepicker';
import * as data from './employeeDashboardChartData'
import { SharedModule } from '../../../../shared/common/sharedmodule';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { subDays, startOfDay, addDays, endOfMonth, addHours, isSameMonth, isSameDay, endOfDay } from 'date-fns';
import { Subject } from 'rxjs';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import moment from 'moment';
import flatpickr from 'flatpickr';
import { FlatpickrDefaults, FlatpickrModule } from 'angularx-flatpickr';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Contrat } from '../../../../shared/models/contrat.model';
import { ContratService } from '../../../../shared/services/contrat/contrat.service';
import { PartnerService } from '../../../../shared/services/partner/partner.service';
import { CommonModule } from '@angular/common';
const colors = {
  red: {
    primary: '#705ec8',
    secondary: '#6958be',
  },
  blue: {
    primary: '#fb1c52',
    secondary: '#f83e6b',
  },
  yellow: {
    primary: '#ffab00',
    secondary: '#f3a403',
  },
};
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,SharedModule,NgApexchartsModule,NgbModule,CalendarModule,FullCalendarModule,RouterModule,FlatpickrModule,NgSelectModule],
  providers:[FlatpickrDefaults],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    totalPartners: number = 0;
    totalProjects: number = 0;
    recentContrats: Contrat[] = [];
    contratStats: any = {};
    recentActivities: any[] = [];
    contrats: Contrat[] = [];
  
    monthlyPartners: number[] = [];
    monthlyProjects: number[] = [];
  
    chartOptions: any;
    chartOptions1: any;
    chartOptions2: any;
  
    constructor(private modalService:NgbModal,private contratService: ContratService,
      private partnerService: PartnerService, private route: Router ){
      // this.futureDate.setDate(this.futureDate.getDate() + 2);
    }
  
    ngOnInit() : void{
      this.initializeCharts();
      const partner = JSON.parse(localStorage.getItem('currentUser')!);
      if (partner.role === 'PARTNER') {
        this.loadPartnerData(partner.id);  
      } 
    }

    loadPartnerData(partnerId: number): void {
    // Chargement des contrats du partenaire
    this.contratService.getContratsByPartner(partnerId).subscribe({
    next: (contrats) => {
      this.contrats = contrats;
      this.totalProjects = contrats.length;
      this.recentContrats = contrats.slice(0, 5);
      this.calculateContratStats(contrats);
      this.prepareRecentActivities(contrats);
    }
    });

    // Statistiques mensuelles
    this.contratService.getMonthlyContratsForPartner(partnerId).subscribe({
    next: counts => {
      this.monthlyProjects = this.normalizeMonthlyData(counts);
      console.log('Monthly Projects Data:', this.monthlyProjects); // Debug
      // Initialisez le graphique APRÈS avoir les données
      this.initializeCharts();

      this.updateChartData();
    },

     error: err => {
          console.error('Error loading monthly contracts:', err);
          // Initialisez quand même avec des données par défaut
          this.monthlyProjects = new Array(12).fill(0);
          this.initializeCharts();
        }
    });
    }
  
    getCountByType(type: string): number {
    if (!this.contrats || this.contrats.length === 0) return 0;
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
  
    // this.chartOptions = {
    //   series: [{
    //     name: "Mes contrats", 
    //     data: this.monthlyProjects,
    //   }],
    //   chart: {
    //     height: 325,
    //     type: 'line',
    //     zoom: { enabled: false },
    //     toolbar: { show: false },
    //     dropShadow: {
    //       enabled: true,
    //       top: 5,
    //       left: 0,
    //       blur: 3,
    //       color: '#000',
    //       opacity: 0.1
    //     }
    //   },
    //   dataLabels: { enabled: false },
    //   legend: { show: false },
    //   stroke: {
    //     curve: 'smooth',
    //     width: 3,
    //     dashArray: [0, 5]
    //   },
    //   grid: {
    //     borderColor: '#f2f6f7'
    //   },
    //   colors: ["var(--primary-color)", "rgba(var(--primary-rgb), 0.2)"],
    //   xaxis: {
    //     categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    //     axisBorder: {
    //       show: false,
    //       color: 'rgba(119, 119, 142, 0.05)'
    //     },
    //     axisTicks: {
    //       show: true,
    //       color: 'rgba(119, 119, 142, 0.05)',
    //       width: 6
    //     },
    //     labels: {
    //       rotate: -90
    //     }
    //   },
    //   yaxis: {
    //     title: {
    //       text: '',
    //       style: {
    //         color: '#adb5be',
    //         fontSize: '14px',
    //         fontFamily: 'poppins, sans-serif'
    //       }
    //     }
    //   }
    // };

      this.chartOptions = {
    series: [{
        name: "Contrats",
        data: this.monthlyProjects || [] // Utilisation des données existantes
    }],
    chart: {
        height: 300,
        type: 'area',
        zoom: { enabled: false },
        toolbar: { show: false },
        sparkline: { enabled: false }
    },
    colors: ["#4361ee"],
    dataLabels: { enabled: false },
    stroke: {
        curve: 'smooth',
        width: 3
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100]
        }
    },
    grid: {
        borderColor: '#f1f1f1',
        row: {
            colors: ['transparent', 'transparent'],
            opacity: 0.5
        }
    },
    markers: {
        size: 5,
        colors: ["#4361ee"],
        strokeWidth: 0,
        hover: {
            size: 7
        }
    },
    xaxis: {
        categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
        axisBorder: { show: false },
        axisTicks: { show: false },
        labels: { style: { colors: '#718096' } }
    },
    yaxis: {
        min: 0,
        tickAmount: 5,
        labels: {
            style: { colors: '#718096' },
            formatter: function(val: number) { // Type ajouté
                return Math.floor(val).toString();
            }
        }
    },
    legend: { show: false },
    tooltip: {
        theme: 'light',
        y: {
            formatter: function(val: number) { // Type ajouté
                return val + " contrats";
            }
        }
    }
};
  }
  
  
  //   updateChartData(): void {
  //   if (this.monthlyPartners.length === 0 || this.monthlyProjects.length === 0) return;
  
  //   this.chartOptions = {
  //     ...this.chartOptions,
  //     series: [{
  //       name: "Total Partners",
  //       data: this.monthlyPartners
  //     }, {
  //       name: "Total Projects", 
  //       data: this.monthlyProjects
  //     }],
  //     xaxis: {
  //       ...this.chartOptions.xaxis,
  //       categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  //     }
  //   };
  // }
  
  
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

      // Créez le graphique seulement quand vous avez les données
      this.chartOptions = {
        series: [{
          name: "Contrats",
          data: this.monthlyProjects
        }],
        chart: {
          height: 300,
          type: 'area',
          zoom: { enabled: false },
          toolbar: { show: false },
          sparkline: { enabled: false }
        },
        colors: ["#4361ee"],
        dataLabels: { enabled: false },
        stroke: {
          curve: 'smooth',
          width: 3
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 90, 100]
          }
        },
        grid: {
          borderColor: '#f1f1f1',
          row: {
            colors: ['transparent', 'transparent'],
            opacity: 0.5
          }
        },
        markers: {
          size: 5,
          colors: ["#4361ee"],
          strokeWidth: 0,
          hover: {
            size: 7
          }
        },
        xaxis: {
          categories: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: { style: { colors: '#718096' } }
        },
        yaxis: {
          min: 0,
          tickAmount: 5,
          labels: {
            style: { colors: '#718096' },
            formatter: function(val: number) {
              return Math.floor(val).toString();
            }
          }
        },
        legend: { show: false },
        tooltip: {
          theme: 'light',
          y: {
            formatter: function(val: number) {
              return val + " contrats";
            }
          }
        }
      };
      
    //   this.chartOptions = {
    //   series: [{ data: [] }],
    //   chart: { type: 'line', height: 350 }
    // };
    
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

