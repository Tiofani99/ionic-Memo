import { Component } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  posts: any;

  constructor(
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) { }

  ionViewWillEnter() {
    this.getPosts();
  }

  async getPosts() {
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    try {
      this.firestore.collection("posts")
        .snapshotChanges()
        .subscribe(data => {
          this.posts = data.map(e => {
            return {
              id: e.payload.doc.id,
              title: e.payload.doc.data()["title"],
              details: e.payload.doc.data()["details"]
            };
          });
        });

      (await loader).dismiss();

    } catch (e) {
      this.showToast(e);
    }
  }

  async deletePost(id: string) {
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();
    try {
      await this.firestore.doc("posts/" + id).delete();
    } catch (e) {
      this.showToast(e);
    }

    (await loader).dismiss();

  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

}
