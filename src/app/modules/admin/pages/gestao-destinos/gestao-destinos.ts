// modules/admin/pages/gestao-destinos/gestao-destinos.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestinoService, Destino } from '../../../../core/services/destino.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-gestao-destinos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div class="header-left">
          <button class="btn-back" (click)="voltar()">← Voltar</button>
          <h1>📍 Gestão de Destinos</h1>
        </div>
        <button class="btn-add" (click)="abrirModal()">+ Novo Destino</button>
      </div>

      <div class="table-container">
        <div *ngIf="carregando" class="loading">
          <div class="spinner"></div>
          <p>Carregando destinos...</p>
        </div>

        <table class="admin-table" *ngIf="!carregando">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagem</th>
              <th>Nome</th>
              <th>País</th>
              <th>Cidade</th>
              <th>Preço</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let destino of destinos">
              <td>{{ destino.id }}</td>
              <td>
                <img [src]="destino.imagem || 'https://placehold.co/50x50?text=Sem+Imagem'" 
                     class="table-img" 
                     [alt]="destino.nome">
              </td>
              <td>{{ destino.nome }}</td>
              <td>{{ destino.pais }}</td>
              <td>{{ destino.cidade }}</td>
              <td>{{ destino.preco | number }} Kz</td>
              <td class="actions">
                <button class="btn-edit" (click)="editar(destino)" title="Editar">✏️</button>
                <button class="btn-delete" (click)="excluir(destino.id)" title="Excluir">🗑️</button>
              </td>
            </tr>
            <tr *ngIf="destinos.length === 0">
              <td colspan="7" class="empty-table">
                Nenhum destino cadastrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal -->
      <div class="modal" *ngIf="modalAberto" (click)="fecharModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editando ? 'Editar' : 'Novo' }} Destino</h2>
            <button class="close" (click)="fecharModal()">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Nome *</label>
              <input type="text" [(ngModel)]="destinoForm.nome" class="form-control" required>
            </div>
            <div class="form-group">
              <label>País *</label>
              <input type="text" [(ngModel)]="destinoForm.pais" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Cidade *</label>
              <input type="text" [(ngModel)]="destinoForm.cidade" class="form-control" required>
            </div>
            <div class="form-group">
              <label>Preço (Kz) *</label>
              <input type="number" [(ngModel)]="destinoForm.preco" class="form-control" required>
            </div>
            <div class="form-group">
              <label>URL da Imagem</label>
              <input type="text" [(ngModel)]="destinoForm.imagem" class="form-control" placeholder="https://exemplo.com/imagem.jpg">
            </div>
            <div class="form-group">
              <label>Descrição</label>
              <textarea rows="3" [(ngModel)]="destinoForm.descricao" class="form-control" placeholder="Descrição do destino..."></textarea>
            </div>
            <div class="form-group">
              <label>Avaliação (0-5)</label>
              <input type="number" [(ngModel)]="destinoForm.avaliacao" class="form-control" min="0" max="5" step="0.1">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn-cancel" (click)="fecharModal()">Cancelar</button>
            <button class="btn-save" (click)="salvar()" [disabled]="!isFormValido()">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page { padding: 24px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .btn-back { background: rgba(0, 217, 255, 0.1); border: 1px solid rgba(0, 217, 255, 0.3); padding: 8px 16px; border-radius: 8px; color: #00D9FF; cursor: pointer; transition: all 0.2s; font-size: 0.9rem; }
    .btn-back:hover { background: rgba(0, 217, 255, 0.2); transform: translateX(-2px); }
    .page-header h1 { color: white; margin: 0; font-size: 1.8rem; }
    .btn-add { background: linear-gradient(135deg, #6C3BD4, #00D9FF); border: none; padding: 10px 24px; border-radius: 8px; color: white; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-add:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(108,59,212,0.3); }
    .table-container { background: rgba(17, 22, 61, 0.8); border-radius: 12px; overflow-x: auto; border: 1px solid rgba(0, 217, 255, 0.1); min-height: 400px; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th, .admin-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid rgba(0, 217, 255, 0.1); color: #A0A8C6; }
    .admin-table th { color: white; font-weight: 600; background: rgba(0, 0, 0, 0.3); }
    .admin-table tr:hover { background: rgba(0, 217, 255, 0.05); }
    .table-img { width: 50px; height: 50px; border-radius: 8px; object-fit: cover; }
    .actions { display: flex; gap: 8px; }
    .btn-edit, .btn-delete { padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
    .btn-edit { background: #3B82F6; color: white; }
    .btn-delete { background: #EF4444; color: white; }
    .btn-edit:hover, .btn-delete:hover { transform: scale(1.05); }
    .empty-table { text-align: center; padding: 60px !important; color: #A0A8C6; }
    .loading { text-align: center; padding: 60px; color: #A0A8C6; }
    .spinner { width: 50px; height: 50px; border: 3px solid rgba(0, 217, 255, 0.1); border-top-color: #00D9FF; border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .modal { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-content { background: #11123D; border-radius: 16px; width: 550px; max-width: 90%; border: 1px solid rgba(0, 217, 255, 0.2); }
    .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(0, 217, 255, 0.1); }
    .modal-header h2 { color: white; margin: 0; }
    .close { background: none; border: none; color: white; font-size: 28px; cursor: pointer; }
    .close:hover { color: #EF4444; }
    .modal-body { padding: 24px; }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; color: #A0A8C6; margin-bottom: 8px; font-size: 0.9rem; }
    .form-control { width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(0, 217, 255, 0.2); border-radius: 8px; color: white; font-size: 0.9rem; }
    .form-control:focus { outline: none; border-color: #00D9FF; }
    textarea.form-control { resize: vertical; font-family: inherit; }
    .modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid rgba(0, 217, 255, 0.1); }
    .btn-cancel, .btn-save { padding: 8px 20px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .btn-cancel { background: transparent; border: 1px solid #EF4444; color: #EF4444; }
    .btn-save { background: linear-gradient(135deg, #6C3BD4, #00D9FF); border: none; color: white; }
    .btn-cancel:hover, .btn-save:hover { transform: translateY(-2px); }
    .btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class GestaoDestinos implements OnInit {
  destinos: Destino[] = [];
  destinoForm: Destino = { id: 0, nome: '', pais: '', cidade: '', descricao: '', imagem: '', preco: 0, avaliacao: 0 };
  editando = false;
  modalAberto = false;
  carregando = true;

  constructor(
    private destinoService: DestinoService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarDestinos();
  }

  voltar() {
    this.router.navigate(['/admin/dashboard']);
  }

  abrirModal() {
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.cancelar();
  }

  isFormValido(): boolean {
    return !!(this.destinoForm.nome && this.destinoForm.pais && this.destinoForm.cidade && this.destinoForm.preco > 0);
  }

  carregarDestinos() {
    this.carregando = true;
    this.destinoService.listar().subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response && response.success) {
          this.destinos = response.data || [];
        } else {
          this.notificationService.error(response?.message || 'Erro ao carregar destinos');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.carregando = false;
        this.notificationService.error('Erro ao conectar com o servidor');
        this.cdr.detectChanges();
      }
    });
  }

  salvar() {
    if (!this.isFormValido()) {
      this.notificationService.error('Preencha todos os campos obrigatórios (*)');
      return;
    }
    
    if (this.editando) {
      this.destinoService.atualizar(this.destinoForm).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.notificationService.success('Destino atualizado com sucesso!');
            this.carregarDestinos();
            this.fecharModal();
          } else {
            this.notificationService.error(response?.message || 'Erro ao atualizar');
          }
        },
        error: () => this.notificationService.error('Erro ao atualizar destino')
      });
    } else {
      this.destinoService.criar(this.destinoForm).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.notificationService.success('Destino criado com sucesso!');
            this.carregarDestinos();
            this.fecharModal();
          } else {
            this.notificationService.error(response?.message || 'Erro ao criar');
          }
        },
        error: () => this.notificationService.error('Erro ao criar destino')
      });
    }
  }

  editar(destino: Destino) {
    this.destinoForm = { ...destino };
    this.editando = true;
    this.abrirModal();
  }

  excluir(id: number) {
    if (confirm('Tem certeza que deseja excluir este destino?')) {
      this.destinoService.deletar(id).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.notificationService.success('Destino excluído com sucesso!');
            this.carregarDestinos();
          } else {
            this.notificationService.error(response?.message || 'Erro ao excluir');
          }
        },
        error: () => this.notificationService.error('Erro ao excluir destino')
      });
    }
  }

  cancelar() {
    this.destinoForm = { id: 0, nome: '', pais: '', cidade: '', descricao: '', imagem: '', preco: 0, avaliacao: 0 };
    this.editando = false;
  }
}