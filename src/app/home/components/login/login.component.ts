import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../../core/authentication/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitted = false;

  constructor(
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {

  }

}


