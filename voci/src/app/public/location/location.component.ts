import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- NAV -->
    <nav class="nav">
      <div class="container nav-inner">
        <a routerLink="/" class="logo">VOCI</a>
        <div class="nav-links">
          <a routerLink="/" class="nav-link">Punimet</a>
          <a routerLink="/rreth-nesh" class="nav-link">Rreth Nesh</a>
          <a routerLink="/lokacioni" class="nav-link active">Lokacioni</a>
          <a [href]="callLink()" class="btn btn-ghost btn-sm btn-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            Telefono
          </a>
          <a [href]="waLink()" target="_blank" rel="noopener" class="btn btn-secondary btn-sm btn-pill">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        </div>
        <button class="menu-btn" (click)="menuOpen = !menuOpen">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path [attr.d]="menuOpen ? 'M18 6L6 18M6 6l12 12' : 'M3 12h18M3 6h18M3 18h18'"/>
          </svg>
        </button>
      </div>
      @if (menuOpen) {
        <div class="mobile-menu">
          <a routerLink="/" class="mobile-link" (click)="menuOpen=false">Punimet</a>
          <a routerLink="/rreth-nesh" class="mobile-link" (click)="menuOpen=false">Rreth Nesh</a>
          <a routerLink="/lokacioni" class="mobile-link active-mobile" (click)="menuOpen=false">Lokacioni</a>
          <a [href]="callLink()" class="mobile-link">📞 Telefono</a>
          <a [href]="waLink()" target="_blank" rel="noopener" class="mobile-link wa-green">WhatsApp</a>
        </div>
      }
    </nav>

    <!-- HERO -->
    <section class="loc-hero">
      <div class="container loc-hero-inner">
        <span class="eyebrow">Na vizito</span>
        <h1 class="hero-title font-display">Na gjeni <em>këtu</em></h1>
        <p class="hero-lead">Punishtja jonë ndodhet në Tiranë. Jemi gjithmonë të disponueshëm — mjafton të na telefononi për të caktuar një vizitë.</p>
      </div>
    </section>

    <!-- MAP -->
    <section class="section">
      <div class="container map-layout">
        <div class="map-embed-wrap">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2996.8044782204324!2d19.7732025752014!3d41.3131169006001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1350312de4b670b5%3A0x6694a1b13990e105!2sVoci%20Mobileri!5e0!3m2!1sen!2s!4v1784234187520!5m2!1sen!2s"
            width="100%" height="100%" style="border:0" allowfullscreen="" loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin" title="Lokacioni i VOCI Mobileri">
          </iframe>
        </div>

        <div class="loc-info">
          <div class="loc-info-card card">
            <span class="loc-info-icon">📍</span>
            <h3 class="loc-info-title">Adresa</h3>
            <p class="loc-info-text">Voci Mobileri, Tiranë, Shqipëri</p>
          </div>
          <div class="loc-info-card card">
            <span class="loc-info-icon">🕒</span>
            <h3 class="loc-info-title">Ora e vizitës</h3>
            <p class="loc-info-text">Jemi gjithmonë të disponueshëm — na telefononi kur të duash dhe caktojmë kohën bashkë.</p>
          </div>
          <div class="loc-info-card card">
            <span class="loc-info-icon">🚗</span>
            <h3 class="loc-info-title">Vjen me makinë?</h3>
            <p class="loc-info-text">Përdor butonin "Udhëzime" në Google Maps më sipër për rrugën më të shpejtë.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section">
      <div class="container cta-inner">
        <div>
          <h2 class="cta-title font-display">Gati për një vizitë?</h2>
          <p class="cta-sub">Na kontakto për të caktuar një kohë, ose thjesht kalo pa lajmërim gjatë orëve të punës.</p>
        </div>
        <div class="cta-actions">
          <a [href]="waLink()" target="_blank" rel="noopener" class="btn btn-primary btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Shkruaj në WhatsApp
          </a>
          <a [href]="callLink()" class="btn btn-ghost btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            Telefono direkt
          </a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer" id="kontakt">
      <div class="container footer-inner">
        <div>
          <div class="footer-brand font-display">VOCI</div>
          <p class="footer-tagline">Mobileri artizanale me porosi — Tiranë, Shqipëri</p>
        </div>
        <div class="footer-meta font-mono">
          <p>© {{ year }} VOCI</p>
          <p>Tiranë, Shqipëri</p>
        </div>
      </div>
    </footer>

    <!-- FLOATING BUTTONS -->
    <div class="float-btns">
      <a [href]="callLink()" class="float-btn float-call" aria-label="Telefono">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
      </a>
      <a [href]="waLink()" target="_blank" rel="noopener" class="float-btn float-wa" aria-label="WhatsApp">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>
  `,
  styles: [`
    /* NAV */
    .nav { position:sticky; top:0; z-index:50; background:rgba(30,24,18,.92); backdrop-filter:blur(8px); border-bottom:1px solid var(--line); }
    .nav-inner { display:flex; align-items:center; justify-content:space-between; height:66px; }
    .logo { font-family:var(--font-display); font-size:22px; font-weight:700; letter-spacing:.08em; color:var(--accent); }
    .nav-links { display:flex; align-items:center; gap:16px; }
    .nav-link { font-size:14px; color:var(--text-muted); transition:color var(--transition); &:hover { color:var(--text); } &.active { color:var(--accent); } }
    .menu-btn { display:none; background:none; border:none; color:var(--text); padding:4px; }
    .mobile-menu { border-top:1px solid var(--line); padding:16px 24px; display:flex; flex-direction:column; gap:14px; }
    .mobile-link { font-size:15px; color:var(--text-muted); } .active-mobile { color:var(--accent); } .wa-green { color:#4ADE80; }

    /* HERO */
    .loc-hero { padding:72px 0 48px; border-bottom:1px solid var(--line); text-align:center; }
    .loc-hero-inner { max-width:560px; margin:0 auto; }
    .hero-title { font-size:clamp(34px,4.5vw,52px); font-weight:600; line-height:1.1; margin:.5rem 0 1rem; em { font-style:italic; color:var(--accent); } }
    .hero-lead { color:var(--text-muted); font-size:16px; line-height:1.75; }

    /* MAP */
    .section { padding:64px 0; }
    .map-layout { display:grid; grid-template-columns:1.4fr 1fr; gap:32px; align-items:start; }
    .map-embed-wrap { border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--line); aspect-ratio:4/3; background:var(--surface-2); }
    .loc-info { display:flex; flex-direction:column; gap:16px; }
    .loc-info-card { padding:20px; }
    .loc-info-icon { font-size:24px; display:block; margin-bottom:8px; }
    .loc-info-title { font-size:15px; font-weight:600; margin:0 0 6px; }
    .loc-info-text { font-size:13px; color:var(--text-muted); line-height:1.65; margin:0; }

    /* CTA */
    .cta-section { padding:80px 0; background:var(--surface); border-top:1px solid var(--line); }
    .cta-inner { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
    .cta-title { font-size:clamp(26px,3.5vw,42px); font-weight:600; line-height:1.1; margin:.5rem 0 .75rem; }
    .cta-sub { color:var(--text-muted); font-size:15px; line-height:1.7; }
    .cta-actions { display:flex; flex-direction:column; gap:12px; }

    /* FOOTER */
    .footer { border-top:1px solid var(--line); padding:48px 0 32px; }
    .footer-inner { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; flex-wrap:wrap; }
    .footer-brand { font-size:22px; font-weight:700; color:var(--accent); }
    .footer-tagline { color:var(--text-muted); font-size:14px; margin-top:6px; }
    .footer-meta { font-size:11px; color:var(--text-faint); line-height:2; text-align:right; p { margin:0; } }

    /* FLOATING */
    .float-btns { position:fixed; bottom:24px; right:24px; z-index:60; display:flex; flex-direction:column; gap:12px; }
    .float-btn { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:var(--shadow-lg); transition:transform var(--transition); &:hover { transform:translateY(-2px) scale(1.05); } }
    .float-wa { background:var(--olive); color:#1A1D12; }
    .float-call { background:var(--surface-2); color:var(--text); border:1px solid var(--line); }

    /* RESPONSIVE */
    @media (max-width:960px) {
      .map-layout { grid-template-columns:1fr; }
      .map-embed-wrap { aspect-ratio:16/9; }
      .cta-inner { grid-template-columns:1fr; }
    }
    @media (max-width:640px) {
      .nav-links { display:none; }
      .menu-btn { display:block; }
      .loc-hero { padding:40px 0 36px; }
      .footer-inner { flex-direction:column; align-items:flex-start; }
      .footer-meta { text-align:left; }
    }
  `]
})
export class LocationComponent {
  year = new Date().getFullYear();
  menuOpen = false;

  callLink() { return `tel:+${environment.whatsappNumber}`; }
  waLink() {
    const msg = 'Përshëndetje VOCI! Dëshiroj të vizitoj punishten tuaj.';
    return `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }
}
