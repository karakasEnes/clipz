import { Component } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent {
  videoOrder = '1';

  constructor(private router: Router, private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params?.['sort'] === '2' ? '2' : '1';
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
}
