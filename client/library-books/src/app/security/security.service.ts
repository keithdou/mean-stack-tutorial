import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AppUserAuth } from './app-user-auth';
import { AppUser } from './app-user';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { tap } from 'rxjs/operators';

const API_URL = "/api/user/";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  securityObject: AppUserAuth = new AppUserAuth();

  constructor(private http: HttpClient) { }

  resetSecurityObject(): void {
    this.securityObject.username = "";
    this.securityObject.token = "";
    this.securityObject.isAuthenticated = false;
    this.securityObject.emailAddress = "";
    this.securityObject.mobileNumber = "";
    this.securityObject.member = false;
    this.securityObject.admin = false;
    this.securityObject.roles = null;
    this.securityObject.roleSummary = "";
    
    localStorage.removeItem("currentUser");
  }

  login(entity: AppUser): Observable<AppUserAuth> {
    // Initialize security object
    this.resetSecurityObject();
    return this.http.post<AppUserAuth>(API_URL + "login", entity, httpOptions).pipe(
    tap(resp => {
      // Use object assign to update the current object
      // NOTE: Don't create a new AppUserAuth object
      //       because that destroys all references to object
      Object.assign(this.securityObject, resp);
      // temp
      this.securityObject.admin = true;
      this.securityObject.roles.forEach(role => {
        this.securityObject.roleSummary += "," + role["name"];
      });
      // Store user name + token into local storage
      localStorage.setItem("currentUser",JSON.stringify({
        username : this.securityObject.username,
        token: this.securityObject.token}));
    }));
  }

  logout(): void {
    this.resetSecurityObject();
  }
}
