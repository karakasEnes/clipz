import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { last } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  isDragover = false;
  file: File | null = null;
  isFormVisible = false;

  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Your clip is being uploaded';
  inSubmission = false;
  percentage = 0;
  showPercentage = false;

  titleFC = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadFG = new FormGroup({
    title: this.titleFC,
  });

  constructor(private storage: AngularFireStorage) {}

  storeFile(e: Event) {
    this.isDragover = false;

    this.file = (e as DragEvent).dataTransfer?.files.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.titleFC.setValue(this.file.name.replace(/.[^/.]+$/, ''));

    this.isFormVisible = true;
  }

  uploadFile() {
    this.showAlert = true;
    this.alertColor = 'blue';
    this.alertMsg = 'Please wait! Your clip is being uploaded';
    this.inSubmission = true;
    this.showPercentage = true;

    const uniqueFileName = uuidv4();
    //Angular will understand automatically we want to store in sub-folder.
    const clipPath = `clips/${uniqueFileName}.mp4`;
    const uploadTask = this.storage.upload(clipPath, this.file);

    uploadTask.percentageChanges().subscribe((progress) => {
      this.percentage = (progress as number) / 100;
    });

    uploadTask
      .snapshotChanges()
      .pipe(last())
      .subscribe({
        next: (snapshot) => {
          this.alertColor = 'green';
          this.alertMsg = 'Success! Your clip is ready to be share with world!';
          this.showPercentage = false;
        },

        error: (error) => {
          this.alertColor = 'red';
          this.alertMsg = 'Upload failed! Please try again later!';
          this.inSubmission = true;
          this.showPercentage = false;
          console.log(error);
        },
      });
  }
}
