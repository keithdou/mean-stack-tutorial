import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';
import { AppUserAuth } from '../security/app-user-auth';
import { SecurityService } from '../security/security.service';

@Component({
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  users: AppUserAuth[];
  securityObject: AppUserAuth = null;

  constructor(private UserService: UserService,
              private securityService: SecurityService) {
      this.securityObject = securityService.securityObject;
  }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers(): void {
    this.UserService.getUsers()
      .subscribe(users => this.users = users);
  }
  
  addUser(): void {
  }
}
