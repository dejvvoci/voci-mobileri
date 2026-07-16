import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // ─── PUBLIC ───────────────────────────────────────────────────────────────
  {
    path: '',
    loadComponent: () =>
      import('./public/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'produkt/:id',
    loadComponent: () =>
      import('./public/product-detail/product-detail.component')
        .then(m => m.ProductDetailComponent)
  },
  {
    path: 'rreth-nesh',
    loadComponent: () =>
      import('./public/about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'lokacioni',
    loadComponent: () =>
      import('./public/location/location.component').then(m => m.LocationComponent)
  },

  // ─── ADMIN ────────────────────────────────────────────────────────────────
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./admin/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./admin/dashboard/dashboard.component').then(m => m.DashboardComponent),
    children: [
      {
        path: '',
        redirectTo: 'produkte',
        pathMatch: 'full'
      },
      {
        path: 'produkte',
        loadComponent: () =>
          import('./admin/products/product-list.component')
            .then(m => m.ProductListComponent)
      },
      {
        path: 'produkte/shto',
        loadComponent: () =>
          import('./admin/products/product-form.component')
            .then(m => m.ProductFormComponent)
      },
      {
        path: 'produkte/ndrysho/:id',
        loadComponent: () =>
          import('./admin/products/product-form.component')
            .then(m => m.ProductFormComponent)
      },
      {
        path: 'kategori',
        loadComponent: () =>
          import('./admin/categories/categories.component')
            .then(m => m.CategoriesComponent)
      }
    ]
  },

  { path: '**', redirectTo: '' }
];