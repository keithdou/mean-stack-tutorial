import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { User } from '../user';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticatedUser } from '../../security/authenticated-user';
import { SecurityService } from '../../security/security.service';

@Component({
  templateUrl: './userlist.component.html'
})
export class UserListComponent implements OnInit {
  users: User[];
  authenticatedUser: AuthenticatedUser;
  
  constructor(private UserService: UserService,
              private router: Router,
              private securityService: SecurityService) {
      this.authenticatedUser = securityService.securityObject;
    }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers(): void {
    this.UserService.getUsers()
      .subscribe(users => 
        {
          this.users = users;
        });
  }
  
  addUser() {
  }

  formatRoles(roles) {
    let roleSummary = "";
    roles.forEach(role => {
      roleSummary += ", " + role;
    });
    return roleSummary.substring(2);
  }

  rowSelected(user : User) {
    console.log("selected user:");
    console.log(user);
    this.UserService.selectedUser = user;
    this.router.navigate(["/adduser"]);
  }
}
