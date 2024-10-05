import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { HeaderService } from '../../../core/services/header.service';
import { SidenavService } from '../../../core/services/sidenav.service';
import { TagsService } from '../../../core/services/tags.service';

@Component({
  selector: 'app-tags',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule],
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent {
  constructor(private _hS: HeaderService, private sidenavService: SidenavService, private headerService: HeaderService, private router: Router, private spinnerServerice: NgxSpinnerService, private tagsService: TagsService) {
    _hS.updateHeaderData({
      title: 'Tags',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class:"fal fa-tags pe-2"
    })
  }

  id:any=null;
  TagForm = new FormGroup({
    name:new FormControl('',[Validators.required]),
    id: new FormControl(0,[Validators.required]),
    });

  templates!: any[];
  sortOptions: string[] = ['All', 'Ascending', 'Descending'];
  selectedSortOption: string = 'All';
  messages: any;
  searchText: any = '';
  perPage: number = 15;
  currentPage: number = 1;
  totalCount: any;
  startPoint:any;
  endPoint:any;
  totalPage: any;

  ngOnInit(): void {
      this.refreshMessages()
  }
  get cF(){
    return this.TagForm.controls
  }
  applySearchFilter() {
    if(this.searchText.length> 2){
      this.refreshMessages();
    }
    if(this.searchText.length == 0){
      this.refreshMessages();
    }
  }
  resetForm(){
    this.TagForm.reset()
  }
  resetfilters() {
    this.searchText = '';
    this.refreshMessages();
  }
  setSortOption(option: string) {

    this.selectedSortOption = option;
    this.refreshMessages();
  }
  refreshMessages() {
    const formData = {
      search: this.searchText,
      pageNumber: this.currentPage,
      pageSize: this.perPage,
      sorting: this.selectedSortOption
    }
    this.spinnerServerice.show();
    this.tagsService.GetTags(formData).subscribe(
      (response: any) => {
        this.spinnerServerice.hide()
        this.messages = response.Tags;
        this.totalCount = response.TotalCount;
        if(this.messages.length==0 || this.messages==null){

          this.endPoint=0
          this.totalCount=0
        }

          if(this.currentPage==1){
           this.startPoint =this.currentPage
          }
          else{
            this.startPoint= (this.currentPage -1) * this.perPage+1
          }
          this.totalPage = Math.ceil(this.totalCount/ this.perPage)
          if(this.totalCount <=this.startPoint +this.perPage -1){
            this.endPoint=this.totalCount
          }
          else{
            this.endPoint= this.startPoint +  this.perPage -1
          }
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

  deleteTemplate(tag: any) {
    const confirmation = confirm('Are you sure you want to delete this tag?');
    if (confirmation) {
      this.tagsService.DeleteTags(tag.id).subscribe(
        () => {
         this.refreshMessages();
        },
        (error: any) => {
          console.error('Error deleting tag:', error);
        }
      );
    }
  }

  getTagById(id:any) {
    this.spinnerServerice.show();

    this.id = id;
    this.tagsService.GetTagsById(this.id).subscribe(
      (res: any) => {
        this.TagForm.get('name')?.setValue(res.name);
        this.TagForm.get('id')?.setValue(res.id);
        this.spinnerServerice.hide()
      },
      (error: any) => {
        this.spinnerServerice.hide()
        console.error(error);
      }
    );
  }
  setPerPage(perPage: number): void {
    this.perPage = perPage;
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
    const maxPages = Math.ceil(this.totalCount / this.perPage);
    if (this.currentPage < maxPages) {
      this.currentPage++;
    }
    this.refreshMessages()
  }
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(this.totalCount / this.perPage)) {
      this.currentPage = pageNumber;
    }
    this.refreshMessages()
  }

  getVisiblePageNumbers(): number[] {
    const maxPages = Math.ceil(this.totalCount / this.perPage);
    const visiblePages = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(startPage + visiblePages - 1, maxPages);
    if (endPage - startPage + 1 < visiblePages) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }
  submit(){
    if(this.TagForm.valid){
      if (this.id == null) {
        this.tagsService.Save(this.TagForm.value).subscribe(
          (res: any) => {
            // _self.onReset();
            this.refreshMessages();
            this.TagForm.reset();
          }), {
          error: (err: HttpErrorResponse) => {
            this.TagForm.reset();
          }
        }
      }
      else {
        this.tagsService.Update(this.TagForm.value).subscribe(
          (res: any) => {
            // _self.onReset();
            this.refreshMessages();
            this.TagForm.reset();
            this.id=null
          }), {
          error: (err: HttpErrorResponse) => {
            this.TagForm.reset();
            this.id=null
          }
        };
      }
    }
    else{
      this.markFormGroupTouched(this.TagForm)
    }
  }
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
