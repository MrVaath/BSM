import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { Md5 } from 'ts-md5/dist/md5';

import { MessagePage } from '../message/message';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  loading: Loading;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController) {

  }

  message = {
    content: '',
    password: '',
    status: "false"
  }

  saveMessage() {

    this.showLoading();
    let hashingPass = Md5.hashStr(this.message.password);
    localStorage.setItem('myMessage', JSON.stringify({
      content: this.message.content, 
      password: hashingPass
    }));
    this.message.status = "true";
    localStorage.setItem('status', this.message.status);
    this.navCtrl.setRoot(MessagePage);
    this.loading.dismiss();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Proszę czekać...',
      duration: 2000
    });
    this.loading.present();
  }
}
