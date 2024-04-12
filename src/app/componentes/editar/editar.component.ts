import { Component, OnInit } from '@angular/core';
import { UsuarioProp } from '../../Interfaces/cadastro';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
 
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent implements OnInit {
  
 


    editUsuario: UsuarioProp = {
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
    private cadastroUsuarioService: CadastroUsuarioService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
     
   ) {}


   ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const usuarioId = params.get('id')
      if(usuarioId) {
        this.cadastroUsuarioService.obterUsuarioId(usuarioId).subscribe(
          usuario => {
            this.editUsuario = usuario
          }
        )
      }
    })
   }


   handleCepChange(){}

   editarUsuario(){
    this.cadastroUsuarioService.atualizarUsuario(this.editUsuario).subscribe(
      ()=> {
        console.log('Usuario atualizado com sucesso')
        this.router.navigate(['listarUser'], {relativeTo: this.route.parent})
      },
      error => {
        console.error("Erro ao atualizar usuario", error)
      }
    )
   }

   fecharModal(){
   this.router.navigate(['listarUser'], {relativeTo: this.route.parent})
   }

}
