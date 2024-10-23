import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApprovalsService {

  constructor(
    private http: HttpClient
  ) { }

  findOneByPeriodAndUser(period: string, user: string) {
    return this.http.get(`${environment.base_url}/approvals?period=${period}&user=${user}`);
  }

  createApproval(period: string, user: string) {
    return this.http.post(`${environment.base_url}/approvals`, { period, user });
  }

  findActiveApprovalsByUserId(user: string) {
    return this.http.get(`${environment.base_url}/approvals/by-approver-id/${user}`);
  }

  findByApproverOneAndPeriod(period: string, approverOne: string) {
    return this.http.get(`${environment.base_url}/approvals/available/survey/by-approver?period=${period}&approverOne=${approverOne}`);
  }

  updateById(id: string, body: any) {
    return this.http.patch(`${environment.base_url}/approvals/${id}`, body);
  }

  deleteById(id: string) {
    return this.http.delete(`${environment.base_url}/approvals/${id}`);
  }


}
