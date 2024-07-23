import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { NavigationComponent } from '../../../shared/components/navigation/navigation.component';
import { ChartDisplayComponent } from '../../../shared/components/chart-display/chart-display.component';
import { SidebarComponent } from '../../../shared/components/sidebar/sidebar.component';
import { SidebarService } from '../../../core/services/sidebar.service';
import { Profile } from '../../../shared/models/profile';
import { HttpDataService } from '../../../core/services/http-data.service';
import { Position } from '../../../shared/models/position';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NavigationComponent, ChartDisplayComponent, SidebarComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup = new FormGroup({
    // username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    employee_number: new FormControl('', Validators.required),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    is_admin: new FormControl(false, Validators.required),

  })
  findEmployeeForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
  })
  updateProfileForm: FormGroup = new FormGroup({

    employee_number: new FormControl('', Validators.required),
    first_name: new FormControl('', Validators.required),
    last_name: new FormControl('', Validators.required),
    is_admin: new FormControl(false, Validators.required),
    positionsArray: new FormArray([])
    // selectedPositions: new FormArray([], Validators.required),
  })
  checkSidebar(): boolean{
    return this.sidebar.isSidebarVisible
  }
  isError:boolean = false;
  whatError:string = '';
  name:string = 'profile3';
  profile_id = 0;
  profile_is_admin = false;
  departments = [];
  positions: Position[] = [];
  selectedPositions: Position[] = [];
  employee_number: number = 0;
  first_name: string = '';
  last_name: string = '';
  is_admin: boolean = false;
  positionsArray: any[] = [];



  constructor(private router:Router, private authService:AuthenticationService, private sidebar:SidebarService, private httpDataService: HttpDataService) { }

  ngOnInit(): void {
    // this.httpDataService.adminGetDepartments().subscribe({
    //   next: (res: any) => {
    //     this.departments = res.data

    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    // })


      this.httpDataService.adminGetPositions().subscribe({
        next: (res: any) => {
          this.positions = res.data.positions
          console.log(res.data.positions);
        },
        error: (err) => {
          console.log(err);
        }
      })


      this.positions.forEach(() => this.positionsArray.push(new FormControl(false)))
    }
    get positionsFormArray(){
      return this.updateProfileForm.controls['positions'] as FormArray
    }

  onSignup() {
    if (this.signupForm.valid){
      const username = this.signupForm.value.username;
      const password = this.signupForm.value.password;
      const email = this.signupForm.value.email;
      const employee_number = this.signupForm.value.employee_number;
      const first_name = this.signupForm.value.first_name;
      const last_name = this.signupForm.value.last_name;
      const is_admin = this.signupForm.value.is_admin
      this.authService.signup(email, password, username).subscribe({
        next: (res: any) => {
          console.log('Signup successful:', res);
          console.log("User id", res.data.id)
          const user_id = res.data.id;
          console.log('Creating profile with:', { employee_number, first_name, last_name, user_id, is_admin });
          this.authService.createProfile(employee_number, first_name, last_name, user_id, is_admin).subscribe({
            next: (profileRes: any) => {
              console.log('Profile created successfully:',profileRes)
              let profile = profileRes.data.profile;
              this.addProfileToForm(profile);
            },
            error: (profileError: any) => {
              console.error('Profile creation error:', profileError);
              this.isError = true;
            }
          })
        },
        error: (error:any) => {
          console.error("signup error", error)
          this.isError = true;
        }
      });
      this.isError = false;
      this.signupForm.reset();
    }

  }
  onFind(name: string){
    if (name.length > 0){
      console.log(this.findEmployeeForm.value.name);
      let name = this.findEmployeeForm.value.name;
      this.authService.adminGetProfile(name).subscribe({
        next: (res:any) => {
          console.log(res);
          let profile = res.data.profile;
          console.log("this is onfind", profile, profile.first_name, profile.id);
          this.addProfileToForm(profile);
          this.profile_id = profile.id;
          console.log(profile.id);
          this.profile_is_admin = profile.is_admin;
          name = profile.first_name;
          console.log(name);
          this.authService.adminGetProfilePositions(profile.id).subscribe({
            next: (positionsRes: any) => {
              console.log(positionsRes.data.profile);
              this.selectedPositions = positionsRes.data.profile;
              // console.log(this.selectedPositions);
              // console.log(this.positions.slice(0, 10))
              // this.testArray = this.positions.slice(0, 10);
              // this.testArray.forEach(position => {
              //   const exists = this.selectedPositions.some(selectedPosition => {
              //     return Object.keys(position).every(key => {
              //       return position[key as keyof typeof position] === selectedPosition[key as keyof typeof selectedPosition]
              //     })
              //   })
              //   if (exists) {
              //     console.log(exists)
              //   } else {
              //     console.log("not true", exists)
              //   }
              // })

              // this.positions.forEach(position => {
              //   const exists = this.selectedPositions.some(selectedPosition => {
              //     return Object.keys(position).every(key => {
              //       return position[key as keyof typeof position] === selectedPosition[key as keyof typeof selectedPosition]
              //     })
              //   })
              //   if (exists) {
              //     this.positionsArray.push(new FormControl(true))
              //     console.log(this.positionsArray.push(new FormControl(true)))
              //   } else {
              //     this.positionsArray.push(new FormControl(false))
              //   }
              // })
            },
            error: (error: any) => {
              console.error("get profile positions", error)
            }
          })
        },
        error: (error:any) => {
          console.error("onFind error", error)
        }
      })
    }
  }

  addProfileToForm(profile: Profile){
    this.updateProfileForm.setValue({
      employee_number: profile.employee_number,
      first_name: profile.first_name,
      last_name: profile.last_name,
      is_admin: profile.is_admin,
      positionsArray: this.positionsArray
      // selectedPositions: profile.positions
    })
    this.signupForm.value.username
    this.employee_number = this.updateProfileForm.value.employee_number;
    this.first_name = this.updateProfileForm.value.first_name;
    this.last_name = this.updateProfileForm.value.last_name;
    this.is_admin = this.updateProfileForm.value.is_admin;
    console.log(this.is_admin)
    // this.selectedPositions = this.updateProfileForm.value.selectedPositions;
    // console.log("selectedPositions", this.selectedPositions);

  }

  onUpdateProfile(employee_number: number, first_name: string, last_name: string, is_admin: boolean, id: number) {
    this.employee_number = this.updateProfileForm.value.employee_number;
    this.first_name = this.updateProfileForm.value.first_name;
    this.last_name = this.updateProfileForm.value.last_name;
    this.is_admin = this.updateProfileForm.value.is_admin;
    this.authService.adminUpdateProfile(this.employee_number, this.first_name, this.last_name, this.is_admin, id = this.profile_id).subscribe({
      next: (res:any) => {
        console.log(res)
        this.updateProfileForm.reset();
      },
      error: (err:any) => {
        console.log(err);
        this.isError = true;
        this.whatError = err.error.message;
      }
    })

  }
  onDeleteProfile(id: number){
    this.authService.adminDeleteProfile(id).subscribe({
    next: (res:any) => {
      console.log(res)
      this.updateProfileForm.reset();

    },
    error: (err:any) => {
      console.log(err);
      this.isError = true;
      this.whatError = err.error.message;
    }
    })
  }




}


  // transformToArray(data: any) {
  //   if (typeof data === 'object') {
  //     return Object.keys(data).map(key => JSON.stringify(data[key]));
  //   }
  //   return [data];
  // }
  // onUpdateProfile(employee_number: number, first_name: string, last_name: string, user_id: number, is_admin: boolean, positions: []) {
  //   this.authService.adminUpdateProfile(employee_number, first_name, last_name, user_id, is_admin, positions)
  // }
              // for (let i = 0; i < this.testArray.length; i++){
              //   let object1 = this.testArray[i];
              //   let found = this.selectedPositions.filter(object2 => {
              //     return object2.id === object1.id;})
              //   if (found){
              //     console.log(object1);
              //   } else {
              //     console.log(false)
              //   }
              // }
              // this.testArray.forEach(position => {
              //   if (this.selectedPositions.some(selecedPosition => selecedPosition.id === position.id)){
              //     console.log(selectedPosition);
              //   } else {
              //     console.log(false);}
              // })


                // this.selectedPositions.filter(selectedPosition => selectedPosition.id === position.id)


              // })
              // this.testArray.forEach(position => {
              //   if (this.selectedPositions.includes(position)) {
              //     console.log(true)
              //   } else {
              //     console.log(false)
              //   }
              // })

              // this.selectedPositions.forEach((position) => {
              //   if (this.testArray.includes(position.position_title)) {
              //     console.log(true)
              //   } else { console.log(false)}
              // })
