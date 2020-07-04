import { Component, OnInit } from '@angular/core';
import { ToastController, LoadingController, NavController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Post } from '../models/post.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.page.html',
  styleUrls: ['./edit-page.page.scss'],
})
export class EditPagePage implements OnInit {
  post = {} as Post;
  id: any;

  constructor(
    private actroute: ActivatedRoute,
    private toastCtrl: ToastController,
    private loadingCtrl: LoadingController,
    private firestore: AngularFirestore,
    private afAuth: AngularFireAuth,
    private navCtrl: NavController
  ) {
    this.id = this.actroute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.getPostById(this.id);
  }

  async getPostById(id: string) {
    let loader = this.loadingCtrl.create({
      message: "Please wait..."
    });
    (await loader).present();

    try {
      this.firestore.doc("posts/" + id)
        .valueChanges()
        .subscribe(data => {
          this.post.title = data['title'];
          this.post.details = data['details'];
        });
    } catch (error) {
      this.showToast(error);
    }
    (await loader).dismiss();
  }

  async updatePost(post: Post){
    if(this.formValidation()){
      let loader = this.loadingCtrl.create({
        message: "Please wait..."
      });
      (await loader).present();

      try {
        await this.firestore.doc("posts/"+this.id)
        .update(post);
      } catch (e) {
        this.showToast(e);
      }

      (await loader).dismiss();
      this.navCtrl.navigateRoot("home");
    }
  }

  showToast(message: string) {
    this.toastCtrl.create({
      message: message,
      duration: 3000
    }).then(toastData => toastData.present());
  }

  formValidation() {
    if (!this.post.title) {
      this.showToast("Enter Title");
      return false;
    }

    if (!this.post.details) {
      this.showToast("Enter Details");
      return false;
    }

    return true;
  }

}
