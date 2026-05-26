// modules/admin/pages/gestao-usuarios/gestao-usuarios.ts
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService, Usuario } from '../../../../core/services/usuario.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-gestao-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page">
      <div class="page-header">
        <div class="header-left">
          <button class="btn-back" (click)="voltar()">← Voltar</button>
          <h1>👥 Gestão de Usuários</h1>
        </div>
        <button class="btn-refresh" (click)="carregarUsuarios()">🔄 Atualizar</button>
      </div>

      <div class="table-container">
        <div *ngIf="carregando" class="loading">
          <div class="spinner"></div>
          <p>Carregando usuários...</p>
        </div>

        <table class="admin-table" *ngIf="!carregando">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Telefone</th>
              <th>Data Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let usuario of usuarios">
              <td>{{ usuario.id }}</td>
              <td>{{ usuario.nome }}</td>
              <td>{{ usuario.email }}</td>
              <td>
                <select 
                  [(ngModel)]="usuario.tipo" 
                  (change)="atualizarTipo(usuario)" 
                  class="tipo-select"
                  [disabled]="usuario.id === adminId">
                  <option value="cliente">Cliente</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{{ usuario.telefone || '-' }}</td>
              <td>{{ usuario.created_at | date:'dd/MM/yyyy' }}</td>
              <td class="actions">
                <button 
                  class="btn-delete" 
                  (click)="excluir(usuario.id)" 
                  [disabled]="usuario.id === adminId"
                  [title]="usuario.id === adminId ? 'Não pode excluir o próprio admin' : 'Excluir usuário'">
                  🗑️ Excluir
                </button>
              </td>
            </tr>
            <tr *ngIf="usuarios.length === 0">
              <td colspan="7" class="empty-table">
                Nenhum usuário cadastrado
              </td>
            </tr>
          </tbody>
        </table>
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
    .btn-refresh { background: linear-gradient(135deg, #6C3BD4, #00D9FF); border: none; padding: 10px 24px; border-radius: 8px; color: white; cursor: pointer; font-weight: 500; transition: all 0.2s; }
    .btn-refresh:hover { transform: translateY(-2px); }
    .table-container { background: rgba(17, 22, 61, 0.8); border-radius: 12px; overflow-x: auto; border: 1px solid rgba(0, 217, 255, 0.1); min-height: 400px; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th, .admin-table td { padding: 14px 16px; text-align: left; border-bottom: 1px solid rgba(0, 217, 255, 0.1); color: #A0A8C6; }
    .admin-table th { color: white; font-weight: 600; background: rgba(0, 0, 0, 0.3); }
    .admin-table tr:hover { background: rgba(0, 217, 255, 0.05); }
    .tipo-select { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(0, 217, 255, 0.3); border-radius: 6px; color: white; padding: 6px 12px; cursor: pointer; }
    .tipo-select:focus { outline: none; border-color: #00D9FF; }
    .tipo-select:disabled { opacity: 0.5; cursor: not-allowed; }
    .actions { text-align: center; }
    .btn-delete { background: #EF4444; border: none; padding: 6px 14px; border-radius: 6px; color: white; cursor: pointer; transition: all 0.2s; }
    .btn-delete:hover:not(:disabled) { transform: scale(1.05); background: #dc2626; }
    .btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }
    .empty-table { text-align: center; padding: 60px !important; color: #A0A8C6; }
    .loading { text-align: center; padding: 60px; color: #A0A8C6; }
    .spinner { width: 50px; height: 50px; border: 3px solid rgba(0, 217, 255, 0.1); border-top-color: #00D9FF; border-radius: 50%; margin: 0 auto 20px; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class GestaoUsuarios implements OnInit {
  usuarios: Usuario[] = [];
  adminId: number = 0;
  carregando = true;

  constructor(
    private usuarioService: UsuarioService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit() {
    const usuario = this.authService.usuario();
    if (usuario && usuario.id) {
      this.adminId = usuario.id;
    }
    this.carregarUsuarios();
  }

  voltar() {
    this.router.navigate(['/admin/dashboard']);
  }

  carregarUsuarios() {
    this.carregando = true;
    this.usuarioService.listar().subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response && response.success) {
          this.usuarios = response.data || [];
        } else {
          this.notificationService.error(response?.message || 'Erro ao carregar usuários');
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

  atualizarTipo(usuario: Usuario) {
    if (usuario.id === this.adminId) {
      this.notificationService.error('Não pode alterar seu próprio tipo!');
      this.carregarUsuarios();
      return;
    }
    
    this.usuarioService.atualizarTipo(usuario.id, usuario.tipo).subscribe({
      next: (response: any) => {
        if (response && response.success) {
          this.notificationService.success('Tipo de usuário atualizado!');
        } else {
          this.notificationService.error(response?.message || 'Erro ao atualizar');
          this.carregarUsuarios();
        }
      },
      error: () => {
        this.notificationService.error('Erro ao atualizar tipo');
        this.carregarUsuarios();
      }
    });
  }

  excluir(id: number) {
    if (id === this.adminId) {
      this.notificationService.error('Não é possível excluir o próprio administrador!');
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      this.usuarioService.deletar(id).subscribe({
        next: (response: any) => {
          if (response && response.success) {
            this.notificationService.success('Usuário excluído com sucesso!');
            this.carregarUsuarios();
          } else {
            this.notificationService.error(response?.message || 'Erro ao excluir');
          }
        },
        error: () => this.notificationService.error('Erro ao excluir usuário')
      });
    }
  }
}