import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AuthenticatedUser } from './authenticated-user';
import { LoginRequest } from './login-request';

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

  securityObject: AuthenticatedUser = new AuthenticatedUser();

  constructor(private http: HttpClient) { }

  resetSecurityObject(): void {
    this.securityObject.username = "";
    this.securityObject.token = "";
    this.securityObject.isAuthenticated = false;
    this.securityObject.emailAddress = "";
    this.securityObject.mobileNumber = "";
    this.securityObject.admin = false;
    this.securityObject.roles = null;
     
    localStorage.removeItem("currentUser");
  }

  login(entity: LoginRequest): Observable<AuthenticatedUser> {
    // Initialize security object
    this.resetSecurityObject();
    return this.http.post<AuthenticatedUser>(API_URL + "login", entity, httpOptions).pipe(
    tap(resp => {
      Object.assign(this.securityObject, resp);
      var roles = [];
      roles = this.securityObject.roles;
      this.securityObject.admin = roles.includes("admin");
      this.securityObject.member = roles.includes("member");
       
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
