// modules/destinos/pages/lista-destinos/lista-destinos.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DestinoService, Destino } from '../../../../core/services/destino.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { I18nService } from '../../../../core/services/i18n.service';

@Component({
  selector: 'app-lista-destinos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="hero-section">
      <div class="hero-content">
        <h1>{{ i18n.t('destinos.hero_title') }} <span>Travel<span>ly</span></span></h1>
        <p>{{ i18n.t('destinos.hero_subtitle') }}</p>
        
        <div class="search-card">
          <div class="search-grid">
            <div class="search-item search-item-full">
              <label>🔍 {{ i18n.t('destinos.pesquisar') }}</label>
              <div class="search-input-wrapper">
                <input 
                  type="text" 
                  [placeholder]="i18n.t('destinos.destino_placeholder')" 
                  [(ngModel)]="filtroNome" 
                  (keyup.enter)="pesquisar()"
                  class="search-input">
                <button class="search-btn" (click)="pesquisar()">
                  🔍 {{ i18n.t('destinos.pesquisar') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="hero-bg">
        <div class="gradient-1"></div>
        <div class="gradient-2"></div>
      </div>
    </div>

    <div class="container">
      <div class="section-header">
        <h2>{{ i18n.t('destinos.destaques') }}</h2>
        <p>{{ i18n.t('destinos.destaques_sub') }}</p>
      </div>

      <div *ngIf="filtroNome && !carregando" class="search-result-info">
        <p>🔍 {{ i18n.t('destinos.resultados_para') }}: <strong>"{{ filtroNome }}"</strong> 
        ({{ destinosFiltrados.length }} {{ i18n.t('destinos.resultados_encontrados') }})</p>
        <button class="btn-clear-filter" (click)="limparFiltro()">✖ {{ i18n.t('destinos.limpar_filtro') }}</button>
      </div>

      <div *ngIf="carregando" class="loading">{{ i18n.t('common.carregando') }}</div>

      <div *ngIf="!carregando && erro" class="error-message">
        <p>{{ erro }}</p>
        <button class="btn-retry" (click)="carregarDestinos()">{{ i18n.t('common.tentar_novamente') }}</button>
      </div>

      <div class="destinos-grid" *ngIf="!carregando && !erro">
        <div *ngFor="let destino of destinosFiltrados" class="destino-card">
          <div class="card-image">
            <img [src]="destino.imagem" [alt]="destino.nome" (error)="destino.imagem = 'https://placehold.co/400x300?text=Destino'">
            <div class="card-overlay">
              <span class="price">{{ i18n.t('destinos.a_partir_de') }} {{ destino.preco | number }} Kz</span>
            </div>
          </div>
          <div class="card-content">
            <h3>{{ destino.nome }}</h3>
            <p class="location">{{ destino.cidade }}, {{ destino.pais }}</p>
            <div class="rating">
              <span class="stars">★</span>
              <span>{{ destino.avaliacao || 4.5 }}</span>
              <span class="reviews">{{ i18n.t('destinos.excelente') }}</span>
            </div>
            <button class="btn-details" [routerLink]="['/destino', destino.id]">{{ i18n.t('destinos.ver_detalhes') }} →</button>
          </div>
        </div>
      </div>

      <div *ngIf="!carregando && !erro && destinosFiltrados.length === 0 && filtroNome" class="empty-state">
        {{ i18n.t('destinos.nenhum_resultado') }}
      </div>

      <div *ngIf="!carregando && !erro && destinosFiltrados.length === 0 && !filtroNome" class="empty-state">
        {{ i18n.t('destinos.nenhum_encontrado') }}
      </div>
    </div>
  `,
  styles: [`
    /* Hero Section - Dark Mode (padrão) */
    .hero-section {
      position: relative;
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
      padding: 80px 20px 60px;
      overflow: hidden;
    }

    .hero-content {
      position: relative;
      z-index: 2;
      text-align: center;
      max-width: 900px;
    }

    .hero-content h1 {
      font-size: 3.5rem;
      font-weight: 800;
      margin-bottom: 20px;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--color-secondary) 50%, var(--color-primary) 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .hero-content h1 span {
      background: linear-gradient(135deg, var(--color-primary), #FF2E9A);
      -webkit-background-clip: text;
      background-clip: text;
    }

    .hero-content p {
      font-size: 1.2rem;
      color: var(--text-secondary);
      margin-bottom: 40px;
    }

    .search-card {
      background: var(--bg-card);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 24px;
      border: 1px solid var(--border-color);
    }

    .search-item-full label {
      display: block;
      font-size: 0.85rem;
      color: var(--color-secondary);
      margin-bottom: 8px;
      text-align: left;
    }

    .search-input-wrapper {
      display: flex;
      gap: 12px;
    }

    .search-input {
      flex: 1;
      background: var(--bg-input);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 14px 18px;
      color: var(--text-primary);
      font-size: 1rem;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: var(--color-secondary);
      box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
    }

    .search-input::placeholder {
      color: var(--text-muted);
    }

    .search-btn {
      background: var(--gradient-primary);
      border: none;
      color: white;
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .search-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 20px rgba(108, 59, 212, 0.4);
    }

    .hero-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
    }

    .gradient-1 {
      position: absolute;
      top: -50%;
      left: -20%;
      width: 80%;
      height: 80%;
      background: radial-gradient(circle, rgba(108, 59, 212, 0.3) 0%, transparent 70%);
      border-radius: 50%;
    }

    .gradient-2 {
      position: absolute;
      bottom: -50%;
      right: -20%;
      width: 80%;
      height: 80%;
      background: radial-gradient(circle, rgba(0, 217, 255, 0.2) 0%, transparent 70%);
      border-radius: 50%;
    }

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 60px 24px;
    }

    .section-header {
      text-align: center;
      margin-bottom: 48px;
    }

    .section-header h2 {
      font-size: 2rem;
      margin-bottom: 12px;
      color: var(--text-primary);
    }

    .section-header p {
      color: var(--text-secondary);
    }

    .search-result-info {
      background: var(--bg-hover);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 12px 20px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
    }

    .search-result-info p {
      color: var(--text-secondary);
      margin: 0;
    }

    .search-result-info strong {
      color: var(--color-secondary);
    }

    .btn-clear-filter {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      padding: 6px 14px;
      color: #EF4444;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.85rem;
    }

    .btn-clear-filter:hover {
      background: rgba(239, 68, 68, 0.25);
    }

    .destinos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 30px;
    }

    .destino-card {
      background: var(--bg-card);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid var(--border-color);
      transition: all 0.4s;
    }

    .destino-card:hover {
      transform: translateY(-8px);
      border-color: var(--color-secondary);
      box-shadow: var(--shadow-lg);
    }

    .card-image {
      position: relative;
      height: 220px;
      overflow: hidden;
    }

    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s;
    }

    .destino-card:hover .card-image img {
      transform: scale(1.05);
    }

    .card-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
      padding: 20px;
    }

    .price {
      color: white;
      font-weight: 700;
      font-size: 1rem;
      background: rgba(0, 0, 0, 0.5);
      padding: 4px 12px;
      border-radius: 20px;
    }

    .card-content {
      padding: 20px;
    }

    .card-content h3 {
      font-size: 1.2rem;
      margin-bottom: 6px;
      color: var(--text-primary);
    }

    .location {
      color: var(--color-secondary);
      font-size: 0.85rem;
      margin-bottom: 12px;
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 16px;
    }

    .stars {
      color: #FFD700;
    }

    .reviews {
      color: var(--text-secondary);
      font-size: 0.8rem;
    }

    .btn-details {
      width: 100%;
      padding: 12px;
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-secondary);
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }

    .btn-details:hover {
      background: var(--gradient-primary);
      border-color: transparent;
      color: white;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 60px;
      color: var(--text-secondary);
    }

    .error-message {
      text-align: center;
      padding: 60px;
      color: #EF4444;
    }

    .btn-retry {
      margin-top: 16px;
      padding: 10px 24px;
      background: var(--gradient-primary);
      border: none;
      border-radius: 30px;
      color: white;
      cursor: pointer;
    }

    /* Light Mode Specific Overrides */
    body.light-theme .hero-section {
      background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
    }

    body.light-theme .search-card {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }

    body.light-theme .search-input {
      background: #F9FAFB;
      border-color: #E2E8F0;
      color: #1E293B;
    }

    body.light-theme .search-input::placeholder {
      color: #94A3B8;
    }

    body.light-theme .destino-card {
      background: #FFFFFF;
      border-color: #E2E8F0;
    }

    body.light-theme .destino-card:hover {
      border-color: #3B82F6;
    }

    body.light-theme .card-content h3 {
      color: #1E293B;
    }

    body.light-theme .location {
      color: #3B82F6;
    }

    body.light-theme .reviews {
      color: #64748B;
    }

    body.light-theme .btn-details {
      border-color: #E2E8F0;
      color: #64748B;
    }

    body.light-theme .btn-details:hover {
      background: linear-gradient(135deg, #6C3BD4, #3B82F6);
      color: white;
    }

    body.light-theme .search-result-info {
      background: #F1F5F9;
      border-color: #E2E8F0;
    }

    body.light-theme .search-result-info p {
      color: #64748B;
    }

    body.light-theme .section-header h2 {
      color: #1E293B;
    }

    body.light-theme .section-header p {
      color: #64748B;
    }

    body.light-theme .gradient-1 {
      background: radial-gradient(circle, rgba(108, 59, 212, 0.1) 0%, transparent 70%);
    }

    body.light-theme .gradient-2 {
      background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
    }

    @media (max-width: 768px) {
      .hero-content h1 {
        font-size: 2rem;
      }
      .search-input-wrapper {
        flex-direction: column;
      }
      .search-btn {
        width: 100%;
      }
      .destinos-grid {
        grid-template-columns: 1fr;
      }
      .search-result-info {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class ListaDestinos implements OnInit {
  destinos: Destino[] = [];
  destinosFiltrados: Destino[] = [];
  carregando = true;
  erro = '';
  filtroNome = '';

  constructor(
    private destinoService: DestinoService,
    private notificationService: NotificationService,
    public i18n: I18nService
  ) {}

  ngOnInit(): void {
    this.carregarDestinos();
  }

  carregarDestinos() {
    this.carregando = true;
    this.erro = '';
    
    this.destinoService.listar().subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success && response.data) {
          this.destinos = response.data;
          this.destinosFiltrados = [...this.destinos];
          console.log('Destinos carregados:', this.destinos.length);
        } else {
          this.erro = this.i18n.t('destinos.erro_carregar');
          this.notificationService.error(this.i18n.t('destinos.erro_carregar'));
        }
      },
      error: (err) => {
        this.carregando = false;
        this.erro = this.i18n.t('destinos.erro_conexao');
        this.notificationService.error(this.i18n.t('destinos.erro_conexao'));
        console.error('Erro:', err);
      }
    });
  }

  pesquisar() {
    console.log('Pesquisando com termo:', this.filtroNome);
    
    if (!this.filtroNome || this.filtroNome.trim() === '') {
      this.destinosFiltrados = [...this.destinos];
    } else {
      const termo = this.filtroNome.toLowerCase().trim();
      this.destinosFiltrados = this.destinos.filter(destino => {
        return destino.nome.toLowerCase().includes(termo) ||
               destino.cidade.toLowerCase().includes(termo) ||
               destino.pais.toLowerCase().includes(termo);
      });
    }
    
    console.log('Resultados encontrados:', this.destinosFiltrados.length);
  }

  limparFiltro() {
    this.filtroNome = '';
    this.destinosFiltrados = [...this.destinos];
  }
}