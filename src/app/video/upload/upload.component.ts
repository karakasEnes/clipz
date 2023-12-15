import { Component, OnDestroy } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { last, switchMap } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ClipService } from 'src/app/services/clip.service';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/compat/app';
import { FfmpegService } from 'src/app/services/ffmpeg.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragover = false;
  file: File | null = null;
  isFormVisible = false;

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your clip is being uploaded';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;
  user: firebase.User | null = null;
  uploadTask?: AngularFireUploadTask;

  titleFC = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadFG = new FormGroup({
    title: this.titleFC,
  });

  constructor(
    private storage: AngularFireStorage,
    private authService: AuthService,
    private clipService: ClipService,
    private router: Router,
    public ffmpegService: FfmpegService
  ) {
    this.authService.getAuthedUser().subscribe((user) => (this.user = user));
    this.ffmpegService.init();
  }

  ngOnDestroy(): void {
    this.uploadTask?.cancel();
  }

  storeFile(e: Event) {
    this.isDragover = false;

    this.file = (e as DragEvent).dataTransfer
      ? (e as DragEvent).dataTransfer?.files.item(0) ?? null
      : (e.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.titleFC.setValue(this.file.name.replace(/.[^/.]+$/, ''));

    this.isFormVisible = true;
  }

  uploadFile() {
    this.uploadFG.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded';
    this.inSubmission = true;
    this.showPercentage = true;

    const uniqueFileName = uuidv4();
    //Angular will understand automatically we want to store in sub-folder.
    const clipPath = `clips/${uniqueFileName}.mp4`;
    this.uploadTask = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    this.uploadTask.percentageChanges().subscribe((progress) => {
      this.percentage = (progress as number) / 100;
    });

    this.uploadTask
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.titleFC.value,
            fileName: `${uniqueFileName}.mp4`,
            url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };

          const clipDocRef = await this.clipService.createClip(clip);

          this.alertColor = 'green';
          this.alertMsg = 'Success! Your clip is ready to be share with world!';
          this.showPercentage = false;

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1500);
        },

        error: (error) => {
          this.uploadFG.enable();
          this.alertColor = 'red';
          this.alertMsg = 'Upload failed! Please try again later!';
          this.inSubmission = true;
          this.showPercentage = false;
          console.log(error);
        },
      });
  }
}
