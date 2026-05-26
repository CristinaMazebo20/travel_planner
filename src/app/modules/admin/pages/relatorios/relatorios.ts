import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestinoService } from '../../../../core/services/destino.service';
import { UsuarioService } from '../../../../core/services/usuario.service';
import { ViagemService } from '../../../../core/services/viagem.service';
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
          <button class="btn-back" (click)="voltar()">← Voltar</button>
          <h1>📊 Relatórios e Estatísticas</h1>
        </div>
        <div class="export-buttons">
          <button class="btn-export-excel" (click)="exportarExcel()">📊 Exportar Excel</button>
          <button class="btn-print" (click)="imprimir()">🖨️ Imprimir</button>
        </div>
      </div>

      <div *ngIf="carregando" class="loading">
        <div class="spinner"></div>
        <p>Carregando estatísticas...</p>
      </div>

      <div *ngIf="!carregando">
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🌍</div>
            <div class="stat-info">
              <h3>{{ totalDestinos }}</h3>
              <p>Destinos</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>{{ totalUsuarios }}</h3>
              <p>Usuários</p>
              <small>{{ usuariosAdmin }} Admin | {{ usuariosCliente }} Clientes</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">✈️</div>
            <div class="stat-info">
              <h3>{{ totalViagens }}</h3>
              <p>Viagens</p>
              <small>{{ viagensConfirmadas }} Confirmadas | {{ viagensPlanejadas }} Planejadas</small>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-info">
              <h3>{{ totalFaturado | number }} Kz</h3>
              <p>Faturamento</p>
              <small>Média: {{ ticketMedio | number }} Kz</small>
            </div>
          </div>
        </div>

        <!-- Status das Viagens -->
        <div class="chart-card">
          <h3>📊 Status das Viagens</h3>
          <div class="status-stats">
            <div class="status-item">
              <div class="status-color status-confirmada"></div>
              <div class="status-info">
                <span class="status-name">Confirmadas</span>
                <span class="status-value">{{ viagensConfirmadaPorcentagem }}%</span>
              </div>
            </div>
            <div class="status-item">
              <div class="status-color status-planejando"></div>
              <div class="status-info">
                <span class="status-name">Planejando</span>
                <span class="status-value">{{ viagensPlanejandoPorcentagem }}%</span>
              </div>
            </div>
            <div class="status-item">
              <div class="status-color status-reservada"></div>
              <div class="status-info">
                <span class="status-name">Reservadas</span>
                <span class="status-value">{{ viagensReservadaPorcentagem }}%</span>
              </div>
            </div>
            <div class="status-item">
              <div class="status-color status-aguardando"></div>
              <div class="status-info">
                <span class="status-name">Aguardando Pagamento</span>
                <span class="status-value">{{ viagensAguardandoPorcentagem }}%</span>
              </div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>🌟 Destinos Mais Populares</h3>
          <div class="ranking-list">
            <div *ngFor="let destino of destinosPopulares; let i = index" class="ranking-item">
              <div class="ranking-position">{{ i + 1 }}º</div>
              <div class="ranking-info">
                <span class="ranking-name">{{ destino.nome }}</span>
                <span class="ranking-pais">{{ destino.pais }}</span>
              </div>
              <div class="ranking-value">{{ destino.total_viagens }} viagens</div>
            </div>
          </div>
        </div>

        <div class="chart-card">
          <h3>📋 Últimas Viagens</h3>
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Destino</th>
                <th>Data</th>
                <th>Status</th>
                <th>Valor</th>
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
    .btn-back { background: rgba(0,217,255,0.1); border: 1px solid rgba(0,217,255,0.3); padding: 8px 16px; border-radius: 8px; color: #00D9FF; cursor: pointer; }
    .btn-back:hover { background: rgba(0,217,255,0.2); transform: translateX(-2px); }
    .page-header h1 { color: white; margin: 0; font-size: 1.8rem; }
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  voltar() {
    this.router.navigate(['/admin/dashboard']);
  }

  getStatusTexto(status: string): string {
    if (status === 'confirmada') return 'Confirmada';
    if (status === 'planejando') return 'Planejando';
    if (status === 'reservada') return 'Reservada';
    if (status === 'aguardando_pagamento') return 'Aguardando';
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
      ['Confirmadas', this.viagensConfirmadas, this.viagensConfirmadaPorcentagem + '%'],
      ['Planejando', this.viagensPlanejadas, this.viagensPlanejandoPorcentagem + '%'],
      ['Reservadas', this.viagensReservadas, this.viagensReservadaPorcentagem + '%'],
      ['Aguardando Pagamento', this.viagensAguardando, this.viagensAguardandoPorcentagem + '%'],
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