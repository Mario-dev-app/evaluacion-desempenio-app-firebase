import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import OneSignal, { OSNotificationPermission } from 'onesignal-cordova-plugin';
import { environment } from '../../environments/environment.prod';
import { AlertController } from '@ionic/angular/standalone';

@Injectable({
  providedIn: 'root'
})
export class OnesignalService {

  constructor(
    private alertCtrl: AlertController
  ) { }

  async getOneSignalId() {
    return await OneSignal.User.getOnesignalId();
  }

  OneSignalInit() {
    OneSignal.initialize(environment.capacitor.app_id);

    let myClickListener = async (event: any) => {
      let notificationData = JSON.stringify(event);
      console.log(notificationData);
    }

    OneSignal.Notifications.addEventListener('click', myClickListener);
  }

  async OneSignalIOSPermission() {
    try {
      if (Capacitor.getPlatform() === 'ios') {
        const ios_permission = await OneSignal.Notifications.permissionNative();
        if (ios_permission !== OSNotificationPermission.Authorized) {
          this.OneSignalPermission();
        } else {
          this.requestPermission();
        }
      } else {
        //Para android
        this.OneSignalPermission();
      }
    } catch (error) {
      console.log(error);
    }
  }

  async OneSignalPermission(msg: string = '') {
    try {
      const hasPermission = await OneSignal.Notifications.getPermissionAsync();
      console.log('hasPermission', hasPermission);
      if (!hasPermission) {
        this.showAlert(msg);
      }
    } catch (error) {
      throw (error);
    }
  }

  async requestPermission() {
    try {
      const permission = await OneSignal.Notifications.canRequestPermission();
      console.log('permission', permission);
      if (permission) {

        const accept = await OneSignal.Notifications.requestPermission(true);
        console.log('User accepted notifications', accept);
      } else {
        console.log('Permission denied', permission);
        this.OneSignalPermission();
      }
    } catch (error) {
      throw (error);
    }
  }

  async showAlert(msg: string) {
    const alert = await this.alertCtrl.create({
      header: `Permitir notificaciones push ${msg}`,
      message: 'Por favor, permitir el envío de notificaciones para obtener las alertas de aprobación',
      buttons: [
        {
          text: 'No permitir',
          /* role: 'cancel', */
          handler: () => {
            console.log('Confirm Cancel');
            this.OneSignalPermission('(Es necesario)');
          }
        },
        {
          text: 'Permitir',
          handler: () => {
            this.requestPermission();
          }
        }
      ]
    });

    await alert.present();
  }

  login(external_id: string) {
    OneSignal.login(external_id);
  }

  logout() {
    OneSignal.logout();
  }
}
