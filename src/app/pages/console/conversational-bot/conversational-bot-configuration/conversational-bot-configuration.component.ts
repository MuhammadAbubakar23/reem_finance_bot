import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { HttpParams } from '@angular/common/http';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ValueSettingService } from '../../../../core/services/value-setting-service';
import { HeaderService } from '../../../../core/services/header.service';
import { SidenavService } from '../../../../core/services/sidenav.service';
import { ConversationlBotService } from '../../../../core/services/conversationl-bot.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-conversational-bot-configuration',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule],
  templateUrl: './conversational-bot-configuration.component.html',
  styleUrls: ['./conversational-bot-configuration.component.scss']
})
export class ConversationalBotConfigurationComponent  implements OnInit {
  bots: any[] = [];
  fileArray: any = [];
  isButtonDisabled = false;
  twoDigitValue: string = '';
  currentId = 0;
  llms = ['ollama', 'openai', 'groq']
  models = ['llama3 ', 'mistral ']
  embeddings = ['mxbai-embed-large', 'nomic-embed-text', 'all-minilm', 'all-MiniLM-L6-v2', 'text-embedding-3-small', 'text-embedding-3-large']
  vdb = ['chroma', 'faiss', 'lancedb']
  documents: any;
  // workspace_id: any = this.ValueSettingServiceService.workspace_id;;
  workspace_id: any;
  files: any;
  prompt: any;
  workspaceName: any;
  name: any;
  editButtonClicked: any =false;
  constructor(private ValueSettingServiceService:ValueSettingService ,private toaster:ToastrService, private spinner: NgxSpinnerService ,private _hS: HeaderService, private sidenavService: SidenavService, private _toastr: ToastrService, private _cBS: ConversationlBotService) {
    _hS.updateHeaderData({
      title: 'Conversational Bot',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fa-light fa-calendar"
    })
  }
  ngOnInit(): void {
    this.getBots();
    this.ValueSettingServiceService.workspace_Id$.subscribe(id => {
      this.workspace_id = id;
    }),
    this.ValueSettingServiceService.editFormValues$.subscribe(currentBot => {
      if (currentBot && currentBot !="null") {
        this.patchWorkspace(currentBot);
      }
      else if( currentBot && currentBot == "null"){
        this.cancel()
      }
    })
      // if(this.workspace_id != null){this.patchWorkspace();}
  }
  getBots() {
    // this.bots.push(
    //   { name: 'Generative Ai', icon: 'fa-light fa-message-bot' },
    //   { name: 'HelperBot', icon: 'fa-light fa-message-bot' },
    //   { name: 'Proxima Ai', icon: 'fa-light fa-message-bot' },
    //   { name: 'ChatSensei Ai', icon: 'fa-light fa-message-bot' },
    //   { name: 'MegaBot Ai', icon: 'fa-light fa-message-bot' },
    // )
    // this.spinner.show()
    this._cBS.getBots().subscribe((res: any) => {

      this.bots = res;
      this.ValueSettingServiceService.setBotsList(this.bots)
      // this.spinner.hide();
    })
  }

  patchWorkspace(currentBot:any){
    this.workspace_id = this.ValueSettingServiceService.workspace_Id$;
    this.editButtonClicked = true
    // const currentBot = this.ValueSettingServiceService.editFormValues$;

    this.conversationalBotForm.get('botName')?.setValue(currentBot.workspace_name);
    this.conversationalBotForm.get('LLM')?.setValue(currentBot.llm);
    this.conversationalBotForm.get('llmApiKey')?.setValue(currentBot.llm_api_key);
    this.conversationalBotForm.get('llm_url')?.setValue(currentBot.llm_url)
    this.conversationalBotForm.get('Embeddings')?.setValue(currentBot.embeddings);
    this.conversationalBotForm.get('EmbeddingsApiKey')?.setValue(currentBot.embeddings_api_key);
    this.conversationalBotForm.get('embeddings_url')?.setValue(currentBot.embeddings_url);
    this.conversationalBotForm.get('vectorDB')?.setValue(currentBot.vectordb);
    this.conversationalBotForm.get('vectordb_url')?.setValue(currentBot.vectordb_url);
    this.conversationalBotForm.get('vectordb_api_key')?.setValue(currentBot.vectordb_api_key);
    this.conversationalBotForm.get('chatLimit')?.setValue(currentBot.chat_limit);
    this.conversationalBotForm.get('prompt')?.setValue(currentBot.system_prompt);
    this.conversationalBotForm.get('sessionLimit')?.setValue(currentBot.sessions_limit);
    this.conversationalBotForm.get('model')?.setValue(currentBot.model)
  }

