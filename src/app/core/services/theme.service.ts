import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkSignal = signal<boolean>(false);
  public isDark = this.isDarkSignal.asReadonly();

  constructor() {
    const saved = localStorage.getItem('theme');
    const isDark = saved === 'dark';
    this.isDarkSignal.set(isDark);
    this.aplicarTema();

    effect(() => {
      this.aplicarTema();
      localStorage.setItem('theme', this.isDarkSignal() ? 'dark' : 'light');
    });
  }

  toggle(): void {
    this.isDarkSignal.update(v => !v);
  }

  private aplicarTema(): void {
    if (this.isDarkSignal()) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }
}