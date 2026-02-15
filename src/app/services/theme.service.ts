import {effect, Injectable, signal} from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({providedIn: 'root'})
export class ThemeService {
  readonly #THEME_KEY = 'theme';
  theme = signal<Theme>(this.#getInitialTheme());

  constructor() {
    effect(() => {
      const current = this.theme();
      document.documentElement.classList.toggle('dark', current === 'dark');
      localStorage.setItem(this.#THEME_KEY, current);
    });
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => this.#handleSystemChange(e));
  }

  toggleTheme() {
    this.theme.update(t => t === 'light' ? 'dark' : 'light');
  }

  #handleSystemChange(e: MediaQueryListEvent) {
    if (!localStorage.getItem(this.#THEME_KEY)) {
      this.theme.set(e.matches ? 'dark' : 'light');
    }
  }

  #getInitialTheme(): Theme {
    const saved = localStorage.getItem(this.#THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
