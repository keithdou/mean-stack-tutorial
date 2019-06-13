import { Component, OnInit } from '@angular/core';
import { AppUser } from '../security/app-user';
import { AppUserAuth } from '../security/app-user-auth';
import { SecurityService } from '../security/security.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'library-books-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: AppUser = new AppUser();
  securityObject: AppUserAuth = null;
  returnUrl: string;
  errorMessage: string;

  constructor(private securityService: SecurityService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  login() {
    localStorage.removeItem("currentUser");
    this.errorMessage = "";
    this.securityService.login(this.user)
    .subscribe(
      resp => {
        this.securityObject = resp;

        this.securityObject.roleSummary = '';
        this.securityObject.roles.forEach(role => {
          this.securityObject.roleSummary += "," + role;
        });
        this.securityObject.roleSummary = this.securityObject.roleSummary.substring(1);
   
        if (this.returnUrl) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.router.navigate(["/dashboard"]);
        }
      },
      error => {
        console.log(error);
        this.errorMessage = error.status + " - " + error.statusText
          + " : " + error.error.message;
      }
    );
  }

}
