import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateUserRequest } from "../create-user-request";
import { UserService } from '../user.service';


@Component({
  selector: 'app-manage',
  templateUrl: './usercreate.component.html',
  styleUrls: ['./usercreate.component.css']
})
export class UserCreateComponent implements OnInit {

  userForm: FormGroup;
  errorMessage: [];
  successMessage: string;

	roles: Array<string> = [
	 'member',
	 'admin'
	];

	user: CreateUserRequest = {
		username: '',
		password: '',
    emailAddress: '',
    mobileNumber: '',
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
    this.errorMessage = [];
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

