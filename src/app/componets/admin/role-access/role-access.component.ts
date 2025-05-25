import { Component, OnInit } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '../../../shared/common/sharedmodule';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { User } from '../../../shared/models/user.model';
import { UserService } from '../../../shared/services/user/user.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
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
        next: () => this.loadUsers(),
        error: (err) => console.error('Error deleting user:', err)
      });
    }
  }

}
