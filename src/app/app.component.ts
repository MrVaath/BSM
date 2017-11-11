import { Component } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { MessagePage } from '../pages/message/message';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, app: App) {

    platform.ready().then(() => {

      if(localStorage.getItem('status') == 'true') {
        app.getActiveNav().setRoot(MessagePage);
        statusBar.styleDefault();
        splashScreen.hide();
      } else {
        statusBar.styleDefault();
        splashScreen.hide();  
      }
    });
  }
}
