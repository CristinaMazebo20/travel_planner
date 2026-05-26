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
    <!-- Hero Section -->
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

      <!-- Resultados da busca -->
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
    .hero-section {
      position: relative;
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0A0F2E 0%, #1A1F4E 100%);
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
      background: linear-gradient(135deg, #fff 0%, #00D9FF 50%, #6C3BD4 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .hero-content h1 span {
      background: linear-gradient(135deg, #6C3BD4, #FF2E9A);
      -webkit-background-clip: text;
      background-clip: text;
    }

    .hero-content p {
      font-size: 1.2rem;
      color: #A0A8C6;
      margin-bottom: 40px;
    }

    .search-card {
      background: rgba(255,255,255,0.05);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      padding: 24px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .search-grid {
      display: flex;
      justify-content: center;
    }

    .search-item-full {
      width: 100%;
      max-width: 600px;
    }

    .search-item-full label {
      display: block;
      font-size: 0.85rem;
      color: #00D9FF;
      margin-bottom: 8px;
      text-align: left;
    }

    .search-input-wrapper {
      display: flex;
      gap: 12px;
    }

    .search-input {
      flex: 1;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(0, 217, 255, 0.3);
      border-radius: 12px;
      padding: 14px 18px;
      color: white;
      font-size: 1rem;
      transition: all 0.3s;
    }

    .search-input:focus {
      outline: none;
      border-color: #00D9FF;
      box-shadow: 0 0 10px rgba(0, 217, 255, 0.2);
    }

    .search-input::placeholder {
      color: #6B7280;
    }

    .search-btn {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
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
      box-shadow: 0 4px 20px rgba(108,59,212,0.4);
    }

    .search-result-info {
      background: rgba(0, 217, 255, 0.1);
      border: 1px solid rgba(0, 217, 255, 0.2);
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
      color: #A0A8C6;
      margin: 0;
    }

    .search-result-info strong {
      color: #00D9FF;
    }

    .btn-clear-filter {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.3);
      border-radius: 8px;
      padding: 6px 14px;
      color: #EF4444;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.85rem;
    }

    .btn-clear-filter:hover {
      background: rgba(239, 68, 68, 0.3);
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
      background: radial-gradient(circle, rgba(108,59,212,0.3) 0%, transparent 70%);
      border-radius: 50%;
    }

    .gradient-2 {
      position: absolute;
      bottom: -50%;
      right: -20%;
      width: 80%;
      height: 80%;
      background: radial-gradient(circle, rgba(0,217,255,0.2) 0%, transparent 70%);
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
      color: white;
    }

    .section-header p {
      color: #A0A8C6;
    }

    .destinos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 30px;
    }

    .destino-card {
      background: rgba(17, 22, 61, 0.8);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      overflow: hidden;
      border: 1px solid rgba(0,217,255,0.1);
      transition: all 0.4s;
    }

    .destino-card:hover {
      transform: translateY(-8px);
      border-color: rgba(0,217,255,0.3);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
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
      background: linear-gradient(transparent, rgba(0,0,0,0.7));
      padding: 20px;
    }

    .price {
      color: white;
      font-weight: 700;
      font-size: 1rem;
      background: rgba(0,0,0,0.5);
      padding: 4px 12px;
      border-radius: 20px;
    }

    .card-content {
      padding: 20px;
    }

    .card-content h3 {
      font-size: 1.2rem;
      margin-bottom: 6px;
      color: white;
    }

    .location {
      color: #00D9FF;
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
      color: #A0A8C6;
      font-size: 0.8rem;
    }

    .btn-details {
      width: 100%;
      padding: 12px;
      background: transparent;
      border: 1px solid rgba(0,217,255,0.3);
      color: #A0A8C6;
      border-radius: 30px;
      cursor: pointer;
      transition: all 0.3s;
      font-weight: 500;
    }

    .btn-details:hover {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border-color: transparent;
      color: white;
    }

    .loading, .empty-state {
      text-align: center;
      padding: 60px;
      color: #A0A8C6;
    }

    .error-message {
      text-align: center;
      padding: 60px;
      color: #EF4444;
    }

    .btn-retry {
      margin-top: 16px;
      padding: 10px 24px;
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border: none;
      border-radius: 30px;
      color: white;
      cursor: pointer;
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