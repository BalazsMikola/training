import { Injectable } from '@angular/core';

import { User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor() {
  }

  readUserNameFromLocalStorage(): string {
    return localStorage.getItem('currentUsername');
  }

  saveUserNameToLocalStorage(username: string): void {
    localStorage.setItem('currentUsername', username);
  }

  addNewUser(newUsername: string, newPassword: string): void {
    let dataBase: object = this.getDataBaseFromLocalStorage();
    if (dataBase) {
      if (!dataBase[newUsername]) {
        dataBase[newUsername] = {};
        dataBase[newUsername]['username'] = newUsername;
        dataBase[newUsername]['password'] = newPassword;
        dataBase[newUsername]['cities'] = [];
      }
    } else {
      dataBase = {};
      dataBase[newUsername] = {};
      dataBase[newUsername]['username'] = newUsername;
      dataBase[newUsername]['password'] = newPassword;
      dataBase[newUsername]['cities'] = [];
    }

    this.saveDataBaseToLocalStorage(dataBase);
  }

  getUserDataFromDB(username: string): object | null {
    const dataBase: object = this.getDataBaseFromLocalStorage();
    if (dataBase) {
      if (dataBase[username]) {
        return dataBase[username];
      } else {
        return null;
      }
    } else {
      return null;
    }
  }


  saveDataBaseToLocalStorage(newDB: object): void {
    localStorage.setItem('dataBase', JSON.stringify(newDB));
  }

  getDataBaseFromLocalStorage(): object | null {
    const data: string = localStorage.getItem('dataBase');
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }


}

