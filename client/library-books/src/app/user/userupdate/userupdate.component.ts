import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../user';

@Component({
  selector: 'app-userupdate',
  templateUrl: './userupdate.component.html',
  styleUrls: ['./userupdate.component.css']
})
export class UserUpdateComponent implements OnInit {

  userForm: FormGroup;
  errorMessage: string;
  successMessage: string;

	roles: Array<string> = [
	 'member',
	 'admin'
	];

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router) { 

  		if (!userService.selectedUser) {
  			this.router.navigate(["/dashboard"]);
  			return;
  		}

		this.userForm = this.formBuilder.group({
		'userId' : [userService.selectedUser._id],
		'username': [userService.selectedUser.username, [Validators.required]],
		'emailAddress': [userService.selectedUser.emailAddress, [Validators.required]],
		'mobileNumber': [userService.selectedUser.mobileNumber, [Validators.required]],
		'roles': [userService.selectedUser.roles, [Validators.required]]
    });
  }

  ngOnInit() {
  }

  updateUser() {
    console.log(JSON.stringify(this.userForm.value));
    this.errorMessage = '';
    this.successMessage = '';
    this.userService.updateUser(this.userForm.value).subscribe(
      resp => {
        this.successMessage = this.successMessage = "User update successful";
      }, 
      error => {
        this.errorMessage = error.error;
      });
  }
}
