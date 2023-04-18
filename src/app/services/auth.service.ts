import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
import { Observable, map } from 'rxjs';

interface ILoginCredentials {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usersCollection: AngularFirestoreCollection<IUser>;
  isAuthenticated$: Observable<boolean>;
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection('users');
    this.isAuthenticated$ = auth.user.pipe(map((user) => !!user));
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
}
