import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class GoalService {

  constructor(
    private http: HttpClient
  ) { }

  createGoal(user: string, period: string, description: string) {
    return this.http.post(`${environment.base_url}/goal`, { user, period, description });
  }
  
  createAbility(user: string, period: string, description: string) {
    return this.http.post(`${environment.base_url}/ability`, { user, period, description });
  }

  findAllGoalsByPeriodAndUser(period: string, user: string) {
    return this.http.get(`${environment.base_url}/goal/${period}/${user}`);
  }
  
  findAllAbilitiesByPeriodAndUser(period: string, user: string) {
    return this.http.get(`${environment.base_url}/ability/${period}/${user}`);
  }

  removeGoalById(id: string) {
    return this.http.delete(`${environment.base_url}/goal/${id}`);
  }

  removeAbilityById(id: string) {
    return this.http.delete(`${environment.base_url}/ability/${id}`);
  }

  updateGoal(id: string, body: any) {
    return this.http.patch(`${environment.base_url}/goal`, body);
  }
}
