import { Component } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
    const uniqueFileName = uuidv4();
    //Angular will understand automatically we want to store in sub-folder.
    const clipPath = `clips/${uniqueFileName}.mp4`;
    this.storage.upload(clipPath, this.file);
  }
}
