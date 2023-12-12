import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService
  ) {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params?.['sort'] === '2' ? '2' : '1';
    });
  }

  ngOnInit(): void {
    this.clipService.getUserClips().subscribe(console.log);
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
}
