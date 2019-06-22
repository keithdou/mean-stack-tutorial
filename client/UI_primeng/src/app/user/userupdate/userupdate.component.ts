import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../user';

interface Role {
    label: string,
    code: string
}

@Component({
  selector: 'app-userupdate',
  templateUrl: './userupdate.component.html',
  styleUrls: ['./userupdate.component.css']
})
export class UserUpdateComponent implements OnInit {

  userForm: FormGroup;
  errorMessage: [];
  successMessage: string;
  availableRoles : Role[];
  selectedRoles : Role[];

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router) { 

  	if (!userService.selectedUser) {
  		this.router.navigate(["/dashboard"]);
  		return;
  	}

    this.availableRoles = [
      {label : "admin", code : "admin"},
      {label : "member", code : "member"}
    ];
    this.selectedRoles = [
      {label : "member", code : "member"}
    ];  

		this.userForm = this.formBuilder.group({
		'userId' : [userService.selectedUser._id],
		'username': [userService.selectedUser.username, [Validators.required]],
		'emailAddress': [userService.selectedUser.emailAddress, [Validators.required]],
		'mobileNumber': [userService.selectedUser.mobileNumber, [Validators.required]],
		'roles': [userService.selectedUser.roles, [Validators.required]],
    'selectedRoles': [this.selectedRoles]
    });
  }

  ngOnInit() {
  }

  updateUser() {
    console.log(JSON.stringify(this.userForm.value));
    this.errorMessage = [];
    this.successMessage = '';
    // Tidy up the roles
    this.userForm.value.selectedRoles.forEach(role => {
      this.userForm.value.roles.push(role.code);
    });
    // Drop the selectedRoles array
    this.userService.updateUser(Object.assign({}, this.userForm.value, { selectedRoles: undefined })).subscribe(

      resp => {
        this.successMessage = this.successMessage = "User update successful";
      }, 
      error => {
        this.errorMessage = error.error;
      });
  }
}
