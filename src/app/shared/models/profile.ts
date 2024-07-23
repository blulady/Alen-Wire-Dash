export class Profile {
  id: number;
  user_id: number;
  employee_number: number;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  positions:[] = [];


  constructor(profile:any){
    this.id = profile.id;
    this.user_id = profile.user_id;
    this.employee_number = profile.employee_number;
    this.first_name = profile.first_name;
    this.last_name = profile.last_name;
    this.is_admin = profile.is_admin;
    this.positions = profile.positions;


  }
}
