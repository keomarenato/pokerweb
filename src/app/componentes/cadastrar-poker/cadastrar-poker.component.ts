import { Component, OnInit, Output, ViewChild } from '@angular/core';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { Observable } from 'rxjs';
import { UsuarioProp } from '../../Interfaces/cadastro';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DatePipe } from '@angular/common';
import { ModalComponentService } from '../../services/modal.service';
import { Partida } from '../../Interfaces/partidas';
import { map } from 'rxjs/operators';
import { subscribe } from 'diagnostics_channel';
import { Usuario } from '../../Interfaces/usuario';
import { error } from 'console';
import { response } from 'express';
import { EventEmitter } from '@angular/core';



interface Campeonato {
  id: number;
  nome: string;
  data: string;
  valorTotal: number;
  deletado: boolean;
  partidas: Partida[];
  selecionado?: boolean;
  participantes: Participante[];
}

interface Participante {
  id: number;
  nome: string;

}


@Component({
  selector: 'app-cadastrar-poker',
  templateUrl: './cadastrar-poker.component.html',
  styleUrl: './cadastrar-poker.component.css'
})

export class CadastrarPokerComponent implements OnInit {

  @Output() campeonatoSalvo = new EventEmitter<any>();

  partida: any = {
    id: null,  
    data: null,  
    usuarios: [],  
    valor: null,  
    inputRemovido: false  
  };

  @ViewChild('modalData') public modalData!: ModalDirective
  @ViewChild('modalUsuarios') modalUsuarios!: ModalDirective;
  @ViewChild('modalNomeCampeonato') public modalNomeCampeonato!: ModalDirective
  @ViewChild('modalUsuariosConfirmar') public modalUsuariosConfirmar!: ModalDirective;
  @ViewChild('modalSelecaoCampeonato') modalSelecaoCampeonato!: ModalDirective;
  @ViewChild('modalListarCampeonatosFinalizados') modal!: ModalDirective;



  valorRake: number | null = null;
  campeonatoId: number = 0;
  partidaId: number = 0;
  valor: number = 0;

  valorTotal: number = 0;

  dataPartida: Date | null = null;
  partidaCriada: boolean = false;
  valorPartida: number | null = null;
  partidaDetalhes: any = null;
  partidas: any[] = [];


  usuariosSelecionados: any[] = []

  nomeCampeonato = ""
  dataCampeonato: string = new Date().toISOString().split('T')[0];
  selectedUsers: number[] = []
  campeonatoSelecionado: any

  campeonatos: any[] = []
  campeonato: any
  usuarios: Usuario[] = [];
  participantesSelecionados: number[] = []

  campeonatosFinalizados: any[] = []
  registrosCampeonatos: any[] = []

  valorTotalPorCampeonato: { [campeonatoId: number]: number } = {};
  exibirFormulario: { [campeonatoId: number]: boolean } = {};

  constructor(
    private cadastroUsuarioService: CadastroUsuarioService,
    private toastr: ToastrService,

  ) { }

  ngOnInit(): void {
    this.buscarCampeonatos()
    this.carregarUsuarios()
    this.listarCampeonatosFinalizados()
  }

  openModal() {
    this.modalUsuarios.show()
  }



  //Listar campeonatos criado na tela 
  buscarCampeonatos(): void {
    this.cadastroUsuarioService.listarInativos().subscribe({
      next: (campeonatos) => {
        this.campeonatos = campeonatos;
      },
      error: (erro) => {
        console.error("Erro ao buscar campeonatos", erro);
        this.toastr.error("Erro ao buscar campeonatos")
      }
    });
  }

  // Listar usuarios
  carregarUsuarios(): void {
    this.cadastroUsuarioService.listarTodosUsuarios().subscribe({
      next: (usuarios: Usuario[]) => {
        console.log(usuarios);

        if (usuarios && usuarios.length > 0) {
          this.usuarios = usuarios.map(usuario => ({
            id: usuario.id,
            nome: usuario.nome,
            selecionado: false
          }))
        }
        else {
          console.log("Nenhum usuário recebido ou a lista está vazia")
        }
      },
      error: (error) => {
        console.error("Erro ao carregar usuários", error);
        this.toastr.error("Erro ao carregar usuários");
      }
    });
  }


  // Criar campeonato
  criarCampeonato() {
    const deslocamentoFusoHorario = new Date().getTimezoneOffset() * 60000;
    const dataCampeonatoUTC = new Date(new Date(this.dataCampeonato).getTime() + deslocamentoFusoHorario);

    const dadosCampeonato = {
      nome: this.nomeCampeonato,
      data: dataCampeonatoUTC
    }

    this.cadastroUsuarioService.criarCampeonato(dadosCampeonato).subscribe({
      next: (res) => {
        console.log("Campeonato criado com sucesso", res)

        const deletado = res.deletado;

        this.atualizarListaDeCampeonatos()
        window.location.reload()

        if (deletado) {
          console.log("O campeonato está marcado como deletado.")
        } else {
          console.log("O campeonato não está marcado como deletado.")
        }

        this.toastr.success("Campeonato criado com sucesso")
        this.buscarCampeonatos()
        // Resetar os valores dos campos após criar o campeonato
        this.nomeCampeonato = "";
        this.dataCampeonato = ""
      }
    })
  }


