import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonLoading, IonCol, IonText, IonImg, IonRow, IonGrid, IonPopover, IonItem, IonIcon, IonLabel, IonList, IonButtons, IonAlert, IonToast } from '@ionic/angular/standalone';
import { NavController, AlertController } from '@ionic/angular';
import { ApprovalsService, AuthService, GoalService, PeriodService, StorageService, UtilService } from '../../../app/services';
import { addIcons } from 'ionicons';
import { personCircle, cog, power } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonToast, IonAlert, IonButtons, IonList, IonLabel, IonIcon, IonItem, IonPopover, IonGrid, IonRow, IonImg, IonText, IonCol, IonLoading, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class HomePage {

  firstname: string = '';

  isPeriodActive: boolean = false;

  period: any;

  isApprovalActive?: boolean;

  isApprover: boolean = false;

  role!: string;

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      cssClass: 'cancel-alert-btn'
    },
    {
      text: 'Grabar',
      role: 'confirm',
      cssClass: 'confirm-alert-btn',
      handler: (inputs: any) => {
        console.log(inputs);
      }
    }
  ];
  public alertInputs = [
    {
      placeholder: 'Descripción',
      type: 'textarea',
      name: 'descripcion'
    }
  ];

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private periodService: PeriodService,
    private goalService: GoalService,
    private approvalsService: ApprovalsService,
    private storageService: StorageService,
    private utilService: UtilService
  ) {
    addIcons({ personCircle, cog, power });
    this.utilService.showLoading('Cargando...');
    this.periodService.findPeriodByFilters(new Date().getFullYear().toString(), this.authService.user.society).subscribe((resp: any) => {
      if(resp.resultsActive) {
        this.navCtrl.navigateRoot('/download-results');
        this.utilService.dismissLoading();
        return;
      }
      this.storageService.set('period', resp._id)?.then(() => {});
      if(resp.surveyActive) {
        this.navCtrl.navigateRoot('/survey-list');
        this.utilService.dismissLoading();
        return;
      }
      this.isPeriodActive = true;
      this.period = resp._id;
      this.utilService.dismissLoading();
    }, (err) => {
      this.utilService.showSimpleToast('ERROR', err.error.message, 'danger');
      this.utilService.dismissLoading();
    });
  }

  ionViewWillEnter() {
    this.firstname = this.authService.user.firstname;
    this.role = this.authService.user.role;
    if(this.authService.user.role === 'BOSS' || this.authService.user.role === 'GER') {
      this.isApprover = true;
    }
    if (this.period) {
      this.approvalsService.findOneByPeriodAndUser(this.period, this.authService.user._id).subscribe((resp2) => {
        this.isApprovalActive = true;
      }, (err) => {
        this.isApprovalActive = false;
      });
    } else {
      this.periodService.findPeriodByFilters(new Date().getFullYear().toString(), this.authService.user.society).subscribe((resp: any) => {
        this.isPeriodActive = true;
        this.period = resp._id;
        this.approvalsService.findOneByPeriodAndUser(resp._id, this.authService.user._id).subscribe((resp2) => {
          this.isApprovalActive = true;
        })
      });
    }
  }

  
  async presentAlert(header: string, subHeader: string, cssClass: string) {
    const alert = await this.alertCtrl.create({
      header,
      subHeader,
      cssClass,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-alert-btn'
        },
        {
          text: 'Grabar',
          role: 'confirm',
          cssClass: 'confirm-alert-btn',
          handler: (inputs: any) => {
            const { descripcion } = inputs;
            if (!descripcion) {
              this.utilService.showSimpleToast('WARNING', 'La descripción no puede estar vacía', 'warning');
              return;
            }
            this.utilService.showLoading('Cargando...');
            this.goalService.createGoal(this.authService.user._id, this.period, descripcion).subscribe(async(resp) => {
              await this.utilService.dismissLoading();
              this.utilService.showSimpleToast('SUCCESS', 'Objetivo registrado correctamente', 'success');
            }, (err) => {
              this.utilService.dismissLoading();
              this.utilService.showSimpleToast('ERROR', err.message, 'danger');
            });
          }
        }
      ],
      inputs: [
        {
          placeholder: 'Descripción',
          type: 'textarea',
          name: 'descripcion'
        }
      ]
    });

    await alert.present();
  }

  signOut() {
    this.authService.signOut();
  }

  async redirectToGoalsReviewPage() {
    await this.storageService.set('period', this.period);
    this.navCtrl.navigateForward('/goals-review');
  }
  
  async redirectToApprovalsReviewPage() {
    await this.storageService.set('userId', this.authService.user._id);
    this.navCtrl.navigateForward('/approvals-review');
  }

  redirectToConfigPage() {
    this.navCtrl.navigateForward('/config');
  }

}
