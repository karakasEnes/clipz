import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';
import IClip from 'src/app/models/clip.model';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  clips: IClip[] = [];
  activeClip: IClip | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modalService: ModalService
  ) {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params?.['sort'] === '2' ? '2' : '1';
    });
  }

  ngOnInit(): void {
    this.clipService.getUserClips().subscribe((docs) => {
      this.clips = [];

      docs.forEach((doc) => {
        this.clips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  sort(e: Event) {
    const { value } = e.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal(e: Event, clip: IClip) {
    e.preventDefault();
    this.activeClip = clip;
    this.modalService.toggleModal('editClip');
  }

  update(e: IClip) {
    this.clips.forEach((element, index) => {
      if (element.docID == e.docID) {
        this.clips[index].title = e.title;
      }
    });
  }
}