  conversationalBotForm = new FormGroup({
    botName: new FormControl('', [Validators.required]),
    LLM: new FormControl(null, [Validators.required]),
    llmApiKey: new FormControl(''),
    llm_url: new FormControl(''),
    Embeddings: new FormControl(null, [Validators.required]),
    EmbeddingsApiKey: new FormControl(''),
    embeddings_url: new FormControl(''),
    vectorDB: new FormControl(null, [Validators.required]),
    vectordb_api_key: new FormControl(null),
    vectordb_url: new FormControl(''),
    chatLimit: new FormControl('', [Validators.required]),
    prompt: new FormControl('', [Validators.required]),
    sessionLimit: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required])
  });

  WorkspaceNameForm = new FormGroup({
    name : new FormControl('')
  })
  get cBF() {
    return this.conversationalBotForm.controls
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  getName(){
    this.spinner.show()
    this._cBS.getName(this.workspace_id).subscribe((res:any)=>{
      this.spinner.hide()
      this.workspaceName = res.detail;
      // this.conversationalBotForm.get('botName')?.setValue(res.detail);
      this.name = res.detail;
    })
  }

  validateInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    if (input.value.length >= 2 && !['Backspace', 'Delete'].includes(event.key)) {
      event.preventDefault();
    }
  }

  createWorkspace(){
    if(this.conversationalBotForm.valid){
      const formData = new FormData;
      formData.append('bot_id', "1");
      formData.append('workspace_name', String(this.conversationalBotForm.value.botName));
      formData.append('llm', String(this.conversationalBotForm.value.LLM));
      formData.append('llm_api_key', String(this.conversationalBotForm.value.llmApiKey));
      formData.append('llm_url', String(this.conversationalBotForm.value.llm_url));
      formData.append('embeddings', String(this.conversationalBotForm.value.Embeddings));
      formData.append('embeddings_api_key', String(this.conversationalBotForm.value.EmbeddingsApiKey));
      formData.append('embeddings_url', String(this.conversationalBotForm.value.embeddings_url));
      formData.append('system_prompt', String(this.conversationalBotForm.value.prompt));
      formData.append('vectordb', String(this.conversationalBotForm.value.vectorDB));
      formData.append('vectordb_url', String(this.conversationalBotForm.value.vectordb_url));
      formData.append('vectordb_api_key', String(this.conversationalBotForm.value.vectordb_url));
      formData.append('chat_limit', String(this.conversationalBotForm.value.chatLimit));
      formData.append('sessions_limit', String(this.conversationalBotForm.value.sessionLimit))
      formData.append('model',String(this.conversationalBotForm.value.model))
      this.spinner.show();
      this._cBS.createBot(formData).subscribe((res:any)=>{
        this.getBots();
        this.workspace_id = null;
        this.conversationalBotForm.reset();
        this.editButtonClicked = false;
        this.documents = null;
        this.spinner.hide();
      },
      (error: any) => {
        this._toastr.error( error.error?.detail, 'Failed!', {
          timeOut: 3000,
        });
        this.spinner.hide()
      }
      )
    }
    else {
      this.markFormGroupTouched(this.conversationalBotForm);
    }
  }

  updateWorkspace(){

    if(this.conversationalBotForm.valid){
      // const formData = new FormData;
      // formData.append('bot_id', "1");
      // formData.append('workspace_name', String(this.conversationalBotForm.value.botName));
      // formData.append('llm', String(this.conversationalBotForm.value.LLM));
      // formData.append('llm_api_key', String(this.conversationalBotForm.value.llmApiKey));
      // formData.append('embeddings', String(this.conversationalBotForm.value.Embeddings));
      // formData.append('embeddings_api_key', String(this.conversationalBotForm.value.EmbeddingsApiKey));
      // formData.append('prompt', String(this.conversationalBotForm.value.prompt));
      // formData.append('vectordb', String(this.conversationalBotForm.value.vectorDB));
      // formData.append('chat_limit', String(this.conversationalBotForm.value.chatLimit));
      this.updateName();
      this.updateLimit();
      this.updatePrompt();
      this.updatellm();
      this.updateEmbeddings();
      this.updatevectorDb();
    }
    else {
      this.markFormGroupTouched(this.conversationalBotForm);
    }
  }

  cancel(){
    this.workspace_id = null;
    this.conversationalBotForm.reset();
    this.editButtonClicked = false;
    this.documents = null;
  }
  updatellm(){

    const formData = new FormData();
    formData.append('bot_id', "1");
    formData.append('workspace_id', String(this.workspace_id));
    formData.append('llm', String(this.conversationalBotForm.value.LLM));
    formData.append('llm_api_key', String(this.conversationalBotForm.value.llmApiKey));
    formData.append('llm_url', String(this.conversationalBotForm.value.llm_url));
    formData.append('model',String(this.conversationalBotForm.value.model));
    this._cBS.updatellm(formData).subscribe((res:any)=>{
      this.getBots()
    })
  }
  updateEmbeddings(){

    const formData = new FormData();
    formData.append('bot_id', "1");
    formData.append('workspace_id', String(this.workspace_id));
    formData.append('embeddings', String(this.conversationalBotForm.value.Embeddings));
    formData.append('embeddings_url', String(this.conversationalBotForm.value.embeddings_url));
    formData.append('embeddings_api_key', String(this.conversationalBotForm.value.EmbeddingsApiKey));
    this._cBS.updateEmbeddings(formData).subscribe((res:any)=>{
      this.getBots()
      this.workspace_id = null;
      this.conversationalBotForm.reset();
      this.editButtonClicked = false;
      this.documents = null;

    })
  }
  updatevectorDb(){

    const formData = new FormData();
    formData.append('bot_id', "1");
    formData.append('workspace_id', String(this.workspace_id));
    formData.append('vectordb_url', String(this.conversationalBotForm.value.vectordb_url));
    formData.append('vectordb_api_key', String(this.conversationalBotForm.value.vectordb_url));
    formData.append('vectordb', String(this.conversationalBotForm.value.vectorDB));
    formData.append('sessions_limit', String(this.conversationalBotForm.value.sessionLimit))
    this._cBS.updatevectorDb(formData).subscribe((res:any)=>{
      this.getBots()
      this.workspace_id = null;
      this.conversationalBotForm.reset();
      this.editButtonClicked = false;
      this.documents = null;
    })
  }
  updateName(){

    const formData = new FormData();
    formData.append('bot_id', "1");
    formData.append('workspace_id', String(this.workspace_id));
    formData.append('workspace_name', String(this.conversationalBotForm.value.botName));
    this.spinner.show();
    this._cBS.updateName(formData).subscribe((res:any)=>{
      this.getBots()
      this.spinner.hide();
    })
  }

  updateLimit(){

    const formData = new FormData();
    formData.append('bot_id', "1");
    formData.append('workspace_id', String(this.workspace_id));
    formData.append('chat_limit', String(this.conversationalBotForm.value.chatLimit));
    this.spinner.show();
    this._cBS.updateLimit(formData).subscribe((res:any)=>{
      this.getBots()
      this.spinner.hide();
    })
  }
  updateSession(){
    const formData = new FormData();
    formData.append('bot_id', "1");
    formData.append('workspace_id', String(this.workspace_id));
    formData.append('sessions_limit', String(this.conversationalBotForm.value.chatLimit));
    this.spinner.show();
    this._cBS.updateSession(formData).subscribe(
      (res:any)=>{
      this.getBots()
      this.spinner.hide();
    },(error:any)=>{
      this.spinner.hide();
    }
  )
  }
  updatePrompt(){

    const formData = new FormData();
    formData.append('bot_id', "1");
    formData.append('workspace_id', String(this.workspace_id));
    formData.append('system_prompt', String(this.conversationalBotForm.value.prompt));
    this.spinner.show();
    this._cBS.updatePrompt(formData).subscribe((res:any)=>{
      this.getBots();
      this.spinner.hide();
    })
  }


}
