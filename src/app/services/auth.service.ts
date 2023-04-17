import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private db: AngularFirestore) {}

  async createUser(formData) {
    await this.auth.createUserWithEmailAndPassword(
      formData.email as string,
      formData.password as string
    );

    await this.db.collection('users').add({
      name: formData.name,
      email: formData.email,
      age: formData.age,
      phoneNumber: formData.phoneNumber,
    });
  }
}
