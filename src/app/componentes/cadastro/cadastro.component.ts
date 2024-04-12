import { Component, OnInit } from '@angular/core';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
 
 

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.css'
})
export class CadastroComponent implements OnInit {
  
    public cadastrarUser: FormGroup = this.formBuilder.group({
      name: [''],
      email: [''],
      password: ['']
    })

  constructor(
    private cadastroService: CadastroUsuarioService,
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() { }

  cadastrarUsuario(): void {
    this.cadastroService.criarUser(this.cadastrarUser.value).subscribe(
      response => {
        this.toastr.success("Usuario cadastrado com sucesso")
        console.log('Usuario cadastrado com sucesso', response)
        this.cadastrarUser.reset()
        this.router.navigate(['/login'])
      },
      error => {
        this.toastr.error("Falha ao cadastrado usuario")
        console.error('Erro ao cadastrar o usuario', error)
      }
    )
  }
}
