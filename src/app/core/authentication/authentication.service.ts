import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { DataAccessService } from '../http/data-access.service';
import { User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {


  constructor(
    private router: Router,
    private dataAccessService: DataAccessService
  ) { }


  get getCurrentUsername(): string {
    return this.dataAccessService.readUserNameFromLocalStorage();
  }


  getCurrentUserData(username: string): object {
    return this.dataAccessService.getUserDataFromDB(username);
  }


  updateCurrentUsersCities(user: string, order: object): void {
    const userData: object = this.getCurrentUserData(user);
    if (order['add']) {
      userData['cities'].push(order['add'])
    } else {
      userData['cities'].splice(userData['cities'].indexOf(order['remove']), 1);
    }
    this.dataAccessService.updateUsersCities(userData);
  }


  settingsAfterLogin(username: string): void {
    this.dataAccessService.saveUserNameToLocalStorage(username);
    this.router.navigate(['/']);
  }


  login(username: string, password: string): void {
    const userData: object = this.dataAccessService.getUserDataFromDB(username);
    if (!userData) {
      this.dataAccessService.addNewUser(username, password);
      this.settingsAfterLogin(username);
    } else {
      if (userData['password'] === password) {
        this.settingsAfterLogin(userData['username']);
      } else {
        alert('Wrong username or password');
      }
    }
  }


  logout(): void {
    localStorage.removeItem('currentUsername');
    this.router.navigate(['/login']);
  }

}

