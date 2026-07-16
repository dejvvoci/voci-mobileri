import { Injectable, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const STORAGE_KEY = 'voci_favorites';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  ids = signal<string[]>(this.isBrowser ? this.load() : []);

  private load(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private persist(ids: string[]) {
    if (!this.isBrowser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }

  has(id: string): boolean {
    return this.ids().includes(id);
  }

  toggle(id: string) {
    const current = this.ids();
    const next = current.includes(id) ? current.filter(x => x !== id) : [...current, id];
    this.ids.set(next);
    this.persist(next);
  }

  clear() {
    this.ids.set([]);
    this.persist([]);
  }
}
