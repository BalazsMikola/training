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

}

