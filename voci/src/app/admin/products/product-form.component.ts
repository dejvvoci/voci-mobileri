import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Category, Product, ProductImage, UploadProgress } from '../../core/models/models';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-page">
      <div class="form-header">
        <button class="btn btn-ghost btn-sm" (click)="goBack()">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Kthehu
        </button>
        <h1 class="form-title font-display">{{ isEdit ? 'Ndrysho punën' : 'Shto punë të re' }}</h1>
      </div>

      <div class="form-body">
        <!-- LEFT: details -->
        <div class="form-col">
          <div class="form-section card">
            <h3 class="section-title">Informacioni bazë</h3>

            <div class="field">
              <label class="field-label">Titulli <span class="req">*</span></label>
              <input type="text" [(ngModel)]="form.title" placeholder="p.sh. Kuzhinë 'Liri'"/>
            </div>

            <div class="field">
              <label class="field-label">Kategoria <span class="req">*</span></label>
              <select [(ngModel)]="form.categoryId">
                <option value="">— Zgjidh kategorinë —</option>
                @for (c of categories(); track c.id) {
                  <option [value]="c.id">{{ c.name }}</option>
                }
              </select>
            </div>

            <div class="field">
              <label class="field-label">Materiali <span class="req">*</span></label>
              <input type="text" [(ngModel)]="form.material" placeholder="p.sh. Dushk masiv"/>
            </div>

            <div class="field">
              <label class="field-label">Përmasa</label>
              <input type="text" [(ngModel)]="form.dimensions" placeholder="p.sh. 320 × 60 × 85 cm"/>
            </div>

            <div class="field">
              <label class="field-label">
                Çmimi (€)
                <span class="field-hint">Lëre bosh për "Pyet për çmim"</span>
              </label>
              <input type="number" [(ngModel)]="priceInput" placeholder="0" min="0"/>
            </div>

            <div class="field">
              <label class="field-label">Përshkrimi</label>
              <textarea [(ngModel)]="form.description" rows="4"
                        placeholder="Përshkruaj punën, detaje speciale, opsione ngjyrash..."></textarea>
            </div>

            <div class="field-row">
              <label class="toggle-label">
                <input type="checkbox" [(ngModel)]="form.featured"/>
                <span class="toggle-track"><span class="toggle-thumb"></span></span>
                Shfaq në hero (ballinë)
              </label>
            </div>
          </div>
        </div>

        <!-- RIGHT: images -->
        <div class="form-col">
          <div class="form-section card">
            <h3 class="section-title">
              Imazhet & Videot
              <span class="img-counter-badge font-mono">{{ form.images.length }}</span>
            </h3>
            <p class="section-hint">Imazhet kompresohen automatikisht ~500KB/WebP. Kliko ★ për të caktuar median kryesore.</p>

            <!-- UPLOAD DROPZONE -->
            <div class="dropzone" [class.drag-over]="dragOver()"
                 (dragover)="$event.preventDefault(); dragOver.set(true)"
                 (dragleave)="dragOver.set(false)"
                 (drop)="onDrop($event)"
                 (click)="fileInput.click()">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <p class="dropzone-text">Tërhiq imazhet/videot këtu ose <span>kliko për të zgjedhur</span></p>
              <p class="dropzone-hint">JPG, PNG, WebP, MP4, MOV, WebM</p>
              <input #fileInput type="file" accept="image/*,video/*" multiple style="display:none"
                     (change)="onFileSelect($event)"/>
            </div>

            <!-- UPLOAD PROGRESS -->
            @if (uploads().length > 0) {
              <div class="uploads-list">
                @for (u of uploads(); track u.file.name) {
                  <div class="upload-item">
                    <div class="upload-info">
                      <span class="upload-name">{{ u.file.name }}</span>
                      <span class="upload-status" [class]="'status-' + u.status">
                        {{ u.status === 'done' ? '✓' : u.status === 'error' ? '✕' : u.progress + '%' }}
                      </span>
                    </div>
                    @if (u.status === 'uploading') {
                      <div class="progress-bar">
                        <div class="progress-fill" [style.width.%]="u.progress"></div>
                      </div>
                    }
                  </div>
                }
              </div>
            }

            <!-- CURRENT IMAGES GRID -->
            @if (form.images.length > 0) {
              <div class="img-grid">
                @for (img of form.images; track img.storagePath; let i = $index) {
                  <div class="img-item" [class.primary]="img.isPrimary">
                    @if (img.type === 'video') {
                      <video [src]="img.url" muted></video>
                    } @else {
                      <img [src]="img.url" [alt]="'Foto ' + (i+1)"/>
                    }
                    @if (img.isPrimary) {
                      <span class="primary-badge">Kryesore</span>
                    }
                    <div class="img-actions">
                      @if (!img.isPrimary) {
                        <button class="img-btn" (click)="setPrimary(i)" title="Bëje kryesore">★</button>
                      }
                      <button class="img-btn danger" (click)="removeImage(i)" title="Fshi">✕</button>
                    </div>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>

      <!-- FOOTER ACTIONS -->
      @if (errors().length > 0) {
        <div class="form-errors">
          @for (e of errors(); track e) { <p>• {{ e }}</p> }
        </div>
      }

      <div class="form-actions">
        <button class="btn btn-ghost" (click)="goBack()" [disabled]="saving()">Anulo</button>
        <button class="btn btn-primary btn-lg" (click)="save()" [disabled]="saving() || uploading()">
          @if (saving()) { <span class="spinner" style="width:16px;height:16px;border-width:2px"></span> }
          @if (uploading()) { Duke ngarkuar imazhet… }
          @else { {{ isEdit ? 'Ruaj ndryshimet' : 'Shto punën' }} }
        </button>
      </div>
    </div>

    @if (toast()) {
      <div class="toast" [class.toast-success]="toast()!.type==='success'" [class.toast-error]="toast()!.type==='error'">
        {{ toast()!.message }}
      </div>
    }
  `,
  styles: [`
    .form-page { max-width:1100px; }
    .form-header { display:flex; align-items:center; gap:16px; margin-bottom:28px; flex-wrap:wrap; }
    .form-title { font-size:24px; font-weight:600; margin:0; }

    .form-body { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
    .form-col { display:flex; flex-direction:column; gap:20px; }
    .form-section { padding:24px; }
    .section-title { font-family:var(--font-display); font-size:16px; font-weight:600; margin:0 0 18px; display:flex; align-items:center; gap:10px; }
    .img-counter-badge { font-size:11px; font-weight:500; background:var(--surface-3); color:var(--text-faint); padding:3px 9px; border-radius:var(--radius-pill); margin-left:auto; }
    .section-hint { font-size:12px; color:var(--text-faint); margin:-12px 0 16px; }

    .field { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
    .field-label { font-size:13px; font-weight:500; color:var(--text-muted); display:flex; align-items:center; gap:8px; }
    .field-hint { font-size:11px; color:var(--text-faint); font-weight:400; }
    .req { color:var(--accent); }
    textarea { resize:vertical; min-height:100px; line-height:1.6; }

    .field-row { margin-top:4px; }
    .toggle-label { display:flex; align-items:center; gap:10px; cursor:pointer; font-size:14px; color:var(--text-muted); }
    .toggle-label input[type=checkbox] { display:none; }
    .toggle-track { width:38px; height:22px; background:var(--surface-3); border-radius:11px; position:relative; transition:background var(--transition); flex-shrink:0; }
    .toggle-thumb { position:absolute; top:3px; left:3px; width:16px; height:16px; background:var(--text-faint); border-radius:50%; transition:transform var(--transition), background var(--transition); }
    .toggle-label input:checked ~ .toggle-track { background:var(--accent); }
    .toggle-label input:checked ~ .toggle-track .toggle-thumb { transform:translateX(16px); background:#1A1208; }

    // DROPZONE
    .dropzone {
      border:2px dashed var(--line); border-radius:var(--radius-md);
      padding:32px 20px; text-align:center; cursor:pointer;
      transition:border-color var(--transition), background var(--transition);
      &:hover:not(.dropzone-full), &.drag-over { border-color:var(--accent); background:var(--accent-glow); }
    }
    .dropzone-full { cursor:default; opacity:.55; }
    .dropzone-text { font-size:14px; color:var(--text-muted); margin:10px 0 4px; span { color:var(--accent); } }
    .dropzone-hint { font-size:12px; color:var(--text-faint); margin:0; }

    // UPLOAD PROGRESS
    .uploads-list { margin-top:14px; display:flex; flex-direction:column; gap:8px; }
    .upload-item { background:var(--surface-2); border-radius:var(--radius-sm); padding:10px 12px; }
    .upload-info { display:flex; justify-content:space-between; align-items:center; font-size:12px; margin-bottom:6px; }
    .upload-name { color:var(--text-muted); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:200px; }
    .upload-status { font-family:var(--font-mono); font-size:11px; }
    .status-done { color:#5DBA80; }
    .status-error { color:#E07050; }
    .status-uploading { color:var(--accent); }
    .progress-bar { height:4px; background:var(--line); border-radius:2px; overflow:hidden; }
    .progress-fill { height:100%; background:var(--accent); transition:width .15s; }

    // IMAGE GRID
    .img-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:10px; margin-top:16px; }
    .img-item {
      position:relative; aspect-ratio:4/3; border-radius:var(--radius-sm);
      overflow:hidden; border:2px solid var(--line);
      &.primary { border-color:var(--accent); }
      img, video { width:100%; height:100%; object-fit:cover; }
    }
    .primary-badge { position:absolute; top:6px; left:6px; background:var(--accent); color:#1A1208; font-size:10px; font-weight:700; padding:3px 7px; border-radius:var(--radius-pill); }
    .img-actions { position:absolute; top:6px; right:6px; display:flex; gap:5px; opacity:0; transition:opacity var(--transition); }
    .img-item:hover .img-actions { opacity:1; }
    .img-btn {
      width:26px; height:26px; border-radius:50%; border:none;
      background:rgba(30,24,18,.85); color:var(--text-muted);
      font-size:12px; cursor:pointer; display:flex; align-items:center; justify-content:center;
      &:hover { color:var(--text); }
      &.danger:hover { color:#E07050; }
    }

    // FORM FOOTER
    .form-errors { background:rgba(168,75,42,.12); border:1px solid rgba(168,75,42,.3); border-radius:var(--radius-sm); padding:14px 18px; margin-top:20px; p { margin:3px 0; font-size:13px; color:#E07050; } }
    .form-actions { display:flex; gap:12px; justify-content:flex-end; margin-top:24px; }

    @media (max-width:768px) {
      .form-body { grid-template-columns:1fr; }
      .img-grid { grid-template-columns:repeat(2,1fr); }
    }
  `]
})
export class ProductFormComponent implements OnInit {
  private svc = inject(ProductService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEdit = false;
  editId = '';
  categories = signal<Category[]>([]);
  saving = signal(false);
  uploading = signal(false);
  uploads = signal<UploadProgress[]>([]);
  errors = signal<string[]>([]);
  toast = signal<{ message: string; type: 'success' | 'error' } | null>(null);
  dragOver = signal(false);
  priceInput: number | null = null;

  form: Omit<Product, 'id'> = {
    title: '', description: '', categoryId: '', categoryName: '',
    material: '', dimensions: '', price: null,
    images: [], featured: false, order: 0
  };

  ngOnInit() {
    this.svc.getCategories().subscribe(c => this.categories.set(c));
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = id;
      this.svc.getProduct(id).subscribe(p => {
        this.form = { ...p };
        this.priceInput = p.price;
      });
    }
  }

  onFileSelect(e: Event) {
    const files = Array.from((e.target as HTMLInputElement).files || []);
    this.uploadFiles(files);
    (e.target as HTMLInputElement).value = '';
  }

  onDrop(e: DragEvent) {
    e.preventDefault();
    this.dragOver.set(false);
    const files = Array.from(e.dataTransfer?.files || [])
      .filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));
    this.uploadFiles(files);
  }

  async uploadFiles(files: File[]) {
    if (!files.length) return;

    this.uploading.set(true);

    const newImages = await this.svc.uploadMultipleImages(
      files,
      (prog) => this.uploads.set(prog)
    );

    this.form = {
      ...this.form,
      images: [
        ...this.form.images,
        ...newImages.map((img, i) => ({
          ...img,
          isPrimary: this.form.images.length === 0 && i === 0
        }))
      ]
    };

    this.uploading.set(false);
    this.uploads.set([]);
  }

  setPrimary(idx: number) {
    this.form.images = this.form.images.map((img, i) => ({
      ...img, isPrimary: i === idx
    }));
  }

  async removeImage(idx: number) {
    const img = this.form.images[idx];
    // Fshi nga Storage
    await this.svc.deleteImageFromStorage(img.storagePath);
    const remaining = this.form.images.filter((_, i) => i !== idx);
    // Ri-cakto primary nëse u fshi ajo kryesore
    if (img.isPrimary && remaining.length > 0) remaining[0].isPrimary = true;
    this.form.images = remaining;
  }

  validate(): string[] {
    const e: string[] = [];
    if (!this.form.title.trim()) e.push('Titulli është i detyrueshëm.');
    if (!this.form.categoryId) e.push('Zgjidh një kategori.');
    if (!this.form.material.trim()) e.push('Materiali është i detyrueshëm.');
    return e;
  }

  async save() {
    const errs = this.validate();
    if (errs.length) { this.errors.set(errs); return; }
    this.errors.set([]);
    this.saving.set(true);

    const cat = this.categories().find(c => c.id === this.form.categoryId);
    const payload: Omit<Product, 'id'> = {
      ...this.form,
      price: this.priceInput ?? null,
      categoryName: cat?.name || ''
    };

    try {
      if (this.isEdit) {
        await this.svc.updateProduct(this.editId, payload);
        this.showToast('Ndryshimet u ruajtën.', 'success');
      } else {
        await this.svc.addProduct(payload);
        this.showToast('Puna u shtua me sukses!', 'success');
      }
      setTimeout(() => this.router.navigate(['/admin/produkte']), 1200);
    } catch {
      this.showToast('Gabim gjatë ruajtjes. Provo sërish.', 'error');
    } finally {
      this.saving.set(false);
    }
  }

  goBack() { this.router.navigate(['/admin/produkte']); }

  private showToast(message: string, type: 'success' | 'error') {
    this.toast.set({ message, type });
    setTimeout(() => this.toast.set(null), 3500);
  }
}
