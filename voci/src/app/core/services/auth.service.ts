import { Injectable, inject } from '@angular/core';
import {
  Auth, signInWithEmailAndPassword,
  signOut, user, User
} from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);

  currentUser$: Observable<User | null> = user(this.auth);
  isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(map(u => !!u));

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
  }
}
