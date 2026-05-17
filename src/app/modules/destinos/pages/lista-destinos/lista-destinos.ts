import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DestinoService, Destino } from '../../../../core/services/destino.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-lista-destinos',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <!-- Hero Section -->
    <div class="hero-section">
      <div class="hero-content">
        <h1>Explore o mundo com <span>Travel<span>ly</span></span></h1>
        <p>Encontre os melhores destinos e planeje sua viagem perfeita</p>
        
        <div class="search-card">
          <div class="search-grid">
            <div class="search-item">
              <label>🌍 Destino</label>
              <input type="text" placeholder="Para onde você quer ir?" [(ngModel)]="filtroNome" (input)="filtrarDestinos()">
            </div>
            <div class="search-item">
              <label>📅 Data de ida</label>
              <input type="date">
            </div>
            <div class="search-item">
              <label>📅 Data de volta</label>
              <input type="date">
            </div>
            <button class="search-btn" (click)="carregarDestinos()">🔍 Pesquisar</button>
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
        <h2>Destinos em destaque</h2>
        <p>Os lugares mais desejados do momento</p>
      </div>

      <div *ngIf="carregando" class="loading">Carregando destinos...</div>

      <div *ngIf="!carregando && erro" class="error-message">
        <p>{{ erro }}</p>
        <button class="btn-retry" (click)="carregarDestinos()">Tentar novamente</button>
      </div>

      <div class="destinos-grid" *ngIf="!carregando && !erro">
        <div *ngFor="let destino of destinosFiltrados" class="destino-card">
          <div class="card-image">
            <img [src]="destino.imagem" [alt]="destino.nome" (error)="destino.imagem = 'https://placehold.co/400x300?text=Destino'">
            <div class="card-overlay">
              <span class="price">a partir de {{ destino.preco }} Kz</span>
            </div>
          </div>
          <div class="card-content">
            <h3>{{ destino.nome }}</h3>
            <p class="location">{{ destino.cidade }}, {{ destino.pais }}</p>
            <div class="rating">
              <span class="stars">★</span>
              <span>{{ destino.avaliacao || 4.5 }}</span>
              <span class="reviews">Excelente</span>
            </div>
            <button class="btn-details" [routerLink]="['/destino', destino.id]">Ver detalhes →</button>
          </div>
        </div>
      </div>

      <div *ngIf="!carregando && !erro && destinosFiltrados.length === 0" class="empty-state">
        Nenhum destino encontrado.
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      position: relative;
      min-height: 70vh;
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
      border-radius: 60px;
      padding: 8px;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .search-grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr auto;
      gap: 8px;
      align-items: end;
    }

    .search-item {
      text-align: left;
      padding: 8px 16px;
    }

    .search-item label {
      display: block;
      font-size: 0.75rem;
      color: #A0A8C6;
      margin-bottom: 4px;
    }

    .search-item input {
      width: 100%;
      background: transparent;
      border: none;
      color: white;
      font-size: 1rem;
      padding: 8px 0;
    }

    .search-btn {
      background: linear-gradient(135deg, #6C3BD4, #00D9FF);
      border: none;
      color: white;
      padding: 16px 32px;
      border-radius: 50px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .search-btn:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 20px rgba(108,59,212,0.4);
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
      .search-grid {
        grid-template-columns: 1fr;
      }
      .search-card {
        border-radius: 20px;
      }
      .search-btn {
        width: 100%;
      }
      .destinos-grid {
        grid-template-columns: 1fr;
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
    private notificationService: NotificationService
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
        } else {
          this.erro = 'Erro ao carregar destinos.';
          this.notificationService.error('Erro ao carregar destinos');
        }
      },
      error: (err) => {
        this.carregando = false;
        this.erro = 'Erro de conexão com o servidor.';
        this.notificationService.error('Erro de conexão');
        console.error('Erro:', err);
      }
    });
  }

  filtrarDestinos() {
    if (!this.filtroNome) {
      this.destinosFiltrados = [...this.destinos];
    } else {
      this.destinosFiltrados = this.destinos.filter(d => 
        d.nome.toLowerCase().includes(this.filtroNome.toLowerCase()) ||
        d.cidade.toLowerCase().includes(this.filtroNome.toLowerCase()) ||
        d.pais.toLowerCase().includes(this.filtroNome.toLowerCase())
      );
    }
  }
}