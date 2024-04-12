import { UsuarioProp } from "./cadastro"

export interface Partida {
  id: number
  nomeCampeonato: string;
  dataCampeonato: Date | undefined;
  valorTotal: number;
  participantes: UsuarioProp[];
}