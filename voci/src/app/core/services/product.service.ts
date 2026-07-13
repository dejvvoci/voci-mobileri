import { Injectable, inject } from '@angular/core';
import {
  Firestore, collection, collectionData, doc, docData,
  addDoc, updateDoc, deleteDoc, query, orderBy, where,
  serverTimestamp
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import imageCompression from 'browser-image-compression';
import { Category, Product, ProductImage, UploadProgress } from '../models/models';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private firestore = inject(Firestore);

  private readonly CLOUDINARY_URL =
    `https://api.cloudinary.com/v1_1/${environment.cloudinary.cloudName}/auto/upload`;

  // ─── CATEGORIES ────────────────────────────────────────────────────────────

  getCategories(): Observable<Category[]> {
    const colRef = collection(this.firestore, 'categories');
    const q = query(colRef, orderBy('order', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Category[]>;
  }

  async addCategory(cat: Omit<Category, 'id'>): Promise<void> {
    const colRef = collection(this.firestore, 'categories');
    await addDoc(colRef, { ...cat, createdAt: serverTimestamp() });
  }

  async updateCategory(id: string, data: Partial<Category>): Promise<void> {
    const docRef = doc(this.firestore, 'categories', id);
    await updateDoc(docRef, data);
  }

  async deleteCategory(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'categories', id);
    await deleteDoc(docRef);
  }

  // ─── PRODUCTS ──────────────────────────────────────────────────────────────

  getProducts(): Observable<Product[]> {
    const colRef = collection(this.firestore, 'products');
    const q = query(colRef, orderBy('order', 'asc'));
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  getProductsByCategory(categoryId: string): Observable<Product[]> {
    const colRef = collection(this.firestore, 'products');
    const q = query(colRef,
      where('categoryId', '==', categoryId),
      orderBy('order', 'asc')
    );
    return collectionData(q, { idField: 'id' }) as Observable<Product[]>;
  }

  getProduct(id: string): Observable<Product> {
    const docRef = doc(this.firestore, 'products', id);
    return docData(docRef, { idField: 'id' }) as Observable<Product>;
  }

  async addProduct(product: Omit<Product, 'id'>): Promise<string> {
    const colRef = collection(this.firestore, 'products');
    const docRef = await addDoc(colRef, {
      ...product,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  async updateProduct(id: string, data: Partial<Product>): Promise<void> {
    const docRef = doc(this.firestore, 'products', id);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  }

  async deleteProduct(product: Product): Promise<void> {
    // Fshi imazhet nga Cloudinary (opsionale — public_id duhet ruajtur)
    const deletePromises = product.images
      .filter(img => img.publicId)
      .map(img => this.deleteFromCloudinary(img.publicId!));
    await Promise.allSettled(deletePromises);

    // Fshi dokumentin nga Firestore
    const docRef = doc(this.firestore, 'products', product.id!);
    await deleteDoc(docRef);
  }

  // ─── CLOUDINARY IMAGE UPLOAD ───────────────────────────────────────────────

  async compressImage(file: File): Promise<File> {
    const options = {
      maxSizeMB: 0.6,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      initialQuality: 0.85
    };
    try {
      return await imageCompression(file, options);
    } catch {
      return file;
    }
  }

  async uploadToCloudinary(
    file: File,
    onProgress: (progress: number) => void
  ): Promise<{ url: string; publicId: string }> {
    const isVideo = file.type.startsWith('video/');
    const toUpload = isVideo ? file : await this.compressImage(file);

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', toUpload);
      formData.append('upload_preset', environment.cloudinary.uploadPreset);
      formData.append('folder', 'voci/products');

      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          onProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          resolve({
            url: response.secure_url,
            publicId: response.public_id
          });
        } else {
          reject(new Error(`Cloudinary error: ${xhr.status}`));
        }
      });

      xhr.addEventListener('error', () => reject(new Error('Gabim rrjeti gjatë ngarkimit')));

      xhr.open('POST', this.CLOUDINARY_URL);
      xhr.send(formData);
    });
  }

  async deleteFromCloudinary(publicId: string): Promise<void> {
    // Fshirja e Cloudinary kërkon backend/signed request
    // Imazhet e vjetra mbeten në Cloudinary por nuk shfaqen në app
    // Për fshirje të plotë mund të bëhet manualisht nga Cloudinary Dashboard
    console.log('Image to clean from Cloudinary:', publicId);
  }

  async uploadMultipleImages(
    files: File[],
    onProgress: (uploads: UploadProgress[]) => void
  ): Promise<ProductImage[]> {
    const uploads: UploadProgress[] = files.map(f => ({
      file: f,
      progress: 0,
      status: 'pending'
    }));

    const results: ProductImage[] = [];

    for (let i = 0; i < files.length; i++) {
      uploads[i].status = 'uploading';
      onProgress([...uploads]);

      try {
        const result = await this.uploadToCloudinary(
          files[i],
          (progress) => {
            uploads[i].progress = progress;
            onProgress([...uploads]);
          }
        );

        uploads[i].status = 'done';
        uploads[i].url = result.url;
        onProgress([...uploads]);

        results.push({
          url: result.url,
          publicId: result.publicId,
          storagePath: result.publicId, // ruajmë publicId edhe këtu për kompatibilitet
          isPrimary: results.length === 0,
          order: results.length,
          type: files[i].type.startsWith('video/') ? 'video' : 'image'
        });
      } catch {
        uploads[i].status = 'error';
        onProgress([...uploads]);
      }
    }

    return results;
  }

  // Fshi një imazh individual (hiqe nga lista, Cloudinary pastrohet manualisht)
  async deleteImageFromStorage(_storagePath: string): Promise<void> {
    // Me Cloudinary unsigned, fshirja bëhet nga Dashboard ose me backend
    // Për momentin hiqet vetëm nga Firestore
  }
}
