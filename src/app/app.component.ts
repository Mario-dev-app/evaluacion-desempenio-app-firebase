import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Platform } from '@ionic/angular/standalone';
import { OnesignalService } from './services';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {

  private platform = inject(Platform);
  private onesignal = inject(OnesignalService);

  constructor() {
    this.platform.ready().then(() => {
      if(Capacitor.getPlatform() !== 'web') this.onesignal.OneSignalInit();
    });
  }
}
