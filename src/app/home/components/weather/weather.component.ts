import { Component, OnInit } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { FormControl } from '@angular/forms';
import { take } from 'rxjs/operators';

import { AuthenticationService } from '../../../core/authentication/authentication.service';
import { DataAccessService } from '../../../core/http/data-access.service';

import { User } from '../../../shared/models/user';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

  username: string = '';
  chartData: Object[] = [];
  weatherData: Object[] = [];
  dayBydayData: Object = {};
  selectedCityTab: FormControl = new FormControl(0);
  selectedDayTab: FormControl = new FormControl(0);
  inputErrorMessage: string = '';

  constructor(
    private dataAccessService: DataAccessService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit() {
    this.username = this.authenticationService.getCurrentUsername;
    let userData: object = this.authenticationService.getCurrentUserData(this.username);
    if (userData['cities']) {
      this.callGetWeatherAndForecast(userData['cities']);
    }
  }


  callGetWeatherAndForecast(cities: number[]): void {
    this.getWeatherAndForecast(cities).subscribe((weatherData: Object[]) => {
      this.weatherData = this.weatherData.concat(this.filterWeatherData(weatherData));
    })
  }

  addCity(newCity: string): void {
    this.inputErrorMessage = '';
    this.dataAccessService.getCityByName(newCity).pipe(take(1)).subscribe(data => {
      let userData: object = this.authenticationService.getCurrentUserData(this.username);
      const indexOfCity: number = userData['cities'].indexOf(data['id'])
      if (indexOfCity > -1) {
        alert(`${data['name']} is already in your list!`);
        this.selectedCityTab.setValue(indexOfCity);
      } else {
        this.getWeatherAndForecast([data['id']]).subscribe((weatherData: object[]) => {
          this.weatherData = this.weatherData.concat(this.filterWeatherData(weatherData));
          this.selectedCityTab.setValue(this.weatherData.length - 1)
          this.authenticationService.updateCurrentUsersCities(this.username, { add: data['id'] })
        }, error => alert(error))
      }

    }, error => {
      if (error.status === 404) {
        this.inputErrorMessage = 'There is no city called ' + newCity + '!'
      } else {
        alert(error)
      }
    }
    )
  }



  getWeatherAndForecast(cities: number[]): Observable<object> {
    return forkJoin([this.dataAccessService.getWeatherDataForSeveralCities(cities), this.dataAccessService.getForecastForAllCities(cities)])
  }


  createDayByDayForecast(data: object[]): object {
    let dayByDayData: object = {}
    for (let i: number = 0; i < data.length; i++) {
      if (Object.keys(dayByDayData).includes(data[i]['dt_txt'].split(' ')[0])) {
        dayByDayData[(data[i]['dt_txt'].split(' '))[0]].push(data[i])
      } else {
        dayByDayData[(data[i]['dt_txt'].split(' '))[0]] = [data[i]]
      }
    }

    let keys: string[] = Object.keys(dayByDayData)
    let result: object = {}
    for (let i: number = 0; i < keys.length; i++) {
      if (dayByDayData[keys[i]].length === 8) {
        result[keys[i]] = dayByDayData[keys[i]]
      }
    }
    return result
  }


  filterWeatherData(data: object[]): object[] {
    let weatherListOfCities: object[] = data[0]['list']
    let forecastListOfCities: object = data[1]
    let result: object[] = [];
    for (let i: number = 0; i < weatherListOfCities.length; i++) {
      result.push({
        'id': weatherListOfCities[i]['id'],
        'city': weatherListOfCities[i]['name'],
        'temp': weatherListOfCities[i]['main']['temp'],
        'humidity': weatherListOfCities[i]['main']['humidity'],
        'pressure': weatherListOfCities[i]['main']['pressure'],
        'wind': weatherListOfCities[i]['wind'],
        'forecast': this.createDayByDayForecast(forecastListOfCities[i]['list'])
      });
    }
    return result;
  }


  removeCity(cityID: number, index: number): void {
    this.authenticationService.updateCurrentUsersCities(this.username, { remove: cityID });
    this.weatherData.splice(index, 1);
  }


  onLogout(): void {
    this.authenticationService.logout()
  }

}

