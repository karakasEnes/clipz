import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable, map, delay, filter, switchMap, EMPTY } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

interface ILoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usersCollection: AngularFirestoreCollection<IUser>;
  isAuthenticated$: Observable<boolean>;
  isAuthenticatedWithDelay$: Observable<boolean>;
  private redirect = false;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(delay(1200));

    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationEnd),
        map((e) => this.route.firstChild),
        switchMap((route) => route?.data ?? EMPTY)
      )
      .subscribe((data) => {
        this.redirect = data?.['authOnly'] ?? false;
      });
  }

  async createUser(formData: IUser) {
    if (!formData.password) {
      throw new Error('Password not provided!');
    }

    const userCred = await this.auth.createUserWithEmailAndPassword(
      formData.email as string,
      formData.password as string
    );

    if (!userCred.user) {
      throw new Error('User is not exists!');
    }

    await this.usersCollection.doc(userCred.user.uid).set({
      name: formData.name,
      email: formData.email,
      age: formData.age,
      phoneNumber: formData.phoneNumber,
    });

    await userCred.user.updateProfile({
      displayName: formData.name,
    });
  }

  async loginUser(loginCredentials: ILoginCredentials) {
    await this.auth.signInWithEmailAndPassword(
      loginCredentials.email,
      loginCredentials.password
    );
  }

  async signOutWrapper() {
    await this.auth.signOut();
  }

  async getEmailsArray(email: string) {
    return await this.auth.fetchSignInMethodsForEmail(email);
  }

  async logout(e?: Event) {
    if (e) {
      e.preventDefault();
    }
    await this.signOutWrapper();

    if (this.redirect) {
      await this.router.navigateByUrl('/');
    }
  }
}
