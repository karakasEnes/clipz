import { Component, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
})
export class ClipComponent {
  id = '';
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;

  constructor(public route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      this.id = params?.['id'];
    });
  }
}
