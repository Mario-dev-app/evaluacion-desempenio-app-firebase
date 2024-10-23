import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonCol, IonRow, IonCard, IonCardHeader, IonCardTitle, IonImg, IonCardContent, IonItem, IonList, IonLabel, IonButton, IonIcon, IonChip, IonToast, IonLoading } from '@ionic/angular/standalone';
import { SimpleToolbarComponent } from '../../../app/components/simple-toolbar/simple-toolbar.component';
import { ApprovalsService, AuthService, CompetencyService, GoalService, StorageService, UtilService } from '../../../app/services';
import { AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-goals-review',
  templateUrl: './goals-review.page.html',
  styleUrls: ['./goals-review.page.scss'],
  standalone: true,
  imports: [IonLoading, IonToast, IonChip, IonIcon, IonButton, IonLabel, IonList, IonItem, IonCardContent, IonImg, IonCardTitle, IonCardHeader, IonCard, IonRow, IonCol, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SimpleToolbarComponent]
})
export class GoalsReviewPage implements OnInit {

  goals: any;

  competencies: any;

  period!: string;

  approval: any;

  isRequestApprovalActive: boolean = false;

  constructor(
    private storageService: StorageService,
    private goalService: GoalService,
    private authService: AuthService,
    private approvalsService: ApprovalsService,
    private alertCtrl: AlertController,
    private utilService: UtilService,
    private competencyService: CompetencyService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ trash });
  }

  async ngOnInit() {
    this.period = await this.storageService.get('period');
    this.findAllGoalsByPeriod(this.period);
    this.findCompetencsByLevel(this.authService.user.competencyLevel);
    this.validateApprovalActive();
  }

  validateApprovalActive() {
    this.approvalsService.findOneByPeriodAndUser(this.period, this.authService.user._id).subscribe((resp) => {
      this.approval = resp;
      this.isRequestApprovalActive = true;
    }, (err) => {
      this.isRequestApprovalActive = false;
    });
  }


  findAllGoalsByPeriod(period: string) {
    this.goalService.findAllGoalsByPeriodAndUser(period, this.authService.user._id).subscribe((resp) => {
      this.goals = resp;
    });
  }

  findCompetencsByLevel(competencyLevel: number) {
    this.competencyService.findCompetencyByLevel(competencyLevel).subscribe((resp: any) => {
      console.log(resp.grouping);
      this.competencies = resp.grouping;
    });
  }


  removeGoal(id: string) {
    this.utilService.showLoading('Cargando...');
    this.goalService.removeGoalById(id).subscribe((resp) => {
      this.goals = this.goals.filter((goal: any) => goal._id !== id);
      if (this.goals.length === 0) {
        this.goals = undefined;
      }
      this.utilService.dismissLoading();
    }, (err) => {
      this.utilService.dismissLoading();
      this.utilService.showSimpleToast('ERROR', err.message, 'danger');
    })
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'ALERTA',
      subHeader: '¿Seguro de solicitar la aprobación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-alert-btn'
        },
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => {
            if (!this.competencies || !this.goals) {
              this.utilService.showSimpleToast('INFORMATION', 'Debe registrar objetivos y tener competencias designadas', 'warning');
              return;
            }
            this.utilService.showLoading('Cargando...');
            this.approvalsService.createApproval(this.period, this.authService.user._id).subscribe((resp) => {
              this.validateApprovalActive();
              this.cdr.detectChanges();
              this.utilService.dismissLoading();
            }, (err) => {
              this.utilService.dismissLoading();
              this.utilService.showSimpleToast('ERROR', err.message, 'danger');
            });
          }
        }
      ]
    });

    await alert.present();
  }

  async requestApproval() {
    await this.presentAlert();
  }

  resetSurvey() {
    this.utilService.showLoading('Cargando...');
    this.approvalsService.deleteById(this.approval._id).subscribe((resp) => {
      this.validateApprovalActive();
      this.cdr.detectChanges();
      this.utilService.dismissLoading();
    }, (err) => {
      this.utilService.dismissLoading();
      this.utilService.showSimpleToast('ERROR', err.error.message, 'danger');
    });
  }

}
