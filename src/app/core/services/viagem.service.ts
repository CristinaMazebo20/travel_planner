import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ViagemService {
  constructor(private api: ApiService) {}

  listar(): Observable<any> {
    return this.api.get('viagens.php');
  }

  listarPorUsuario(utilizadorId: number): Observable<any> {
    return this.api.get(`viagens.php?utilizador_id=${utilizadorId}`);
  }

  buscar(id: number): Observable<any> {
    return this.api.get(`viagens.php?id=${id}`);
  }

  criar(viagem: any): Observable<any> {
    return this.api.post('viagens.php', viagem);
  }

  atualizar(viagem: any): Observable<any> {
    return this.api.put('viagens.php', viagem);
  }

  atualizarPagamento(id: number, valorPago: number, formaPagamento: string, status: string): Observable<any> {
    return this.api.put('viagens.php', { id, valor_pago: valorPago, forma_pagamento: formaPagamento, status });
  }

  deletar(id: number): Observable<any> {
    return this.api.delete(`viagens.php?id=${id}`);
  }
}