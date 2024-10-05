import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { HttpParams } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ValueSettingService } from '../../../../core/services/value-setting-service';
import { ConversationlBotService } from '../../../../core/services/conversationl-bot.service';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { HeaderService } from '../../../../core/services/header.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversational-bot-upload-files',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule],
  templateUrl: './conversational-bot-upload-files.component.html',
  styleUrls: ['./conversational-bot-upload-files.component.scss']
})
export class ConversationalBotUploadFilesComponent  implements OnInit {
  bots: any[] = [];
  fileArray: any = [];
  isButtonDisabled = false;
  currentId = 0;
  llms = ['ollama', 'openai', 'groq']
  embeddings = ['mxbai-embed-large', 'nomic-embed-text', 'all-minilm', 'all-MiniLM-L6-v2', 'text-embedding-3-small', 'text-embedding-3-large']
  vdb = ['chroma', 'faiss', 'lancedb']
  documents: any ;
  workspace_id: any;
  files: any;
  prompt: any;
  workspaceName: any;
  name: any;
  editButtonClicked: any =false;
  constructor(public ValueSettingService: ValueSettingService,private toaster:ToastrService, private spinner: NgxSpinnerService ,private _hS: HeaderService, private sidenavService: SidenavService, private _toastr: ToastrService, private _cBS: ConversationlBotService) {
    _hS.updateHeaderData({
      title: 'Conversational Bot > Upload File',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fa-light fa-calendar"
    })

    this.documents= this.ValueSettingService.documents$;
    this.workspace_id= this.ValueSettingService.workspace_Id$;
  }
  ngOnInit(): void {
    this.ValueSettingService.workspace_Id$.subscribe(id => {
      this.workspace_id = id;
    }),
    this.ValueSettingService.documents$.subscribe(documents => {
      if (documents && documents != "null") {
        this.documents = documents;
        // this.patchWorkspace(currentBot);
      }
      else if(documents && documents == "null"){
        this.documents = null;
      }
    })
  }

  getDocuments(workspace_id:any){
    this.workspace_id = workspace_id;
    // this.getName();

    const params = new HttpParams()
    .set('bot_id', '1')
    .set('workspace_id', workspace_id);
    this.spinner.show();
    this._cBS.getDocuments(params).subscribe((res:any)=>{
      this.documents = res;
      this.ValueSettingService.setDocuments(res, this.workspace_id);
      this.spinner.hide();
    },
    (error: any) => {
      this.documents = null;
      this.spinner.hide();
      this._toastr.error( error.error?.detail, 'Failed!',{
        timeOut: 2000,
      });
    }
    )
  }

  setLLMDetails(){

  }

  documentsForm = new FormGroup({
    document: new FormControl("", [Validators.required]),
  })
  WorkspaceNameForm = new FormGroup({
    name : new FormControl('')
  })

  get pF(){
    return this.documentsForm.controls
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  onFileChange(event: any) {
    const files = event.target.files;
    let flag = true;

    for (let i = 0; i < files.length; i++) {
      if (!files[i].name.toLowerCase().endsWith('.pdf')) {
        event.target.files = null;
        this.fileArray = [];
        flag = false;
        break; // Exit the loop immediately if a non-PDF file is found
      }
    }

    if (flag) {
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          this.fileArray.push(files.item(i));
        }
      }
    } else {
      this._toastr.error('Only PDF files are allowed', 'Failed!', {
        timeOut: 2000,
      });
    }
  }

  uploadFile(){
    if(this.workspace_id!=null){
      const formData = new FormData();
      for (let i = 0; i < this.fileArray.length; i++) {
        formData.append('documents', this.fileArray[i]);
      }
      formData.append('bot_id', "1");
      formData.append('workspace_id', String(this.workspace_id));
      this.spinner.show();
      this._cBS.uploadFile(formData).subscribe(
        (res:any)=>{
        this.spinner.hide();
        this.files = res;
        this.getDocuments(this.workspace_id);
        },
        (error: any) => {
          this.spinner.hide();
          this._toastr.error( error.error?.detail, 'Failed!',{
            timeOut: 3000,
          });
        }
    );
    }
    else{
      this._toastr.error('Please select an agent first','Failed!', {
        timeOut: 2000,
      });
    }
    // this.updateName();
  }

  createDocument(){
    if(this.workspace_id!=null){
      const formData = new FormData();
      formData.append('text', String(this.documentsForm.value.document));
      formData.append('bot_id', "1");
      formData.append('workspace_id', String(this.workspace_id));

      this._cBS.createDocument(formData).subscribe((res:any)=>{
        this.files = res;
        this.getDocuments(this.workspace_id);
        this.documentsForm.reset()
      });
      // this.updateName();
    }
    else{
      this._toastr.error( 'Please select an agent first','Failed!', {
        timeOut: 2000,
      });
    }
  }

  getName(){
    // this.spinner.show()
    this._cBS.getName(this.workspace_id).subscribe((res:any)=>{
      // this.spinner.hide()
      this.workspaceName = res.detail;
      // this.conversationalBotForm.get('botName')?.setValue(res.detail);
      this.name = res.detail;
    })
  }

  documentsUpdateCheck(){
    if(this.documentsForm.value.document == null || this.documentsForm.value.document == ""){
      return false
    }
    else{
      return true
    }

  }

  getPrompt(){
    this.spinner.show();
    this._cBS.getPrompt(this.workspace_id).subscribe((res:any)=>{
      this.spinner.hide();
      this.documentsForm.get('document')?.setValue(res.detail);
    })
  }
  updateDocStatus(doc: any,event: any) {

    const formData = new FormData;
    formData.append('bot_id', "1");
    formData.append('workspace_id', String(this.workspace_id));
    formData.append('document_id', String(doc.document_id))
    this.spinner.show()
    if(event.target.checked){
      this._cBS.enableDocument(formData).subscribe((res:any)=>{
        this.getDocuments(this.workspace_id);
        this.spinner.hide()
      })
    }
    else{
      this._cBS.disableDocument(formData).subscribe((res:any)=>{
        this.getDocuments(this.workspace_id);
        this.spinner.hide()
      })
    }
    // documentid
    // this.workspace_id
    // botid
  }

  createEmbeddings(){
    const formData = new FormData;
    formData.append('bot_id', "1");
    formData.append('workspace_id', String(this.workspace_id));
    this.spinner.show()
    this._cBS.createEmbeddings(formData).subscribe((res:any)=>{
      this.spinner.hide();
      this._toastr.success('Success!', res.detail, {
        timeOut: 3000,
      });
    }, (error: any) => {
      this.spinner.hide();
      this._toastr.error('Failed!', error.error.detail, {
        timeOut: 3000,
      });
    }
    )
  }

  routeToCreate() {
    this.ValueSettingService.default = "create";
    this.ValueSettingService.setEditFormValues("null",null);

  }
}
