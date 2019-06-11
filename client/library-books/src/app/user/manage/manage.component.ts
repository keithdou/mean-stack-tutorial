import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from "./user";
import { UserService } from '../user.service';


@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

	userForm: FormGroup;

	roles: Array<string> = [
	'member',
	'admin'
	];

	user: User = {
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
    var newUser = Object.assign(this.userForm.value);
    var roleList = [];
    newUser.roles.forEach(role => {
      roleList.push({name : role});
    });
    newUser.roles = roleList;
    this.userService.addUser(newUser).subscribe(resp => {
      console.log(resp);
    });
  }
}

