import { Component, OnInit } from '@angular/core';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { error } from 'console';
 

@Component({
  selector: 'app-listar-campeonatos',
  templateUrl: './listar-campeonatos.component.html',
  styleUrl: './listar-campeonatos.component.css'
})

export class ListarCampeonatosComponent implements OnInit {
  registrosCampeonatos: any[] = []

  constructor(
    private cadastroUsuarioService: CadastroUsuarioService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.listarRegistrosCampeonatos()
  }

   
  listarRegistrosCampeonatos(): void {
    this.cadastroUsuarioService.listarTodosRegistroCampeonato().subscribe({
      next: (registros) => {
        this.registrosCampeonatos = registros
      },
      error: (error) => {
        console.error("Erro ao listar registros de campeonatos", error)
      }
    })
  }
   
  deletarRegistroCampeonato(registroCampeonatoId: number): void {
    this.cadastroUsuarioService.deletarRegistroCampeonato(registroCampeonatoId).subscribe({
      next: (res) => {
        console.log("Registro de campeonato deletado com sucesso", res)
        this.listarRegistrosCampeonatos()
        this.toastr.success("Registro de campeonato deletado com sucesso")
      },
      error: (error) => {
        console.error("Erro ao deletar registro de campeonato", error)
        this.toastr.error("Erro ao deletar o registro")
      }
    })
  }

}

