import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonGrid, IonRow, IonCol, IonText, IonImg, IonList, IonItem, IonLabel, IonBadge } from '@ionic/angular/standalone';
import { ApprovalsService, AuthService, StorageService } from 'src/app/services';
import { addIcons } from "ionicons";
import { power, checkmarkDoneCircleOutline } from "ionicons/icons";
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-survey-list',
  templateUrl: './survey-list.page.html',
  styleUrls: ['./survey-list.page.scss'],
  standalone: true,
  imports: [IonBadge, IonLabel, IonItem, IonList, IonImg, IonText, IonCol, IonRow, IonGrid, IonIcon, IonButton, IonButtons, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class SurveyListPage {

  period!: string;

  approvals: any;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private approvalService: ApprovalsService,
    private navCtrl: NavController
  ) {
    addIcons({ power, checkmarkDoneCircleOutline });
  }


  async ionViewWillEnter() {
    this.period = await this.storageService.get('period');
    this.approvalService.findByApproverOneAndPeriod(this.period, this.authService.user._id).subscribe((resp) => {
      this.approvals = resp;
    });
  }

  signOut() {
    this.authService.signOut();
  }

  async redirectToSurvey(user: string, approvalId: string, competencyLevel: number) {
    await this.storageService.set('surveyUserId', user);
    await this.storageService.set('approvalId', approvalId);
    await this.storageService.set('competencyLevel', competencyLevel);
    this.navCtrl.navigateForward('survey');
  }

}
