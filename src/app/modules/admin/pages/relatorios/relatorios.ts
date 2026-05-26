import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestinoService } from '../../../../core/services/destino.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ViagemService } from '../../../../core/services/viagem.service';
import { I18nService } from '../../../../core/services/i18n.service';
import { ThemeService } from '../../../../core/services/theme.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="relatorios-page">
      <div class="page-header">
        <div class="header-left">
          <button class="btn-back" (click)="voltar()">← {{ i18n.t('common.voltar') }}</button>
          <h1>📊 {{ i18n.t('relatorios.titulo') }}</h1>
        </div>
        <div class="header-right">
          <div class="export-buttons">
            <button class="btn-export-excel" (click)="exportarExcel()">📊 {{ i18n.t('relatorios.exportar_excel') }}</button>
            <button class="btn-print" (click)="imprimir()">🖨️ {{ i18n.t('relatorios.imprimir') }}</button>
          </div>
        </div>
      </div>

      <div *ngIf="carregando" class="loading">
        <div class="spinner"></div>
        <p>{{ i18n.t('common.carregando') }}</p>
      </div>

      <div *ngIf="!carregando">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🌍</div>
            <div class="stat-info">
              <h3>{{ totalDestinos }}</h3>
              <p>{{ i18n.t('relatorios.destinos') }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>{{ totalUsuarios }}</h3>
              <p>{{ i18n.t('relatorios.usuarios') }}</p>
              <small>{{ usuariosAdmin }} Admin | {{ usuariosCliente }} {{ i18n.t('relatorios.clientes') }}</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✈️</div>
            <div class="stat-info">
              <h3>{{ totalViagens }}</h3>
              <p>{{ i18n.t('relatorios.viagens') }}</p>
              <small>{{ viagensConfirmadas }} {{ i18n.t('relatorios.confirmadas') }} | {{ viagensPlanejadas }} {{ i18n.t('relatorios.planejadas') }}</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3>{{ totalFaturado | number }} Kz</h3>
              <p>{{ i18n.t('relatorios.faturamento') }}</p>
              <small>{{ i18n.t('relatorios.media') }}: {{ ticketMedio | number }} Kz</small>
            </div>
          </div>
        </div>

        <!-- Status das Viagens -->
        <div class="chart-card">
          <h3>📊 {{ i18n.t('relatorios.status_viagens') }}</h3>
          <div class="status-stats">
            <div class="status-item">
              <div class="status-color status-confirmada"></div>
              <div class="status-info">
                <span class="status-name">{{ i18n.t('status.confirmada') }}</span>
                <span class="status-value">{{ viagensConfirmadaPorcentagem }}%</span>
              </div>
            </div>
            <div class="status-item">
              <div class="status-color status-planejando"></div>
              <div class="status-info">
                <span class="status-name">{{ i18n.t('status.planejando') }}</span>
                <span class="status-value">{{ viagensPlanejandoPorcentagem }}%</span>
              </div>
            </div>
            <div class="status-item">
              <div class="status-color status-reservada"></div>
              <div class="status-info">
                <span class="status-name">{{ i18n.t('status.reservada') }}</span>
                <span class="status-value">{{ viagensReservadaPorcentagem }}%</span>
              </div>
            </div>
            <div class="status-item">
              <div class="status-color status-aguardando"></div>
              <div class="status-info">
                <span class="status-name">{{ i18n.t('status.aguardando') }}</span>
                <span class="status-value">{{ viagensAguardandoPorcentagem }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>🌟 {{ i18n.t('relatorios.destinos_populares') }}</h3>
          <div class="ranking-list">
            <div *ngFor="let destino of destinosPopulares; let i = index" class="ranking-item">
              <div class="ranking-position">{{ i + 1 }}º</div>
              <div class="ranking-info">
                <span class="ranking-name">{{ destino.nome }}</span>
                <span class="ranking-pais">{{ destino.pais }}</span>
              </div>
              <div class="ranking-value">{{ destino.total_viagens }} {{ i18n.t('relatorios.viagens') }}</div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>📋 {{ i18n.t('relatorios.ultimas_viagens') }}</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{{ i18n.t('gestao_viagens.destino') }}</th>
                <th>{{ i18n.t('gestao_viagens.data') }}</th>
                <th>{{ i18n.t('gestao_viagens.status') }}</th>
                <th>{{ i18n.t('gestao_viagens.valor') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let viagem of ultimasViagens">
                <td>{{ viagem.id }}</td>
                <td>{{ viagem.destino_nome }}</td>
                <td>{{ viagem.data_inicio | date:'dd/MM/yyyy' }}</td>
                <td>{{ getStatusTexto(viagem.status) }}</td>
                <td>{{ viagem.orcamento | number }} Kz</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .relatorios-page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .header-right { display: flex; align-items: center; gap: 12px; }
    .btn-back { background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); padding: 8px 16px; border-radius: 8px; color: #00D9FF; cursor: pointer; }
    .btn-back:hover { background: rgba(0,217,255,0.2); transform: translateX(-2px); }
    .page-header h1 { color: white; margin: 0; font-size: 1.8rem; }
    
    /* Language Selector */
    .lang-selector { position: relative; }
    .lang-btn { display: flex; align-items: center; gap: 6px; background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; padding: 8px 12px; color: #00D9FF; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
    .lang-btn:hover { background: rgba(0,217,255,0.2); }
    .lang-icon { transition: transform 0.2s; }
    .lang-selector:hover .lang-icon { transform: rotate(180deg); }
    .lang-dropdown { position: absolute; top: 100%; right: 0; margin-top: 8px; background: var(--bg-card-solid, #11123D); border: 1px solid rgba(0,217,255,0.2); border-radius: 12px; overflow: hidden; min-width: 140px; z-index: 100; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); }
    .lang-item { display: block; width: 100%; padding: 10px 16px; background: transparent; border: none; color: var(--text-secondary, #A0A8C6); font-size: 0.85rem; cursor: pointer; text-align: left; transition: all 0.2s; }
    .lang-item:hover { background: rgba(0,217,255,0.1); color: #00D9FF; }
    .lang-item.active { background: linear-gradient(135deg, #6C3BD4, #00D9FF); color: white; }
    
    /* Theme Button */
    .theme-btn { background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); border-radius: 8px; width: 36px; height: 36px; cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .theme-btn:hover { background: rgba(0,217,255,0.2); transform: scale(1.05); }
    
    .export-buttons { display: flex; gap: 12px; }
    .btn-export-excel, .btn-print { padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; }
    .btn-export-excel { background: #10B981; color: white; }
    .btn-print { background: #3B82F6; color: white; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .stat-card { background: linear-gradient(135deg, rgba(108,59,212,0.2), rgba(0,217,255,0.1)); border: 1px solid rgba(0,217,255,0.2); border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; }
    .stat-icon { font-size: 48px; }
    .stat-info h3 { color: white; font-size: 1.8rem; margin: 0; }
    .stat-info p { color: #A0A8C6; margin: 5px 0 0 0; }
    .stat-info small { color: #00D9FF; font-size: 0.7rem; }
    .chart-card { background: rgba(17,22,61,0.8); border: 1px solid rgba(0,217,255,0.1); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
    .chart-card h3 { color: white; margin: 0 0 20px 0; }
    .status-stats { display: flex; flex-direction: column; gap: 16px; }
    .status-item { display: flex; align-items: center; gap: 12px; }
    .status-color { width: 20px; height: 20px; border-radius: 4px; }
    .status-confirmada { background: #10B981; }
    .status-planejando { background: #F59E0B; }
    .status-reservada { background: #3B82F6; }
    .status-aguardando { background: #EF4444; }
    .status-info { flex: 1; display: flex; justify-content: space-between; }
    .status-name { color: #A0A8C6; }
    .status-value { color: white; font-weight: bold; }
    .ranking-list { display: flex; flex-direction: column; gap: 12px; }
    .ranking-item { display: flex; align-items: center; gap: 16px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 8px; }
    .ranking-position { font-size: 1.5rem; font-weight: bold; color: #00D9FF; min-width: 50px; }
    .ranking-info { flex: 1; }
    .ranking-name { display: block; color: white; font-weight: 500; }
    .ranking-pais { font-size: 0.8rem; color: #A0A8C6; }
    .ranking-value { color: #10B981; font-weight: bold; }
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(0,217,255,0.1); color: #A0A8C6; }
    .data-table th { color: white; }
    .loading { text-align: center; padding: 60px; color: #A0A8C6; }
    .spinner { width: 50px; height: 50px; border: 3px solid rgba(0,217,255,0.1); border-top-color: #00D9FF; border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; }
      .header-right { width: 100%; justify-content: flex-end; flex-wrap: wrap; }
      .export-buttons { width: 100%; justify-content: flex-end; }
    }
  `]
})
export class Relatorios implements OnInit {
  carregando = true;
  totalDestinos: number = 0;
  totalUsuarios: number = 0;
  usuariosAdmin: number = 0;
  usuariosCliente: number = 0;
  totalViagens: number = 0;
  viagensConfirmadas: number = 0;
  viagensPlanejadas: number = 0;
  viagensReservadas: number = 0;
  viagensAguardando: number = 0;
  totalFaturado: number = 0;
  ticketMedio: number = 0;
  destinosPopulares: any[] = [];
  ultimasViagens: any[] = [];
  langMenuOpen = false;
  
  viagensConfirmadaPorcentagem: number = 0;
  viagensPlanejandoPorcentagem: number = 0;
  viagensReservadaPorcentagem: number = 0;
  viagensAguardandoPorcentagem: number = 0;

  constructor(
    private destinoService: DestinoService,
    private usuarioService: UsuarioService,
    private viagemService: ViagemService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    public i18n: I18nService,
    public themeService: ThemeService
  ) {
    document.addEventListener('click', (event) => {
      if (!(event.target as Element).closest('.lang-selector')) {
        this.langMenuOpen = false;
      }
    });
  }

  ngOnInit() {
    this.carregarDados();
  }

  voltar() {
    this.router.navigate(['/admin/dashboard']);
  }

  getCurrentLangLabel(): string {
    const labels = { pt: 'PT', en: 'EN', fr: 'FR' };
    return labels[this.i18n.getCurrentLang()];
  }

  toggleLangMenu() {
    this.langMenuOpen = !this.langMenuOpen;
  }

  setLanguage(lang: 'pt' | 'en' | 'fr') {
    this.i18n.setLanguage(lang);
    this.langMenuOpen = false;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  getStatusTexto(status: string): string {
    const s = status?.toLowerCase() || '';
    if (s === 'confirmada' || s === 'confirmado') return this.i18n.t('status.confirmada');
    if (s === 'planejando' || s === 'planejada') return this.i18n.t('status.planejando');
    if (s === 'reservada' || s === 'reservado') return this.i18n.t('status.reservada');
    if (s === 'aguardando_pagamento' || s === 'aguardando') return this.i18n.t('status.aguardando');
    return status;
  }

  calcularPorcentagens() {
    if (this.totalViagens > 0) {
      this.viagensConfirmadaPorcentagem = Math.round((this.viagensConfirmadas / this.totalViagens) * 100);
      this.viagensPlanejandoPorcentagem = Math.round((this.viagensPlanejadas / this.totalViagens) * 100);
      this.viagensReservadaPorcentagem = Math.round((this.viagensReservadas / this.totalViagens) * 100);
      this.viagensAguardandoPorcentagem = Math.round((this.viagensAguardando / this.totalViagens) * 100);
    }
  }

  carregarDados() {
    this.destinoService.listar().subscribe({
      next: (res: any) => {
        if (res?.success && res.data) {
          this.totalDestinos = res.data.length;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Erro destinos:', err)
    });

    this.usuarioService.listar().subscribe({
      next: (res: any) => {
        if (res?.success && res.data) {
          this.totalUsuarios = res.data.length;
          this.usuariosAdmin = res.data.filter((u: any) => u.tipo === 'admin').length;
          this.usuariosCliente = res.data.filter((u: any) => u.tipo === 'cliente').length;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Erro usuarios:', err)
    });

    this.viagemService.listar().subscribe({
      next: (res: any) => {
        this.carregando = false;
        if (res?.success && res.data) {
          const viagens = res.data;
          this.totalViagens = viagens.length;
          this.viagensConfirmadas = viagens.filter((v: any) => v.status === 'confirmada').length;
          this.viagensPlanejadas = viagens.filter((v: any) => v.status === 'planejando').length;
          this.viagensReservadas = viagens.filter((v: any) => v.status === 'reservada').length;
          this.viagensAguardando = viagens.filter((v: any) => v.status === 'aguardando_pagamento').length;
          this.totalFaturado = viagens.reduce((sum: number, v: any) => sum + (v.valor_pago || 0), 0);
          this.ticketMedio = this.totalViagens > 0 ? this.totalFaturado / this.totalViagens : 0;
          
          this.calcularPorcentagens();
          
          const contagem = new Map();
          viagens.forEach((v: any) => {
            contagem.set(v.destino_id, (contagem.get(v.destino_id) || 0) + 1);
          });
          
          this.destinoService.listar().subscribe({
            next: (destRes: any) => {
              if (destRes?.success && destRes.data) {
                this.destinosPopulares = destRes.data
                  .map((d: any) => ({
                    nome: d.nome,
                    pais: d.pais,
                    total_viagens: contagem.get(d.id) || 0
                  }))
                  .sort((a: any, b: any) => b.total_viagens - a.total_viagens)
                  .slice(0, 5);
                this.cdr.detectChanges();
              }
            }
          });
          
          this.ultimasViagens = viagens.slice(0, 5);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Erro viagens:', err);
        this.carregando = false;
        this.cdr.detectChanges();
      }
    });
  }

  exportarExcel() {
    const dadosRelatorio = [
      ['RELATÓRIO DE ESTATÍSTICAS - TRAVEL LY'],
      ['Data:', new Date().toLocaleString()],
      [''],
      ['INDICADORES GERAIS'],
      ['Indicador', 'Valor'],
      ['Total de Destinos', this.totalDestinos],
      ['Total de Usuários', this.totalUsuarios],
      ['Administradores', this.usuariosAdmin],
      ['Clientes', this.usuariosCliente],
      ['Total de Viagens', this.totalViagens],
      ['Viagens Confirmadas', this.viagensConfirmadas],
      ['Viagens Planejando', this.viagensPlanejadas],
      ['Viagens Reservadas', this.viagensReservadas],
      ['Viagens Aguardando Pagamento', this.viagensAguardando],
      ['Faturamento Total', this.totalFaturado + ' Kz'],
      ['Ticket Médio', this.ticketMedio + ' Kz'],
      [''],
      ['STATUS DAS VIAGENS'],
      ['Status', 'Quantidade', 'Percentual'],
      [this.i18n.t('status.confirmada'), this.viagensConfirmadas, this.viagensConfirmadaPorcentagem + '%'],
      [this.i18n.t('status.planejando'), this.viagensPlanejadas, this.viagensPlanejandoPorcentagem + '%'],
      [this.i18n.t('status.reservada'), this.viagensReservadas, this.viagensReservadaPorcentagem + '%'],
      [this.i18n.t('status.aguardando'), this.viagensAguardando, this.viagensAguardandoPorcentagem + '%'],
      [''],
      ['DESTINOS MAIS POPULARES'],
      ['Posição', 'Destino', 'País', 'Total de Viagens']
    ];

    this.destinosPopulares.forEach((destino, index) => {
      dadosRelatorio.push([(index + 1).toString(), destino.nome, destino.pais, destino.total_viagens.toString()]);
    });

    dadosRelatorio.push(['']);
    dadosRelatorio.push(['ÚLTIMAS VIAGENS']);
    dadosRelatorio.push(['ID', 'Destino', 'Data Início', 'Status', 'Valor (Kz)']);

    this.ultimasViagens.forEach(viagem => {
      dadosRelatorio.push([
        viagem.id.toString(),
        viagem.destino_nome,
        viagem.data_inicio,
        this.getStatusTexto(viagem.status),
        viagem.orcamento.toString()
      ]);
    });

    const ws = XLSX.utils.aoa_to_sheet(dadosRelatorio);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatorios');
    
    ws['!cols'] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 25 },
      { wch: 25 },
      { wch: 20 }
    ];
    
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const dataAtual = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    saveAs(data, `relatorio_travelly_${dataAtual}.xlsx`);
  }

  imprimir() {
    window.print();
  }
}