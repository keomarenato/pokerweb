
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login.component';
import { CadastroComponent } from './componentes/cadastro/cadastro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ToastrModule} from 'ngx-toastr'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NavibarComponent } from './componentes/navibar/navibar.component';
import { HomeComponent } from './componentes/home/home.component';
import { ListarUsuarioComponent } from './componentes/listar-usuario/listar-usuario.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { EditarComponent } from './componentes/editar/editar.component';
import { CadastrarPokerComponent } from './componentes/cadastrar-poker/cadastrar-poker.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListarCampeonatosComponent } from './componentes/listar-campeonatos/listar-campeonatos.component';
import { DatePipe } from '@angular/common';
import { RankingComponent } from './componentes/ranking/ranking.component';
import { CampeonatosComponent } from './componentes/campeonatos/campeonatos.component'; 
 
 


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CadastroComponent,
    NavibarComponent,
    HomeComponent,
    ListarCampeonatosComponent,
    FooterComponent,
    EditarComponent,
    CadastrarPokerComponent,
    ListarUsuarioComponent,
    RankingComponent,
    CampeonatosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModalModule,
    ModalModule.forRoot(),
    ToastrModule.forRoot(),
    CommonModule
  ],
  exports: [
    ListarCampeonatosComponent
  ],
  providers: [
    provideClientHydration(),
    DatePipe 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
