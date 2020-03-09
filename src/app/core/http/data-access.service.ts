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


}

