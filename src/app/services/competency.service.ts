import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CompetencyService {

  constructor(
    private http: HttpClient
  ) { }

  findCompetencyByLevel(competencyLevel: number) {
    return this.http.get(`${environment.base_url}/competencies/${competencyLevel}`); 
  }
}
