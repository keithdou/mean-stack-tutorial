import { BrowserModule} from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Primefaces
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {MessagesModule} from 'primeng/messages';
import {MessageModule} from 'primeng/message';
import {ToolbarModule} from 'primeng/toolbar';
import {SplitButtonModule} from 'primeng/splitbutton';
import {TableModule} from 'primeng/table';
import {MenuModule} from 'primeng/menu';

// App
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UserService } from './user/user.service';
import { SecurityService } from './security/security.service';
import { AuthGuard } from './security/auth.guard';
import { JwtInterceptor } from './security/jwt.interceptor';

import { LoginComponent } from './login/login.component';
import { UserListComponent } from './user/userlist/userlist.component';
import { UserUpdateComponent } from './user/userupdate/userupdate.component';
import { UserCreateComponent } from './user/usercreate/usercreate.component';
import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserListComponent,
    UserUpdateComponent,
    UserCreateComponent,
    DashboardComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ButtonModule,
    MenuModule,
    MessageModule,
    MessagesModule,
    SplitButtonModule,
    TableModule,
    ToolbarModule
  ],
  providers: [
    SecurityService,
    UserService,
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
