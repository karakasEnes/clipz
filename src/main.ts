import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

import { AppModule } from './app/app.module';
import { environment } from './environments/environments';

firebase.initializeApp(environment.firebase);

let isAppStart = false;

firebase.auth().onAuthStateChanged(() => {
  if (!isAppStart) {
    platformBrowserDynamic()
      .bootstrapModule(AppModule)
      .catch((err) => console.error(err));
  }

  isAppStart = true;
});
