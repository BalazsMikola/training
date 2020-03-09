import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  constructor() {
  }

  readUserNameFromLocalStorage(): string {
    return localStorage.getItem('currentUsername');
  }

  addNewUser(newUsername: string, newPassword: string): void {
    let dataBase: object = this.getDataBaseFromLocalStorage();
    if (dataBase) {
      if (!dataBase[newUsername]) {
        dataBase[newUsername] = {};
        dataBase[newUsername]['password'] = newPassword;
        dataBase[newUsername]['cities'] = [];
      }
    } else {
      dataBase = {};
      dataBase[newUsername] = {};
      dataBase[newUsername]['password'] = newPassword;
      dataBase[newUsername]['cities'] = [];
    }

    this.saveDataBaseToLocalStorage(dataBase);
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

