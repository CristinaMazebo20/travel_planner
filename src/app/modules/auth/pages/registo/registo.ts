import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-registo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `...` // mantém o mesmo template
})
export class Registo {
  nome = '';
  email = '';
  senha = '';
  confirmarSenha = '';
  erro = '';
  sucesso = '';
  carregando = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  onSubmit() {
    if (!this.nome || !this.email || !this.senha || !this.confirmarSenha) {
      this.erro = 'Preencha todos os campos';
      return;
    }
    if (this.senha !== this.confirmarSenha) {
      this.erro = 'As senhas não coincidem';
      return;
    }
    if (this.senha.length < 6) {
      this.erro = 'A senha deve ter pelo menos 6 caracteres';
      return;
    }

    this.carregando = true;
    this.erro = '';
    this.sucesso = '';

    this.authService.registar({ nome: this.nome, email: this.email, senha: this.senha }).subscribe({
      next: (response: any) => {
        this.carregando = false;
        if (response.success) {
          this.sucesso = 'Conta criada com sucesso! Redirecionando...';
          this.notificationService.success('Conta criada com sucesso!');
          setTimeout(() => this.router.navigate(['/login']), 2000);
        } else {
          this.erro = response.message || 'Erro ao criar conta';
          this.notificationService.error(this.erro);
        }
      },
      error: () => {
        this.carregando = false;
        this.erro = 'Erro de conexão';
        this.notificationService.error('Erro de conexão');
      }
    });
  }
}