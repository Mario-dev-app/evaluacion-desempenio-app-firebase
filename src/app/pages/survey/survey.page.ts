import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonText, IonButtons, IonBackButton, IonIcon, IonButton, IonLoading, IonTextarea
} from '@ionic/angular/standalone';
import { SimpleToolbarComponent } from "../../components/simple-toolbar/simple-toolbar.component";
import { addIcons } from 'ionicons';
import { send } from 'ionicons/icons';
import { ApprovalsService, AuthService, CompetencyService, GoalService, StorageService, SurveyService, UtilService } from 'src/app/services';
import { NavController } from '@ionic/angular';

interface SurveyItem {
  value: number;
  description: string;
}

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
  standalone: true,
  imports: [IonTextarea, IonLoading, IonButton, IonIcon, IonBackButton, IonButtons,
    IonText,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleToolbarComponent
  ]
})
export class SurveyPage implements OnInit {

  period!: string;

  approvalId!: string;

  surveyUser!: string;

  competencyLevel!: number;

  goals: any;

  competencies: any;

  surveyForm!: FormGroup;

  isFormReady = false;

  constructor(
    private storageService: StorageService,
    private goalService: GoalService,
    private fb: FormBuilder,
    private utilService: UtilService,
    private authService: AuthService,
    private surveyService: SurveyService,
    private competencyService: CompetencyService,
    private navCtrl: NavController,
    private approvalService: ApprovalsService
  ) {
    addIcons({ send });
    this.surveyForm = this.fb.group({});
  }

  async ngOnInit() {
    this.period = await this.storageService.get('period');
    this.surveyUser = await this.storageService.get('surveyUserId');
    this.approvalId = await this.storageService.get('approvalId');
    this.competencyLevel = await this.storageService.get('competencyLevel');
    await this.loadData();
    this.initForm();
  }

  async loadData() {
    await this.findGoalsByPeriodAndUser(this.period, this.surveyUser);
    await this.findCompetenciesByUserLevel(this.competencyLevel);
  }

  async findGoalsByPeriodAndUser(period: string, user: string) {
    return new Promise<void>((resolve) => {
      this.goalService.findAllGoalsByPeriodAndUser(period, user).subscribe((resp) => {
        this.goals = resp;
        resolve();
      });
    });
  }


  async findCompetenciesByUserLevel(competencyLevel: number) {
    return new Promise<void>((resolve) => {
      this.competencyService.findCompetencyByLevel(competencyLevel).subscribe((resp: any) => {
        this.competencies = resp.grouping;
        resolve();
      });
    });
  }

  initForm() {
    const formControls: { [key: string]: FormGroup } = {};

    this.goals.forEach((goal: any, index: any) => {
      formControls[`goal_${index}`] = this.fb.group({
        value: ['', Validators.required],
        description: [goal.description]
      });
    });


    this.competencies.forEach((competency: any, index: any) => {
      formControls[`ability_${index}`] = this.fb.group({
        value: ['', Validators.required],
        description: [competency]
      });
    });

    this.surveyForm = this.fb.group({ ...formControls, comentaries: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(250)]) });
    this.isFormReady = true;
  }

  sendSurvey() {
    if (!this.surveyForm.valid) {
      this.utilService.showSimpleToast('WARNING', 'Complete correctamente todas las preguntas de la evaluación.', 'warning');
      return;
    }

    const comentaries: string = this.surveyForm.controls['comentaries'].value;
    this.surveyForm.removeControl('comentaries');
    const formValue = this.surveyForm.value;
    const processedData = {
      competencies: Object.keys(formValue)
      .filter(key => key.startsWith('ability_'))
      .map(key => formValue[key] as SurveyItem),
      goals: Object.keys(formValue)
      .filter(key => key.startsWith('goal_'))
      .map(key => formValue[key] as SurveyItem)
      /* responses: Object.keys(formValue)
      .map(key => formValue[key] as SurveyItem ) */
      /* abilities: Object.keys(formValue)
      .filter(key => key.startsWith('ability_'))
      .map(key => formValue[key] as SurveyItem) */
    };

    
    const body = {
      userEvaluator: this.authService.user._id,
      userEvaluated: this.surveyUser,
      period: this.period,
      /* responses: processedData.responses, */
      competencies: processedData.competencies,
      goals: processedData.goals,
      comentaries
    };
    
    this.utilService.showLoading('Cargando...');
    this.surveyService.submitSurveyResponse(body).subscribe((resp) => {
      this.utilService.dismissLoading();
      this.approvalService.updateById(this.approvalId, { state: 'DONE' }).subscribe(() => {
        this.navCtrl.back();
      });
    }, (err) => {

      console.log(err);
      this.utilService.dismissLoading();
      this.utilService.showSimpleToast('ERROR', err.message, 'danger');
    });
  }

}