  //Criar as partidas no campeonatos escolhido
  criarPartida(): void {
    if(!this.campeonatoSelecionado) {
     console.error("Nenhum campeonato selecionado")
     return
    }

   // Verifica se a data da partida foi selecionada
   if (!this.dataPartida) {
     this.toastr.error("Selecione a data da partida");
     return;
   }

   // Verifica se o valor de rake foi inserido
   if (!this.partida.valor) {
     this.toastr.error("Insira um valor de rake válido");
     return;
   }

   const dataLocal = new Date(this.dataPartida);
   const deslocamentoFusoHorario = dataLocal.getTimezoneOffset() * 60000;

   const dataPartidaUTC = new Date(dataLocal.getTime() + deslocamentoFusoHorario);
  
   const dataPartidaISO = dataPartidaUTC.toISOString();

   console.log(dataPartidaUTC )

   const participantesSelecionados = this.usuarios
     .filter(usuario => usuario.selecionado)
     .map(usuario => usuario.id);

   // Verifica se pelo menos um usuário foi selecionado
   if (participantesSelecionados.length === 0) {
     this.toastr.error("Selecione pelo menos um usuário para criar a partida");
     return;
   }

   // Cria o objeto da nova partida
   const novaPartida = {
     id: null,
     data: dataPartidaUTC, 
     usuarios: participantesSelecionados,
     valor: this.partida.valor,
     inputRemovido: false
   }; 

   console.log(novaPartida)
    
   // Faz a chamada para o serviço de adicionar a partida ao campeonato
   this.cadastroUsuarioService.adicionarPartidaAoCampeonato(
     this.campeonatoSelecionado.id, 
     participantesSelecionados, 
     dataPartidaISO,  // Aqui deve ser passado como string
     this.partida.valor
   )
     .subscribe({
       next: (res) => {
         novaPartida.id = res.id;

          // Encontra o campeonato atualizado na lista de campeonatos
         const campeonato = this.campeonatos.find(c => c.id === this.campeonatoSelecionado.id);
         if (campeonato) {
           campeonato.partidas.push(novaPartida);
         }
         
         this.atualizarValorTotalDoCampeonato(this.campeonatoSelecionado.id);
         this.usuarios.forEach(usuario => usuario.selecionado = false);
         this.partida.valor = null;

         this.toastr.success("Partida criada com sucesso");

          window.location.reload();
       },
       error: (error) => {
         this.toastr.error("Erro ao cadastrar partida no campeonato");
         console.error("Erro ao cadastrar partida no campeonato:", error);
       }
     });
 }


  salvarCampeonato(campeonatoId: number) {
    this.cadastroUsuarioService.atualizarStatusCampeonato(campeonatoId).subscribe({
      next: (response) => {
        this.toastr.success("Salvo com sucesso")
        this.campeonatoSalvo.emit(response)
        this.buscarCampeonatos()
         
      },
      error: (error) => {
        this.toastr.error("Erro ao cadastrar partida no campeonato");
        console.error("Erro ao cadastrar partida no campeonato:", error);
      }
    })
  }



  atualizarValorTotalDoCampeonato(campeonatoId: number): void {
    this.cadastroUsuarioService.calcularValorTotalCampeonato(campeonatoId).subscribe({
      next: (valorTotalAtualizado) => {
        // Encontre o campeonato e atualize o valor total acumulado na sua lista local
        const campeonato = this.campeonatos.find(c => c.id === campeonatoId);
        if (campeonato) {
          campeonato.totalAcumulado = valorTotalAtualizado;

        }
      },
      error: (error) => {
        this.toastr.error("Erro ao atualizar o valor total do campeonato");
        console.error("Erro ao atualizar o valor total do campeonato", error);
      }
    });
  }



  atualizarValorPartida(campeonatoId: number, partidaId: number, valor: number): void {
    // Chama o serviço para atualizar o valor da partida no backend
    this.cadastroUsuarioService.atualizarValorTotalPartida(campeonatoId, partidaId, valor).subscribe({
      next: (res) => {
        this.toastr.success("Valor da partida atualizado com sucesso");
        // Após atualizar o valor da partida, recalcule o valor total do campeonato
        this.atualizarValorTotalDoCampeonato(campeonatoId);
      },
      error: (error) => {
        this.toastr.error("Erro ao atualizar o valor da partida");
        console.error("Erro ao atualizar o valor da partida:", error);
      }
    });
  }




