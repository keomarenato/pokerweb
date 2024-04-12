import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioProp } from '../Interfaces/cadastro';
import { Usuario } from '../Interfaces/usuario';
import { url } from 'node:inspector';


@Injectable({
  providedIn: 'root'
})

export class CadastroUsuarioService {

  private baseUrl = 'http://192.168.1.134:3333';

  private readonly APICadastro = 'http://192.168.1.134:3333/users'

  private readonly APILogin = 'http://192.168.1.134:3333/session'

  private readonly APIUser = 'http://192.168.1.134:3333/cadastroUser'

  private readonly APICampeonato = 'http://192.168.1.134:3333/campeonatos'

  private readonly APICadastroCampeonato = 'http://192.168.1.134:3333/campeonatos'


  private readonly APICampeonatoUser = 'http://192.168.1.134:3333/campeonatosUserId'

  private readonly APIPartida = 'http://192.168.1.134:3333/partidas'

  private readonly APIListarCampeonatos = 'http://192.168.1.134:3333/listarCampeonatos'

  private readonly APICampeonatoId = 'http://192.168.1.134:3333/cameponatosId'

  private readonly APIDelCampeonato = 'http://192.168.1.134:3333/campeonatos'

  private readonly APIRankCampeonato = 'http://192.168.1.134:3333/pordata/campeonato'

  private readonly APICadastrarPartidaDoCampeonato = 'http://192.168.1.134:3333/campeonatos/:campeonatoId/partidas'

  private readonly APIRemoverParticipante  = 'http://192.168.1.134:3333'

  private readonly APICriarRegistro  = 'http://192.168.1.134:3333/criarRegistroCampeonato' 
  
  private readonly APIListarRegisto  = 'http://192.168.1.134:3333/listarCampeonatos' 

  private readonly APIDeletarRegistro  = 'http://192.168.1.134:3333/deletarRegistroCampeonato'

  constructor(private http: HttpClient) { }

  // Criar um cadastro no banco
  criarUser(usuario: any): Observable<any> {
    return this.http.post<any>(this.APICadastro, usuario)
  }

  // Logar Usuario
  logarUser(email: string, password: string): Observable<any> {
    return this.http.post<any>(this.APILogin, { email, password })
  }

  //Cadastrar um usuario
  cadastroUsuario(usuario: UsuarioProp): Observable<UsuarioProp> {
    return this.http.post<UsuarioProp>(this.APIUser, usuario)
  }

  obterUsuarioId(usuarioId: string): Observable<UsuarioProp> {
    return this.http.get<UsuarioProp>(`${this.APIUser}/${usuarioId}`)
  }

  //Mostrar todos usuarios cadastrados
  listarTodosUsuarios(): Observable<any> {
    return this.http.get<any>(this.APIUser)
  }


  //Editar usuario
  atualizarUsuario(usuario: any): Observable<any> {
    return this.http.put<any>(`${this.APIUser}/${usuario.id}`, usuario)
  }

  //Deletar usuario
  deletarUsuario(id: number): Observable<UsuarioProp> {
    const url = `${this.APIUser}/${id}`
    return this.http.delete<UsuarioProp>(url)
  }




  // // Buscar Campeonato por ID
  buscarCampeonatoPorId(id: string): Observable<any> {
    return this.http.get<any>(`${this.APICampeonatoId}/${id}`)
  }


