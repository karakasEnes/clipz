import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import IClip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClipInput: IClip | null = null;
  inSubmission = false;
  showAlert = false;
  alertColor = 'blue';
  alertMsg = 'Please wait! Updating clip.';

  clipIdFC = new FormControl('', {
    nonNullable: true,
  });

  titleFC = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editFG = new FormGroup({
    title: this.titleFC,
    id: this.clipIdFC,
  });

  constructor(
    private modalService: ModalService,
    private clipService: ClipService
  ) {}
  ngOnInit(): void {
    this.modalService.register('editClip');
  }

  ngOnDestroy(): void {
    this.modalService.unregister('editClip');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClipInput) {
      return;
    }

    this.clipIdFC.setValue(this.activeClipInput.docID as string);
    this.titleFC.setValue(this.activeClipInput.title);
  }

  async submitEdit() {
    this.inSubmission = true;
    this.showAlert = true;
    this.alertColor = 'blue';

    this.alertMsg = 'Please wait! Updating clip.';

    try {
      await this.clipService.updateClip(
        this.clipIdFC.value,
        this.titleFC.value
      );
    } catch (e) {
      this.inSubmission = false;
      this.alertColor = 'red';
      this.alertMsg = 'Something went wrong. Try again later!';
      return;
    }

    this.inSubmission = false;
    this.alertColor = 'green';
    this.alertMsg = 'Success!';
  }
}
