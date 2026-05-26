// core/services/theme.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkSignal = signal<boolean>(true);
  public isDark = this.isDarkSignal.asReadonly();

  constructor() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkSignal.set(savedTheme === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkSignal.set(prefersDark);
    }
    this.applyTheme();
  }

  toggleTheme() {
    this.isDarkSignal.update(value => !value);
    this.applyTheme();
    localStorage.setItem('theme', this.isDarkSignal() ? 'dark' : 'light');
  }

  private applyTheme() {
    const body = document.body;
    if (this.isDarkSignal()) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }
  }
}