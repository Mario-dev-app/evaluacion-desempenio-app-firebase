import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonIcon, IonText, IonItem, IonLabel, IonBadge, IonGrid, IonRow, IonCol, IonImg } from '@ionic/angular/standalone';
import { AuthService, PeriodService, SurveyService, UtilService } from 'src/app/services';
import { addIcons } from 'ionicons';
import { power } from 'ionicons/icons';

@Component({
  selector: 'app-download-results',
  templateUrl: './download-results.page.html',
  styleUrls: ['./download-results.page.scss'],
  standalone: true,
  imports: [IonImg, IonCol, IonRow, IonGrid, IonBadge, IonLabel, IonItem, IonText, IonIcon, IonButtons, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class DownloadResultsPage implements OnInit {

  survey: any;

  firstname?: string;

  totalValueCompetencies: number = 0;

  totalCompetencies: number = 0;

  totalValueGoals: number = 0;

  totalGoals: number = 0;

  constructor(
    private authService: AuthService,
    private surveyService: SurveyService,
    private periodService: PeriodService,
    private utilService: UtilService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    addIcons({ power });
  }

  ionViewWillEnter() {
    this.firstname = this.authService.user.firstname;
    this.findSurvey();
  }

  getGrade(value: number) {
    switch(value) {
      case 1:
        return 11;
      case 2:
        return 13;
      case 3:
        return 15;
      case 4:
        return 17;
      case 5:
        return 19;
      default:
        return 0;
    }
  }

  findSurvey() {
    this.periodService.findPeriodByFilters(new Date().getFullYear().toString(), this.authService.user.society).subscribe((resp: any) => {
      this.surveyService.findSurveyByUserIdAndPeriod(this.authService.user._id, resp._id).subscribe((resp: any) => {
        this.survey = resp;
        this.totalValueCompetencies = resp.competencies.reduce((acc: number, competency: any) => {
          this.totalCompetencies++;
          return acc + this.getGrade(competency.value);
        }, 0);
        this.totalValueGoals = resp.goals.reduce((acc: number, goal: any) => {
          this.totalGoals++;
          return acc + this.getGrade(goal.value);
        }, 0);
      }, (err) => {
        console.log(err);
        this.utilService.showSimpleToast('ERROR', err.error.message, 'danger');
      });
    }, (err) => {
      console.log(err);
      this.utilService.showSimpleToast('ERROR', err.error.message, 'danger');
    });
  }

  signOut() {
    this.authService.signOut();
  }

  acceptResults() {
    const acceptHandler = () => {
      this.utilService.showLoading('Cargando...');
      this.surveyService.confirmResults({ surveyId: this.survey._id, mailTo: this.authService.user.email }).subscribe((resp) => {
        this.utilService.dismissLoading();
        this.utilService.showSimpleToast('SUCCESS', 'Se enviaron sus resultados al correo registrado', 'success');
        this.findSurvey();
        this.cdr.detectChanges();
      }, (err) => {
        console.log(err);
        this.utilService.dismissLoading();
        this.utilService.showSimpleToast('ERROR', err.error.message, 'danger');
      })
      console.log(this.authService.user);
    }

    this.utilService.presentAlertWithAcceptHandler('Al aceptar confirma estar de acuerdo con el envío de sus resultados de forma digital y la visualización del detalle en esta aplicación', acceptHandler );
  }

}
