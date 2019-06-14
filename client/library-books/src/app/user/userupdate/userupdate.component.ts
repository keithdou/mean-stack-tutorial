import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateUserRequest } from "../create-user-request";
import { UserService } from '../user.service';


@Component({
  selector: 'app-manage',
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

	user: CreateUserRequest = {
		username: 'linda',
		password: 'linda',
    emailAddress: 'lindaZ@mailinator.com',
    mobileNumber: '0409555555',
    roles: ["member"]
	};

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) { 

      this.userForm = this.formBuilder.group({
      'username': [this.user.username, [Validators.required]],
      'password': [this.user.password, [Validators.required]],
      'emailAddress': [this.user.emailAddress, [Validators.required]],
      'mobileNumber': [this.user.mobileNumber, [Validators.required]],
      'roles': [this.user.roles, [Validators.required]]
    });
  }

  ngOnInit() {
  }

  addUser() {
    console.log(JSON.stringify(this.userForm.value));
    this.errorMessage = '';
    this.successMessage = '';
    this.userService.addUser(this.userForm.value).subscribe(
      resp => {
        this.successMessage = resp['user'];
      }, 
      error => {
        this.errorMessage = error.error;
      });
  }
}

