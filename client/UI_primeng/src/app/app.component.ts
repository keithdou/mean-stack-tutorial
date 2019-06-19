import { Component, OnInit  } from '@angular/core';
import { AuthenticatedUser } from './security/authenticated-user';
import { SecurityService } from './security/security.service';
import { ActivatedRoute, Router } from '@angular/router';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit{
  title: string = "Keith's MEAN Tutorial";
  securityObject: AuthenticatedUser = null;
  isCollapsed : boolean = true;
  items: MenuItem[];

	constructor(private securityService: SecurityService,
		        private router: Router) {
    	this.securityObject = securityService.securityObject;
  	}

	ngOnInit() {
		this.items = [
		    {label: 'List Users ', icon: 'pi pi-refresh', routerLink :["/userlist"]},
		    {label: 'Create User', icon: 'pi pi-times', routerLink :["/adduser"]},
		];
	}

	logout(): void {
		this.securityService.logout();
	}

	isAdminUser() {
		return this.securityObject.admin;
	}
}
