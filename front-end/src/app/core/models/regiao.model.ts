import { Cidade } from './cidade.model';

export interface Regiao {
  id: string | null; 
  nome: string;
  ativo: boolean;
  cidades: Cidade[]; 
}