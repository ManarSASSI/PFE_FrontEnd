import { Component, inject, Input } from '@angular/core';
import { NgbActiveOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../services/alert/alert.service';
import { MessageService } from '../../services/message/message.service';


@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss'
})
export class RightSidebarComponent {
  @Input() alerts: any[] = [];
  notificationCount = 0;
  currentUserId!: number ;

  messages: any[] = [];
  MessagesCount = 0;

  selectedTab: 'notifications' | 'messages' = 'notifications';


  activeOffcanvas = inject(NgbActiveOffcanvas);
  isNotifyEmpty: boolean = false;


  ngOnInit() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const currentUser = JSON.parse(userData);
      this.currentUserId = currentUser.id;
      this.loadManagerAlerts();
      this.loadMessages();
    }
  }

  switchTab(tab: 'notifications' | 'messages') {
    this.selectedTab = tab;
    if (tab === 'messages') {
      this.loadMessages();
    }
  }



   private loadMessages(): void {
    if (!this.currentUserId) return;

    this.messageService.getUserMessages(this.currentUserId)
      .subscribe(messages => {
        this.messages = messages;
      });
  }

  private loadManagerAlerts() {
    if (this.currentUserId) {
      this.alertService.getAlertsForManager(this.currentUserId).subscribe({
        next: (alerts) => {
          this.alerts = alerts;
          this.notificationCount = this.alerts.filter(alert => !alert.read).length;
        },
        error: (err) => console.error('Error loading alerts', err)
      });
    }
  }

  sendMessage(receiverId: number, content: string): void {
    this.messageService.sendMessage(this.currentUserId, receiverId, content)
      .subscribe(() => {
        this.loadMessages();
      });
  }

  markMessageAsRead(messageId: number): void {
    this.messageService.markAsRead(messageId)
      .subscribe(() => {
        this.messages = this.messages.map(msg => 
          msg.id === messageId ? { ...msg, status: 'READ' } : msg
        );
      });
  }
  

  handleCardClick(event: MouseEvent) {
    // Prevent the click event from propagating to the container
    event.stopPropagation();
  }

  constructor(private alertService: AlertService, private messageService: MessageService) {}

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
