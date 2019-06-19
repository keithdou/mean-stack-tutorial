import { Component } from '@angular/core';
import { AuthenticatedUser } from './security/authenticated-user';
import { SecurityService } from './security/security.service';

@Component({
  selector: 'librarybooks-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title: string = "Keith's MEAN Tutorial";
  securityObject: AuthenticatedUser = null;
  isCollapsed : boolean = true;

  constructor(private securityService: SecurityService) {
    this.securityObject = securityService.securityObject;
  }

  logout(): void {
    this.securityService.logout();
  }
}
