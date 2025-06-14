import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user/user.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MessageService } from '../../../shared/services/message/message.service';



@Component({
  selector: 'app-role-access',
  standalone: true,
  imports: [ CommonModule,FormsModule,NgbModule,SharedModule,NgSelectModule,RouterModule],
  templateUrl: './role-access.component.html',
  styleUrls: ['./role-access.component.scss']
})
export class RoleAccessComponent implements OnInit {

  users: User[] = [];
  filteredUsers: User[] = [];
  paginatedUsers: User[] = [];
  
  // Pagination
  currentPage = 1;
  pageSize = 10;
  pageSizes = [5, 10, 15, 20];
  totalPages = 1;
  pages: number[] = [];
  
  // Filters
  searchQuery = '';
  selectedRole = '';
  roles = ['ADMIN', 'MANAGER', 'PARTNER'];

  constructor(private userService: UserService,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadUsers();

    const userJson = localStorage.getItem('currentUser');
    this.currentUser = userJson ? JSON.parse(userJson) : null;;
  }

   @ViewChild('messageModal') messageModal!: TemplateRef<any>;
    selectedUser: User | null = null;
    messageContent: string = '';
    messageError: string = '';
    sendingMessage: boolean = false;
    currentUser: any; // Utilisateur actuellement connecté


    openMessageModal(user: User, modalTemplate: TemplateRef<any>) {
    this.selectedUser = user;
    this.messageContent = '';
    this.messageError = '';
    this.modalService.open(modalTemplate, { ariaLabelledBy: 'modal-basic-title' });
  }

    // Envoyer le message
    sendMessage(modal: any) {
        if (!this.selectedUser || !this.currentUser || !this.messageContent.trim()) {
            this.messageError = 'Invalid message data';
            return;
        }

        this.sendingMessage = true;
        
        this.messageService.sendMessage(
            this.currentUser.id, // ID expéditeur
            this.selectedUser.id, // ID destinataire
            this.messageContent
        ).subscribe({
            next: () => {
                this.sendingMessage = false;
                modal.close();
                this.toastr.success('Message sent successfully!');
            },
            error: (err) => {
                this.sendingMessage = false;
                this.messageError = err.error?.message || 'Failed to send message';
            }
        });
    }

    // Ajoutez ces nouvelles propriétés
    @ViewChild('addUserModal') addUserModal: any;
    newUser: any = {};
    errorMessage: string = '';

// Méthode pour ouvrir le modal
openAddUserModal() {
    this.newUser = {};
    this.errorMessage = '';
    this.modalService.open(this.addUserModal, { ariaLabelledBy: 'modal-basic-title' });
}

// Méthode pour créer un nouvel utilisateur
createNewUser() {
    this.userService.createUser({
        username: this.newUser.username,
        email: this.newUser.email,
        role: this.newUser.role,
        password: this.newUser.password
    }).subscribe({
        next: () => {
            this.modalService.dismissAll();
            this.loadUsers();
            this.toastr.success('User created successfully! Credentials sent via email.');
        },
        error: (err) => {
            this.errorMessage = err.error || 'Error creating user';
        }
    });
}





  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (users: User[]) => {
        this.users = users;
        this.applyFilters();
      },
      error: (err) => console.error('Error loading users:', err)
    });
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      return matchesSearch && matchesRole;
    });
    
    this.totalPages = Math.ceil(this.filteredUsers.length / this.pageSize);
    this.pages = Array.from({length: this.totalPages}, (_, i) => i + 1);
    this.updatePagination();
  }

  updatePagination() {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedUsers = this.filteredUsers.slice(start, end);
  }

  onPageSizeChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  resetFilters() {
    this.searchQuery = '';
    this.selectedRole = '';
    this.applyFilters();
  }

  editUser(user: User) {
    // Implement edit functionality
  }

  deleteUser(userId: number) {
  if (confirm('Are you sure you want to delete this user?')) {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.toastr.success('User deleted successfully');
        this.loadUsers();
      },
      error: (err) => {
        console.error('Error deleting user:', err);
        this.toastr.error('Failed to delete user');
      }
    });
  }
}

  // deleteUser(userId: number) {
  //   if (confirm('Are you sure you want to delete this user?')) {
  //     this.userService.deleteUser(userId).subscribe({
  //       next: () => this.loadUsers(),
  //       error: (err) => console.error('Error deleting user:', err)
  //     });
  //   }
  // }

}
