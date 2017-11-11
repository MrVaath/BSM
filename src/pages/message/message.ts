import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, ActionSheetController, LoadingController, Loading } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';

import { HomePage } from '../home/home';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {

  loading: Loading;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController, public loadingCtrl: LoadingController) {

  }

  message = {
    content: '',
    password: '',
    status: ""
  }

  accessPassword : any;
  savedMessage = '';
  showMessage = false;

  checkPassword(){
    
    let message = JSON.parse(localStorage.getItem('myMessage'));

    //MD5 is one way hashing algorythm. It’s not decryptable.
    let hashingAccessPassword = Md5.hashStr(this.accessPassword);

    if(hashingAccessPassword === message.password){
      this.savedMessage = message.content;
      this.showMessage = true;
      this.accessPassword = "";
    }
    else{
      this.presentToast("Podane hasło jest nieprawidłowe");
    }
  }

  hideMess() {
    this.showMessage = false;
  }

  createNewPassword(){
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
            if(data.password === '') {
              this.presentToast("Nie podałeś nowego hasła!")
            } else {
              let message = JSON.parse(localStorage.getItem('myMessage'));
              let hashingAccessPassword = Md5.hashStr(data.oldPassword);
              if(hashingAccessPassword === message.password) {
                let hashingPass = Md5.hashStr(data.password);
                localStorage.setItem('myMessage', JSON.stringify(
                  { 
                    content: message.content, 
                    password: hashingPass
                  }
                ));
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
            localStorage.clear();
            this.navCtrl.setRoot(HomePage);
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