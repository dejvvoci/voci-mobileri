import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-card card">
        <div class="login-brand font-display">VOCI</div>
        <p class="login-sub">Paneli i administrimit</p>

        <div class="field">
          <label class="field-label">Email</label>
          <input type="email" [(ngModel)]="email" placeholder="admin@voci.al"
                 (keydown.enter)="login()"/>
        </div>
        <div class="field">
          <label class="field-label">Fjalëkalimi</label>
          <input [type]="showPw() ? 'text' : 'password'" [(ngModel)]="password"
                 placeholder="••••••••" (keydown.enter)="login()"/>
          <button class="show-pw" (click)="showPw.set(!showPw())" type="button">
            {{ showPw() ? 'Fshih' : 'Shfaq' }}
          </button>
        </div>

        @if (error()) {
          <div class="login-error">{{ error() }}</div>
        }

        <button class="btn btn-primary btn-lg" style="width:100%"
                (click)="login()" [disabled]="loading()">
          @if (loading()) { <span class="spinner" style="width:16px;height:16px;border-width:2px"></span> }
          Hyr në panel
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height:100vh; display:flex; align-items:center; justify-content:center;
      background:var(--bg); padding:24px;
    }
    .login-card { padding:40px; width:100%; max-width:400px; }
    .login-brand { font-size:28px; font-weight:700; color:var(--accent); letter-spacing:.08em; text-align:center; }
    .login-sub { text-align:center; color:var(--text-muted); font-size:14px; margin:6px 0 28px; }
    .field { display:flex; flex-direction:column; gap:6px; margin-bottom:16px; position:relative; }
    .field-label { font-size:13px; font-weight:500; color:var(--text-muted); }
    .show-pw { position:absolute; right:12px; bottom:11px; background:none; border:none; color:var(--text-muted); font-size:12px; }
    .login-error { background:rgba(168,75,42,.15); color:#E07050; border:1px solid rgba(168,75,42,.3); border-radius:var(--radius-sm); padding:10px 14px; font-size:13px; margin-bottom:14px; }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';
  loading = signal(false);
  error = signal('');
  showPw = signal(false);

  async login() {
    if (!this.email || !this.password) {
      this.error.set('Plotëso të gjitha fushat.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/admin']);
    } catch {
      this.error.set('Email ose fjalëkalim i gabuar.');
    } finally {
      this.loading.set(false);
    }
  }
}
