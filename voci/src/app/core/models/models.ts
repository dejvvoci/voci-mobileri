export interface Category {
  id?: string;
  name: string;
  slug: string;
  order: number;
  createdAt?: Date;
}

export interface Product {
  id?: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  material: string;
  dimensions: string;
  price: number | null;       // null = "Pyet për çmim"
  images: ProductImage[];
  featured: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductImage {
  url: string;           // Cloudinary secure_url
  publicId?: string;     // Cloudinary public_id
  storagePath: string;   // I njëjtë me publicId, për kompatibilitet
  isPrimary: boolean;
  order: number;
}

export interface AdminUser {
  uid: string;
  email: string;
}

export interface UploadProgress {
  file: File;
  progress: number;
  url?: string;
  publicId?: string;
  storagePath?: string;
  error?: string;
  status: 'pending' | 'uploading' | 'done' | 'error';
}
