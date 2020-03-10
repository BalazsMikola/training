import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

import { User } from '../../shared/models/user';
import { environment } from '../guards/environment';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {

  private env: string =  environment.APIKey;

  constructor(private http: HttpClient) {
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

  updateUsersCities(userData: object): void {
    let dataBase: object = this.getDataBaseFromLocalStorage();
    dataBase[userData['username']] = userData;
    this.saveDataBaseToLocalStorage(dataBase);
  }

  getCityByName(cityName: string): Observable<object> {
    return this.http.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.env}`);
  }

  getWeatherDataForSeveralCities(cities: number[]): Observable<object> {
    return this.http.get(`http://api.openweathermap.org/data/2.5/group?id=${cities}&appid=${this.env}&units=metric`);
  }

  getForecastForAllCities(cityIDs: number[]): Observable<any> {
    const listOfLinks = cityIDs.map(id => {
      return this.http.get(`http://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=${this.env}&units=metric`);
    });
    return forkJoin(listOfLinks);
  }



}

