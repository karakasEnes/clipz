import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js/dist/video.min';

@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ClipComponent implements OnInit {
  id = '';
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  player?: videojs.Player;

  constructor(public route: ActivatedRoute) {
    this.route.params.subscribe((params: Params) => {
      this.id = params?.['id'];
    });
  }

  ngOnInit(): void {
    this.player = videojs(this.target?.nativeElement);
  }
}
