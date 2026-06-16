import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { Category } from '../../core/models/models';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title font-display">Kategoritë</h1>
        <p class="page-sub">Menaxho kategoritë e produkteve</p>
      </div>
    </div>

    <div class="cat-layout">
      <!-- ADD / EDIT FORM -->
      <div class="cat-form card">
        <h3 class="section-title font-display">{{ editingId ? 'Ndrysho kategorinë' : 'Shto kategori të re' }}</h3>

        <div class="field">
          <label class="field-label">Emri i kategorisë</label>
          <input type="text" [(ngModel)]="newName" placeholder="p.sh. Kuzhina"
                 (keydown.enter)="save()"/>
        </div>

        <div class="field">
          <label class="field-label">
            Renditja
            <span style="font-size:11px;color:var(--text-faint);font-weight:400">Numri i vogël shfaqet i pari</span>
          </label>
          <input type="number" [(ngModel)]="newOrder" min="0" placeholder="0"/>
        </div>

        @if (formError()) {
          <p class="field-error">{{ formError() }}</p>
        }

        <div style="display:flex;gap:10px;margin-top:4px">
          <button class="btn btn-primary" (click)="save()" [disabled]="saving()">
            @if (saving()) { <span class="spinner" style="width:14px;height:14px;border-width:2px"></span> }
            {{ editingId ? 'Ruaj' : 'Shto' }}
          </button>
          @if (editingId) {
            <button class="btn btn-ghost" (click)="cancelEdit()">Anulo</button>
          }
        </div>
      </div>

      <!-- LIST -->
      <div class="cat-list card">
        <h3 class="section-title font-display" style="padding:20px 20px 0">
          Kategoritë aktuale
        </h3>

        @if (loading()) {
          <div style="display:flex;justify-content:center;padding:40px"><div class="spinner"></div></div>
        } @else if (categories().length === 0) {
          <div class="empty-state" style="padding:40px 24px">
            <p class="empty-title" style="font-size:16px">Asnjë kategori akoma</p>
            <p class="empty-text">Shto kategorinë e parë duke përdorur formularin.</p>
          </div>
        } @else {
          <ul class="cat-items">
            @for (cat of categories(); track cat.id) {
              <li class="cat-item">
                <div class="cat-info">
                  <span class="cat-order font-mono">{{ cat.order }}</span>
                  <span class="cat-name">{{ cat.name }}</span>
                  <span class="cat-slug badge badge-muted">{{ cat.slug }}</span>
                </div>
                <div class="cat-actions">
                  <button class="btn btn-ghost btn-sm" (click)="startEdit(cat)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button class="btn btn-danger btn-sm" (click)="confirmDelete(cat)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                  </button>
                </div>
              </li>
            }
          </ul>
        }
      </div>
    </div>

    <!-- DELETE MODAL -->
    @if (deleteTarget()) {
      <div class="modal-backdrop" (click)="deleteTarget.set(null)">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3 class="font-display" style="margin:0 0 10px;font-size:18px">Fshi kategorinë?</h3>
          <p style="color:var(--text-muted);font-size:14px;margin:0 0 6px">
            Do të fshihet kategoria <strong>{{ deleteTarget()!.name }}</strong>.
          </p>
          <p style="color:var(--text-faint);font-size:13px;margin:0 0 24px">
            ⚠️ Produktet e kësaj kategorie do të mbesin, por pa kategori të caktuar.
          </p>
          <div style="display:flex;gap:12px;justify-content:flex-end">
            <button class="btn btn-ghost" (click)="deleteTarget.set(null)">Anulo</button>
            <button class="btn btn-danger" (click)="doDelete()" [disabled]="deleting()">Fshi</button>
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
    .page-header { margin-bottom:28px; }
    .page-title { font-size:26px; font-weight:600; margin:0; }
    .page-sub { color:var(--text-muted); font-size:14px; margin:4px 0 0; }

    .cat-layout { display:grid; grid-template-columns:340px 1fr; gap:24px; align-items:start; }

    .cat-form { padding:24px; }
    .section-title { font-size:16px; font-weight:600; margin:0 0 18px; }
    .field { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
    .field-label { font-size:13px; font-weight:500; color:var(--text-muted); display:flex; justify-content:space-between; }
    .field-error { color:#E07050; font-size:13px; margin:0 0 12px; }

    .cat-items { list-style:none; margin:0; padding:0; }
    .cat-item {
      display:flex; align-items:center; justify-content:space-between;
      padding:14px 20px; border-bottom:1px solid var(--line-soft);
      &:last-child { border-bottom:none; }
    }
    .cat-info { display:flex; align-items:center; gap:12px; }
    .cat-order { font-size:12px; color:var(--text-faint); width:20px; text-align:right; }
    .cat-name { font-weight:500; font-size:15px; }
    .cat-slug { font-size:10px; }
    .cat-actions { display:flex; gap:8px; }

    @media (max-width:768px) {
      .cat-layout { grid-template-columns:1fr; }
    }
  `]
})
export class CategoriesComponent implements OnInit {
  private svc = inject(ProductService);

  categories = signal<Category[]>([]);
  loading = signal(true);
  saving = signal(false);
  deleting = signal(false);
  deleteTarget = signal<Category | null>(null);
  toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);
  formError = signal('');

  newName = '';
  newOrder = 0;
  editingId = '';

  ngOnInit() {
    this.svc.getCategories().subscribe(c => {
      this.categories.set(c);
      this.loading.set(false);
    });
  }

  private toSlug(name: string): string {
    return name.toLowerCase()
      .replace(/ë/g, 'e').replace(/ç/g, 'c')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async save() {
    if (!this.newName.trim()) { this.formError.set('Emri është i detyrueshëm.'); return; }
    this.formError.set('');
    this.saving.set(true);
    try {
      const data: Omit<Category, 'id'> = {
        name: this.newName.trim(),
        slug: this.toSlug(this.newName.trim()),
        order: this.newOrder
      };
      if (this.editingId) {
        await this.svc.updateCategory(this.editingId, data);
        this.showToast('Kategoria u ndryshua.', 'success');
      } else {
        await this.svc.addCategory(data);
        this.showToast('Kategoria u shtua.', 'success');
      }
      this.cancelEdit();
    } catch {
      this.showToast('Gabim. Provo sërish.', 'error');
    } finally {
      this.saving.set(false);
    }
  }

  startEdit(cat: Category) {
    this.editingId = cat.id!;
    this.newName = cat.name;
    this.newOrder = cat.order;
    this.formError.set('');
  }

  cancelEdit() {
    this.editingId = '';
    this.newName = '';
    this.newOrder = 0;
  }

  confirmDelete(cat: Category) { this.deleteTarget.set(cat); }

  async doDelete() {
    const cat = this.deleteTarget();
    if (!cat) return;
    this.deleting.set(true);
    try {
      await this.svc.deleteCategory(cat.id!);
      this.showToast('Kategoria u fshi.', 'success');
    } catch {
      this.showToast('Gabim gjatë fshirjes.', 'error');
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
