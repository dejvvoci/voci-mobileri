import { Component, OnInit, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Category, Product } from '../../core/models/models';
import { environment } from '../../../environments/environment';

const WA_SVG = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- NAV -->
    <nav class="nav">
      <div class="container nav-inner">
        <a routerLink="/" class="logo">VOCI</a>
        <div class="nav-links">
          <a href="#punimet" class="nav-link">Punimet</a>
          <a routerLink="/rreth-nesh" class="nav-link">Rreth Nesh</a>
          <a href="#kontakt" class="nav-link">Kontakt</a>
          <a [href]="callLink()" class="btn btn-ghost btn-sm btn-pill nav-call">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
            </svg>
            Telefono
          </a>
          <a [href]="waLink('Informacion i përgjithshëm')" target="_blank" rel="noopener"
             class="btn btn-secondary btn-sm btn-pill nav-wa" [innerHTML]="waSvg + ' WhatsApp'">
          </a>
        </div>
        <button class="menu-btn" (click)="menuOpen.set(!menuOpen())">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            @if (menuOpen()) { <path d="M18 6L6 18M6 6l12 12"/> }
            @else { <path d="M3 12h18M3 6h18M3 18h18"/> }
          </svg>
        </button>
      </div>
      @if (menuOpen()) {
        <div class="mobile-menu">
          <a href="#punimet" class="mobile-link" (click)="menuOpen.set(false)">Punimet</a>
          <a routerLink="/rreth-nesh" class="mobile-link" (click)="menuOpen.set(false)">Rreth Nesh</a>
          <a href="#kontakt" class="mobile-link" (click)="menuOpen.set(false)">Kontakt</a>
          <a [href]="callLink()" class="mobile-link call-green">📞 Telefono</a>
          <a [href]="waLink('Informacion i përgjithshëm')" target="_blank" rel="noopener" class="mobile-link wa-green">
            WhatsApp
          </a>
        </div>
      }
    </nav>

    <!-- HERO -->
    <header class="hero">
      <div class="container hero-inner">
        <div class="hero-text">
          <span class="eyebrow">Punë dore · Sipas porosisë</span>
          <h1 class="hero-title">Mobilje që mbajnë<br><em>shenjën e drurit</em></h1>
          <p class="hero-sub">Çdo copë kalon nëpër duart e zejtarëve tanë — nga druri i zgjedhur me kujdes deri tek finitura e fundit.</p>
          <div class="hero-actions">
            <a href="#punimet" class="btn btn-primary btn-lg">
              Shiko punimet
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a [href]="waLink('Dëshiroj të flas për një projekt me porosi')" target="_blank" rel="noopener" class="btn btn-ghost btn-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Kontakto
            </a>
          </div>
        </div>
        <div class="hero-visual">
          @if (featuredProduct()) {
            <div class="hero-carousel">
              @for (p of featuredProducts(); track p.id; let i = $index) {
                <div class="hero-slide" [class.active]="heroSlide() === i">
                  @if (p.images[0]?.type === 'video') {
                    <video [src]="p.images[0]?.url" class="hero-img" autoplay muted loop playsinline></video>
                  } @else {
                    <img [src]="p.images[0]?.url" [alt]="p.title" class="hero-img"/>
                  }
                </div>
              }
            </div>
            <div class="hero-tag">
              <span class="eyebrow">Punë e fundit</span>
              <span class="hero-tag-title">{{ featuredProduct()!.title }}</span>
            </div>
            @if (featuredProducts().length > 1) {
              <div class="hero-dots">
                @for (p of featuredProducts(); track p.id; let i = $index) {
                  <button class="hero-dot" [class.active]="heroSlide() === i"
                          (click)="setHeroSlide(i)"></button>
                }
              </div>
            }
          } @else {
            <div class="hero-img-placeholder">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
            </div>
          }
        </div>
      </div>
    </header>

    <!-- FILTER BAR -->
    <div class="filter-bar-wrap" id="punimet">
      <div class="container filter-bar">
        <span class="filter-label eyebrow">Filtro:</span>
        <div class="chips-scroll">
          <button class="chip" [class.active]="activeCategory() === 'all'" (click)="setCategory('all')">Të gjitha</button>
          @for (cat of categories(); track cat.id) {
            <button class="chip" [class.active]="activeCategory() === cat.id" (click)="setCategory(cat.id!)">{{ cat.name }}</button>
          }
        </div>
      </div>
    </div>

    <!-- GALLERY -->
    <main class="gallery-section">
      <div class="container">
        @if (loading()) {
          <div class="loading-grid">
            @for (s of [1,2,3,4,5,6]; track s) {
              <div class="skeleton-card"><div class="skeleton-img"></div><div class="skeleton-body"><div class="skeleton-line w80"></div><div class="skeleton-line w50"></div></div></div>
            }
          </div>
        } @else if (filteredProducts().length === 0) {
          <div class="empty-state">
            <span class="empty-icon">🪑</span>
            <p class="empty-title">Asnjë punë në këtë kategori</p>
            <p class="empty-text">Shih kategoritë e tjera ose na kontakto direkt.</p>
          </div>
        } @else {
          <div class="gallery-grid">
            @for (p of filteredProducts(); track p.id) {
              <article class="product-card card">
                <!-- CAROUSEL -->
                <div class="carousel-wrap">
                  <div class="carousel-track" [style.transform]="'translateX(-' + (activeSlide[p.id!] || 0) * 100 + '%)'">
                    @for (img of p.images; track img.url) {
                      <div class="carousel-slide">
                        @if (img.type === 'video') {
                          <video [src]="img.url" muted loop playsinline></video>
                        } @else {
                          <img [src]="img.url" [alt]="p.title" loading="lazy"/>
                        }
                      </div>
                    }
                  </div>

                  <!-- PREV / NEXT -->
                  @if (p.images.length > 1) {
                    <button class="carousel-btn prev" (click)="prevSlide(p); $event.stopPropagation()" aria-label="Foto e mëparshme">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <button class="carousel-btn next" (click)="nextSlide(p); $event.stopPropagation()" aria-label="Foto tjetër">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                    <!-- DOTS -->
                    <div class="carousel-dots">
                      @for (img of p.images; track $index) {
                        <button class="dot" [class.active]="(activeSlide[p.id!] || 0) === $index"
                                (click)="setSlide(p, $index); $event.stopPropagation()"></button>
                      }
                    </div>
                  }

                  <span class="category-badge badge badge-muted">{{ p.categoryName }}</span>
                </div>

                <!-- CARD BODY -->
                <div class="card-body">
                  <h3 class="card-title font-display">{{ p.title }}</h3>
                  <div class="spec-tag">
                    <span class="spec-hole"></span>
                    <div class="spec-content">
                      <span class="spec-line">{{ p.material }}</span>
                      @if (p.dimensions) {
                        <span class="spec-line spec-dims">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 3H3v18M3 21l4-4m0 0l4 4m-4-4v-4"/></svg>
                          {{ p.dimensions }}
                        </span>
                      }
                    </div>
                  </div>
                  <div class="card-footer">
                    <span class="price font-display">{{ p.price ? (p.price + '€') : 'Pyet për çmim' }}</span>
                    <div class="card-actions">
                      <a [routerLink]="['/produkt', p.id]" class="btn btn-ghost btn-sm btn-pill detail-btn" title="Shiko detajet">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35M11 8v6M8 11h6"/></svg>
                        Detaje
                      </a>
                      <a [href]="waLinkProduct(p)" target="_blank" rel="noopener" class="btn btn-sm btn-pill wa-btn" title="Pyet në WhatsApp">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        Pyet
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            }
          </div>
        }
      </div>
    </main>

    <!-- FOOTER -->
    <footer class="footer" id="kontakt">
      <div class="container footer-inner">
        <div>
          <div class="footer-brand font-display">VOCI</div>
          <p class="footer-tagline">Mobileri artizanale me porosi — Tiranë, Shqipëri</p>
          <div style="display:flex;gap:12px;margin-top:18px;flex-wrap:wrap">
            <a [href]="waLink('Pershendetje! Jam i interesuar per mobiljet tuaja')" target="_blank" rel="noopener" class="btn btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
            </a>
            <a [href]="callLink()" class="btn btn-ghost">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              Telefono
            </a>
          </div>
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
      <a [href]="waLink('Pershendetje!')" target="_blank" rel="noopener" class="float-btn float-wa" aria-label="WhatsApp">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      </a>
    </div>
  `,
  styles: [`
    .nav { position:sticky; top:0; z-index:50; background:rgba(30,24,18,.92); backdrop-filter:blur(8px); border-bottom:1px solid var(--line); }
    .nav-inner { display:flex; align-items:center; justify-content:space-between; height:66px; }
    .logo { font-family:var(--font-display); font-size:22px; font-weight:700; letter-spacing:.08em; color:var(--accent); }
    .nav-links { display:flex; align-items:center; gap:16px; }
    .nav-link { font-size:14px; color:var(--text-muted); transition:color var(--transition); &:hover { color:var(--text); } }
    .nav-call { color:var(--text-muted); border-color:var(--line); }
    .nav-wa { gap:7px; }
    .menu-btn { display:none; background:none; border:none; color:var(--text); padding:4px; }
    .mobile-menu { border-top:1px solid var(--line); padding:16px 24px; display:flex; flex-direction:column; gap:14px; }
    .mobile-link { font-size:15px; color:var(--text-muted); }
    .wa-green { color:#4ADE80; }
    .call-green { color:#60A5FA; }

    .hero { padding:72px 0 60px; }
    .hero-inner { display:grid; grid-template-columns:1.1fr 0.9fr; gap:56px; align-items:center; }
    .hero-title { font-family:var(--font-display); font-weight:600; font-size:clamp(36px,5vw,62px); line-height:1.06; margin:.5rem 0 1.25rem; letter-spacing:-.01em; em { font-style:italic; color:var(--accent); } }
    .hero-sub { color:var(--text-muted); font-size:16px; line-height:1.75; max-width:440px; margin-bottom:2rem; }
    .hero-actions { display:flex; gap:14px; flex-wrap:wrap; }
    .hero-visual { border-radius:var(--radius-lg); overflow:hidden; aspect-ratio:4/5; border:1px solid var(--line); position:relative; background:var(--surface); }
    .hero-carousel { position:absolute; inset:0; }
    .hero-slide { position:absolute; inset:0; opacity:0; transition:opacity .8s ease; &.active { opacity:1; } }
    .hero-img { width:100%; height:100%; object-fit:cover; filter:saturate(.9) contrast(1.05); }
    .hero-img-placeholder { width:100%; height:100%; display:flex; align-items:center; justify-content:center; }
    .hero-tag { position:absolute; bottom:18px; left:18px; background:rgba(30,24,18,.88); backdrop-filter:blur(4px); border:1px solid var(--line); border-radius:var(--radius-sm); padding:10px 14px; display:flex; flex-direction:column; gap:4px; z-index:2; }
    .hero-tag-title { font-family:var(--font-display); font-size:14px; font-weight:600; }
    .hero-dots { position:absolute; bottom:18px; right:18px; display:flex; gap:6px; z-index:2; }
    .hero-dot { width:7px; height:7px; border-radius:50%; background:rgba(255,255,255,.35); border:none; cursor:pointer; padding:0; transition:background var(--transition), transform var(--transition); &.active { background:#fff; transform:scale(1.25); } }

    .filter-bar-wrap { position:sticky; top:66px; z-index:40; background:var(--bg); border-bottom:1px solid var(--line); padding:14px 0; }
    .filter-bar { display:flex; align-items:center; gap:10px; }
    .filter-label { flex-shrink:0; margin-right:4px; }
    .chips-scroll { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; padding-bottom:2px; &::-webkit-scrollbar { display:none; } }
    .chip { flex-shrink:0; padding:8px 16px; border-radius:var(--radius-pill); border:1px solid var(--line); background:var(--surface); color:var(--text-muted); font-size:13px; font-weight:500; cursor:pointer; transition:all var(--transition); &:hover { border-color:var(--accent); color:var(--text); } &.active { background:var(--accent); color:#1A1208; border-color:var(--accent); font-weight:600; } }

    .gallery-section { padding:40px 0 80px; }
    .gallery-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }
    .loading-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:28px; }

    /* CAROUSEL */
    .product-card { cursor:default; transition:transform var(--transition), border-color var(--transition); &:hover { transform:translateY(-4px); border-color:var(--accent); } }
    .carousel-wrap { position:relative; aspect-ratio:4/3; overflow:hidden; background:var(--surface-2); }
    .carousel-track { display:flex; height:100%; transition:transform .35s cubic-bezier(.4,0,.2,1); }
    .carousel-slide { flex-shrink:0; width:100%; height:100%; img, video { width:100%; height:100%; object-fit:cover; display:block; } }

    .carousel-btn {
      position:absolute; top:50%; transform:translateY(-50%);
      width:32px; height:32px; border-radius:50%;
      background:rgba(30,24,18,.75); backdrop-filter:blur(4px);
      border:1px solid var(--line); color:var(--text);
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      opacity:0; transition:opacity var(--transition), background var(--transition);
      z-index:2;
      &:hover { background:rgba(30,24,18,.95); }
    }
    .carousel-wrap:hover .carousel-btn { opacity:1; }
    .prev { left:10px; }
    .next { right:10px; }

    .carousel-dots { position:absolute; bottom:10px; left:50%; transform:translateX(-50%); display:flex; gap:5px; z-index:2; }
    .dot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.4); border:none; cursor:pointer; padding:0; transition:background var(--transition), transform var(--transition); &.active { background:#fff; transform:scale(1.3); } }

    .category-badge { position:absolute; top:10px; left:10px; z-index:2; }

    .card-body { padding:18px; display:flex; flex-direction:column; gap:12px; }
    .card-title { font-size:19px; font-weight:600; margin:0; line-height:1.2; }

    .spec-tag { display:flex; align-items:center; gap:8px; background:var(--surface-2); border:1px dashed var(--line); border-radius:var(--radius-sm); padding:8px 10px; transform:rotate(-.5deg); width:fit-content; max-width:100%; }
    .spec-hole { flex-shrink:0; width:8px; height:8px; border-radius:50%; background:var(--bg); border:1px solid var(--line); }
    .spec-content { display:flex; flex-direction:column; gap:2px; min-width:0; }
    .spec-line { font-family:var(--font-mono); font-size:11px; color:var(--text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .spec-dims { display:flex; align-items:center; gap:4px; color:var(--olive); }

    .card-footer { display:flex; align-items:center; justify-content:space-between; margin-top:2px; flex-wrap:wrap; gap:8px; }
    .price { font-size:17px; font-weight:600; }
    .card-actions { display:flex; gap:7px; }
    .detail-btn { background:var(--surface-2); color:var(--text-muted); border-color:var(--line); gap:5px; &:hover { color:var(--text); border-color:var(--accent); } }
    .wa-btn { background:var(--olive); color:#1A1D12; gap:6px; &:hover { background:#7B8560 !important; } }

    .skeleton-card { border-radius:var(--radius-md); overflow:hidden; border:1px solid var(--line); }
    .skeleton-img { aspect-ratio:4/3; background:var(--surface); animation:shimmer 1.4s ease infinite; }
    .skeleton-body { padding:18px; display:flex; flex-direction:column; gap:10px; }
    .skeleton-line { height:14px; border-radius:4px; background:var(--surface); animation:shimmer 1.4s ease infinite; }
    .w80 { width:80%; } .w50 { width:50%; }
    @keyframes shimmer { 0%,100% { opacity:.5; } 50% { opacity:.9; } }

    .footer { border-top:1px solid var(--line); padding:56px 0 36px; }
    .footer-inner { display:flex; justify-content:space-between; align-items:flex-end; gap:24px; flex-wrap:wrap; }
    .footer-brand { font-size:24px; font-weight:700; color:var(--accent); }
    .footer-tagline { color:var(--text-muted); font-size:14px; margin-top:6px; }
    .footer-meta { font-size:11px; color:var(--text-faint); line-height:2; text-align:right; p { margin:0; } }

    /* FLOATING BUTTONS */
    .float-btns { position:fixed; bottom:24px; right:24px; z-index:60; display:flex; flex-direction:column; gap:12px; }
    .float-btn { width:52px; height:52px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:var(--shadow-lg); transition:transform var(--transition); &:hover { transform:translateY(-2px) scale(1.05); } }
    .float-wa { background:var(--olive); color:#1A1D12; }
    .float-call { background:var(--surface-2); color:var(--text); border:1px solid var(--line); }

    @media (max-width:960px) {
      .hero-inner { grid-template-columns:1fr; }
      .hero-visual { order:-1; aspect-ratio:16/9; }
      .gallery-grid,.loading-grid { grid-template-columns:repeat(2,1fr); }
      .carousel-btn { opacity:1; }
    }
    @media (max-width:640px) {
      .nav-links { display:none; }
      .menu-btn { display:block; }
      .gallery-grid,.loading-grid { grid-template-columns:1fr; }
      .hero { padding:36px 0 40px; }
      .footer-inner { flex-direction:column; align-items:flex-start; }
      .footer-meta { text-align:left; }
    }
  `]
})
export class HomeComponent implements OnInit, OnDestroy {
  private svc = inject(ProductService);
  categories = signal<Category[]>([]);
  allProducts = signal<Product[]>([]);
  loading = signal(true);
  activeCategory = signal<string>('all');
  menuOpen = signal(false);
  heroSlide = signal(0);
  year = new Date().getFullYear();
  waSvg = WA_SVG;
  private heroTimer: ReturnType<typeof setInterval> | null = null;

  // Carousel state: productId -> slideIndex
  activeSlide: Record<string, number> = {};

  filteredProducts = computed(() => {
    const cat = this.activeCategory();
    return cat === 'all' ? this.allProducts() : this.allProducts().filter(p => p.categoryId === cat);
  });

  // Të gjitha punimet me featured=true dhe me foto — për hero carousel
  featuredProducts = computed(() =>
    this.allProducts().filter(p => p.featured && p.images.length > 0)
  );

  // Punimi aktual në hero sipas slideIndex
  featuredProduct = computed(() => {
    const list = this.featuredProducts();
    if (list.length > 0) return list[this.heroSlide() % list.length];
    // Fallback: punimi i parë me foto nëse asnjë nuk është featured
    return this.allProducts().find(p => p.images.length > 0) || null;
  });

  ngOnInit() {
    this.svc.getCategories().subscribe(cats => this.categories.set(cats));
    this.svc.getProducts().subscribe(products => {
      const cats = this.categories();
      const withNames = products.map(p => ({
        ...p,
        categoryName: cats.find(c => c.id === p.categoryId)?.name || p.categoryId
      }));
      this.allProducts.set(withNames);
      this.loading.set(false);
      this.startHeroTimer();
    });
  }

  ngOnDestroy() {
    if (this.heroTimer) clearInterval(this.heroTimer);
  }

  private startHeroTimer() {
    if (this.heroTimer) clearInterval(this.heroTimer);
    this.heroTimer = setInterval(() => {
      const len = this.featuredProducts().length;
      if (len > 1) {
        this.heroSlide.set((this.heroSlide() + 1) % len);
      }
    }, 4000); // ndërrohet çdo 4 sekonda
  }

  setHeroSlide(i: number) {
    this.heroSlide.set(i);
    // Rinicio timerin pas klikimit manual
    this.startHeroTimer();
  }

  setCategory(id: string) { this.activeCategory.set(id); }

  nextSlide(p: Product) {
    const cur = this.activeSlide[p.id!] || 0;
    this.activeSlide = { ...this.activeSlide, [p.id!]: (cur + 1) % p.images.length };
  }
  prevSlide(p: Product) {
    const cur = this.activeSlide[p.id!] || 0;
    this.activeSlide = { ...this.activeSlide, [p.id!]: (cur - 1 + p.images.length) % p.images.length };
  }
  setSlide(p: Product, idx: number) {
    this.activeSlide = { ...this.activeSlide, [p.id!]: idx };
  }

  callLink(): string {
    return `tel:+${environment.whatsappNumber}`;
  }

  waLink(title: string): string {
    const msg = `Përshëndetje Mobileri VOCI! ${title}`;
    return `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }

  waLinkProduct(p: Product): string {
    const url = `${window.location.origin}/produkt/${p.id}`;
    const msg = `Përshëndetje Mobileri VOCI! Jam i interesuar për punimin:\n*${p.title}*\n${url}\n\nA mund të marr më shumë informacion?`;
    return `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }
}