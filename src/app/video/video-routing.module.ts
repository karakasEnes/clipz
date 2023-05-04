import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageComponent } from './manage/manage.component';
import { UploadComponent } from './upload/upload.component';
import { ClipComponent } from '../clip/clip.component';
import { NotFoundComponent } from '../not-found/not-found.component';

const routes: Routes = [
  {
    path: 'manage',
    component: ManageComponent,
    data: {
      authOnly: true,
    },
  },

  {
    path: 'upload',
    component: UploadComponent,
    data: {
      authOnly: true,
    },
  },

  {
    path: 'clip/:id',
    component: ClipComponent,
  },

  {
    path: 'manage-clips',
    redirectTo: 'manage',
  },

  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VideoRoutingModule {}
