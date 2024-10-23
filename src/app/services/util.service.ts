import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController
  ) { }

  async presentSimpleAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          role: 'confirm'
        }
      ]
    });

    await alert.present();
  }

  async presentAlertWithAcceptHandler(subHeader: string, acceptHandler: Function) {
    const alert = await this.alertCtrl.create({
      header: 'ALERTA',
      subHeader,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'cancel-alert-btn'
        },
        {
          text: 'Aceptar',
          role: 'confirm',
          handler: () => acceptHandler()
        }
      ]
    });

    await alert.present();
  }

  async showLoading(message: string) {
    const loading = await this.loadingCtrl.create({
      message
    });

    await loading.present();
  }

  async dismissLoading() {
    await this.loadingCtrl.dismiss();
  }

  async showSimpleToast(header: string, message: string, color: string) {
    const toast = await this.toastCtrl.create({
      header,
      message,
      duration: 1500,
      color,
      position: 'bottom',
      cssClass: 'text-white'
    });

    await toast.present();
  }


}
