import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any;

  token: string = '';

  constructor(
    private http: HttpClient,
    private navCtrl: NavController,
    private storageService: StorageService
  ) { }

  signIn(username: string, password: string, onesignal_id: string | undefined | null) {
    return this.http.post(`${environment.base_url}/auth/login`, { username, password, onesignal_id });
  }

  async signOut() {
    this.user = undefined;
    this.token = '';
    await this.storageService.clear();
    this.navCtrl.navigateRoot('/login');
  }
}
