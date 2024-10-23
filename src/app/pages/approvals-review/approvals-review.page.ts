import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonButton, IonImg, IonText, IonIcon, IonAlert, IonModal, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { SimpleToolbarComponent } from '../../../app/components/simple-toolbar/simple-toolbar.component';
import { ApprovalsService, AuthService, CompetencyService, GoalService, StorageService, UtilService } from '../../../app/services';
import { addIcons } from 'ionicons';
import { checkmarkCircle, close } from 'ionicons/icons';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-approvals-review',
  templateUrl: './approvals-review.page.html',
  styleUrls: ['./approvals-review.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonList, IonModal, IonAlert, IonIcon, IonText, IonImg, IonButton, IonCard, IonCol, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, SimpleToolbarComponent]
})
export class ApprovalsReviewPage {

  user!: string;

  approvals: any = [];

  goals: any;

  competencies: any;

  constructor(
    private approvalsService: ApprovalsService,
    private storageService: StorageService,
    private goalService: GoalService,
    private competencyService: CompetencyService,
    private alertCtrl: AlertController,
    private utilService: UtilService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ checkmarkCircle, close });
  }

  async ionViewWillEnter() {
    this.user = await this.storageService.get('userId');
    this.chargePendingApprovals();
  }

  chargePendingApprovals() {
    this.approvalsService.findActiveApprovalsByUserId(this.user).subscribe((resp) => {
      this.approvals = resp;
    });
  }

  chargeGoals(period: string, user: string) {
    const button = document.getElementById('open-modal');
    button?.click();
    this.goalService.findAllGoalsByPeriodAndUser(period, user).subscribe((resp) => {
      this.goals = resp;
    })
  }

  changeAbilities(competencyLevel: number) {
    const button = document.getElementById('open-modal-comp');
    button?.click();
    this.competencyService.findCompetencyByLevel(competencyLevel).subscribe((resp: any) => {
      this.competencies = resp.grouping;
    })
    /* this.goalService.findAllAbilitiesByPeriodAndUser(period, user).subscribe((resp) => {
      this.goals = resp;
    }) */
  }

  approved(id: string) {
    const acceptHandler = () => {
      this.utilService.showLoading('Cargando...');
      if(this.authService.user.approver) {
        this.approvalsService.updateById(id, { state: 'IN REVIEW 2', approverTwo: this.authService.user.approver }).subscribe((resp) => {
          this.utilService.dismissLoading();
          this.utilService.showSimpleToast('SUCCESS', 'Aprobación realizada', 'success');
          this.chargePendingApprovals();
          this.cdr.detectChanges();
        }, (err) => {
          console.log(err);
          this.utilService.dismissLoading();
          this.utilService.showSimpleToast('ERROR', err.message, 'danger');
        });
      }else {
        /* this.utilService.showLoading('Cargando...'); */
        this.approvalsService.updateById(id, { state: 'APPROVED' }).subscribe((resp) => {
          this.utilService.dismissLoading();
          this.utilService.showSimpleToast('SUCCESS', 'Aprobación realizada', 'success');
          this.chargePendingApprovals();
          this.cdr.detectChanges();
        }, (err) => {
          console.log(err);
          this.utilService.dismissLoading();
          this.utilService.showSimpleToast('ERROR', err.message, 'danger');
        });
      }
    };
    
    this.utilService.presentAlertWithAcceptHandler('¿Seguro de aprobar?', acceptHandler);
  }

  async rejected(id: string) {
    
    const acceptHandler = () => {
      this.utilService.showLoading('Cargando...');
      this.approvalsService.updateById(id, { state: 'REJECTED' }).subscribe((resp) => {
        this.utilService.dismissLoading();
        this.utilService.showSimpleToast('SUCCESS', 'Rechazo realizado', 'success');
        this.chargePendingApprovals();
        this.cdr.detectChanges();
      }, (err) => {
        this.utilService.dismissLoading();
        this.utilService.showSimpleToast('ERROR', err.message, 'danger');
      });
    };

    this.utilService.presentAlertWithAcceptHandler('¿Seguro de rechazar?', acceptHandler);
    
  }
}
