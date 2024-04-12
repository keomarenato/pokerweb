import { Component, OnInit } from '@angular/core';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { error } from 'console';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  editUsuario = {
    email: '',
    password: ''
  }

  constructor(
    private authService: AuthService,
    private cadastroService: CadastroUsuarioService,
    private router: Router,
    private toastr: ToastrService
  ){}

  ngOnInit() {}


  logarUsuario(email: string, password: string) {
    return this.cadastroService.logarUser(email, password).subscribe(
     response => {
      this.toastr.success('Usuario logado com sucesso')
      console.log('Usuario logado com sucesso', response)
      this.authService.login()
      this.router.navigate(['/dashboard'])
     },
     error => {
      this.toastr.error("Erro ao efetuar o login")
      console.error('Erro ao efetuaro o login', error)
     }
    )
  }
}
