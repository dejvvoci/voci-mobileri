import { Component, EventEmitter, Input, Output, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../core/services/favorites.service';
import { ProductService } from '../core/services/product.service';
import { Product } from '../core/models/models';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-favorites-panel',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    @if (open) {
      <div class="fav-overlay" (click)="close.emit()"></div>
      <aside class="fav-drawer">
        <div class="fav-header">
          <h3 class="fav-title font-display">Të preferuarat</h3>
          <button class="fav-close" (click)="close.emit()" aria-label="Mbyll">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        @if (favProducts().length === 0) {
          <div class="fav-empty">
            <span style="font-size:32px">🤍</span>
            <p>Ende s'ke shënuar asnjë punim.</p>
            <p class="fav-empty-hint">Kliko ikonën zemër te çdo punim për ta ruajtur këtu.</p>
          </div>
        } @else {
          <div class="fav-list">
            @for (p of favProducts(); track p.id) {
              <div class="fav-item">
                <a [routerLink]="['/produkt', p.id]" (click)="close.emit()" class="fav-item-link">
                  <div class="fav-item-img">
                    <img [src]="p.images[0]?.url" [alt]="p.title"/>
                  </div>
                  <div class="fav-item-info">
                    <span class="fav-item-title">{{ p.title }}</span>
                    <span class="fav-item-material font-mono">{{ p.material }}</span>
                  </div>
                </a>
                <button class="fav-remove" (click)="remove(p.id!)" title="Hiq nga të preferuarat">✕</button>
              </div>
            }
          </div>

          <div class="fav-footer">
            <a [href]="waLinkAll()" target="_blank" rel="noopener" class="btn btn-primary btn-lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Dërgo listën në WhatsApp
            </a>
            <button class="btn btn-ghost" (click)="clearAll()">Fshi të gjitha</button>
          </div>
        }
      </aside>
    }
  `,
  styles: [`
    .fav-overlay { position:fixed; inset:0; background:rgba(0,0,0,.5); z-index:70; }
    .fav-drawer {
      position:fixed; top:0; right:0; height:100%; width:min(400px, 100vw);
      background:var(--surface); border-left:1px solid var(--line);
      z-index:71; display:flex; flex-direction:column; padding:22px;
      overflow-y:auto;
    }
    .fav-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:18px; }
    .fav-title { font-size:19px; font-weight:600; margin:0; }
    .fav-close { background:none; border:none; color:var(--text-muted); cursor:pointer; padding:4px; &:hover { color:var(--text); } }

    .fav-empty { text-align:center; padding:60px 12px; display:flex; flex-direction:column; gap:8px; align-items:center; }
    .fav-empty p { margin:0; color:var(--text-muted); font-size:14px; }
    .fav-empty-hint { font-size:12px !important; color:var(--text-faint) !important; }

    .fav-list { display:flex; flex-direction:column; gap:10px; flex:1; }
    .fav-item { display:flex; align-items:center; gap:10px; background:var(--surface-2); border:1px solid var(--line); border-radius:var(--radius-sm); padding:8px; }
    .fav-item-link { display:flex; align-items:center; gap:10px; flex:1; min-width:0; }
    .fav-item-img { width:52px; height:40px; border-radius:6px; overflow:hidden; flex-shrink:0; img { width:100%; height:100%; object-fit:cover; } }
    .fav-item-info { display:flex; flex-direction:column; gap:2px; min-width:0; }
    .fav-item-title { font-size:13px; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .fav-item-material { font-size:11px; color:var(--text-faint); }
    .fav-remove { background:none; border:none; color:var(--text-faint); cursor:pointer; font-size:14px; padding:6px; flex-shrink:0; &:hover { color:#E07050; } }

    .fav-footer { display:flex; flex-direction:column; gap:10px; margin-top:18px; padding-top:16px; border-top:1px solid var(--line); }

    @media (max-width:480px) {
      .fav-drawer { width:100vw; }
    }
  `]
})
export class FavoritesPanelComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();

  private favorites = inject(FavoritesService);
  private svc = inject(ProductService);
  private allProducts = signal<Product[]>([]);

  favProducts = computed(() => {
    const ids = this.favorites.ids();
    return this.allProducts().filter(p => ids.includes(p.id!));
  });

  constructor() {
    this.svc.getProducts().subscribe(list => this.allProducts.set(list));
  }

  remove(id: string) {
    this.favorites.toggle(id);
  }

  clearAll() {
    this.favorites.clear();
  }

  waLinkAll(): string {
    const list = this.favProducts();
    const lines = list.map(p => `• *${p.title}* — ${environment.siteUrl}/produkt/${p.id}`).join('\n');
    const msg = `Përshëndetje VOCI! Jam i interesuar për këto punime:\n\n${lines}\n\nA mund të marr më shumë informacion?`;
    return `https://wa.me/${environment.whatsappNumber}?text=${encodeURIComponent(msg)}`;
  }
}
