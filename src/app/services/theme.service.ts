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
  }

  toggleTheme() {
    this.theme.update(theme => theme === 'light' ? 'dark' : 'light');
  }

  #getInitialTheme(): Theme {
    const saved = localStorage.getItem(this.#THEME_KEY);
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}
