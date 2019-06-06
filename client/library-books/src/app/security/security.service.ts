import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AppUserAuth } from './app-user-auth';
import { AppUser } from './app-user';

import {HttpClient, HttpHeaders} from '@angular/common/http';
import { tap } from 'rxjs/operators';

const API_URL = "/api/";

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
    this.securityObject.userName = "";
    this.securityObject.token = "";
    this.securityObject.isAuthenticated = false;
  
    this.securityObject.canUpdate = false;
    this.securityObject.canQuery = false;
    
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
      // Store user name + token into local storage
      localStorage.setItem("currentUser",JSON.stringify({
        userName : this.securityObject.userName,
        token: this.securityObject.token}));
    }));
  }

  logout(): void {
    this.resetSecurityObject();
  }
}
