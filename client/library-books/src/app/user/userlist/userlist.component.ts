import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AppUserAuth } from '../../security/app-user-auth';
import { SecurityService } from '../../security/security.service';

@Component({
  templateUrl: './userlist.component.html'
})
export class UserListComponent implements OnInit {
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
      .subscribe(users => 
        {
          this.users = users;
          this.users.forEach(user => {
            user.roleSummary = "";
            user.roles.forEach(role => {
              user.roleSummary += "," + role;
            });
            user.roleSummary = user.roleSummary.substring(1);
          });
      });
  }
  
  addUser(): void {
  }
}
