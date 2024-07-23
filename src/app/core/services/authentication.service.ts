import { HttpClient, HttpHeaders , HttpHeaderResponse} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Profile } from '../../shared/models/profile'
import { Position } from '../../shared/models/position'


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http:HttpClient) { }

  login(email:string, password:string){
    return this.http.post<{token:string}>(`${environment.apiUrl}/login/`, {user:{email, password}},
      { observe: 'response'}
    )
  }

  setToken(token:any){
    localStorage.setItem('token', token);
  }

  getToken(){
    return localStorage.getItem('token');
  }

  deleteToken(){
    localStorage.removeItem('token');
  }

  // not sure we'll need this, delete at end of project
  isLoggedIn(){
    return !!this.getToken()
  }

  logout() {
    const headers = {'authorization': `${this.getToken()}`};
    return this.http.delete<{token:string}>(`${environment.apiUrl}/logout`, {headers: headers})
  }

  signup(email:string, password:string, username:string){
    return this.http.post(`${environment.apiUrl}/signup/`, {user:{email,password,username}})
  }

  getLoggedInUser() {
    const token = this.getToken()
    const headers = {'Authorization': `Bearer ${token}`}
    return this.http.get(`${environment.apiUrl}/current_user`, {headers: headers})
  }
  adminGetProfiles() {
    return this.http.get<Profile[]>(`${environment.apiUrl}/profiles`)
  }
  adminGetProfile(name:string){
    return this.http.get<Profile>(`${environment.apiUrl}/profiles/name/${name}`)
  }
  adminGetProfilePositions(profile_id: number){
    return this.http.get<Position[]>(`${environment.apiUrl}/profiles/${profile_id}/positions`)
  }
  createProfile(employee_number: number, first_name: string, last_name: string, user_id:number, is_admin: boolean) {
    return this.http.post(`${environment.apiUrl}/profiles/`, {profile: { employee_number, first_name, last_name, user_id, is_admin}})
  }

  adminUpdateProfile(employee_number: number, first_name: string, last_name: string, is_admin: boolean, id: number) {
    return this.http.put(`${environment.apiUrl}/profiles/${id}`, {profile: { employee_number, first_name, last_name, is_admin}})
  }
  adminDeleteProfile(profile_id: number){
    return this.http.delete(`${environment.apiUrl}/profiles/${profile_id}`)
  }
}






