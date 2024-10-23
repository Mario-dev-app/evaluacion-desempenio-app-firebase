import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  constructor(
    private http: HttpClient
  ) { }

  submitSurveyResponse(body: any) {
    return this.http.post(`${environment.base_url}/survey`, body);
  }

  findSurveyByUserIdAndPeriod(userId: string, period: string) {
    return this.http.get(`${environment.base_url}/survey/${userId}?period=${period}`);
  }

  confirmResults(body: { surveyId: string, mailTo: string }) {
    return this.http.post(`${environment.base_url}/survey/confirm-results`, body);
  }
}
