import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ToastrService } from 'ngx-toastr';
import { ConversationlBotService } from '../../../core/services/conversationl-bot.service';
import { HeaderService } from '../../../core/services/header.service';
import { SidenavService } from '../../../core/services/sidenav.service';

@Component({
  selector: 'app-knowledge-base',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule],
  templateUrl: './knowledge-base.component.html',
  styleUrls: ['./knowledge-base.component.scss']
})
export class KnowledgeBaseComponent implements OnInit{
  allDocuments: any;
  fileArray :any= [];
  knowledgeBaseForm=new FormGroup({
    botName:new FormControl('',[Validators.required]),
    url:new FormControl(''),
  });
  currentId: any;

  get cBF() {
    return this.knowledgeBaseForm.controls
  }
  constructor(private _hS: HeaderService, private sidenavService: SidenavService, private _cBS:ConversationlBotService,private _toastr:ToastrService) {
    _hS.updateHeaderData({
      title: 'Knowledge Base',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class:"fal fa-book-open pe-2"
    })
  }

  ngOnInit(){
    this.getDocuments();
  }

  getDocuments(){
    this.allDocuments = [{ id: 1, name: "Data Privacy.pdf", verified: false}, { id: 2, name: "Bot Creation.pdf", verified: true}]
  }

  onFileChange(event: any) {
    const files = event.target.files;
    if (files && files.length > 0) {

      for (let i = 0; i < files.length; i++) {
        this.fileArray.push(files.item(i));
      }
    }
  }

  submitForm() {

    if (this.knowledgeBaseForm.valid) {
      // this.isButtonDisabled = true;
      const formData = new FormData();
      formData.append('botName', String(this.knowledgeBaseForm.value['botName']));
      formData.append('url', String(this.knowledgeBaseForm.value['url']));
      for (let i = 0; i < this.fileArray.length; i++) {
        formData.append('Files', this.fileArray[i]);
      }
      if (this.currentId !== 0 && this.currentId !== undefined) {
        this._cBS.updateBot(formData).subscribe((res) => {
          // this.isButtonDisabled = false;
          if (res.statusCode === 200) {
            this._toastr.success('Bot Updated SuccessFully!', '', {
              timeOut: 3000,
            });
            this.getDocuments();
            this.knowledgeBaseForm.reset();
          }

        }, (error: any) => {
          this._toastr.error('Failed!', 'Major Error', {
            timeOut: 3000,
          });
        })
      }
      else{
        this._cBS.createBot(formData).subscribe((res) => {
          if (res.statusCode === 200) {

            this._toastr.success('Bot Created SuccessFully!', '', {
              timeOut: 3000,
            });
            this.getDocuments();
            this.knowledgeBaseForm.reset();
          }


        }, (error: any) => {

          // this._toastr.success('Successfuly Created!', 'Knowledge Base Successfully Created', {
          //   timeOut: 3000,
          // });
        })
      }

      //temporary
      this._toastr.success("Successfuly Created","Knowledge Base Successfully Created",{positionClass:"toast-bottom-left"})
      this.allDocuments.push({ id: 4, name: this.knowledgeBaseForm.value.botName, verified: false});
      this.knowledgeBaseForm.reset();
    }

    else {
      this.markFormGroupTouched(this.knowledgeBaseForm);
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
