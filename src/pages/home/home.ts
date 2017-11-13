import { Component } from '@angular/core';
import { LoadingController, Loading, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';
import { SecureStorage, SecureStorageObject } from '@ionic-native/secure-storage';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  loading: Loading;
  storage: SecureStorageObject;

  accessPassword : any;
  savedMessage = '';
  showMessage = false;

  message = {
    content: '',
    password: '',
    status: false
  }

  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, private secureStorage: SecureStorage) {

    this.secureStorage.create('myMessage').then((storage: SecureStorageObject) => {
      alert('Utworzono myMessage store');
      this.storage = storage;
    });
  }

  saveMessage() {

    this.showLoading();
    let hashing = Md5.hashStr(this.message.password);
    let hashingPass = hashing.toString();
    this.storage.set('content', this.message.content).then(data => console.log(data), error => console.log(error));
    this.storage.set('password', hashingPass).then(data => console.log(data), error => console.log(error));   
    this.message.status = true;
    this.loading.dismiss();
  }

  checkPassword() {
    
    this.storage.get('content').then(data => this.message.content = data);
    this.storage.get('password').then(data => this.message.password = data);
    let hashingAccessPassword = Md5.hashStr(this.accessPassword);

    if(hashingAccessPassword === this.message.password) {
      this.savedMessage = this.message.content;
      this.showMessage = true;
      this.accessPassword = "";
    }
    else {
      this.presentToast("Podane hasło jest nieprawidłowe");
    }
  }

  hideMess() {
    this.showMessage = false;
  }

  createNewPassword() {
    let alert = this.alertCtrl.create({
      title: 'Zmiana hasła',
      inputs: [
        {
          name: 'oldPassword',
          type: "password",
          placeholder: 'Stare hasło'
        },
        {
          name: 'password',
          type: "password",
          placeholder: 'Nowe hasło'
        },
      ],
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel'
        },
        {
          text: 'Zmień hasło',
          handler: data => {
            if((data.oldPassword === '') && (data.password === '')) {
              this.presentToast("Nie podałeś żadnego hasła!");
            } else if(data.password === '') {
              this.presentToast("Nie podałeś nowego hasła!");
            } else {
              this.storage.get('content').then(data => this.message.content = data);
              this.storage.get('password').then(data => this.message.password = data);

              let hashingAccessPassword = Md5.hashStr(data.oldPassword);

              if(hashingAccessPassword === this.message.password) {

                let hashing = Md5.hashStr(data.password);
                let hashingPass = hashing.toString();
                this.storage.set('content', this.message.content).then(data => console.log('Data set content: ' + data), error => console.log(error));
                this.storage.set('password', hashingPass).then(data => console.log('Data set password: ' + data), error => console.log(error));
                this.presentSuccess("Udało się zmienić hasło");
              } else {
                this.presentToast("Podane hasło jest nieprawidłowe");
              }
            }
          }
        }
      ]
    });
    alert.present();
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Ustawienia',
      buttons: [
        {
          text: 'Zmień hasło',
          handler: () => {
            this.createNewPassword();
          }
        },
        {
          text: 'Reset',
          handler: () => {
            this.showLoading();
            this.storage.clear();
            this.message.status = false;
            this.loading.dismiss();
          }
        }
      ]
    });
 
    actionSheet.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Proszę czekać...',
      duration: 2000
    });
    this.loading.present();
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: "bottom",
      cssClass: "error"
    });
    toast.present();
  }

  private presentSuccess(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: "bottom",
      cssClass: "success"
    });
    toast.present();
  }
}
