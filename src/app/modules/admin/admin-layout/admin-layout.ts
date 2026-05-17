import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
    <div class="admin-layout">
      <main class="admin-main">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .admin-layout {
      min-height: 100vh;
      background: linear-gradient(135deg, #0A0F2E 0%, #1A1F4E 100%);
    }
    .admin-main {
      padding: 24px;
    }
  `]
})
export class AdminLayout {}