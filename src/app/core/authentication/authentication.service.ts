import { Injectable } from '@angular/core';

import { DataAccessService } from '../http/data-access.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  constructor(
    private dataAccessService: DataAccessService
  ) { }


  get getCurrentUsername(): string {
    return this.dataAccessService.readUserNameFromLocalStorage();
  }

  login(username: string, password: string): void {
    this.dataAccessService.addNewUser(username, password)
  //   this.dataAccessService.getUserDataFromDB(username).then((userData: User) => {
  //     if (userData) {
  //       if (userData['password'] === password) {
  //         this.settingsAfterLogin('Welcome ', userData);
  //       } else {
  //         alert('Wrong username or password');
  //       }
  //     } else {
  //       this.dataAccessService.addNewUser(username, password)
  //         .then((newUserData: User) => this.settingsAfterLogin('Successfully registered! Welcome ', newUserData))
  //         .catch((error: Error) => alert('Something went wrong! Please try again later. ' + error))
  //     }
  //   })
  //     .catch((error: Error) => alert('Something went wrong! Please try again later. ' + error))
  }

}

