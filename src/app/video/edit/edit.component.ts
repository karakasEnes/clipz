import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy {
  @Input() activeClipInput: IClip | null = null;
  constructor(private modalService: ModalService) {}
  ngOnInit(): void {
    this.modalService.register('editClip');
  }

  ngOnDestroy(): void {
    this.modalService.unregister('editClip');
  }
}
