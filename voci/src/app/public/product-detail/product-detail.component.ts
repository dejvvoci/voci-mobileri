import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { FavoritesPanelComponent } from '../../shared/favorites-panel.component';
import { Product } from '../../core/models/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FavoritesPanelComponent],
  template: `
    <nav class="top-nav">
      <div class="container">
        <a routerLink="/" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Kthehu te punimet
        </a>
        <div class="top-nav-right">
          <button class="nav-fav" (click)="favPanelOpen.set(true)" aria-label="Të preferuarat">
            <svg width="18" height="18" viewBox="0 0 24 24" [attr.fill]="favorites.ids().length ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            @if (favorites.ids().length > 0) { <span class="nav-fav-badge">{{ favorites.ids().length }}</span> }
          </button>
          <a routerLink="/" class="logo font-display">VOCI</a>
        </div>
      </div>
    </nav>

    @if (loading()) {
      <div class="container loading-wrap"><div class="spinner"></div></div>
    } @else if (product()) {
      <div class="container detail-layout">

        <!-- GALLERY COL -->
        <div class="gallery-col">
          <!-- MAIN IMAGE -->
          <div class="main-img-wrap">
            @if (product()!.images[activeImg()]?.type === 'video') {
              <video [src]="product()!.images[activeImg()]?.url" class="main-img" controls></video>
            } @else {
              <img [src]="product()!.images[activeImg()]?.url"
                   [alt]="product()!.title" class="main-img"/>
            }

            <button class="fav-toggle" [class.active]="favorites.has(product()!.id!)"
                    (click)="favorites.toggle(product()!.id!)"
                    [attr.aria-label]="favorites.has(product()!.id!) ? 'Hiq nga të preferuarat' : 'Shto te të preferuarat'">
              <svg width="18" height="18" viewBox="0 0 24 24" [attr.fill]="favorites.has(product()!.id!) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>

            <!-- PREV/NEXT arrows -->
            @if (product()!.images.length > 1) {
              <button class="img-arrow prev" (click)="prevImg()" aria-label="Foto e mëparshme">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              </button>
              <button class="img-arrow next" (click)="nextImg()" aria-label="Foto tjetër">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </button>
              <div class="img-counter font-mono">{{ activeImg() + 1 }} / {{ product()!.images.length }}</div>
            }
          </div>

          <!-- THUMBNAILS -->
          @if (product()!.images.length > 1) {
            <div class="thumbs">
              @for (img of product()!.images; track $index) {
                <button class="thumb" [class.active]="activeImg() === $index"
                        (click)="activeImg.set($index)">
                  @if (img.type === 'video') {
                    <video [src]="img.url" muted></video>
                  } @else {
                    <img [src]="img.url" [alt]="'Foto ' + ($index + 1)"/>
                  }
                </button>
              }
            </div>
          }
        </div>

        <!-- INFO COL -->
        <div class="info-col">
          <span class="badge badge-muted eyebrow" style="font-size:10px;width:fit-content">
            {{ product()!.categoryName }}
          </span>
          <h1 class="detail-title font-display">{{ product()!.title }}</h1>

          <div class="spec-grid">
            <div class="spec-item">
              <span class="spec-key eyebrow" style="font-size:10px">Material</span>
              <span class="spec-val">{{ product()!.material }}</span>
            </div>
            
          @if (product()!.dimensions) {
            <div class="spec-item">
              <span class="spec-key eyebrow" style="font-size:10px">Përmasa</span>
              <span class="spec-val">{{ product()!.dimensions }}</span>
            </div>
          }
          </div>

          @if (product()!.description) {
            <p class="description">{{ product()!.description }}</p>
          }

          <div class="price-row">
            <span class="detail-price font-display">
              {{ product()!.price ? (product()!.price + '€') : 'Çmim me marrëveshje' }}
            </span>
            @if (!product()!.price) {
              <span class="price-note">Na kontaktoni për ofertë</span>
            }
          </div>

          <!-- CTA BUTTONS -->
          <div class="cta-stack">
            <a [href]="waLinkProduct()" target="_blank" rel="noopener" class="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Pyet në WhatsApp
            </a>
            <a [href]="callLink()" class="btn btn-ghost btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8a19.79 19.79 0 01-3.07-8.7A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              Telefono direkt
            </a>
            <a routerLink="/" class="btn btn-ghost btn-lg">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Shiko punime të tjera
            </a>
          </div>
        </div>
      </div>

      <!-- RELATED PRODUCTS -->
      @if (related().length > 0) {
        <div class="container related-section">
          <h2 class="related-title font-display">Shiko edhe këto</h2>
          <div class="related-grid">
            @for (r of related(); track r.id) {
              <a [routerLink]="['/produkt', r.id]" class="related-card card">
                <div class="related-img-wrap">
                  @if (r.images[0]?.type === 'video') {
                    <video [src]="r.images[0]?.url" muted></video>
                  } @else {
                    <img [src]="r.images[0]?.url" [alt]="r.title" loading="lazy"/>
                  }
                </div>
                <div class="related-body">
                  <h3 class="related-card-title">{{ r.title }}</h3>
                  <span class="related-card-material font-mono">{{ r.material }}</span>
                </div>
              </a>
            }
          </div>
        </div>
      }
    } @else {
      <div class="container" style="padding:80px 24px;text-align:center">
        <p style="color:var(--text-muted)">Punimi nuk u gjet.</p>
        <a routerLink="/" class="btn btn-ghost" style="margin-top:16px">Kthehu</a>
      </div>
    }

    <app-favorites-panel [open]="favPanelOpen()" (close)="favPanelOpen.set(false)"/>
  `,
  styles: [`
    .top-nav { border-bottom:1px solid var(--line); }
    .top-nav .container { display:flex; align-items:center; justify-content:space-between; height:58px; }
    .back-link { display:flex; align-items:center; gap:6px; color:var(--text-muted); font-size:14px; transition:color var(--transition); &:hover { color:var(--text); } }
    .top-nav-right { display:flex; align-items:center; gap:14px; }
    .logo { font-size:20px; font-weight:700; color:var(--accent); letter-spacing:.08em; }
    .nav-fav { position:relative; background:none; border:none; color:var(--text-muted); cursor:pointer; padding:4px; display:flex; &:hover { color:var(--accent); } }
    .nav-fav-badge { position:absolute; top:-4px; right:-4px; background:var(--accent); color:#1A1208; font-size:9px; font-weight:700; width:15px; height:15px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
    .loading-wrap { display:flex; justify-content:center; padding:80px 0; }

    .detail-layout { display:grid; grid-template-columns:1fr 1fr; gap:56px; padding:48px 24px 80px; align-items:start; }

    /* GALLERY */
    .main-img-wrap { border-radius:var(--radius-md); overflow:hidden; aspect-ratio:4/3; border:1px solid var(--line); position:relative; background:var(--surface-2); }
    .main-img { width:100%; height:100%; object-fit:cover; display:block; background:#000; }

    .img-arrow {
      position:absolute; top:50%; transform:translateY(-50%);
      width:38px; height:38px; border-radius:50%;
      background:rgba(30,24,18,.8); backdrop-filter:blur(4px);
      border:1px solid var(--line); color:var(--text);
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      transition:background var(--transition);
      &:hover { background:rgba(30,24,18,.95); }
    }
    .prev { left:12px; }
    .next { right:12px; }
    .img-counter { position:absolute; bottom:12px; right:12px; background:rgba(30,24,18,.8); color:var(--text-muted); font-size:11px; padding:4px 10px; border-radius:var(--radius-pill); letter-spacing:.05em; }
    .fav-toggle {
      position:absolute; top:12px; left:12px; z-index:2;
      width:36px; height:36px; border-radius:50%;
      background:rgba(30,24,18,.8); backdrop-filter:blur(4px);
      border:1px solid var(--line); color:#fff;
      cursor:pointer; display:flex; align-items:center; justify-content:center;
      transition:background var(--transition), color var(--transition);
      &:hover { background:rgba(30,24,18,.95); }
      &.active { color:var(--rust); }
    }

    .thumbs { display:flex; gap:10px; margin-top:12px; flex-wrap:wrap; }
    .thumb { width:72px; height:54px; border-radius:var(--radius-sm); overflow:hidden; border:2px solid var(--line); padding:0; background:none; cursor:pointer; transition:border-color var(--transition); img, video { width:100%; height:100%; object-fit:cover; } &.active { border-color:var(--accent); } }

    /* INFO */
    .info-col { display:flex; flex-direction:column; gap:20px; padding-top:8px; }
    .detail-title { font-size:clamp(26px,3.5vw,38px); font-weight:600; margin:8px 0 0; line-height:1.15; }

    .spec-grid { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
    .spec-item { background:var(--surface-2); border:1px solid var(--line); border-radius:var(--radius-sm); padding:12px 14px; display:flex; flex-direction:column; gap:5px; }
    .spec-key { color:var(--text-faint); }
    .spec-val { font-size:14px; color:var(--text); }

    .description { color:var(--text-muted); font-size:15px; line-height:1.75; margin:0; }

    .price-row { display:flex; align-items:baseline; gap:12px; }
    .detail-price { font-size:28px; font-weight:600; }
    .price-note { font-size:13px; color:var(--text-muted); }

    .cta-stack { display:flex; flex-direction:column; gap:12px; }

    .share-note { font-size:11px; color:var(--text-faint); display:flex; align-items:center; gap:6px; letter-spacing:.02em; }

    /* RELATED PRODUCTS */
    .related-section { padding:0 24px 80px; }
    .related-title { font-size:22px; font-weight:600; margin:0 0 20px; }
    .related-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; }
    .related-card { display:block; overflow:hidden; transition:transform var(--transition), border-color var(--transition); &:hover { transform:translateY(-4px); border-color:var(--accent); } }
    .related-img-wrap { aspect-ratio:4/3; background:var(--surface-2); img, video { width:100%; height:100%; object-fit:cover; display:block; } }
    .related-body { padding:14px; }
    .related-card-title { font-size:15px; font-weight:600; margin:0 0 4px; line-height:1.25; }
    .related-card-material { font-size:11px; color:var(--text-faint); }

    @media (max-width:768px) {
      .detail-layout { grid-template-columns:1fr; gap:28px; padding:28px 18px 60px; }
      .img-arrow { opacity:1; }
      .related-section { padding:0 18px 60px; }
      .related-grid { grid-template-columns:repeat(2,1fr); }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private svc = inject(ProductService);
  private route = inject(ActivatedRoute);
  favorites = inject(FavoritesService);

  product = signal<Product | null>(null);
  loading = signal(true);
  activeImg = signal(0);
  related = signal<Product[]>([]);
  favPanelOpen = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getProduct(id).subscribe(p => {
      this.product.set(p);
      this.loading.set(false);
      this.loadRelated(p);
    });
  }

  private loadRelated(p: Product) {
    this.svc.getProducts().subscribe(list => {
      this.related.set(list.filter(x => x.categoryId === p.categoryId && x.id !== p.id).slice(0, 4));
    });
  }

  nextImg() {
    const p = this.product();
    if (!p) return;
    this.activeImg.set((this.activeImg() + 1) % p.images.length);
  }
  prevImg() {
    const p = this.product();
    if (!p) return;
    this.activeImg.set((this.activeImg() - 1 + p.images.length) % p.images.length);
  }

  callLink(): string {
    return `tel:+${environment.whatsappNumber}`;
  }

  waLinkProduct(): string {
    const p = this.product();
    if (!p) return `https://wa.me/${environment.whatsappNumber}`;
    const url = `${environment.siteUrl}/produkt/${p.id}`;
    const msg = `Përshëndetje VOCI! Jam i interesuar për punimin:\n*${p.title}*\n\nMaterial: ${p.material}\nPërmasa: ${p.dimensions}\n\nShiko punimin: ${url}\n\nA mund të marr më shumë informacion?`;
    return `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }
}
