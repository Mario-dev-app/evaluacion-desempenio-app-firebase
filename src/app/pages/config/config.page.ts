import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonText, IonCol, IonItem, IonButton, IonIcon, IonInput, IonImg, IonToast } from '@ionic/angular/standalone';
import { SimpleToolbarComponent } from 'src/app/components/simple-toolbar/simple-toolbar.component';
import { AuthService, UtilService } from 'src/app/services';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
  standalone: true,
  imports: [IonToast, IonImg, IonIcon, IonButton, IonItem, IonCol, IonText, IonRow, IonGrid, IonContent, IonHeader, IonTitle, IonInput, IonToolbar, CommonModule, ReactiveFormsModule, SimpleToolbarComponent]
})
export class ConfigPage implements OnInit {

  passwordVisible: boolean = false;

  confirmPasswordVisible: boolean = false;

  changePasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(5)])
  });

  constructor(
    private utilService: UtilService,
    private userService: UserService,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  updatePassword() {
    if(!this.changePasswordForm.valid) {
      this.utilService.showSimpleToast('INFORMATION', 'Complete el formulario con una contraseña de un mínimo de 5 dígitos.', 'primary');
      return;
    }

    const password = this.changePasswordForm.controls['password'].value?.trim();
    const confirmPassword = this.changePasswordForm.controls['confirmPassword'].value?.trim();

    if(password !== confirmPassword) {
      this.utilService.showSimpleToast('INFORMATION', 'Las contraseñas ingresadas no coinciden', 'primary');
      return;
    }

    this.userService.updateUserDataById(this.authService.user._id, { password }).subscribe((resp) => {
      this.changePasswordForm.reset();
      this.utilService.showSimpleToast('SUCCESS', 'Se actualizó la contraseña correctamente', 'success');
    }, (err) => {
      console.log(err);
      this.utilService.showSimpleToast('ERROR', err.message, 'danger');
    });
  }

}
