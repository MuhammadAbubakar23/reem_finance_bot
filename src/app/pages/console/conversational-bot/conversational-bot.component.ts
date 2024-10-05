import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { HttpParams } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';

import { CommonModule, formatDate } from '@angular/common';
import { bot_id } from '../../../../main';
import { ValueSettingService } from '../../../core/services/value-setting-service';
import { SidenavService } from '../../../core/services/sidenav.service';
import { ConversationlBotService } from '../../../core/services/conversationl-bot.service';
import { HeaderService } from '../../../core/services/header.service';
import { ConversationalBotConfigurationComponent } from './conversational-bot-configuration/conversational-bot-configuration.component';
import { ConversationalBotUploadFilesComponent } from './conversational-bot-upload-files/conversational-bot-upload-files.component';
import { ConfigurationsComponent } from '../configurations/configurations.component';

@Component({
  selector: 'app-conversational-bot',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule,ConversationalBotConfigurationComponent,ConversationalBotUploadFilesComponent,ConfigurationsComponent],
  templateUrl: './conversational-bot.component.html',
  styleUrls: ['./conversational-bot.component.scss']
})
export class ConversationalBotComponent implements OnInit {
  bots: any[] = [];
  default:any = "create";
  fileArray: any = [];
  isButtonDisabled = false;
  currentId = 0;
  llms = ['ollama', 'openai', 'groq']
  embeddings = ['mxbai-embed-large', 'nomic-embed-text', 'all-minilm', 'all-MiniLM-L6-v2', 'text-embedding-3-small', 'text-embedding-3-large']
  vdb = ['chroma', 'faiss', 'lancedb']
  documents: any;
  workspace_id: any;
  files: any;
  prompt: any;
  workspaceName: any;
  name: any;
  editButtonClicked: any =false;
  tokenData: any;
  currentToken:any;
  tokenExpiryDate: any;
  constructor(public ValueSettingServiceService:ValueSettingService ,private toaster:ToastrService, private spinner: NgxSpinnerService ,private _hS: HeaderService, private sidenavService: SidenavService, private _toastr: ToastrService, private _cBS: ConversationlBotService) {
    _hS.updateHeaderData({
      title: 'Conversational Bot',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fa-light fa-calendar",
      subTab: true
    })
  }
  ngOnInit(): void {
    this.getBots();
    this.ValueSettingServiceService.botList$.subscribe((bots:any) => {
      if (bots) {
        this.bots = bots;
      }
    })
  }
  getBots() {
    this.spinner.show()
    this._cBS.getBots().subscribe((res: any) => {

      this.bots = res;
      this.spinner.hide();
    }
  ,(error:any) =>{
    this.spinner.hide();
  })
  }
  getDocuments(workspace_id:any){
    this.workspace_id = workspace_id;
    // this.getName();
    const params = new HttpParams()
    .set('bot_id', bot_id)
    .set('workspace_id', workspace_id);
    // this.spinner.show();
    this._cBS.getDocuments(params).subscribe((res:any)=>{
      this.documents = res;
      this.ValueSettingServiceService.setDocuments(res, this.workspace_id);
      this.loadUploadComponent();
      // this.spinner.hide();
    },
    (error: any) => {
      this.documents = null;
      this.loadUploadComponent();
      // this.spinner.hide();
      this.ValueSettingServiceService.setDocuments("null", this.workspace_id);
      this._toastr.error( error.error?.detail, 'Failed!',{
        timeOut: 2000,
      });
    }
    )
  }

  patchWorkspace(workspace_id:any){
    this.workspace_id = workspace_id;
    this.editButtonClicked = true
    const currentBot = this.bots.find(bot=> bot.workspace_id == this.workspace_id);
    this.ValueSettingServiceService.setEditFormValues(currentBot, workspace_id);

    this.loadConfigComponent();
    //
    // this.conversationalBotForm.get('botName')?.setValue(currentBot.workspace_name);
    // this.conversationalBotForm.get('LLM')?.setValue(currentBot.llm);
    // this.conversationalBotForm.get('llmApiKey')?.setValue(currentBot.llm_api_key);
    // this.conversationalBotForm.get('Embeddings')?.setValue(currentBot.embeddings);
    // this.conversationalBotForm.get('EmbeddingsApiKey')?.setValue(currentBot.embeddings_api_key);
    // this.conversationalBotForm.get('vectorDB')?.setValue(currentBot.vectordb);
    // this.conversationalBotForm.get('chatLimit')?.setValue(currentBot.chat_limit);
    // this.conversationalBotForm.get('prompt')?.setValue(currentBot.system_prompt);
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
      formData.append('bot_id',bot_id);
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


  getName(){
    this.spinner.show()
    this._cBS.getName(this.workspace_id).subscribe((res:any)=>{
      this.spinner.hide()
      this.workspaceName = res.detail;
      // this.conversationalBotForm.get('botName')?.setValue(res.detail);
      this.name = res.detail;
      this.ValueSettingServiceService.setName(this.name);
    })
  }

  getToken(id:any){
    this.currentToken=null;
    this.tokenExpiryDate=null;
    this.workspace_id = id;
    this.spinner.show()
    this._cBS.getToken(this.workspace_id).subscribe((res:any)=>{
      this.spinner.hide()
      this.currentToken = res.token;
      this.tokenExpiryDate = this.convertToOriginalFormat(res.expiry);

      this.tokenData = res;
    },
    (error:any)=>{
      this.spinner.hide();
      this.currentToken=null;
      this.tokenExpiryDate=null;
      console.error(error.error);
    }
  )
  }

  createToken(){
    const formData = new FormData();

    const formattedDate = this.convertDate(this.tokenExpiryDate);
    formData.append('bot_id', bot_id);
    // formData.append('workspace_id', String(this.workspace_id));
    formData.append('workspace_id',this.workspace_id);
    formData.append('expiry_date', this.tokenExpiryDate!=null ? formattedDate : this.tokenExpiryDate);
    this.spinner.show()
    this._cBS.createToken(formData).subscribe((res:any)=>{
      this.spinner.hide()
      this.toaster.success(res.detail)
    },
    (error:any)=>{
      this.spinner.hide();
      this._toastr.error(error.error.detail)
    }
  )
  }

  convertDate(date: string): string {
    const dateObj = new Date(date);
    return formatDate(dateObj, 'dd/MM/yyyy HH:mm:ss', 'en-US');
  }

  convertToOriginalFormat(formattedDate: string): string {

    const [datePart, timePart] = formattedDate.split(' ');
    const [year, month, day] = datePart.split('-').map(Number);
    const [hours, minutes, seconds] = timePart.split(':').map(Number);

    const dateObj = new Date(year, month - 1, day, hours, minutes, seconds);
    return dateObj.toISOString().slice(0, 16); // 'YYYY-MM-DDTHH:MM'
  }

  loadUploadComponent(){
    this.ValueSettingServiceService.default = "upload";
  }
  loadConfigComponent(){
    this.ValueSettingServiceService.default = "create";
  }
  loadTimeComponent(){
    this.ValueSettingServiceService.default = "time";
  }
}
