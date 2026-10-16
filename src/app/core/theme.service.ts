import { Injectable, computed, effect, signal } from '@angular/core';

export type Theme = 'dark' | 'light';

const STORAGE_KEY = 'portfolio-theme';
const META_COLORS: Record<Theme, string> = { dark: '#070b17', light: '#f4f6fb' };

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<Theme>(this.initialTheme());
  readonly isDark = computed(() => this.theme() === 'dark');

  constructor() {
    // Re-applies whenever the signal changes — no page reload needed.
    effect(() => this.apply(this.theme()));
  }

  toggle(): void {
    this.theme.update(current => (current === 'dark' ? 'light' : 'dark'));
  }

  private initialTheme(): Theme {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
    } catch { /* storage unavailable */ }
    return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  private apply(theme: Theme): void {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', META_COLORS[theme]);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch { /* storage unavailable */ }
  }
}
