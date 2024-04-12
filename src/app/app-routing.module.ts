import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { CadastroComponent } from './componentes/cadastro/cadastro.component';
import { NavibarComponent } from './componentes/navibar/navibar.component';
import { authGuard } from './auth.guard';
import { HomeComponent } from './componentes/home/home.component';
import { ListarUsuarioComponent } from './componentes/listar-usuario/listar-usuario.component';
import { EditarComponent } from './componentes/editar/editar.component';
import { CadastrarPokerComponent } from './componentes/cadastrar-poker/cadastrar-poker.component';
import { ListarCampeonatosComponent } from './componentes/listar-campeonatos/listar-campeonatos.component';
import { RankingComponent } from './componentes/ranking/ranking.component';
import { CampeonatosComponent } from './componentes/campeonatos/campeonatos.component';

 

const routes: Routes = [ 
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
   //{path: 'cadastrar', component: CadastroComponent},
  {
    path: 'dashboard', component: NavibarComponent, canActivate: [authGuard],
    children:[
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'poker', component: CadastrarPokerComponent },
      { path: 'campeonatos', component: CampeonatosComponent },
      { path: 'listarUser', component: ListarUsuarioComponent },
      { path: 'listarUser/:id', component: EditarComponent },
      { path: 'historicos', component: ListarCampeonatosComponent},
      { path: 'ranking', component: RankingComponent},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
