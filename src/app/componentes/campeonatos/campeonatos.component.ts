import { Component, OnInit } from '@angular/core';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Usuario } from '../../Interfaces/usuario';
import { error } from 'console';
import { Partida } from '../../Interfaces/partidas';

@Component({
  selector: 'app-campeonatos',
  templateUrl: './campeonatos.component.html',
  styleUrl: './campeonatos.component.css'
})

export class CampeonatosComponent implements OnInit {
  
  partida: any = {
    id: null,  
    data: null,  
    usuarios: [],  
    valor: null,  
    inputRemovido: false  
  };

  finalizarClicado: boolean = false;
   
  campeonatos: any[] = [];
  campeonatosFinalizados: any[] = []
  usuarios: Usuario[] = [];
  partidaCriada: boolean = false;
  dataPartida: Date | null = null;
  campeonatoSelecionado: any
  campeonato: any
  valorTotalPorCampeonato: { [campeonatoId: number]: number } = {};
  botaoDesabilitado: { [key: number]: boolean } = {};
 
   
  
  constructor(
    private cadastroUsuarioService: CadastroUsuarioService,
    private toastr: ToastrService,
    )
    {}

  ngOnInit(): void {
    this.listarCampeonatosFinalizados()
    this.carregarUsuarios()
  }

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

  buscarCampeonatos(): void {
    this.cadastroUsuarioService.buscarCampeonatosFinalizados().subscribe({
      next: (campeonatos) => {
        this.campeonatos = campeonatos;
      },
      error: (erro) => {
        console.error("Erro ao buscar campeonatos", erro);
        this.toastr.error("Erro ao buscar campeonatos")
      }
    });
  }


listarCampeonatosFinalizados(): void {
  this.cadastroUsuarioService.buscarCampeonatosFinalizados().subscribe({
    next: (campeonatos: any[]) => {
      this.campeonatosFinalizados = campeonatos
      console.log(campeonatos)
    },
    error: (error) => {
      console.error("Erro ao listar campeonatos finalizados", error)
    }
  })
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

  reabrirCampeonato(campeonatoId: number): void {
    this.cadastroUsuarioService.atualizarStatusCampeonatoPorFalse(campeonatoId, false).subscribe({
      next: (response) => {
        this.toastr.success('Campeonato reaberto com sucesso!', response);
        this.atualizarListaDeCampeonatos();
      },
      error: (error) => {
        this.toastr.error('Erro ao reabrir o campeonato.');
      }
    });
  }


  atualizarValorPartida(campeonatoId: number, partidaId: number, valor: number): void {
    this.cadastroUsuarioService.atualizarValorTotalPartida(campeonatoId, partidaId, valor).subscribe({
      next: (res) => {
        this.atualizarValorTotalDoCampeonato(campeonatoId);
      },
      error: (error) => {
        this.toastr.error("Erro ao atualizar o valor da partida");
        console.error("Erro ao atualizar o valor da partida:", error);
      }
    });
  }


  criarPartida(): void {
    if (!this.campeonatoSelecionado) {
      console.error("Nenhum campeonato selecionado")
      return;
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
  
    const participantesSelecionados = this.usuarios
      .filter(usuario => usuario.selecionado)
      .map(usuario => usuario.id);
  
    // Verifica se pelo menos um usuário foi selecionado
    if (participantesSelecionados.length === 0) {
      this.toastr.error("Selecione pelo menos um usuário para criar a partida");
      return;
    }
  
    // Cria o objeto da nova partida
    const dataLocal = new Date(this.dataPartida);
    const deslocamentoFusoHorario = dataLocal.getTimezoneOffset() * 60000;
    const dataPartidaUTC = new Date(dataLocal.getTime() + deslocamentoFusoHorario);
    const dataPartidaISO = dataPartidaUTC.toISOString();
  
    const novaPartida = {
      id: null,
      data: dataPartidaUTC,
      usuarios: participantesSelecionados,
      valor: this.partida.valor,
      inputRemovido: false
    };
  
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
          this.buscarCampeonatos();
          window.location.reload();
  
        },
        error: (error) => {
          this.toastr.error("Erro ao cadastrar partida no campeonato");
          console.error("Erro ao cadastrar partida no campeonato:", error);
        }
      });
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

  selecionarCampeonato(campeonato: any): void {
    this.campeonatoSelecionado = campeonato
    console.log(this.campeonatoSelecionado)
  }

  
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
        this.listarCampeonatosFinalizados()

      },
      error: (error) => {
        console.error('Erro ao deletar campeonato:', error);
        this.toastr.error("Erro ao deletar o campeonato");
      }
    });
  }


  criarRegistro(campeonatoId: number): void {
    this.botaoDesabilitado[campeonatoId] = true;

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
        
        console.log("Registro de campeonato criado com sucesso", response);
      },
      (error) => {
        console.log("Erro ao cadastrar um campeonato", error);
      }
    );
  }
}
