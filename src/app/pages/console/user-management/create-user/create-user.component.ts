
import { CommonModule, Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntil } from 'rxjs';
import { UsersService } from '../users.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { HeaderService } from '../../../../core/services/header.service';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,NgxSpinnerModule, NgSelectModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  //identity:string | null | undefined = "0";
  toastermessage: boolean = false
  AlterMsg: any
  identity: number = 0;
  botMenuList: any[] = [];
  btnText: string = "Save";
  userForm: UntypedFormGroup = new UntypedFormGroup({
    id: new UntypedFormControl(),
    firstname: new UntypedFormControl(),
    lastname: new UntypedFormControl(),
    phone: new UntypedFormControl(),
    email: new UntypedFormControl(),
    password: new UntypedFormControl(),
    confirmpassword: new UntypedFormControl(),
    roleId: new UntypedFormControl(),
    teamId: new UntypedFormControl(),
    skillId: new UntypedFormControl(),
  });
  submitted = false;
  RolesControl = new UntypedFormControl(null);
  TeamsControl = new UntypedFormControl(null);
  SkillsControl = new UntypedFormControl(null);
  Roles: Array<any> = [];
  Teams: Array<any> = [];
  Skills: Array<any> = [];
  TeamIds: string[] = []
  RoleIds: string[] = [];
  SkillIds: string[] = [];
  id: any;
  // Skills: string[] = ['English', 'Urdu'];
  constructor(private formbuilder: UntypedFormBuilder
    , private _Activatedroute: ActivatedRoute
    , private location: Location
    , private uservc: UsersService
    , private route: ActivatedRoute
    , private router: Router
    , private headerService: HeaderService
    , private spinnerServerice: NgxSpinnerService) {
    headerService.updateHeaderData({
      title: `Users`,
      tabs: [{ title: '', url: '', isActive: true }],
      isTab: false,
      class: "fal fa-users"
    })
  }
  get f(): { [key: string]: AbstractControl } {
    return this.userForm.controls;
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
    });
    this.getBotMenuList();
    // this.Roles = this._Activatedroute.snapshot.data["roles"];
    // this.Skills = this._Activatedroute.snapshot.data["skills"];
    // this._Activatedroute.paramMap.subscribe(paramMap => {
    //   this.identity = Number(paramMap.get('id'));
    // });
    // ;

    if (this.id != null) {
      this.getUserById();
      this.btnText = "Update"
    } else {
      let form = {
        id: 0,
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
        phone: "",
        roleId: [],
        skillId: [],
      }
      this.setform(form);
    }
  }
  getBotMenuList() {
    this.spinnerServerice.show();
    this.uservc.getMyRoles().subscribe((res: any) => {
      this.spinnerServerice.hide()

      this.botMenuList = res;
      console.log("list", this.botMenuList);
      this.botMenuList.splice(1, 1);
    })
  }
  get roleId(): FormArray {
    return this.userForm.get('roleId') as FormArray;
  }
  onBotSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedOptions = Array.from(selectElement.selectedOptions).map(option => +option.value);

    this.roleId.clear(); // Clear the FormArray before adding new controls

    selectedOptions.forEach(value => {
      this.roleId.push(new FormControl(String(value)));
    });
  }
  async setform(formVal: any): Promise<void> {
    this.userForm = this.formbuilder.group({
      id: [formVal.id],
      firstname: [formVal.firstName, Validators.required],
      lastname: [formVal.lastName, Validators.required],
      phone: [formVal.phone, [Validators.required, Validators.minLength(11), Validators.maxLength(14), Validators.pattern(/^\d+$/)]],
      email: [formVal.email, [Validators.required, Validators.email]],
      password: [formVal.password, [Validators.required, Validators.minLength(8)]],
      confirmpassword: [formVal.confirmPassword, [Validators.required, Validators.minLength(8)]],
      roleId: [formVal.roleId.map((id: number) => id.toString()), Validators.required],
      teamId: [[]],
      skillId: [[]]
    });
    // ,
    // {
    //   validators: [Validation.match('password', 'confirmPassword')]
    // }



    let roleForm: any = [];
    let skillForm: any = [];
    // if (formVal.roleId.length >= 1 && this.Roles.length != 0) {
    //   formVal.roleId.forEach((element: any) => {
    //     let mitem = this.Roles.filter((item: any) => item?.name == element);
    //     roleForm.push(mitem[0]);
    //   });
    //   this.RolesControl.setValue(roleForm);
    // }
    // if (formVal.skillId.length >= 1 && this.Skills.length != 0) {
    //   formVal.skillId.forEach((element: any) => {
    //     let mitem = this.Skills.filter((item: any) => item?.skillID == element);
    //     skillForm.push(mitem[0]);
    //   });
    //   this.SkillsControl.setValue(skillForm);
    // }

    this.userForm.get('confirmpassword')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });

    this.userForm.get('password')?.valueChanges.subscribe(() => {
      this.checkPasswords();
    });
  }

  getUserById() {
    this.spinnerServerice.show();

    this.uservc.GetUsersById(this.id).subscribe(
      (response: any) => {
        response.roleId = this.mapRoleNamesToIds(response.roleId);
        this.setform(response);
      },
      (error: any) => {
        this.spinnerServerice.hide()
        console.error(error);
      }
    );
  }

  mapRoleNamesToIds(roleNames: string[]): number[] {
    return roleNames.map(roleName => {
      const role = this.botMenuList.find(bot => bot.name === roleName);
      return role ? role.id : null;
    }).filter(id => id !== null);
  }


  onReset(): void {
    this.submitted = false;
    this.location.back();
    this.userForm.reset();
    this.userForm.controls['roleId'].reset();
    this.userForm.reset({
      teamId: []
    })
    this.userForm.controls['skillId'].reset();
  }
  onSubmit(): void {

    // let _self = this;
    // this.userForm.controls['roleId'].reset();
    // this.userForm.controls['teamId'].reset();
    // this.userForm.controls['skillId'].reset();
    // this.submitted = true;
    // this.RoleIds=[]
    //   for (let i in this.RolesControl.value) {
    //     if(!this.RoleIds.includes(this.RolesControl.value[i]?.id.toString())){
    //       this.RoleIds.push(this.RolesControl?.value[i]?.id.toString());
    //     }
    //   }
    // this.TeamIds=[]
    //   for (let i in this.TeamsControl.value) {
    //     if(!this.TeamIds.includes(this.TeamsControl?.value[i]?.id.toString())){
    //       this.TeamIds.push(this.TeamsControl?.value[i]?.id?.toString());
    //     }
    //   }
    //   this.SkillIds=[]
    //   for (let i in this.SkillsControl.value) {
    //     if(!this.SkillIds.includes(this.SkillsControl.value[i]?.skillID)){
    //       this.SkillIds.push(this.SkillsControl.value[i]?.skillID);
    //     }
    //   }
    // this.userForm.controls['roleId'].setValue(this.RoleIds);
    // this.userForm.controls['teamId'].setValue(this.TeamIds);
    // this.userForm.controls['skillId'].setValue(this.SkillIds);
    // return ;
    //breturn;
    // let controllerRoute = "AddUser";
    // if (this.userForm.value.id > 0) {
    //   controllerRoute = "UpdateUser";
    // }
    // if (controllerRoute != "UpdateUser" && this.userForm.invalid) {
    //   return;
    // }
    // if (controllerRoute == "AddUser" && this.userForm?.controls["password"].value !== this.userForm?.controls["confirmpassword"].value) {
    //   return;
    // }

    if (this.id == null) {
      if (this.userForm.valid) {
        this.uservc.Save(this.userForm.value).subscribe(
          (res: any) => {
            // _self.onReset();
            this.router.navigate(['bot/console/users']);
          }), {
          error: (err: HttpErrorResponse) => {
          }
        }
      }
      else {
        this.markFormGroupTouched(this.userForm)
      }
    }

    else {
      this.uservc.Update(this.userForm.value).subscribe(
        (res: any) => {
          // _self.onReset();
          this.router.navigate(['bot/console/users']);
        }), {
        error: (err: HttpErrorResponse) => {
        }
      };
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
  isShow = false;
  isActive = false;
  ManageSkills() {
    this.isShow = !this.isShow;
  }
  ManageSkillsSwitch() {
    this.isActive = !this.isActive;
  }

  cancelForm() {
    this.router.navigate(['/bot/console/users']);
  }

  onCatRemovedRole(cat: string) {
    const Roles = this.RolesControl.value as string[];
    this.removeFirst(Roles, cat);
    this.RolesControl.setValue(Roles); // To trigger change detection
  }
  onCatRemovedSkill(cat: string) {
    const Skills = this.SkillsControl.value as string[];
    this.removeFirst(Skills, cat);
    this.SkillsControl.setValue(Skills); // To trigger change detection
  }
  private removeFirst(array: any[], toRemove: any): void {
    const index = array.indexOf(toRemove);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }
  reloadComponent() {
  }
  closeToaster() {
    this.toastermessage = false
  }


  checkPasswords() {
    const password = this.userForm.get('password')?.value;
    const confirmPassword = this.userForm.get('confirmpassword')?.value;

    if (password !== confirmPassword) {
      this.userForm.get('confirmpassword')?.setErrors({ mismatch: true });
    } else {
      this.userForm.get('confirmpassword')?.setErrors(null);
    }
  }

  get password() {
    return this.userForm.get('password');
  }

  get confirmPassword() {
    return this.userForm.get('confirmpassword');
  }
  public onSelectAll() {
    const selected = this.botMenuList.map(item => item.id.toString());
    this.userForm.get('roleId')?.patchValue(selected);
  }

  public onClearAll() {
    this.userForm.get('roleId')?.patchValue([]);
  }
}
