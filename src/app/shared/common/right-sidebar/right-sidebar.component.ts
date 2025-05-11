import { Component, inject, Input } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services/alert/alert.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss'
})
export class RightSidebarComponent {
  @Input() alerts: any[] = [];
  notificationCount = 0;

  activeOffcanvas = inject(NgbActiveOffcanvas);
  isNotifyEmpty: boolean = false;
  
  ngOnInit() {
  this.notificationCount = this.alerts.filter(alert => !alert.read).length;
}

  handleCardClick(event: MouseEvent) {
    // Prevent the click event from propagating to the container
    event.stopPropagation();
  }

  constructor(private alertService: AlertService) {}

  markAsRead(alertId: number) {
    this.alertService.markAsRead(alertId).subscribe({
      next: () => {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
        alert.read = true;
        this.notificationCount = this.alerts.filter(a => !a.read).length; // Ajouter cette ligne
      }
      }
    });
  }

  deleteAlert(alertId: number) {
    this.alertService.deleteAlert(alertId).subscribe({
      next: () => {
        this.alerts = this.alerts.filter(alert => alert.id !== alertId);
        this.notificationCount = this.alerts.filter(a => !a.read).length;
      },
      error: (err) => console.error('Error deleting alert', err)
    });
  }
 
}
