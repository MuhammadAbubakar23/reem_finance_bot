import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators,FormsModule } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { BotMonitoringService } from '../../../../pages/live-bot-interactions/bot-monitoring.service';
import { ChatVisibilityService } from '../../../../core/services/chat-visibility.service';
import { environment } from '../../../../../environments/environment';
import { Document, Packer, Paragraph, TextRun, Alignment } from 'docx';
import { saveAs } from 'file-saver';
import { bot_id, workspace_id, chat_path, bot_name } from '../../../../../main';
declare var webkitSpeechRecognition: any;
@Component({
  selector: 'app-chat-widget2',
  templateUrl: './chat-widget2.component.html',
  styleUrls: ['./chat-widget2.component.scss']
})
export class ChatWidget2Component implements OnInit {
  @ViewChild('chatBody') private chatBody?: ElementRef;
  @Input() hasParent: boolean = false;
  currentView = 'EmailForm';
  config = {
    value: true,
    name: '',
    disabled: false,
    height: 25,
    width: 70,
    margin: 3,
    fontSize: 10,
    speed: 300,
    color: {
      checked: '#56C128',
      unchecked: '#dcdcdc',
    },
    switchColor: {
      checked: '#3366FF',
      unchecked: 'crimson',
    },
    labels: {
      unchecked: 'Arabic',
      checked: 'English',
    },
    checkedLabel: '',
    uncheckedLabel: '',
    fontColor: {
      checked: '#fafafa',
      unchecked: '#ffffff',
    },
    textAlign: 'left',
  };
  messages: any[] = [];
  recognition: any;
  isRecording = false;
  audioBlob: Blob | null = null;
  mediaRecorder: any;
  audioChunks: any[] = [];
  chatMessages: any[] = [];
  private timeoutId: any; // Variable to hold the timeout ID
  private readonly delay: number = 6 * 60 * 1000; // 6 minutes in milliseconds
  lastServiceErrorTime: number = 0;
  languages = ['English', 'Arabic'];
  selectedLanguage = 'English';
  typing = false;
  addFeedBack: boolean = false;
  downloadChat: any = false;
  currentTimestamp: Date = new Date();
  isOpen = false;
  chatForm: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required])
  })
  bot_name = bot_name
  workspace_id = workspace_id;
  bot_id = bot_id;
  //interval: any;
  apiGaveResponse: any = false;
  tempCount: any = 0;
  buttonAlreadyClicked: any = false;
  conversation_end: any = 0;
  email = ""
  sessionId = ""
  credentials = {
    fullName: '',
    email: ''
  };
  private interval: any;
  private apiSubscription: Subscription = new Subscription();
  isCredentialsEntered = this.getWithExpiry("isCredentialsEntered") || 0;
  isFirstMessage = 0;
  NameValidationError: any;
  EmailValidationError: any;
  registerForm!: FormGroup;
  ratingForm!: FormGroup;
  localStore = this.getWithExpiry("currentWidgetCredentials") || '{}';
  // localStore: any = JSON.parse(localStorage.getItem("currentWidgetCredentials") || '{}');
  currentUserName: any = this.localStore?.name || "";
  session_id = this.localStore?.session_id || "";
  currentMessage: any;
  byeClicked: any = false;
  isParticipate: boolean = false;
  LanguageAlreadySelected: any = false;
  constructor(private fb: FormBuilder, private chatVisibilityService: ChatVisibilityService, private _spinner: NgxSpinnerService, private _botService: BotMonitoringService, private _toastS: ToastrService, private cdr: ChangeDetectorRef, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.initializeSpeechRecognition();
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[A-Za-z]{2,4}$')]],
      // language: ['', Validators.required]
    });
    this.ratingForm = this.fb.group({
      score: ['']
    });
    // if(this.session_id == ""){this.session_id = this.generateRandomString(6);}

    if (this.session_id != "") {
      this.currentView = "Messages";

      this.refreshHistory();
      this.interval = setInterval(() => {
        this.refreshHistory();
      }, 5000)
    }
  }

  // ngAfterViewChecked() {
  //   this.scrollToBottom();
  // }
  toggleParticipation() {
    this.isParticipate = !this.isParticipate;
  }
  generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  scrollToBottom(): void {
    try {
      if (this.chatBody) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    } catch (err) { }
  }
  openChat() {
    this.isOpen = true;
  }
  closeChat() {
    this.isOpen = false;
    //this.messages = [];
  }
  isArabic(text: string): boolean {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  }
  get cf() {
    return this.chatForm.controls
  }
  submitMessage(msg: any) {
    if(msg==="/bye" || msg=="/transfer"){
      this.buttonAlreadyClicked=true;
    }
    // this.apiGaveResponse = false
    const mesage = msg;
    const message = this.chatForm.value['message'];

    if (!message.trim()) {
      const now = Date.now();
      if (now - this.lastServiceErrorTime > 3000) {
        this._toastS.error('Message is Required', '', {
          timeOut: 3000,
        });
        this.lastServiceErrorTime = now;
      }
    }
    else {
      if (!this.session_id) {
        // this.session_id = this.generateRandomString(6);
        this.sendMessage(mesage);
      } else {
        this.sendMessage(mesage);
      }
    }

  }



  sendMessage(mesage: any) {
    if (mesage == '/english' || mesage == '/arabic') {
      this.LanguageAlreadySelected = true;
    }
    const body = {
      "text": mesage != '' ? mesage : this.chatForm.value['message'],
      "session_id": this.session_id,
      "workspace_id": this.workspace_id,
      "bot_id": this.bot_id,
      "token": localStorage.getItem("token")
    };
    this.currentMessage = body.text;
    if(mesage!='/arabic' || mesage!='/english'){
      this.tempCount++;
      this.chatMessages.push({
        text: this.chatForm.value['message'],
        slug: this.session_id,
        type: 'human',
        timestamp: new Date()
      });
    }
    this.chatForm.reset({ message: '' });
    this.typing = true;
    this.currentTimestamp = new Date();
    this._botService.ChatBotWdidget(body).subscribe(
      (res: any) => {
        this.LanguageAlreadySelected = false;
        if (this.currentView == 'Language Selection') {
          this.currentView = 'Messages'
        }
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        this.isCredentialsEntered = 1;
        this.setWithExpiry("isCredentialsEntered", this.isCredentialsEntered, 6 * 60 * 1000);
        const credentials = {
          email: this.registerForm.value.email,
          name: this.registerForm.value.fullName,
          session_id: this.session_id
        };
        this.setWithExpiry("currentWidgetCredentials", credentials, 6 * 60 * 1000);
        this.timeoutId = setTimeout(() => {
          this.delayedFunction();
        }, this.delay);
        if (mesage == '/bye') {
          this.stopApiCalls();
          this.getLastMessage();

        }
        else if (mesage == '/transfer') {
          this.buttonAlreadyClicked = true;
          const clickedItem = {
            active: false,
            session_id: this.session_id
          }
          const refreshIndex = this.chatVisibilityService.refreshHistoryArray.findIndex(session_id => session_id == this.session_id);
          if (refreshIndex != -1) {
            this.chatVisibilityService.refreshHistoryArray.splice(refreshIndex, 1);
            this.chatVisibilityService.notifyNewChatIdHistory(clickedItem);
          }
          this.interval = setInterval(() => {
            this.refreshHistory();
          }, 5000)
          this.refreshHistory()
        }
        else {
          this.interval = setInterval(() => {
            this.refreshHistory();
          }, 5000)
          this.refreshHistory()
        }
      },
      (error: any) => {
        const now = Date.now();
        this.typing = false;
        if (now - this.lastServiceErrorTime > 3000) {
          this._toastS.error('Service Unavailable', 'Failed!', {
            timeOut: 3000,
          });
          this.lastServiceErrorTime = now;
        }
      }
    );
  }
  generateAndDownloadWordFile(data: any) {
    // Create a new document
    const paragraphs = data.map((detail: any) => {
      const speaker = detail.type === 'human' ? 'You' : 'Agent';
      const sentiment = detail.sentiment ? `(${detail.sentiment})` : '';

      return new Paragraph({
        alignment: detail.type === 'human' ? "left" : "right",
        children: [
          new TextRun({
            text: `[${detail.timestamp}] ${speaker}: ${detail.text} ${sentiment}`,
            // font: { size: 24 },
            bold: true,
          }),
        ],
        spacing: { after: 200 }, // Add some space after each message
      });
    });

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    // Pack the document into a Blob and save it
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, 'chat-log.docx');
    });
  }
  downloadChatLog() {
    this.generateAndDownloadWordFile(this.chatMessages);
  }
  getCurrentTime(): string {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    const secondsStr = seconds < 10 ? '0' + seconds : seconds;

    return `${hours}:${minutesStr} ${ampm}`;
  }
  trackChatMessage(index: number, chatMessage: any) {
    return chatMessage.timestamp;
  }
  refreshHistory() {
    const formData = { bot_id: this.bot_id, workspace_id: this.workspace_id, session_id: this.session_id }
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
    }
    if (this.interval) {
      this.apiSubscription = this._botService.ChatHistory(formData).subscribe((res: any) => {
        if (this.tempCount > 0) {
          this.tempCount--;
          this.chatMessages.splice(this.chatMessages.length - 1, 1)
        }
        if (res.detail.length > 0) {
          res.detail.map((item: any) => {
            item.timestamp = this.formatDate(item.timestamp);
          })
          this.typing = false;
          this.chatMessages = res.detail;
          if(this.chatMessages[0].text=='/english' || this.chatMessages[0].text=='/arabic'){
            this.chatMessages.shift();
          }
          this.conversation_end = res.conversation_end;
          if (this.conversation_end == 1) {
            localStorage.removeItem("isCredentialsEntered");
            localStorage.removeItem("currentWidgetCredentials")
          }
        } else {
          this._spinner.hide('chat-history')
          alert("History not found");
        }
      }, (error) => {
        console.error(error);
        // this.isCredentialsEntered = 0;
        // localStorage.removeItem("isCredentialsEntered");
        // localStorage.removeItem("currentWidgetCredentials")
      });
    }

  }
  getLastMessage() {
    const formData = { bot_id: this.bot_id, workspace_id: this.workspace_id, session_id: this.session_id }
    this.apiSubscription = this._botService.ChatHistory(formData).subscribe((res: any) => {
      if (this.tempCount > 0) {
        this.tempCount--;
        this.chatMessages.splice(this.chatMessages.length - 1, 1)
      }
      if (res.detail.length > 0) {
        res.detail.map((item: any) => {
          item.timestamp = this.formatDate(item.timestamp);
        })
        this.typing = false;
        this.chatMessages = res.detail;
        this.conversation_end = res.conversation_end;
        if (this.currentMessage == '/bye') {
          this.buttonAlreadyClicked = true;
          this.byeClicked = true;
          if (this.byeClicked) {
            if (this.isParticipate) {
              this.addFeedBack = true;
            }
            else {
              setTimeout(() => {
                this.byeScenario();
                this.currentView = "EmailForm";
              }, 10000)
            }
          }

          //this.showFeedBackQuestion = true;
          //this.currentView ='FeedBack Stars';
        }
      } else {
        this._spinner.hide('chat-history')
        alert("History not found");
      }
    }, (error) => {
      console.error(error);
      // this.isCredentialsEntered = 0;
      // localStorage.removeItem("isCredentialsEntered");
      // localStorage.removeItem("currentWidgetCredentials")
    });
  }
  hideFeedbackQuestion(value: string) {
    this.byeScenario();

  }
  byeScenario() {
    this.isParticipate = false;
    this.config.value = true;
    const clickedItem = {
      active: false,
      session_id: this.session_id
    }

    const refreshIndex = this.chatVisibilityService.refreshHistoryArray.findIndex(session_id => session_id == this.session_id);
    this.session_id = ""
    this.chatMessages = [];
    // this.currentView = 'FeedBack Question';
    this.typing = false;
    this.buttonAlreadyClicked = true;
    this.registerForm.reset();
    this.currentUserName = '';
    if (refreshIndex != -1) {
      this.chatVisibilityService.refreshHistoryArray.splice(refreshIndex, 1);
      this.chatVisibilityService.notifyNewChatIdHistory(clickedItem);
    }

    localStorage.removeItem("isCredentialsEntered");
    localStorage.removeItem("currentWidgetCredentials")
  }

  formatDate(inputDate: string): any {
    const [day, month, year, hours, minutes, seconds] = inputDate.split(/[/ :]/);
    const parsedDate = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds);
    return this.datePipe.transform(parsedDate, 'h:mm a');
  }
  get feedBackEnabled(): boolean {
    return this.stars.every((v) => v === false);
  }
  submitCredentials() {
    console.log("Participation", this.isParticipate, this.config.value);

    this.currentRating = 0
    this.stars = this.stars.map(() => false);

    if (this.registerForm.valid) {
      this.currentView = 'Language Selection';
      this.email = this.registerForm.value.email
      const data = {
        email: this.registerForm.value.email,
        username: this.registerForm.value.fullName,
        token: localStorage.getItem('token')
      }
      this._botService.ProfileCreate(data).subscribe((res: any) => {
        this.isCredentialsEntered = 1;
        this.byeClicked = false;
        this.buttonAlreadyClicked = false;
        this.setWithExpiry("isCredentialsEntered", this.isCredentialsEntered, 6 * 60 * 1000);
        const credentials = {
          email: this.registerForm.value.email,
          name: this.registerForm.value.fullName,
          session_id: res.detail
        };
        this.setWithExpiry("currentWidgetCredentials", credentials, 6 * 60 * 1000);
        this.currentUserName = this.registerForm.value.fullName;
        // this.registerForm.reset;
        console.log("response", res)
        this.session_id = res.detail;
        this.sessionId = res.detail;
        console.log("session id: ", res.detail);
      },
        error => {
          this.isCredentialsEntered = 0;
          localStorage.removeItem("isCredentialsEntered");
          localStorage.removeItem("currentWidgetCredentials")
          this._toastS.error(error.error);
        }
      )
      // Handle the form submission
    } else {
      this.isCredentialsEntered = 0;
      localStorage.removeItem("isCredentialsEntered");
      localStorage.removeItem("currentWidgetCredentials")
      // Trigger validation messages
      this.registerForm.markAllAsTouched();
    }
  }
  initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.chatForm.patchValue({ message: transcript });
      };

      this.recognition.onend = () => {
        console.log('Speech recognition service disconnected');
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };
    } else {
      console.warn('Speech recognition not supported in this browser.');
    }
  }
  startSpeechRecognition() {
    if (this.recognition) {
      this.recognition.start();
      console.log('Speech recognition started');
    }
  }
  startRecording() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      this.isRecording = true;
      navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
        this.mediaRecorder = new MediaRecorder(stream);
        this.audioChunks = [];

        this.mediaRecorder.start();
        this.mediaRecorder.ondataavailable = (event:any) => {
          this.audioChunks.push(event.data);
        };

        this.mediaRecorder.onstop = () => {
          this.audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
          if(this.audioBlob.size==0){  
            this.audioBlob = null
          }
        };
      });
    }
  }
  
  stopRecording(){
    if (this.mediaRecorder) {
      this.isRecording = false
      this.mediaRecorder.stop();
    }
  }

  playAudio() {
    if (this.audioBlob) {
      const audioUrl = URL.createObjectURL(this.audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  }

  sendAudio() {
    if (this.audioBlob) {
      // Handle sending the audioBlob to your backend
      this._botService.sendVoice(this.audioBlob).subscribe((res:any)=>{
        debugger
      },
      (error:any)=>{
        debugger
      }
    )
      console.log('Sending audio:', this.audioBlob);
      this.audioBlob = null; // Reset after sending
    }
  }
  fullNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const fullNameRegex = /^[a-zA-Z]+ [a-zA-Z]+$/;
      const valid = fullNameRegex.test(control.value);
      return valid ? null : { fullNameInvalid: true };
    };
  }
  setWithExpiry(key: any, value: any, ttl: any) {
    const now = new Date();

    // `ttl` is the time to live in milliseconds (6 minutes = 360000 milliseconds)
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  }

  // Retrieve data from local storage, checking if it has expired
  getWithExpiry(key: any) {
    const itemStr = localStorage.getItem(key);

    // If the item doesn't exist, return null
    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    // If the item is expired, delete it from local storage and return null
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  }
  delayedFunction() {
    console.log('6 minutes have passed since the last execution.');
    const clickedItem = {
      active: false,
      session_id: this.session_id
    }
    const refreshIndex = this.chatVisibilityService.refreshHistoryArray.findIndex(session_id => session_id == this.session_id);
    this.session_id = ""
    this.chatMessages = [];
    this.typing = false;
    this.isCredentialsEntered = 0;
    localStorage.removeItem("isCredentialsEntered");
    localStorage.removeItem("currentWidgetCredentials")
    this.registerForm.reset();
    this.currentUserName = '';
    this.stopApiCalls();
    if (refreshIndex != -1) {
      this.chatVisibilityService.refreshHistoryArray.splice(refreshIndex, 1);
      this.chatVisibilityService.notifyNewChatIdHistory(clickedItem);
    }
    this.currentView = "EmailForm"
  }
  stars: boolean[] = [false, false, false, false, false];
  currentRating: number = 0;


  setRating(rating: number): void {

    this.currentRating = rating;
    this.stars = this.stars.map((_, index) => index < rating);

  }

  submitFeedback(): void {
    this.byeClicked = false;
    this.addFeedBack = false;

    this.byeScenario();
    this.currentView = 'FeedBack Message';
    const body = {
      token: localStorage.getItem("token"),
      session_id: this.sessionId,
      score: this.currentRating,
      email: this.email
    }
    setTimeout(() => {
      this.currentView = 'EmailForm';
    }, 6000)
    this._botService.csatCreate(body).subscribe((res: any) => {
    })
  }
  stopApiCalls() {

    // Clear the interval so it no longer triggers `refreshHistory()`
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null; // Ensure it's set to null
    }

    // Unsubscribe from the ongoing API call
    if (this.apiSubscription) {
      this.apiSubscription.unsubscribe();
      this.apiSubscription = new Subscription(); // Clean up the subscription reference
    }
  }
  ngOnDestroy() {
    this.stopApiCalls();
  }
}



