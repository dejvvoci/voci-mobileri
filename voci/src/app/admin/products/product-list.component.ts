import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Category, Product } from '../../core/models/models';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">Punimet</h1>
        <p class="page-sub">
          {{ filtered().length }} punime
          @if (searchQuery() || activeCategoryFilter() !== 'all') {
            <span class="filter-active"> (filtro aktiv)</span>
          }
        </p>
      </div>
      <a routerLink="/admin/produkte/shto" class="btn btn-primary">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 5v14M5 12h14"/></svg>
        Shto punë të re
      </a>
    </div>

    <!-- SEARCH + FILTER BAR -->
    <div class="search-bar card">
      <!-- KËRKIM -->
      <div class="search-input-wrap">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
        </svg>
        <input
          type="text"
          class="search-input"
          placeholder="Kërko sipas titullit ose materialit…"
          [(ngModel)]="searchQueryValue"
          (ngModelChange)="searchQuery.set($event)"/>
        @if (searchQuery()) {
          <button class="clear-btn" (click)="clearSearch()" aria-label="Pastro kërkimin">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        }
      </div>

      <!-- FILTËR KATEGORIE -->
      <div class="filter-chips">
        <button class="fchip" [class.active]="activeCategoryFilter() === 'all'"
                (click)="activeCategoryFilter.set('all')">Të gjitha</button>
        @for (cat of categories(); track cat.id) {
          <button class="fchip" [class.active]="activeCategoryFilter() === cat.id"
                  (click)="activeCategoryFilter.set(cat.id!)">{{ cat.name }}</button>
        }
      </div>
    </div>

    @if (loading()) {
      <div style="display:flex;justify-content:center;padding:60px"><div class="spinner"></div></div>

    } @else if (allProducts().length === 0) {
      <div class="empty-state">
        <span class="empty-icon">🪑</span>
        <p class="empty-title">Asnjë punë e shtuar akoma</p>
        <p class="empty-text">Shto punimin e parë duke klikuar butonin lart.</p>
        <a routerLink="/admin/produkte/shto" class="btn btn-primary" style="margin-top:8px">Shto tani</a>
      </div>

    } @else if (filtered().length === 0) {
      <div class="empty-state">
        <span class="empty-icon">🔍</span>
        <p class="empty-title">Asnjë rezultat</p>
        <p class="empty-text">Provo me fjalë të tjera ose ndrysho filtrin e kategorisë.</p>
        <button class="btn btn-ghost" (click)="clearAll()" style="margin-top:8px">Pastro filtrat</button>
      </div>

    } @else {
      <div class="products-table card">
        <table>
          <thead>
            <tr>
              <th>Foto</th>
              <th>Titulli</th>
              <th>Kategoria</th>
              <th>Çmimi</th>
              <th>Imazhe</th>
              <th>Hero</th>
              <th>Veprime</th>
            </tr>
          </thead>
          <tbody>
            @for (p of filtered(); track p.id) {
              <tr>
                <td>
                  <div class="table-thumb">
                    @if (p.images[0]?.type === 'video') {
                      <video [src]="p.images[0]?.url" muted></video>
                    } @else {
                      <img [src]="p.images[0]?.url || placeholder" [alt]="p.title" loading="lazy"/>
                    }
                  </div>
                </td>
                <td>
                  <span class="product-name">{{ p.title }}</span>
                  <span class="product-material font-mono">{{ p.material }}</span>
                </td>
                <td>
                  <span class="badge badge-muted">{{ getCategoryName(p.categoryId) }}</span>
                </td>
                <td>
                  <span [class]="p.price ? 'price-chip' : 'ask-chip'">
                    {{ p.price ? (p.price + '€') : 'Pyet' }}
                  </span>
                </td>
                <td>
                  <span class="img-count font-mono">{{ p.images.length }} foto</span>
                </td>
                <td>
                  @if (p.featured) {
                    <span class="featured-badge">★ Hero</span>
                  }
                </td>
                <td>
                  <div class="action-btns">
                    <a [routerLink]="['/admin/produkte/ndrysho', p.id]" class="btn btn-ghost btn-sm">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Ndrysho
                    </a>
                    <button class="btn btn-danger btn-sm" (click)="confirmDelete(p)">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                      Fshi
                    </button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- DELETE CONFIRM MODAL -->
    @if (deleteTarget()) {
      <div class="modal-backdrop" (click)="deleteTarget.set(null)">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3 class="font-display" style="margin:0 0 10px;font-size:20px">Fshi punën?</h3>
          <p style="color:var(--text-muted);font-size:14px;margin:0 0 24px">
            Do të fshihet <strong>{{ deleteTarget()!.title }}</strong> dhe të gjitha
            {{ deleteTarget()!.images.length }} imazhet. Ky veprim nuk kthehet.
          </p>
          <div style="display:flex;gap:12px;justify-content:flex-end">
            <button class="btn btn-ghost" (click)="deleteTarget.set(null)">Anulo</button>
            <button class="btn btn-danger" (click)="doDelete()" [disabled]="deleting()">
              @if (deleting()) { <span class="spinner" style="width:14px;height:14px;border-width:2px"></span> }
              Fshi definitivisht
            </button>
          </div>
        </div>
      </div>
    }

    @if (toast()) {
      <div class="toast" [class.toast-success]="toast()!.type==='success'" [class.toast-error]="toast()!.type==='error'">
        {{ toast()!.message }}
      </div>
    }
  `,
  styles: [`
    .page-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:20px; flex-wrap:wrap; gap:14px; }
    .page-title { font-size:26px; font-weight:600; margin:0; }
    .page-sub { color:var(--text-muted); font-size:14px; margin:4px 0 0; }
    .filter-active { color:var(--accent); }

    /* SEARCH BAR */
    .search-bar {
      display: flex; flex-direction: column; gap: 14px;
      padding: 16px 18px; margin-bottom: 20px;
    }
    .search-input-wrap {
      position: relative; display: flex; align-items: center;
    }
    .search-icon {
      position: absolute; left: 12px; color: var(--text-faint); pointer-events: none;
    }
    .search-input {
      padding-left: 38px !important; padding-right: 36px !important;
      background: var(--surface-2); border: 1px solid var(--line);
      border-radius: var(--radius-sm); height: 42px;
      font-size: 14px; color: var(--text); width: 100%;
      transition: border-color var(--transition);
      &:focus { border-color: var(--accent); outline: none; }
      &::placeholder { color: var(--text-faint); }
    }
    .clear-btn {
      position: absolute; right: 10px;
      background: none; border: none; color: var(--text-faint);
      cursor: pointer; padding: 4px; display: flex; align-items: center;
      transition: color var(--transition);
      &:hover { color: var(--text); }
    }

    /* CATEGORY FILTER CHIPS */
    .filter-chips {
      display: flex; gap: 7px; flex-wrap: wrap;
    }
    .fchip {
      padding: 6px 14px; border-radius: var(--radius-pill);
      border: 1px solid var(--line); background: var(--surface-2);
      color: var(--text-muted); font-size: 12px; font-weight: 500;
      cursor: pointer; transition: all var(--transition);
      &:hover { border-color: var(--accent); color: var(--text); }
      &.active { background: var(--accent); color: #1A1208; border-color: var(--accent); font-weight: 600; }
    }

    /* TABLE */
    .products-table { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { text-align: left; padding: 12px 16px; font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--text-faint); border-bottom: 1px solid var(--line); white-space: nowrap; }
    td { padding: 14px 16px; border-bottom: 1px solid var(--line-soft); vertical-align: middle; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: var(--surface-2); }

    .table-thumb { width: 52px; height: 40px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--line); img, video { width: 100%; height: 100%; object-fit: cover; } }
    .product-name { display: block; font-weight: 500; font-size: 14px; }
    .product-material { display: block; font-size: 11px; color: var(--text-faint); margin-top: 3px; }
    .price-chip { background: rgba(200,145,60,.12); color: var(--accent); font-size: 12px; font-weight: 600; padding: 4px 9px; border-radius: var(--radius-pill); }
    .ask-chip { background: var(--surface-2); color: var(--text-muted); font-size: 12px; padding: 4px 9px; border-radius: var(--radius-pill); }
    .img-count { font-size: 12px; color: var(--text-faint); }
    .featured-badge { background: var(--accent-glow); color: var(--accent); font-size: 11px; font-weight: 600; padding: 3px 9px; border-radius: var(--radius-pill); border: 1px solid rgba(200,145,60,.25); white-space: nowrap; }
    .action-btns { display: flex; gap: 8px; }

    @media (max-width: 640px) {
      .search-bar { gap: 10px; }
    }
  `]
})
export class ProductListComponent implements OnInit {
  private svc = inject(ProductService);

  allProducts = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(true);
  deleteTarget = signal<Product | null>(null);
  deleting = signal(false);
  toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);

  searchQuery = signal('');
  searchQueryValue = '';
  activeCategoryFilter = signal<string>('all');

  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMkMyMjE5Ii8+PC9zdmc+';

  filtered = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.activeCategoryFilter();
    return this.allProducts().filter(p => {
      const matchCat = cat === 'all' || p.categoryId === cat;
      const matchQ = !q ||
        p.title.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  });

  ngOnInit() {
    this.svc.getCategories().subscribe(c => this.categories.set(c));
    this.svc.getProducts().subscribe(p => {
      this.allProducts.set(p);
      this.loading.set(false);
    });
  }

  getCategoryName(id: string): string {
    return this.categories().find(c => c.id === id)?.name || id;
  }

  clearSearch() {
    this.searchQueryValue = '';
    this.searchQuery.set('');
  }

  clearAll() {
    this.clearSearch();
    this.activeCategoryFilter.set('all');
  }

  confirmDelete(p: Product) { this.deleteTarget.set(p); }

  async doDelete() {
    const p = this.deleteTarget();
    if (!p) return;
    this.deleting.set(true);
    try {
      await this.svc.deleteProduct(p);
      this.showToast('Produkti u fshi me sukses.', 'success');
    } catch {
      this.showToast('Gabim gjatë fshirjes. Provo sërish.', 'error');
    } finally {
      this.deleting.set(false);
      this.deleteTarget.set(null);
    }
  }

  private showToast(message: string, type: 'success' | 'error') {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }
}