import { Component } from '@angular/core';
import { LoadingController, Loading, AlertController, ToastController, ActionSheetController } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';

// Plugins
import { AndroidFingerprintAuth } from '@ionic-native/android-fingerprint-auth';
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
  showFinger = false;
  show = true;
  hashing = '';

  message = {
    content: '',
    password: '',
    status: false
  };
  fingerPrintOptions = {
    clientId: 'MyApp',
    password: this.hashing,
    disableBackup: true
  };
  decryptConfig = {
    clientId: "MyApp",
    token: localStorage.getItem('token'),
    disableBackup: true
};

  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController, public toastCtrl: ToastController, public actionSheetCtrl: ActionSheetController,
    private androidFingerprintAuth: AndroidFingerprintAuth, private secureStorage: SecureStorage) {

    this.secureStorage.create('myMessage').then((storage: SecureStorageObject) => {
      alert('Utworzono myMessage store');
      this.storage = storage;
    });
  }

  // MESSAGE //
  // Save normal
  saveMessage() {
    this.showLoading();
    let hashing = Md5.hashStr(this.message.password);
    let hashingPass = hashing.toString();
    this.storage.set('content', this.message.content).then(data => console.log(data), error => console.log(error));
    this.storage.set('password', hashingPass).then(data => console.log(data), error => console.log(error));
    this.message.status = true;
    this.loading.dismiss();
  }

  // Save finger
  saveMessagePrint() {
    this.androidFingerprintAuth.isAvailable().then(
      (result) => {
        if(result.isAvailable) {
          // it is available
          let test = Md5.hashStr(this.message.password);
          this.hashing = test.toString();
          this.storage.set('content', this.message.content).then(data => console.log(data), error => console.log(error));
          this.storage.set('password', this.hashing).then(data => console.log(data), error => console.log(error));
          this.androidFingerprintAuth.encrypt(this.fingerPrintOptions).then(
            (result) => {
              if (result.withFingerprint) {
                this.message.status = true;
                this.showFinger = true;
                alert('Successfully encrypted credentials');
                alert('Encrypted credentials: ' + result.token);
                localStorage.setItem('token', result.token);
              } else alert('Didn\'t authenticate!');
            }
          ).catch(
            (error) => {
              if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                alert('Fingerprint authentication cancelled');
              } else console.error(error)
            });
        } else {
          // fingerprint auth isn't available
          alert('Sorry, fingerprint isn\'t available');
        }
      }
    ).catch(
      (error) => {
        alert(error);
      }
    );
  }

  // Check normal
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

  // Check finger
  checkPrint() {
    this.androidFingerprintAuth.isAvailable().then(
      (result) => {
        if(result.isAvailable) {
          // it is available
          this.storage.get('content').then(data => this.message.content = data);
          this.androidFingerprintAuth.decrypt(this.decryptConfig).then(
            (result) => {
              if (result.withFingerprint) {
                this.savedMessage = this.message.content;
                this.showMessage = true;
                this.accessPassword = '';
                alert('Successfully decrypted  credentials');
              } else alert('Didn\'t authenticate!');
            }
          ).catch(
            (error) => {
              if (error === this.androidFingerprintAuth.ERRORS.FINGERPRINT_CANCELLED) {
                alert('Fingerprint authentication cancelled');
              } else console.error(error)
            });
        } else {
          // fingerprint auth isn't available
          alert('Sorry, fingerprint isn\'t available');
        }
      }
    ).catch(
      (error) => {
        alert(error);
      }
    );
  }

  // Hide
  hideMess() {
    this.showMessage = false;
  }

  // ACCOUNT //
  // Alert - change password
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

  reset() {
    let alert = this.alertCtrl.create({
      title: 'Reset',
      inputs: [
        {
          name: 'password',
          type: "password",
          placeholder: 'Wpisz hasło'
        },
      ],
      buttons: [
        {
          text: 'Anuluj',
          role: 'cancel'
        },
        {
          text: 'Reset',
          handler: data => {
            if(data.password === '') {
              this.presentToast("Nie podałeś hasła");
            } else {
              this.storage.get('password').then(data => this.message.password = data);

              let hashingAccessPassword = Md5.hashStr(data.password);

              if(hashingAccessPassword === this.message.password) {

                this.showLoading();
                this.message.content = '';
                this.message.password = '';
                this.accessPassword = '';
                this.message.status = false;
                this.savedMessage = '';
                this.showMessage = false;
                this.showFinger = false;
                this.storage.clear();
                this.loading.dismiss();
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

  // ACTION SHEET //
  // Show
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
            this.reset();
          }
        }
      ]
    });
 
    actionSheet.present();
  }

  // LOADING //
  // Show
  showLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Proszę czekać...',
      duration: 2000
    });
    this.loading.present();
  }

  // TOASTS //
  // Error
  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 2000,
      position: "bottom",
      cssClass: "error"
    });
    toast.present();
  }

  // Success
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
