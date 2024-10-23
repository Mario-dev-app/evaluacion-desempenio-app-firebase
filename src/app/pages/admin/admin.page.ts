import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButton, 
  IonImg, 
  IonButtons, 
  IonIcon, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonText
 } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { power } from 'ionicons/icons';
import { Router } from '@angular/router';
import { AuthService } from '../../../app/services';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: true,
  imports: [
    IonText, 
    IonCol, 
    IonRow, 
    IonGrid, 
    IonIcon, 
    IonButtons, 
    IonImg, 
    IonButton, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    CommonModule, 
    FormsModule
  ]
})
export class AdminPage implements OnInit {

  constructor(
    private route: Router,
    private authService: AuthService,
    private navCtrl: NavController
  ) { 
    addIcons({ power });
  }

  ngOnInit() {
  }
  
  signOut() {
    this.authService.token = '';
    this.authService.user = undefined;
    this.route.navigateByUrl('/login', {replaceUrl: true});
  }

  redirectToApprovers() {
    this.navCtrl.navigateForward('/approvers');
  }

}
