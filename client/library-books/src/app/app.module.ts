import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookListComponent } from './book/book-list.component';
import { BookService } from './book/book.service';
import { UserService } from './user/user.service';
import { SecurityService } from './security/security.service';
import { AuthGuard } from './security/auth.guard';
import { JwtInterceptor } from './security/jwt.interceptor';
import { UserComponent } from './user/user.component';
import { ManageComponent } from './user/manage/manage.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    BookListComponent,
    UserComponent,
    ManageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    BookService,
    SecurityService,
    UserService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
