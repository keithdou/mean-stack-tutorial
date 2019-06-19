import { Component, OnInit } from '@angular/core';
import { LoginRequest } from '../security/login-request';
import { AuthenticatedUser } from '../security/authenticated-user';
import { SecurityService } from '../security/security.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'library-books-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginRequest: LoginRequest = new LoginRequest();
  securityObject: AuthenticatedUser = null;
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
    this.securityService.login(this.loginRequest)
    .subscribe(
      resp => {
        this.securityObject = resp;
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
