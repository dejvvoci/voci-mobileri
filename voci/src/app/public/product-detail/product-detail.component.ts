import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product } from '../../core/models/models';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <nav class="top-nav">
      <div class="container">
        <a routerLink="/" class="back-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Kthehu te punimet
        </a>
        <a routerLink="/" class="logo font-display">VOCI</a>
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
            <img [src]="product()!.images[activeImg()]?.url"
                 [alt]="product()!.title" class="main-img"/>

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
                  <img [src]="img.url" [alt]="'Foto ' + ($index + 1)"/>
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
            <div class="spec-item">
              <span class="spec-key eyebrow" style="font-size:10px">Përmasa</span>
              <span class="spec-val">{{ product()!.dimensions }}</span>
            </div>
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

          <!-- SHARE NOTE -->
          <div class="share-note font-mono">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Linku i këtij punimi bashkëngjitur në mesazh automatikisht
          </div>
        </div>
      </div>
    } @else {
      <div class="container" style="padding:80px 24px;text-align:center">
        <p style="color:var(--text-muted)">Punimi nuk u gjet.</p>
        <a routerLink="/" class="btn btn-ghost" style="margin-top:16px">Kthehu</a>
      </div>
    }
  `,
  styles: [`
    .top-nav { border-bottom:1px solid var(--line); }
    .top-nav .container { display:flex; align-items:center; justify-content:space-between; height:58px; }
    .back-link { display:flex; align-items:center; gap:6px; color:var(--text-muted); font-size:14px; transition:color var(--transition); &:hover { color:var(--text); } }
    .logo { font-size:20px; font-weight:700; color:var(--accent); letter-spacing:.08em; }
    .loading-wrap { display:flex; justify-content:center; padding:80px 0; }

    .detail-layout { display:grid; grid-template-columns:1fr 1fr; gap:56px; padding:48px 24px 80px; align-items:start; }

    /* GALLERY */
    .main-img-wrap { border-radius:var(--radius-md); overflow:hidden; aspect-ratio:4/3; border:1px solid var(--line); position:relative; background:var(--surface-2); }
    .main-img { width:100%; height:100%; object-fit:cover; display:block; }

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

    .thumbs { display:flex; gap:10px; margin-top:12px; flex-wrap:wrap; }
    .thumb { width:72px; height:54px; border-radius:var(--radius-sm); overflow:hidden; border:2px solid var(--line); padding:0; background:none; cursor:pointer; transition:border-color var(--transition); img { width:100%; height:100%; object-fit:cover; } &.active { border-color:var(--accent); } }

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

    @media (max-width:768px) {
      .detail-layout { grid-template-columns:1fr; gap:28px; padding:28px 18px 60px; }
      .img-arrow { opacity:1; }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private svc = inject(ProductService);
  private route = inject(ActivatedRoute);

  product = signal<Product | null>(null);
  loading = signal(true);
  activeImg = signal(0);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.svc.getProduct(id).subscribe(p => {
      this.product.set(p);
      this.loading.set(false);
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
    const url = `${window.location.href}`;
    const msg = `Përshëndetje VOCI! Jam i interesuar për punimin:\n*${p.title}*\n\nMaterial: ${p.material}\nPërmasa: ${p.dimensions}\n\nShiko punimin: ${url}\n\nA mund të marr më shumë informacion?`;
    return `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }
}
