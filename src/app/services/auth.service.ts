import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import IUser from '../models/user.model';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  usersCollection: AngularFirestoreCollection<IUser>;
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {
    this.usersCollection = db.collection('users');
  }

  async createUser(formData: IUser) {
    if (!formData.password) {
      throw new Error('Password not provided!');
    }

    await this.auth.createUserWithEmailAndPassword(
      formData.email as string,
      formData.password as string
    );

    await this.usersCollection.add({
      name: formData.name,
      email: formData.email,
      age: formData.age,
      phoneNumber: formData.phoneNumber,
    });
  }
}
