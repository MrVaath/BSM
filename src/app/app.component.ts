import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';

// Pages
import { HomePage } from '../pages/home/home';

// Plugins
import { Keyboard } from '@ionic-native/keyboard';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any = HomePage;

  constructor(public platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private keyboard: Keyboard) {

    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      this.statusBar.styleDefault();
      this.splashScreen.hide(); 
      this.keyboard.disableScroll(true);
    });
  }
}
