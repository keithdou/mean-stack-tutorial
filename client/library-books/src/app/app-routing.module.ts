import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookListComponent } from './book/book-list.component';
import { UserComponent } from './user/user.component';
import { AuthGuard } from './security/auth.guard';

const routes: Routes = [
	{ 
		path: 'login', 
		component: LoginComponent 
	},
	{
    	path: 'dashboard', 
    	component: DashboardComponent
  	},
	{
		path: 'booklist', 
		component: BookListComponent,
	  	canActivate: [AuthGuard],
    	data: {claimType: 'canQuery'} 
    },
    {
		path: 'userlist', 
		component: UserComponent,
	  	canActivate: [AuthGuard],
    	data: {claimType: 'canQuery'} 
    },
    {
    	path: '', redirectTo: 'dashboard', pathMatch: 'full'
	},
   	{
	    path: '**', redirectTo: 'dashboard', pathMatch: 'full'
  	}
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
