import { Component } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { Router, RouterModule } from '@angular/router';
import { UsersService } from './users.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderService } from '../../../core/services/header.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule,RouterModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent {
  templates!: any[];
  sortOptions: string[] = ['All', 'Ascending', 'Descending'];
  selectedSortOption: string = 'All';
  messages: any;
  searchText: any = '';
  perPage: number = 100;
  itemsPerPage: any = 10;
  currentPage: number = 1;
  totalCount: any;
  totalPages: any = 0;
  startPoint: any;
  endPoint: any;
  totalPage: any;
  paginatedMessages: any;

  constructor(private headerService: HeaderService, private userService: UsersService, private router: Router,
    private spinnerServerice: NgxSpinnerService) {
    headerService.updateHeaderData({
      title: 'Users',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fal fa-users"
    })
  }

  ngOnInit(): void {
    this.refreshMessages()
  }

  applySearchFilter() {
    if (this.searchText.length > 2) {
      this.refreshMessages();
    }
    if (this.searchText.length == 0) {
      this.refreshMessages();
    }
  }
  resetfilters() {
    this.searchText = '';
    this.refreshMessages();
  }
  refreshMessages() {
    const formData = {
      search: this.searchText,
      pageNumber: this.currentPage,
      pageSize: this.perPage,
    }
    this.spinnerServerice.show();
    this.userService.GetUsers(formData).subscribe(
      (response: any) => {
        this.spinnerServerice.hide()
        this.messages = response;
        this.totalCount = response.length;
        this.totalPages = Math.ceil(this.totalCount / this.itemsPerPage);

        if (this.messages.length == 0 || this.messages == null) {

          this.endPoint = 0
          this.totalCount = 0
        }

        if (this.currentPage == 1) {
          this.startPoint = this.currentPage
        }
        else {
          this.startPoint = (this.currentPage - 1) * this.itemsPerPage + 1
        }
        this.totalPage = Math.ceil(this.totalCount / this.itemsPerPage)
        if (this.totalCount <= this.startPoint + this.itemsPerPage - 1) {
          this.endPoint = this.totalCount
        }
        else {
          this.endPoint = this.startPoint + this.itemsPerPage - 1
        }
        this.updatePaginatedMessages();
      },
      (error: any) => {
        this.spinnerServerice.hide()
        console.error(error);
      }
    );
  }
  // setSortOption(option: string) {
  //   this.selectedSortOption = option;
  //   this.refreshMessages();
  // }

  editTemplate(template: any) {
    this.router.navigateByUrl(`bot/console/users/create/${template.id}`);
  }

  deleteTemplate(template: any) {
    const confirmation = confirm('Are you sure you want to delete this user?');
    if (confirmation) {
      this.userService.DeleteUser(template.id).subscribe(
        () => {
          this.refreshMessages();
        },
        (error: any) => {
          console.error('Error deleting template:', error);
        }
      );
    }
  }
  updatePaginatedMessages() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;

    this.paginatedMessages = this.messages.slice(start, end);
  }

  changePage(page: number) {
    this.currentPage = page;

    this.updatePaginatedMessages();
  }
  setPerPage(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.refreshMessages()
  }
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage;
    }
    this.refreshMessages()
  }
  nextPage(): void {
    const maxPages = Math.ceil(this.totalCount / this.itemsPerPage);
    if (this.currentPage < maxPages) {
      this.currentPage++;
    }
    this.refreshMessages()
  }
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(this.totalCount / this.itemsPerPage)) {
      this.currentPage = pageNumber;
    }
    this.refreshMessages()
  }

  getVisiblePageNumbers(): number[] {
    const maxPages = Math.ceil(this.totalCount / this.itemsPerPage);
    const visiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(startPage + visiblePages - 1, maxPages);
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
}
