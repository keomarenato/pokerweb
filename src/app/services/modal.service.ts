import { Injectable, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Injectable({
  providedIn: 'root'
})

export class ModalComponentService {
  @ViewChild('modal') public modal: ModalDirective | null = null;


  public abrirModal(): void {
     if(this.modal) {
      this.modal.show()
     }
  }

  public fecharModal(): void {
    if(this.modal) {
      this.modal.hide()
    }
  }
}
