import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AppUserAuth } from '../security/app-user-auth';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { tap } from 'rxjs/operators';

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

  constructor(private http: HttpClient) {}

  getUsers(): Observable<AppUserAuth[]> {
    return this.http.get<AppUserAuth[]>(API_URL + "list",  httpOptions).pipe(
    tap(resp => {
      console.log("BookList");
      console.log(resp);
    }));
  }

}