  //deletarCampeonato
  deletarCampeonato(id: number) {
    this.cadastroUsuarioService.deletarCampeonato(id).subscribe({
      next: (response) => {
        this.toastr.success("Campeonato deletado com sucesso", response);

        // Armazena o ID do campeonato deletado no localStorage
        let campeonatosDeletados = JSON.parse(localStorage.getItem('campeonatosDeletados') || '[]');
        campeonatosDeletados.push(id);
        localStorage.setItem('campeonatosDeletados', JSON.stringify(campeonatosDeletados));

        // Remove o campeonato deletado da lista local
        this.campeonatos = this.campeonatos.filter(campeonato => campeonato.id !== id);

      },
      error: (error) => {
        console.error('Erro ao deletar campeonato:', error);
        this.toastr.error("Erro ao deletar o campeonato");
      }
    });
  }


  // Remover participantes que estao cadastrado no campeonato
  removerParticipante(campeonatoId: number, partidaId: number, participanteId: number) {
    this.cadastroUsuarioService.removerParticipanteDaPartida(campeonatoId, partidaId, participanteId).subscribe({
      next: (response) => {
        console.log('Participante removido com sucesso', response);



        this.toastr.success("Participante removido com sucesso")
        this.buscarCampeonatos()
      },
      error: (error) => {
        console.error('Erro ao remover participante:', error);
      }
    });
  }


  criarRegistro(campeonatoId: number): void {
    const valorTotal = this.valorTotalPorCampeonato[campeonatoId];
    console.log(`Valor total para campeonato ID ${campeonatoId}:`, this.valorTotalPorCampeonato[campeonatoId]);

    if (valorTotal !== undefined) {
      const participantes = this.campeonatos.find(campeonato => campeonato.id === campeonatoId)?.partidas.map((partida: any) => partida.participantes).flat();
    }

    // Criar objeto com os dados do campeonato, incluindo o campo 'deletado'
    const deletado = true; // Definindo como true
    const dadosCampeonato = {
      campeonatoId: campeonatoId,
      valorTotal: valorTotal,
      deletado: deletado
    };

    // Adicionar valores para 'valorTotal' e 'deletado' ao chamar a função
    console.log('Dados do campeonato:', dadosCampeonato); // Mostra os dados antes de chamar a função

    this.cadastroUsuarioService.criarRegistroCampeonato(campeonatoId, valorTotal, deletado).subscribe(
      (response) => {
        this.toastr.success("Cadastrado com sucesso")

        this.buscarCampeonatos()
        window.location.reload()
        console.log("Registro de campeonato criado com sucesso", response);
      },
      (error) => {
        console.log("Erro ao cadastrar um campeonato", error);
      }
    );
  }


  selecionarCampeonato(campeonato: any): void {
    this.campeonatoSelecionado = campeonato
  }


  deletarRegistroCampeonato(registroCampeonatoId: number): void {
    this.cadastroUsuarioService.deletarRegistroCampeonato(registroCampeonatoId).subscribe({
      next: (res) => {
        console.log("Registro de campeonato deletado com sucesso", res)

        this.toastr.success("Registro de campeonato deletado com sucesso")
      },
      error: (error) => {
        console.error("Erro ao deletar registro de campeonato", error)
        this.toastr.error("Erro ao deletar o registro")
      }
    })
  }



  listarCampeonatosFinalizados(): void {
    this.cadastroUsuarioService.buscarCampeonatosFinalizados().subscribe({
      next: (campeonatos: Campeonato[]) => {
        this.campeonatosFinalizados = campeonatos.map(campeonato => ({
          ...campeonato,
          selecionado: false
        }));
        console.log(this.campeonatosFinalizados);
      },
      error: (error) => {
        console.error('Erro ao listar campeonatos finalizados:', error);
      }
    });
  }




  finalizarCampeonato(campeonatoId: number): void {
    const campeonato = this.campeonatos.find(campeonato => campeonato.id === campeonatoId)
    if (campeonato) {
      campeonato.deletado = true
      this.removerCampeonatoAtivo(campeonatoId)
      this.criarRegistro(campeonatoId)
    }
  }



  reabrirCampeonato(campeonatoId: number): void {
    // Supondo que você tenha um serviço chamado cadastroUsuarioService
    this.cadastroUsuarioService.atualizarStatusCampeonatoPorFalse(campeonatoId, false).subscribe({
      next: (response) => {
        this.toastr.success('Campeonato reaberto com sucesso!');
        this.atualizarListaDeCampeonatos();
      },
      error: (error) => {
        this.toastr.error('Erro ao reabrir o campeonato.');
      }
    });
  }

  atualizarListaDeCampeonatos(): void {
    this.cadastroUsuarioService.listarInativos().subscribe({
      next: (campeonatosInativos) => {
        this.campeonatos = campeonatosInativos
      },
      error: (error) => {
        this.toastr.error("Erro ao listar campeonatos inativos")
      }
    })
  }

  removerCampeonatoAtivo(campeonatoId: number): void {
    this.campeonatos = this.campeonatos.filter(campeonato => campeonato.id !== campeonatoId)
  }

}


