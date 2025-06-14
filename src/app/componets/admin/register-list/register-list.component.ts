import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { UserService } from '../../../shared/services/user/user.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-register-list',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    NgSelectModule,
    SharedModule],
  templateUrl: './register-list.component.html',
  styleUrl: './register-list.component.scss'
})
export class RegisterListComponent {

  pendingUsers: User[] = [];
  pendingCount = 0;

  // partners: User[] = [];
  //   partnerCount = 0;
    // @ViewChildren(SortableHeader) headers!: QueryList<SortableHeader>;
  
  // Nouveaux états pour pagination et recherche
    currentPage = 1;
    itemsPerPage = 10;
    searchQuery = '';
    totalPages = 1;
    pageNumbers: number[] = [];
  
    total$!: Observable<number>;
    
    constructor(private userService: UserService,private toastr: ToastrService) {}
  
    ngOnInit(): void {
      this.loadPendingUsers();
      this.loadPendingCount();
      // this.loadPartners();
      // this.loadPartnerCount();
    }
  
    // Méthode pour filtrer et paginer les données
    get filteredUsers(): User[] {
      if (!this.searchQuery) return this.pendingUsers;
    
    return this.pendingUsers.filter(pendingUsers => 
      pendingUsers.username.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    }


    loadPendingUsers(): void {
    this.userService.getPendingUsers().subscribe({
      next: (users) => {
        this.pendingUsers = users;
        this.totalPages = Math.ceil(users.length / this.itemsPerPage);
        this.generatePageNumbers();
      },
      error: (err) => {
        console.error('Error loading pending users', err);
        this.toastr.error('Error loading pending users');
      }
    });
  }

  loadPendingCount(): void {
    this.userService.getPendingCount().subscribe({
      next: (count) => this.pendingCount = count,
      error: (err) => console.error('Error loading pending count', err)
    });
  }

  approveUser(userId: number): void {
    if (confirm('Are you sure to accept this user?')) {
    this.userService.approveUser(userId).subscribe({
      next: () => {
        this.pendingUsers = this.pendingUsers.filter(u => u.id !== userId);
        this.pendingCount--;
        this.toastr.success('User approved successfully');
      },
      error: (err) => {
        console.error('Approval error', err);
        this.toastr.error('Error approving user');
      }
    });
  }
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure to reject this user?')) {
      this.userService.deleteUser(userId).subscribe({
        next: () => {
          this.pendingUsers = this.pendingUsers.filter(u => u.id !== userId);
          this.pendingCount--;
          this.toastr.success('User rejected successfully');
        },
        error: (err) => {
          console.error('Deletion error', err);
          this.toastr.error('Error rejecting user');
        }
      });
    }
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
  

}
