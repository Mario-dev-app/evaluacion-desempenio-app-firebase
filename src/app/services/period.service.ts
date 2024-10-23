import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Societies } from '../enums/societies.enum';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {

  constructor(
    private http: HttpClient
  ) { }

  findPeriodByFilters(year: string, society: Societies) {
    return this.http.get(`${environment.base_url}/period/search/byFilters?year=${year}&society=${society}`);
  }
}
