import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }

  updateUserDataById(id: string, body: any) {
    return this.http.patch(`${environment.base_url}/user/${id}`, body);
  }

  resetPasswordByUsername(username: string) {
    return this.http.patch(`${environment.base_url}/user/update-password/${username}`, null);
  }

  findAllApproversOfUsers() {
    return this.http.get(`${environment.base_url}/user/approvers/all`);
  }

  findUserByPagination(limit: number, skip: number) {
    return this.http.get(`${environment.base_url}/user?limit=${limit}&skip=${skip}`);
  }
}
