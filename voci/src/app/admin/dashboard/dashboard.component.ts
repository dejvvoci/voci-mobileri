import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, RouterLinkActive],
  template: `
    <div class="admin-shell">

      <!-- SIDEBAR -->
      <aside class="sidebar" [class.open]="sidebarOpen()">

        <div class="sidebar-header">
          <div class="sidebar-brand-row">
            <span class="sidebar-brand font-display">VOCI</span>
            <span class="sidebar-role-badge">Admin</span>
          </div>
          <button class="sidebar-close" (click)="sidebarOpen.set(false)" aria-label="Mbyll menunë">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- PRIMARY ACTION -->
        <div class="sidebar-action-wrap">
          <a routerLink="/admin/produkte/shto"
             class="btn btn-primary sidebar-action-btn"
             (click)="sidebarOpen.set(false)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Shto punë të re
          </a>
        </div>

        <div class="sidebar-divider"></div>

        <!-- NAVIGATION -->
        <nav class="sidebar-nav">
          <p class="nav-section-label">Menaxhim</p>

          <a routerLink="/admin/produkte"
             routerLinkActive="active"
             [routerLinkActiveOptions]="{ exact: false }"
             class="nav-item"
             (click)="sidebarOpen.set(false)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <rect x="3" y="3" width="7" height="7" rx="1"/>
              <rect x="14" y="3" width="7" height="7" rx="1"/>
              <rect x="3" y="14" width="7" height="7" rx="1"/>
              <rect x="14" y="14" width="7" height="7" rx="1"/>
            </svg>
            <span>Punimet</span>
            <span class="nav-item-count">{{ productCount() }}</span>
          </a>

          <a routerLink="/admin/kategori"
             routerLinkActive="active"
             class="nav-item"
             (click)="sidebarOpen.set(false)">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
            <span>Kategoritë</span>
          </a>
        </nav>

        <div class="sidebar-divider"></div>

        <!-- FOOTER LINKS -->
        <div class="sidebar-footer-nav">
          <p class="nav-section-label">Tjetër</p>

          <a routerLink="/" target="_blank" class="nav-item nav-item-muted">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Shiko website-in</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-left:auto;opacity:.4">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </a>

          <button class="nav-item nav-item-danger" (click)="logout()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            <span>Dilni</span>
          </button>
        </div>

      </aside>

      <!-- OVERLAY (mobile) -->
      @if (sidebarOpen()) {
        <div class="overlay" (click)="sidebarOpen.set(false)"></div>
      }

      <!-- MAIN CONTENT -->
      <div class="admin-main">

        <!-- TOPBAR -->
        <header class="admin-topbar">
          <div class="topbar-left">
            <button class="menu-toggle btn btn-ghost btn-icon"
                    (click)="sidebarOpen.set(!sidebarOpen())"
                    aria-label="Hap menunë">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
            <span class="topbar-page font-display">{{ pageTitle() }}</span>
          </div>

          <div class="topbar-right">
            <!-- Buton "Shto" shfaqet vetëm në faqen e listës -->
            @if (isProductList()) {
              <a routerLink="/admin/produkte/shto"
                 class="btn btn-primary btn-sm topbar-add-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
                Shto
              </a>
            }
          </div>
        </header>

        <!-- PAGE CONTENT -->
        <div class="admin-content">
          <router-outlet/>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .admin-shell {
      display: flex;
      min-height: 100vh;
      background: var(--bg);
    }

    /* ── SIDEBAR ─────────────────────────────────────────────── */
    .sidebar {
      width: 256px;
      flex-shrink: 0;
      background: var(--surface);
      border-right: 1px solid var(--line);
      display: flex;
      flex-direction: column;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
    }

    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 18px 16px;
      border-bottom: 1px solid var(--line);
      flex-shrink: 0;
    }
    .sidebar-brand-row { display: flex; align-items: center; gap: 10px; }
    .sidebar-brand { font-size: 20px; font-weight: 700; color: var(--accent); letter-spacing: .08em; }
    .sidebar-role-badge {
      font-family: var(--font-mono);
      font-size: 10px; letter-spacing: .1em; text-transform: uppercase;
      background: var(--accent-glow); color: var(--accent);
      border: 1px solid rgba(200,145,60,.25);
      padding: 3px 8px; border-radius: var(--radius-pill);
    }
    .sidebar-close {
      display: none;
      background: none; border: none; color: var(--text-muted);
      cursor: pointer; padding: 4px; border-radius: var(--radius-sm);
      transition: color var(--transition);
      &:hover { color: var(--text); }
    }

    /* PRIMARY ACTION BUTTON */
    .sidebar-action-wrap { padding: 16px 14px 12px; flex-shrink: 0; }
    .sidebar-action-btn {
      width: 100%;
      justify-content: center;
      gap: 8px;
      padding: 11px 16px;
      font-size: 14px;
    }

    .sidebar-divider { height: 1px; background: var(--line); margin: 0; flex-shrink: 0; }

    /* NAV */
    .sidebar-nav {
      padding: 14px 10px 8px;
      display: flex; flex-direction: column; gap: 2px;
      flex-shrink: 0;
    }
    .sidebar-footer-nav {
      padding: 14px 10px 20px;
      display: flex; flex-direction: column; gap: 2px;
      margin-top: auto;
    }

    .nav-section-label {
      font-family: var(--font-mono);
      font-size: 10px; letter-spacing: .14em; text-transform: uppercase;
      color: var(--text-faint); padding: 0 10px 8px; margin: 0;
    }

    .nav-item {
      display: flex; align-items: center; gap: 11px;
      padding: 11px 12px; border-radius: var(--radius-sm);
      color: var(--text-muted); font-size: 14px; font-weight: 500;
      transition: background var(--transition), color var(--transition);
      cursor: pointer; border: none; background: none;
      text-align: left; width: 100%; text-decoration: none;

      &:hover { background: var(--surface-2); color: var(--text); }
      &.active {
        background: var(--accent-glow);
        color: var(--accent);
        border: 1px solid rgba(200,145,60,.15);
      }
    }
    .nav-item-muted { color: var(--text-faint); font-size: 13px; }
    .nav-item-danger {
      color: var(--text-faint); font-size: 13px;
      &:hover { background: rgba(168,75,42,.1); color: #E07050; }
    }
    .nav-item-count {
      margin-left: auto;
      font-family: var(--font-mono); font-size: 11px;
      background: var(--surface-3); color: var(--text-faint);
      padding: 2px 7px; border-radius: var(--radius-pill);
    }

    /* ── TOPBAR ──────────────────────────────────────────────── */
    .admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }

    .admin-topbar {
      height: 58px;
      border-bottom: 1px solid var(--line);
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 20px;
      background: var(--surface);
      position: sticky; top: 0; z-index: 10;
      flex-shrink: 0;
    }
    .topbar-left { display: flex; align-items: center; gap: 12px; }
    .topbar-right { display: flex; align-items: center; gap: 10px; }
    .menu-toggle { display: none; }
    .topbar-page { font-size: 17px; font-weight: 600; color: var(--text); }
    .topbar-add-btn { display: none; }

    /* ── CONTENT ─────────────────────────────────────────────── */
    .admin-content { flex: 1; padding: 28px 24px; overflow-y: auto; }

    /* ── OVERLAY ─────────────────────────────────────────────── */
    .overlay { display: none; }

    /* ── MOBILE ──────────────────────────────────────────────── */
    @media (max-width: 768px) {
      .sidebar {
        position: fixed; left: 0; top: 0; bottom: 0; z-index: 100;
        transform: translateX(-100%);
        transition: transform 0.25s cubic-bezier(0.4,0,0.2,1);
        height: 100%;
        &.open { transform: translateX(0); box-shadow: var(--shadow-lg); }
      }
      .sidebar-close { display: flex; }
      .overlay {
        display: block; position: fixed; inset: 0;
        z-index: 90; background: rgba(0,0,0,.65);
        animation: fadeIn .2s ease;
      }
      .menu-toggle { display: flex; }
      .topbar-add-btn { display: inline-flex; }
      .admin-content { padding: 20px 16px; }
    }
  `]
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  sidebarOpen = signal(false);
  productCount = signal(0);
  currentUrl = signal('');

  constructor() {
    // Gjurmo URL-në aktuale për titullin dhe butonat kontekstualë
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: any) => {
      this.currentUrl.set(e.urlAfterRedirects);
      this.sidebarOpen.set(false); // mbyll sidebar pas navigimit në mobile
    });
    this.currentUrl.set(this.router.url);
  }

  pageTitle(): string {
    const url = this.currentUrl();
    if (url.includes('/produkte/shto'))    return 'Shto punë të re';
    if (url.includes('/produkte/ndrysho')) return 'Ndrysho punën';
    if (url.includes('/produkte'))         return 'Punimet';
    if (url.includes('/kategori'))         return 'Kategoritë';
    return 'Panel Admin';
  }

  isProductList(): boolean {
    const url = this.currentUrl();
    return url.endsWith('/produkte') || url.endsWith('/admin');
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/admin/login']);
  }
}
