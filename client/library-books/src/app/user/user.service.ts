import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AuthenticatedUser } from '../security/authenticated-user';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { UpdateUserRequest } from './update-user-request';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

const API_URL = "/api/user/";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userList : AuthenticatedUser[];

  constructor(private http: HttpClient) {}

  getUsers(): Observable<AuthenticatedUser[]> {
    return this.http.get<AuthenticatedUser[]>(API_URL + "list",  httpOptions).pipe(
    tap(resp => {
      this.userList = resp;
      console.log("UserList");
      console.log(resp);
    }));
  }

  addUser(createUserRequest) {
    return this.http.post(API_URL + "add", createUserRequest, httpOptions)
      .pipe(
        tap(resp => {
           console.log(resp);
        }));
  }

  updateUser(updateUserRequest) {
    console.log("update_user:");
    console.log(updateUserRequest);
  }
}
