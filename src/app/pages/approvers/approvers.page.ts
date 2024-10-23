import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonGrid, 
  IonRow, 
  IonCol, 
  IonButton, 
  IonIcon, IonLabel, IonInput, IonItem, IonFab, IonFabButton, IonFabList } from '@ionic/angular/standalone';
import { SimpleToolbarComponent } from 'src/app/components/simple-toolbar/simple-toolbar.component';
import { UserService, UtilService } from 'src/app/services';
import { addIcons } from 'ionicons';
import { trash, add } from 'ionicons/icons';

@Component({
  selector: 'app-approvers',
  templateUrl: './approvers.page.html',
  styleUrls: ['./approvers.page.scss'],
  standalone: true,
  imports: [IonFabList, IonFabButton, IonFab, IonItem, IonInput, IonLabel, 
    IonIcon,
    IonButton,
    IonCol,
    IonRow,
    IonGrid,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    SimpleToolbarComponent,
  ]
})
export class ApproversPage implements OnInit {

  approversXusers: any;

  constructor(
    private userService: UserService,
    private utilService: UtilService
  ) {
    addIcons({ trash, add });
  }

  ngOnInit() {
    this.findAllApproversOfUsers();
  }

  findAllApproversOfUsers() {
    this.userService.findAllApproversOfUsers().subscribe((resp) => {
      this.approversXusers = resp;
    }, (err) => {
      this.utilService.showSimpleToast('ERROR', err.error.message, 'danger');
    });
  }

}
