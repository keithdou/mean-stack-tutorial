import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Book } from './book';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { tap } from 'rxjs/operators';

const API_URL = "/api/library/";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class BookService {

  constructor(private http: HttpClient) { }
  
  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(API_URL + "list",  httpOptions).pipe(
    tap(resp => {
      console.log("BookList");
      console.log(resp);
    }));
  }
}
