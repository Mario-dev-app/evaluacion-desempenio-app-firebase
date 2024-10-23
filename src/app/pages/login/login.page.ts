import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonText, 
  IonGrid, 
  IonCol, 
  IonRow, 
  IonImg, 
  IonItem, 
  IonIcon, 
  IonButton,
  IonInput, 
  IonAlert, IonLoading, IonToast } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { person, eye, eyeOff } from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { AuthService, OnesignalService, UserService, UtilService } from '../../../app/services';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonToast, IonLoading, IonAlert, 
    IonButton, 
    IonIcon, 
    IonItem, 
    IonImg, 
    IonRow, 
    IonCol, 
    IonGrid, 
    IonText, 
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonInput,
    CommonModule, 
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LoginPage implements OnInit{

  showPassword: boolean = false;

  onesignal_id?: string | null;

  loginForm = new FormGroup({
    username: new FormControl('mperalta', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('MP1234', [Validators.required, Validators.minLength(3)])
  });

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private utilService: UtilService,
    private userService: UserService,
    private onesignal: OnesignalService
  ) {
    addIcons({ person, eye, eyeOff });
  }

  async ngOnInit() {
    await this.onesignal.OneSignalIOSPermission();
  }


  changeInputType() {
    this.showPassword = !this.showPassword;
  }

  async signIn() {
    if(!this.loginForm.valid) {
      this.utilService.presentSimpleAlert('Información', 'Rellene correctamente el usuario y la contraseña.');
      return;
    }

    if(Capacitor.getPlatform() !== 'web') {
      this.onesignal_id = await this.onesignal.getOneSignalId();
    }

    this.utilService.showLoading('Cargando...');

    const username = this.loginForm.controls['username'].value!.trim().toLocaleLowerCase();
    const password = this.loginForm.controls['password'].value!;

    this.authService.signIn(username, password, this.onesignal_id).subscribe((resp: any) => {
      this.authService.user = resp.user;
      this.authService.token = resp.token;
      this.utilService.dismissLoading();
      /* if(resp.user.role === 'ADMIN') {
        this.navCtrl.navigateForward('/admin');
      }else {
        this.navCtrl.navigateForward('/home');
      } */
      this.navCtrl.navigateForward('/home');
    }, (err) => {
      this.utilService.dismissLoading();
      this.utilService.presentSimpleAlert('Error', err.error.message);
    });
  }

  async resetPasswordAlert() {
    if(this.loginForm.controls['username'].value!.length < 3) {
      this.utilService.showSimpleToast('INFORMATION', 'Debe colocar su usuario en la caja de texto', 'primary');
      return;
    }

    this.utilService.showLoading('Cargando...');
    const username = this.loginForm.controls['username'].value!;

    this.userService.resetPasswordByUsername(username).subscribe((resp) => {
      this.utilService.dismissLoading();
      this.utilService.presentSimpleAlert('INFORMATION', 'Se envió la nueva contraseña al correo registrado.');
    }, (err) => {
      this.utilService.dismissLoading();
      this.utilService.showSimpleToast('ERROR', err.error.message, 'danger');
    });

  }

}
