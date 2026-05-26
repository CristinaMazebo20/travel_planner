// core/services/viagem.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface Viagem {
  id: number;
  titulo: string;
  destino_id: number;
  data_inicio: string;
  data_fim: string;
  orcamento: number;
  status: string;
  forma_pagamento?: string;
  valor_pago?: number;
  usuario_id?: number;
  usuario_nome?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ViagemService {
  constructor(private api: ApiService) {}

  /**
   * Listar todas as viagens
   */
  listar(): Observable<any> {
    return this.api.get('viagens.php');
  }

  /**
   * Listar todas as viagens (alias para listar)
   */
  listarTodas(): Observable<any> {
    return this.api.get('viagens.php');
  }

  /**
   * Listar viagens por usuário
   */
  listarPorUsuario(utilizadorId: number): Observable<any> {
    return this.api.get(`viagens.php?utilizador_id=${utilizadorId}`);
  }

  /**
   * Buscar uma viagem específica por ID
   */
  buscar(id: number): Observable<any> {
    return this.api.get(`viagens.php?id=${id}`);
  }

  /**
   * Criar uma nova viagem
   */
  criar(viagem: any): Observable<any> {
    return this.api.post('viagens.php', viagem);
  }

  /**
   * Atualizar uma viagem existente
   */
  atualizar(viagem: any): Observable<any> {
    return this.api.put('viagens.php', viagem);
  }

  /**
   * Atualizar apenas o pagamento de uma viagem
   */
  atualizarPagamento(id: number, valorPago: number, formaPagamento: string, status: string): Observable<any> {
    return this.api.put('viagens.php', { 
      id, 
      valor_pago: valorPago, 
      forma_pagamento: formaPagamento, 
      status 
    });
  }

  /**
   * Deletar uma viagem
   */
  deletar(id: number): Observable<any> {
    return this.api.delete(`viagens.php?id=${id}`);
  }
}