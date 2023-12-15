import { Component, OnDestroy } from '@angular/core';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { combineLatest, switchMap, forkJoin } from 'rxjs';
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
  screenshots: string[] = [];
  selectedScreenshot = '';
  uploadTaskScreenshot?: AngularFireUploadTask;

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

  async storeFile(e: Event) {
    if (this.ffmpegService.isRunning) {
      return;
    }
    this.isDragover = false;

    this.file = (e as DragEvent).dataTransfer
      ? (e as DragEvent).dataTransfer?.files.item(0) ?? null
      : (e.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);

    this.selectedScreenshot = this.screenshots[0];

    this.titleFC.setValue(this.file.name.replace(/.[^/.]+$/, ''));

    this.isFormVisible = true;
  }

  async uploadFile() {
    this.uploadFG.disable();
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded';
    this.inSubmission = true;
    this.showPercentage = true;

    const uniqueFileName = uuidv4();
    //Angular will understand automatically we want to store in sub-folder.
    const clipPath = `clips/${uniqueFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    );
    const screenshotPath = `screenshots/${uniqueFileName}.png`;

    this.uploadTask = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    this.uploadTaskScreenshot = this.storage.upload(
      screenshotPath,
      screenshotBlob
    );
    const screenshotRef = this.storage.ref(screenshotPath);

    combineLatest(
      this.uploadTask.percentageChanges(),
      this.uploadTaskScreenshot.percentageChanges()
    ).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;
      if (!clipProgress || !screenshotProgress) {
        return;
      }

      const total = clipProgress + screenshotProgress;

      this.percentage = (total as number) / 200;
    });

    forkJoin([
      this.uploadTask.snapshotChanges(),
      this.uploadTaskScreenshot.snapshotChanges(),
    ])
      .pipe(
        switchMap(() =>
          forkJoin([clipRef.getDownloadURL(), screenshotRef.getDownloadURL()])
        )
      )
      .subscribe({
        next: async (urls) => {
          const [clipURL, screenshotURL] = urls;
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.titleFC.value,
            fileName: `${uniqueFileName}.mp4`,
            url: clipURL,
            screenshotURL,
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
