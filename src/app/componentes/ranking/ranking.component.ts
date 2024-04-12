import { Component, OnInit } from '@angular/core';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';
import { Observable } from 'rxjs';
import { UsuarioProp } from '../../Interfaces/cadastro';


@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrl: './ranking.component.css'
})

export class RankingComponent implements OnInit {

  registrosCampeonatos: any[] = [];
  rankingsPorCampeonato: { [campeonatoId: string]: { id: string, nome: string, participacoes: number }[] } = {};
  campeonatoIds: string[] = [];
  campeonatoNomes: string[] = [];

  constructor(
    private cadastroUsuarioService: CadastroUsuarioService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.buscarRegistrosCampeonatos()
  }

  buscarRegistrosCampeonatos(): void {
    this.cadastroUsuarioService.listarTodosRegistroCampeonato().subscribe({
      next: (registros) => {
        this.registrosCampeonatos = registros
        this.calcularRankingPorCampeonato()
      },
      error: (error) => {
        console.error('Erro ao buscar registros de campeonatos:', error);
        this.toastr.error('Erro ao buscar registros de campeonatos')
      }
    })
  }

  calcularRankingPorCampeonato(): void {
    this.registrosCampeonatos.forEach(registro => {
      const campeonatoNome = registro.campeonato.nome;
      this.rankingsPorCampeonato[campeonatoNome] = this.rankingsPorCampeonato[campeonatoNome] || [];
      registro.campeonato.participantes.forEach((participante: any) => {
        const participanteId = participante.id.toString();
        const participanteNome = participante.nome;
        const participanteIndex = this.rankingsPorCampeonato[campeonatoNome].findIndex(p => p.id === participanteId);
        if (participanteIndex !== -1) {
          this.rankingsPorCampeonato[campeonatoNome][participanteIndex].participacoes++;
        } else {
          this.rankingsPorCampeonato[campeonatoNome].push({ id: participanteId, nome: participanteNome, participacoes: 1 });
        }
      });
      this.rankingsPorCampeonato[campeonatoNome].sort((a, b) => b.participacoes - a.participacoes);
    });
    this.campeonatoNomes = Object.keys(this.rankingsPorCampeonato);
  }
}
  
  

 
