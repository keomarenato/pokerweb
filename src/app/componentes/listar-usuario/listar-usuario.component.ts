import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UsuarioProp } from '../../Interfaces/cadastro';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listar-usuario',
  templateUrl: './listar-usuario.component.html',
  styleUrl: './listar-usuario.component.css'
})
export class ListarUsuarioComponent implements OnInit {
  
  usuarios$!: Observable<UsuarioProp[]>
   
  criarUsuario: UsuarioProp = {
    nome: '',
    fone: undefined,
    cpf: undefined,
    cep: '',
    logradouro: '',
    numero: '',
    bairro: '',
    localidade: '',
    uf: ''
  }


  constructor(
    private http: HttpClient,
    private cadastroUsuarioService: CadastroUsuarioService,
    private toastr: ToastrService,
    private router: Router
    ) {}

  ngOnInit() { 
   this.listarUsuarios()
  }

  listarUsuarios(){
    this.usuarios$ = this.cadastroUsuarioService.listarTodosUsuarios()
  }

  adicionarUser(): void{
    this.cadastroUsuarioService.cadastroUsuario(this.criarUsuario).subscribe(
      response => {
        console.log('Usuario cadastrado com sucesso', response)
        this.toastr.success("Usuário cadastrado com sucesso")
        this.criarUsuario = {} as UsuarioProp
         
        this.router.navigateByUrl(this.router.url).then(() => {
          this.listarUsuarios()
        })
      },
      error => {
        this.toastr.error("Erro ao cadastrar usuário", error)
      }
    )
  }

  async handleCepChange() {
    try {
      const responseCep: any = await this.http.get(`https://viacep.com.br/ws/${this.criarUsuario.cep}/json/`).toPromise();
      this.criarUsuario.logradouro = responseCep.logradouro
      this.criarUsuario.bairro = responseCep.bairro
      this.criarUsuario.localidade = responseCep.localidade
      this.criarUsuario.uf = responseCep.uf
    } catch (error) {
      console.log("Erro ao cadastrar cep", error)
    }
  }
  
  removerUsuario(id: number){
   this.cadastroUsuarioService.deletarUsuario(id).subscribe(
    () => {
     console.log('Usuario deletado com sucesso')
      this.toastr.success('Usuario deletado com sucesso')
      this.listarUsuarios()
    }
   )  
  }

}
