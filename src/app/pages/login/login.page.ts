import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
// import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides, { static: true }) slides: IonSlides;
  public melanciaPosition: number = 0;
  private melanciaDifference: number = 200;
  public userLogin: User = {};
  public userRegister: User = {};
  private loading: any;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,

  ) { }

  ngOnInit() { }

  segmentChanged(event: any) {
    if (event.detail.value === 'login') {
      this.slides.slidePrev();
      this.melanciaPosition += this.melanciaDifference;
    } else {
      this.slides.slideNext();
      this.melanciaPosition -= this.melanciaDifference;
    }
  }

  async login() {
    await this.presentLoading();

    try {
      await this.authService.login(this.userLogin);
    } catch (error) {
      console.error(error);

      let message: string;

      switch (error.code) {
        case "auth/user-not-found":
          message = 'Endereço de e-mail não encontrado';
          break;

        case 'auth/wrong-password':
          message = 'Senha inválida';
          break;

        case 'auth/argument-error':
          message = 'Favor preencher todos os campos';
          break;
      }

      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
  }

  async register() {
    await this.presentLoading();

    try {
      await this.authService.register(this.userRegister);
    } catch (error) {
      console.error(error);
      let message: string;

      switch (error.code) {
        case "auth/email-already-in-use":
          message = 'Esse endereço de e-mail já está sendo utilizado';
          break;

        case 'auth/invalid-email':
          message = 'E-mail inválido';
          break;
      }

      this.presentToast(message);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Relaxa ai..' });
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}