  // //Filtrar campeonato que cada usuario participou
  buscarUsuarioPorCampeonato(id: number, startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.APICampeonato}/${id}?startDate=${startDate}&endDate=${endDate}`);
  }

  //  //Cadastrar uma partida
  cadastroPartida(partida: any): Observable<any> {
    return this.http.post<any>(this.APIPartida, partida);
  }


  // // Listar toda as partidas
  listarTodasPartidas(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.APIPartida)
  }

  // //Deletar Partida
  deletarPartida(id: number): Observable<any> {
    return this.http.delete<any>(`${this.APIPartida}/${id}`)
  }



  verificarCampeonatosPorData(startDate: string, endDate: string): Observable<any> {
    const url = `${this.APIRankCampeonato}/?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<any>(url);
  }

  //Cadastrando Campeonato
  criarCampeonato(dadosCampeonato: {
    nome: string,
    data: Date,
    valorTotal?: number | null
  }): Observable<any> {
    const dadosFormatados = {
      nome: dadosCampeonato.nome,
      data: dadosCampeonato.data.toISOString(), // Convertendo a data para string no formato ISO
      valorTotal: dadosCampeonato.valorTotal
    };
    return this.http.post(this.APICadastroCampeonato, dadosFormatados);
  }

  listarTodosCampeonatos(): Observable<any> {
    return this.http.get<any>(this.APICampeonato)
  }

  listarCampeonatosAtivos(): Observable<any> {
    const url = `${this.baseUrl}/listarCampeonatosAtivos`;
    return this.http.get<any>(url);
  }


  listarInativos(): Observable<any> {
    const url = `${this.baseUrl}/campeonatosInativos`;
    return this.http.get<any>(url);
  }

  buscarCampeonatosFinalizados(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/campeonatosFinalizados`)
  }

 

  // Criar Partida no campeonato
  adicionarPartidaAoCampeonato(campeonatoId: number, participantesSelecionados: number[], dataPartida: string, valorPartida?: any): Observable<any> {
    const data = {
      campeonatoId,
      participantesIds: participantesSelecionados,
      dataPartida,
      valorPartida // Este campo pode ser undefined, e está tudo bem
    };
  
    const url = `http://192.168.1.134:3333/campeonatos/${campeonatoId}/partidas`;
    return this.http.post(url, data);
  }

  

  atualizarValorTotalPartida(campeonatoId: number, partidaId: number, valor: number): Observable<any> {
    const url = `http://192.168.1.134:3333/campeonatos/${campeonatoId}/partidas/${partidaId}/valorTotal`;
    const data = { valor: valor }; // Ajuste aqui
    console.log('Enviando novo valor total:', valor);
    return this.http.patch(url, data);
  }
   

  // // Calcular os valores das partidas criadas
   calcularValorTotalPartida(campeonatoId: number, partidaId: number): Observable<any> {
     const url = `${this.baseUrl}/campeonatos/${campeonatoId}/partidas/${partidaId}/valorTotal`;
     return this.http.put(url, {});
   }

  calcularValorTotalCampeonato(campeonatoId: number): Observable<any> {
    const url = `${this.baseUrl}/campeonatos/${campeonatoId}/valorTotal`;
    return this.http.put(url, {});
  }
 
   //Listar todos os campeonatos
   buscarDadosDoCampeonato(): Observable<any> {
    return this.http.get<any>(this.APIListarCampeonatos)
  }


// Listar campeonatos que estão TRUE
  buscarCampeonatosDeletados(): Observable<any> {
    return this.http.get<any>(this.APIListarCampeonatos);
  }


  // Deletar Campeonato
  deletarCampeonato(campeonatoId: number): Observable<any> {
    return this.http.delete(`http://192.168.1.134:3333/campeonatos/${campeonatoId}`);
  }
     

  // Remover participantes que estao cadastrado no campeonato
  removerParticipanteDaPartida(campeonatoId: number, partidaId: number, participanteId: number) {
    const url = `${this.APIRemoverParticipante}/campeonatos/${campeonatoId}/partidas/${partidaId}/participantes/${participanteId}`;
    return this.http.delete(url);
  }
  
  
  criarRegistroCampeonato(campeonatoId: number, valorTotal: number, deletado: boolean): Observable<any> {
    return this.http.post<any>(this.APICriarRegistro, { campeonatoId, valorTotal, deletado });
  }

  // Listar Registro do campeonato
  listarTodosRegistroCampeonato(): Observable<any> {
    return this.http.get<any>(this.APIListarRegisto)
  }

  // Deletar Registro do campeonato
  deletarRegistroCampeonato(registroCampeonatoId: number): Observable<any> {
    return this.http.delete<any>(`${this.APIDeletarRegistro}/${registroCampeonatoId}`)
  }

   
  atualizarStatusCampeonato(campeonatoId: number): Observable<any> {
    const url = `${this.baseUrl}/campeonatos/${campeonatoId}/status`;
    return this.http.put(url, {});
  }
  
  
  atualizarStatusCampeonatoPorFalse(campeonatoId: number, deletado: boolean): Observable<any> {
    const url = `${this.baseUrl}/campeonatos/${campeonatoId}/false`;
    return this.http.put(url, { deletado: deletado });
}

}


