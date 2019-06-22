import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateUserRequest } from "./create-user-request";
import { UserService } from '../user.service';


interface Role {
    label: string,
    code: string
}

@Component({
  selector: 'app-manage',
  templateUrl: './usercreate.component.html',
  styleUrls: ['./usercreate.component.css']
})
export class UserCreateComponent implements OnInit {

  userForm: FormGroup;
  errorMessage: [];
  successMessage: string;

	availableRoles : Role[];
  selectedRoles : Role[];

	user: CreateUserRequest = {
		username: 'amanda3',
		password: 'amanda3',
    emailAddress: 'amanda3@yahoo.com',
    mobileNumber: '0409123456',
    roles: []
	};

  constructor(private formBuilder: FormBuilder,
              private userService: UserService) { 

      this.availableRoles = [
        {label : "admin", code : "admin"},
        {label : "member", code : "member"}
      ];
      this.selectedRoles = [
        {label : "member", code : "member"}
      ];
      this.userForm = this.formBuilder.group({
      'username': [this.user.username, [Validators.required]],
      'password': [this.user.password, [Validators.required]],
      'emailAddress': [this.user.emailAddress, [Validators.required]],
      'mobileNumber': [this.user.mobileNumber, [Validators.required]],
      'roles': [this.user.roles],
      'selectedRoles': [this.selectedRoles]
     });
  }

  ngOnInit() {
  }

  addUser() {
    console.log(JSON.stringify(this.userForm.value));
    this.errorMessage = [];
    this.successMessage = '';
    this.userForm.value.roles = [];
    // Tidy up the roles
    this.userForm.value.selectedRoles.forEach(role => {
      this.userForm.value.roles.push(role.code);
    });
    // Drop the selectedRoles array
    this.userService.addUser(Object.assign({}, this.userForm.value, { selectedRoles: undefined })).subscribe(
      resp => {
        this.successMessage = resp['user'];
      }, 
      error => {
        this.errorMessage = error.error;
      });
  }
}

