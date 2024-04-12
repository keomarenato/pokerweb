import { Component, OnInit } from '@angular/core';
import { UsuarioProp } from '../../Interfaces/cadastro';
import { CadastroUsuarioService } from '../../services/cadastro-usuario.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navibar',
  templateUrl: './navibar.component.html',
  styleUrl: './navibar.component.css'
})
export class NavibarComponent implements OnInit {


  constructor(
    private cadastroUsuarioService: CadastroUsuarioService,
    private toastr: ToastrService,
    private router: Router
    ){}

  ngOnInit() {}

   

}
