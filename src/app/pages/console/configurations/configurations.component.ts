
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { BotMonitoringService } from '../../../core/services/bot-monitoring.service';
import { HeaderService } from '../../../core/services/header.service';
import { SidenavService } from '../../../core/services/sidenav.service';
// import { CommonDataService } from 'src/app/shared/services/common/common-data.service';

// import { BotMonitoringService } from 'src/app/modules/bot-monitoring/services/bot-monitoring.service';

@Component({
  selector: 'app-configurations',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule],
  templateUrl: './configurations.component.html',
  styleUrls: ['./configurations.component.scss']
})
export class ConfigurationsComponent implements OnInit {

  daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  channels: any;
  companyPages: any = [{name: 'Ibex Global',uniqueId: 3425346435547}, {name: 'Ibex Local',uniqueId: 35647634747}, {name: 'Virtual World VW',uniqueId: 938473285}];
  contentTypes: any;
  contentTypess: any;
  statuses: any = ["Active", "Inactive"];
  formDisabled = false;
  errorMessage = '';
  showEntitiesDropdown = false;
  botIds: any;
  toastermessage: boolean = false;
  AlterMsg:any
  botsForm!: FormGroup;
  currentId: any;
  status: any = true;
  broadcast: any = true
  type: any ;
  baseUrl: any = 'https://linked.360scrm.com/api/';
  channelId: any;


  constructor(private _hS: HeaderService, private sidenavService: SidenavService, private spinnerServerice: NgxSpinnerService, private headerService: HeaderService, private formBuilder: FormBuilder, private _botService: BotMonitoringService, private router: Router, private _route: ActivatedRoute) {
    _hS.updateHeaderData({
      title: 'Configurations',
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class:"fa-light fa-calendar"
    })
  }
  ngOnInit(): void {
    this.getBots();
    this.getChannels();
    this.currentId = this._route.snapshot.paramMap.get('id')
    this.type = this._route.snapshot.paramMap.get('type')
    this.channelId = this._route.snapshot.paramMap.get('channelId')
      this.initializeForm();
  }
  initializeForm(): void {
    this.botsForm = this.formBuilder.group({
      botId: [null, Validators.required],
      platform: [null, Validators.required],
      activeHoursDetails: this.formBuilder.array([]),
    });
    this.daysOfWeek.forEach((day)=>{
      this.addDays(day);
    })
    this.Days.controls.forEach((day)=>{
      day.disable();
    })
  }
  getBotDetails(){

    this.botsForm.value.botId
    const res = {
      activeHoursDetails: [
          {
          "day": "Tuesday",
          "activeFrom": "19:27",
          "activeTo": "19:24"
          },
          {
            "day": "Wednesday",
            "activeFrom": "19:24",
            "activeTo": "20:31"
          }
      ]
    };
    const days = this.botsForm.get('activeHoursDetails') as FormArray;
    res.activeHoursDetails.forEach((d: any) => {
      var currentDay = days.controls.find(day=> day.value.day == d.day);
      currentDay?.patchValue(d);

      if(!this.isDayEnabled(d.day)){
        this.DayEnableOrDisable(d.day);
      }
    })
  }
  // patchFormValues(): void {
  //   this.commonService.GetBotConfigById(this.currentId, this.type).subscribe(
  //     (res: any) => {
  //
  //       this.botsForm.get('contentType')?.setValue(res.contentType);
  //       this.getContentTypes();
  //       this.botsForm.patchValue({
  //         botId: res.botId,
  //         platform: this.channelId,
  //       });

  //       const days = this.botsForm.get('activeHoursDetails') as FormArray;
  //       res.activeHoursDetails.forEach((d: any) => {

  //       var currentDay = days.controls.find(day=> day.value.day == d.day)
  //       currentDay?.patchValue(d)
  //       this.spinnerServerice.hide()
  //       });
  //     })

  //     this.botsForm.disable();

  // }
  clearDays(): void {
    const Days = this.botsForm.get('activeHoursDetails') as FormArray;
    while (Days.length !== 0) {
      Days.removeAt(0);
    }
  }

  getContentTypes(){

    var channel:any;
    if(this.botsForm.value.platform){
      channel = this.contentTypes.find((x:any)=> x.id == this.botsForm.value.platform );
    }
    else{
      channel = this.contentTypes.find((x:any)=> x.id == this.channelId );
    }

    this.contentTypess = channel?.subService;
    // this.botsForm.get('contentTypes')?.reset;
  }
  getChannels(){
    // this.commonService.getChannelsList().subscribe((res: any)=>{
    //   const response = res as { [key: string]: string };

    //   this.channels = Object.keys(response).map(key => ({
    //     id: Number(key),
    //     name: response[key]
    //   }));
    // })
    this.channels = [{id: 1, name: "Facebook"},{id: 2, name: "Instagram"},{id: 3, name: "Linkedin"},]
  }
  getBots(){
    // this._botService.GetAllChatBot().subscribe((res: any)=>{
    //   this.botIds = res;
    // })
    this.botIds = [{ id: 1, name: "Generative Ai" },{ id: 2, name: "HelperBot Ai" },{ id: 3, name: "CogniBot Ai" },{ id: 4, name: "Pixella" } ]
  }

  Day(i: any){
    return this.Days.controls[i];
  }
  get Days(): FormArray {
    return this.botsForm.get('activeHoursDetails') as FormArray;
  }
  addDays(workingDay: string): void {
    const formArray = this.Days;
    formArray.push(
      this.formBuilder.group({
        day: [workingDay],
        activeFrom: [null],
        activeTo: [null]
      })
    );
  }

  DayEnableOrDisable(day: string): void {
    const index = this.daysOfWeek.indexOf(day);
    const dayGroup = this.Days?.at(index) as FormGroup;

    if(!dayGroup.disabled){
      dayGroup.disable();
    }
    else{
      dayGroup.enable();
    }
  }
  isDayEnabled(day: string): boolean {
    const index = this.daysOfWeek.indexOf(day);
    const dayGroup = this.Days.at(index) as FormGroup;
    return !dayGroup?.get('activeFrom')!.disabled || false;
  }
  saveForm(){

    console.log("d['activeFrom']",typeof(this.Days.controls[0].value['activeFrom']))

      this.botsForm
    //   this.commonService.AddBotConfig(this.baseUrl, this.botsForm.value).subscribe(
    //   (res: any) => {

    //     console.log("botsResponse--", res)
    //     this.botsForm.reset()
    //     this.router.navigate(['/console/bot-configuration'])
    //   },
    //   (error: any)=>{

    //     console.error('Error occurred:', error);
    //     var existing:boolean = error.error.text.includes('Existing');
    //     if(!existing){
    //       this.router.navigate(['/console/bot-configuration'])
    //     }
    //   },
    //   () => {

    //     console.log('HTTP request completed.');
    //   }
    // )
  }

  resetForm(){
    Object.keys(this.botsForm.controls).forEach(key => {
      this.botsForm.removeControl(key);
    });
    this.initializeForm();
    // this.Days.controls.forEach((form)=>{
    //   form.get('workingDay')?.disable();
    //   form.get('startTime')?.disable();
    //   form.get('activeTo')?.disable();
    // })
    console.log(this.botsForm);
  }

}
