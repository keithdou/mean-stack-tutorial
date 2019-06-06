import { Component, OnInit } from '@angular/core';
import { BookService } from './book.service';
import { Book } from './book';
import { AppUserAuth } from '../security/app-user-auth';
import { SecurityService } from '../security/security.service';

@Component({
  templateUrl: './book-list.component.html'
})
export class BookListComponent implements OnInit {
  books: Book[];
  securityObject: AppUserAuth = null;

  constructor(private BookService: BookService,
              private securityService: SecurityService) {
      this.securityObject = securityService.securityObject;
  }

  ngOnInit() {
    this.getBooks();
  }

  private getBooks(): void {
    this.BookService.getBooks()
      .subscribe(books => this.books = books);
  }
  
  addBook(): void {
  }
}
