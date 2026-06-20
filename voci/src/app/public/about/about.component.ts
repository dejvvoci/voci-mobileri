import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <!-- NAV -->
    <nav class="nav">
      <div class="container nav-inner">
        <a routerLink="/" class="logo">VOCI</a>
        <div class="nav-links">
          <a routerLink="/" class="nav-link">Punimet</a>
          <a routerLink="/rreth-nesh" class="nav-link active">Rreth Nesh</a>
          <a href="#kontakt" class="nav-link">Kontakt</a>
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
          <a routerLink="/rreth-nesh" class="mobile-link active-mobile" (click)="menuOpen=false">Rreth Nesh</a>
          <a href="#kontakt" class="mobile-link" (click)="menuOpen=false">Kontakt</a>
          <a [href]="callLink()" class="mobile-link">📞 Telefono</a>
          <a [href]="waLink()" target="_blank" rel="noopener" class="mobile-link wa-green">WhatsApp</a>
        </div>
      }
    </nav>

    <!-- HERO SECTION -->
    <section class="about-hero">
      <div class="container about-hero-inner">
        <div class="hero-content">
          <span class="eyebrow">Që nga viti 1999</span>
          <h1 class="hero-title font-display">
            25 vjet punë,<br>
            <em>mijëra shtëpi të mobiluara</em>
          </h1>
          <p class="hero-lead">
            VOCI është mobileria artizanale shqiptare me traditë njëçerek shekulli.
          </p>
        </div>
        <div class="hero-stats">
          <div class="stat-card card">
            <span class="stat-number font-display">25+</span>
            <span class="stat-label">Vjet eksperience</span>
          </div>
          <div class="stat-card card">
            <span class="stat-number font-display">500+</span>
            <span class="stat-label">Projekte të realizuara</span>
          </div>
          <div class="stat-card card">
            <span class="stat-number font-display">12+</span>
            <span class="stat-label">Profesioniste te rinj ne treg</span>
          </div>
          <div class="stat-card card">
            <span class="stat-number font-display">100%</span>
            <span class="stat-label">Punë dore</span>
          </div>
        </div>
      </div>
    </section>

    <!-- HISTORIA -->
    <section class="section">
      <div class="container section-grid">
        <div class="section-text">
          <span class="eyebrow">Historia jonë</span>
          <p class="section-body">
            Çdo gjë nisi me pasionin e një zejtari dhe disa cope dru. Vitet e para u ndërtuan
            mbi besimin e klientëve të parë — të cilët donin mobilje me cilësi,
            jo prodhim masiv. Sot, pas 25 vitesh, filosofia mbetet e njëjtë: çdo punë trajtohet
            si projekt unik.
          </p>
        </div>
        <div class="timeline">
        
        </div>
      </div>
    </section>

    <!-- VLERAT TONA -->
    <section class="section section-alt">
      <div class="container">
        <div class="section-header-center">
          <span class="eyebrow">Pse VOCI</span>
          <h2 class="section-title-center font-display">Çfarë na bën të veçantë</h2>
        </div>
        <div class="values-grid">
          @for (v of values; track v.title) {
            <div class="value-card card">
              <div class="value-icon">{{ v.icon }}</div>
              <h3 class="value-title font-display">{{ v.title }}</h3>
              <p class="value-text">{{ v.text }}</p>
            </div>
          }
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="cta-section" id="kontakt">
      <div class="container cta-inner">
        <div class="cta-text">
          <span class="eyebrow">Fillo projektin tënd</span>
          <h2 class="cta-title font-display">Kemi eksperiencën.<br>Na trego vizionin tënd.</h2>
          <p class="cta-sub">Konsultimi i parë është falas. Na kontakto dhe diskutojmë projektin tënd.</p>
        </div>
        <div class="cta-actions">
          <a [href]="waLink()" target="_blank" rel="noopener" class="btn btn-primary btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Na kontakto në WhatsApp
          </a>
          <a [href]="callLink()" class="btn btn-ghost btn-lg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            Telefono direkt
          </a>
          <a routerLink="/" class="btn btn-ghost btn-lg">Shiko punimet tona</a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
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
    .about-hero { padding:72px 0 64px; border-bottom:1px solid var(--line); }
    .about-hero-inner { display:grid; grid-template-columns:1fr 1fr; gap:56px; align-items:center; }
    .hero-title { font-size:clamp(34px,4.5vw,58px); font-weight:600; line-height:1.06; margin:.5rem 0 1.25rem; letter-spacing:-.01em; em { font-style:italic; color:var(--accent); } }
    .hero-lead { color:var(--text-muted); font-size:16px; line-height:1.75; max-width:460px; }
    .hero-stats { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .stat-card { padding:22px 18px; text-align:center; }
    .stat-number { display:block; font-size:36px; font-weight:700; color:var(--accent); line-height:1; }
    .stat-label { display:block; font-size:12px; color:var(--text-muted); margin-top:6px; line-height:1.4; }

    /* SECTIONS */
    .section { padding:72px 0; }
    .section-alt { background:var(--surface); border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding:72px 0; }
    .section-grid { display:grid; grid-template-columns:1fr 1fr; gap:64px; align-items:start; }
    .section-text { position:sticky; top:100px; }
    .section-title { font-size:clamp(24px,3vw,36px); font-weight:600; line-height:1.15; margin:.5rem 0 1.25rem; }
    .section-body { color:var(--text-muted); font-size:15px; line-height:1.8; margin-bottom:14px; strong { color:var(--text); } }
    .section-header-center { text-align:center; margin-bottom:40px; }
    .section-title-center { font-size:clamp(24px,3vw,36px); font-weight:600; margin:.5rem 0 .75rem; }
    .section-sub-center { color:var(--text-muted); font-size:15px; max-width:480px; margin:0 auto; }

    /* TIMELINE */
    .timeline { display:flex; flex-direction:column; gap:0; }
    .timeline-item { display:flex; gap:20px; padding:20px 0; border-bottom:1px solid var(--line-soft); &:last-child { border-bottom:none; } }
    .timeline-year { font-size:13px; font-weight:600; color:var(--accent); min-width:52px; padding-top:2px; letter-spacing:.04em; }
    .timeline-title { font-family:var(--font-display); font-size:15px; font-weight:600; margin:0 0 5px; }
    .timeline-text { font-size:13px; color:var(--text-muted); line-height:1.65; margin:0; }

    /* VALUES */
    .values-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; }
    .value-card { padding:28px 22px; }
    .value-icon { font-size:32px; margin-bottom:14px; display:block; }
    .value-title { font-size:17px; font-weight:600; margin:0 0 10px; }
    .value-text { font-size:14px; color:var(--text-muted); line-height:1.7; margin:0; }

    /* MATERIALS */
    .materials-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; }
    .material-tag { padding:18px 14px; text-align:center; display:flex; flex-direction:column; gap:6px; }
    .material-icon { font-size:26px; }
    .material-name { font-size:14px; font-weight:600; }
    .material-origin { font-size:10px; color:var(--text-faint); letter-spacing:.08em; text-transform:uppercase; }

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
      .about-hero-inner { grid-template-columns:1fr; }
      .section-grid { grid-template-columns:1fr; }
      .section-text { position:static; }
      .cta-inner { grid-template-columns:1fr; }
      .values-grid { grid-template-columns:repeat(2,1fr); }
      .materials-grid { grid-template-columns:repeat(3,1fr); }
    }
    @media (max-width:640px) {
      .nav-links { display:none; }
      .menu-btn { display:block; }
      .about-hero { padding:40px 0 48px; }
      .hero-stats { grid-template-columns:1fr 1fr; }
      .values-grid { grid-template-columns:1fr; }
      .materials-grid { grid-template-columns:repeat(2,1fr); }
      .footer-inner { flex-direction:column; align-items:flex-start; }
      .footer-meta { text-align:left; }
    }
  `]
})
export class AboutComponent {
  year = new Date().getFullYear();
  menuOpen = false;

//   timeline = [
//     { year: '1999', title: 'Fillimi', text: 'Hapja e punishtes familjare në Korçë — me pasion për drurin dhe shumë ambicie.' },
//     { year: '2003', title: 'Zgjerimi', text: 'Rritje e ekipit dhe hapja e degës në Tiranë.' },
//     { year: '2022', title: 'Eksperienca ndërkombëtare', text: 'Projektet e para jashtë vendit: mobilim vilash private në Itali dhe Greqi me standarde europiane.' },
//   ];

  values = [
    { icon: '🌟', title: 'Lëndë Premium', text: 'Punojmë vetëm me dru masiv të certifikuar dhe material importi. Cilësia fillon nga zgjedhja e drurit të parë.' },
    { icon: '✋', title: 'Punë Dore', text: 'Çdo detaj kryhet me dorë nga zejtarë me përvojë. Makineritë ndihmojnë precizionin, por dora e njeriut jep shpirtin.' },
    { icon: '📐', title: 'Dizajn me Porosi', text: 'Asnjë projekt nuk kopjohet. Çdo mobilje projektohet bazuar në hapësirën, stilin dhe nevojën specifike të klientit.' },
    { icon: '🌍', title: 'Standarde Europiane', text: 'Eksperienca ndërkombëtare na ka dhënë perspektivë. Aplikojmë standarde dhe tendenca të tregut europian.' },
    { icon: '🤝', title: 'Besueshmëri', text: 'Transparencë totale nga konsultimi i parë deri tek dorëzimi.' },
    { icon: '🔧', title: 'Garanci & Shërbim', text: 'Mbrojmë çdo punë me garanci dhe ofrojmë shërbim dhe mbështetje pas dorëzimit. Jemi këtu edhe pas dorëzimit.' },
  ];

  callLink() { return `tel:+${environment.whatsappNumber}`; }
  waLink() {
    const msg = 'Përshëndetje VOCI! Dëshiroj të diskutoj një projekt mobilimi.';
    return `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }
}