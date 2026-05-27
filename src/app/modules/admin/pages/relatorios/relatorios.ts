// modules/admin/pages/relatorios/relatorios.ts
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
          <button class="btn-back" (click)="voltar()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            {{ i18n.t('common.voltar') }}
          </button>
          <h1>
            <svg class="header-icon" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            {{ i18n.t('relatorios.titulo') }}
          </h1>
        </div>
        <div class="header-right">
          <div class="export-buttons">
            <button class="btn-export-excel" (click)="exportarExcel()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="8" y1="13" x2="16" y2="13"/>
                <line x1="8" y1="17" x2="16" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              {{ i18n.t('relatorios.exportar_excel') }}
            </button>
            <button class="btn-print" (click)="imprimir()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M6 9V3h12v6M6 21h12v-6H6v6z"/>
                <path d="M18 9H6a3 3 0 0 0-3 3v6a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3v-6a3 3 0 0 0-3-3z"/>
                <circle cx="17" cy="15" r="1"/>
              </svg>
              {{ i18n.t('relatorios.imprimir') }}
            </button>
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
            <div class="stat-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
                <circle cx="12" cy="12" r="10"/>
                <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ totalDestinos }}</h3>
              <p>{{ i18n.t('relatorios.destinos') }}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
                <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21"/>
                <circle cx="12" cy="7" r="4"/>
                <path d="M17 3C19.2 3 21 4.8 21 7"/>
                <path d="M7 3C4.8 3 3 4.8 3 7"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ totalUsuarios }}</h3>
              <p>{{ i18n.t('relatorios.usuarios') }}</p>
              <small>{{ usuariosAdmin }} Admin | {{ usuariosCliente }} {{ i18n.t('relatorios.clientes') }}</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
                <path d="M3 15L6 12L9 15L12 12L15 15L18 12L21 15"/>
                <path d="M3 9L6 6L9 9L12 6L15 9L18 6L21 9"/>
                <path d="M3 19L6 16L9 19L12 16L15 19L18 16L21 19"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ totalViagens }}</h3>
              <p>{{ i18n.t('relatorios.viagens') }}</p>
              <small>{{ viagensConfirmadas }} {{ i18n.t('relatorios.confirmadas') }} | {{ viagensPlanejadas }} {{ i18n.t('relatorios.planejadas') }}</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 6v6l4 2"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ totalFaturado | number }} Kz</h3>
              <p>{{ i18n.t('relatorios.faturamento') }}</p>
              <small>{{ i18n.t('relatorios.media') }}: {{ ticketMedio | number:'1.0-0' }} Kz</small>
            </div>
          </div>
        </div>

        <!-- Status das Viagens -->
        <div class="chart-card">
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
            </svg>
            {{ i18n.t('relatorios.status_viagens') }}
          </h3>
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
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12H22M12 2C14.5 4.5 15.5 8 12 12C8.5 8 9.5 4.5 12 2Z"/>
            </svg>
            {{ i18n.t('relatorios.destinos_populares') }}
          </h3>
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
          <h3>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ i18n.t('relatorios.ultimas_viagens') }}
          </h3>
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
    .relatorios-page { 
      padding: 24px; 
      min-height: 100vh;
      background: var(--bg-primary);
    }
    
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .header-right { display: flex; align-items: center; gap: 12px; }
    
    .btn-back { display: flex; align-items: center; gap: 8px; background: var(--bg-input); border: 1px solid var(--border-color); padding: 8px 16px; border-radius: 8px; color: var(--color-secondary); cursor: pointer; transition: all 0.2s; }
    .btn-back:hover { background: var(--bg-hover); transform: translateX(-2px); }
    .page-header h1 { display: inline-flex; align-items: center; gap: 8px; color: var(--text-primary); margin: 0; font-size: 1.8rem; }
    .header-icon { stroke: var(--color-secondary); }
    
    .export-buttons { display: flex; gap: 12px; }
    .btn-export-excel, .btn-print { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-export-excel { background: #10B981; color: white; }
    .btn-print { background: #3B82F6; color: white; }
    .btn-export-excel:hover, .btn-print:hover { transform: translateY(-2px); }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 32px; }
    .stat-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: all 0.3s; }
    .stat-card:hover { transform: translateY(-4px); border-color: var(--color-secondary); }
    .stat-icon { stroke: var(--color-secondary); }
    .stat-info h3 { color: var(--text-primary); font-size: 1.8rem; margin: 0; }
    .stat-info p { color: var(--text-secondary); margin: 5px 0 0 0; }
    .stat-info small { color: var(--color-secondary); font-size: 0.7rem; }
    
    .chart-card { background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px; padding: 24px; margin-bottom: 24px; transition: all 0.3s; }
    .chart-card h3 { display: inline-flex; align-items: center; gap: 8px; color: var(--text-primary); margin: 0 0 20px 0; }
    
    .status-stats { display: flex; flex-direction: column; gap: 16px; }
    .status-item { display: flex; align-items: center; gap: 12px; }
    .status-color { width: 20px; height: 20px; border-radius: 4px; }
    .status-confirmada { background: #10B981; }
    .status-planejando { background: #F59E0B; }
    .status-reservada { background: #3B82F6; }
    .status-aguardando { background: #EF4444; }
    .status-info { flex: 1; display: flex; justify-content: space-between; }
    .status-name { color: var(--text-secondary); }
    .status-value { color: var(--text-primary); font-weight: bold; }
    
    .ranking-list { display: flex; flex-direction: column; gap: 12px; }
    .ranking-item { display: flex; align-items: center; gap: 16px; padding: 12px; background: var(--bg-hover); border-radius: 8px; }
    .ranking-position { font-size: 1.5rem; font-weight: bold; color: var(--color-secondary); min-width: 50px; }
    .ranking-info { flex: 1; }
    .ranking-name { display: block; color: var(--text-primary); font-weight: 500; }
    .ranking-pais { font-size: 0.8rem; color: var(--text-secondary); }
    .ranking-value { color: #10B981; font-weight: bold; }
    
    .data-table { width: 100%; border-collapse: collapse; }
    .data-table th, .data-table td { padding: 12px; text-align: left; border-bottom: 1px solid var(--border-color); color: var(--text-secondary); }
    .data-table th { color: var(--text-primary); font-weight: 600; background: var(--bg-tertiary); }
    
    .loading { text-align: center; padding: 60px; color: var(--text-secondary); }
    .spinner { width: 50px; height: 50px; border: 3px solid var(--border-color); border-top-color: var(--color-secondary); border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    @media (max-width: 768px) {
      .page-header { flex-direction: column; align-items: flex-start; }
      .header-right { width: 100%; justify-content: flex-end; flex-wrap: wrap; }
      .export-buttons { width: 100%; justify-content: flex-end; }
      .stats-grid { grid-template-columns: 1fr; }
    }

    /* Light Mode */
    body.light-theme .relatorios-page {
      background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
    }
    body.light-theme .btn-back { background: #FFFFFF; border-color: #E2E8F0; color: #3B82F6; }
    body.light-theme .btn-back:hover { background: #F1F5F9; }
    body.light-theme .stat-card { background: #FFFFFF; border-color: #E2E8F0; }
    body.light-theme .stat-info h3 { color: #1E293B; }
    body.light-theme .stat-info p { color: #64748B; }
    body.light-theme .chart-card { background: #FFFFFF; border-color: #E2E8F0; }
    body.light-theme .chart-card h3 { color: #1E293B; }
    body.light-theme .ranking-name { color: #1E293B; }
    body.light-theme .ranking-pais { color: #64748B; }
    body.light-theme .data-table th { background: #F8FAFC; }
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
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  voltar() {
    this.router.navigate(['/admin/dashboard']);
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
    // Carrega destinos
    this.destinoService.listar().subscribe({
      next: (res: any) => {
        if (res?.success && res.data) {
          this.totalDestinos = res.data.length;
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Erro destinos:', err)
    });

    // Carrega usuários
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

    // Carrega viagens
    this.viagemService.listar().subscribe({
      next: (res: any) => {
        this.carregando = false;
        if (res?.success && res.data) {
          const viagens = res.data;
          this.totalViagens = viagens.length;
          
          // Contagem por status
          this.viagensConfirmadas = viagens.filter((v: any) => v.status === 'confirmada').length;
          this.viagensPlanejadas = viagens.filter((v: any) => v.status === 'planejando').length;
          this.viagensReservadas = viagens.filter((v: any) => v.status === 'reservada').length;
          this.viagensAguardando = viagens.filter((v: any) => v.status === 'aguardando_pagamento').length;
          
          // SOMA DO FATURAMENTO (usando valor_pago)
          this.totalFaturado = viagens.reduce((sum: number, v: any) => {
            const valor = parseFloat(v.valor_pago) || 0;
            return sum + valor;
          }, 0);
          
          // CÁLCULO DO TICKET MÉDIO (apenas viagens que têm pagamento > 0)
          const viagensComPagamento = viagens.filter((v: any) => {
            const valorPago = parseFloat(v.valor_pago) || 0;
            return valorPago > 0;
          }).length;
          
          if (viagensComPagamento > 0) {
            this.ticketMedio = this.totalFaturado / viagensComPagamento;
          } else {
            this.ticketMedio = 0;
          }
          
          console.log('Total Faturado:', this.totalFaturado);
          console.log('Ticket Médio:', this.ticketMedio);
          
          this.calcularPorcentagens();
          
          // Destinos mais populares
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
          
          // Últimas viagens
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
      ['Ticket Médio', Math.round(this.ticketMedio) + ' Kz'],
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