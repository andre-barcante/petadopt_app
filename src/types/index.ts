export type Especie = 'cao' | 'gato';
export type Sexo = 'M' | 'F' | 'outro';
export type StatusProposta = 'pendente' | 'aceita' | 'recusada';
export type TipoUsuario = 'ong' | 'adotante';

export interface ONG {
  id: string;
  nome: string;
  cnpj: string;
  email: string;
  endereco: string;
  contato: string;
}

export interface Pet {
  id: string;
  ongId: string;
  nome: string;
  dataNascimento: string;
  raca: string;
  especie: Especie;
  cor: string;
  descricao: string;
  disponivel: boolean;
  fotoUrl?: string;
}

export interface Adotante {
  id: string;
  nome: string;
  sexo: Sexo;
  dataNascimento: string;
  email: string;
  contato: string;
  endereco: string;
}

export interface NotaPrivada {
  id: string;
  propostaId: string;
  texto: string;
  criadaEm: string;
}

export interface Proposta {
  id: string;
  petId: string;
  adotanteId: string;
  ongId: string;
  descricaoAdotante: string;
  notasPrivadas: NotaPrivada[];
  status: StatusProposta;
  criadaEm: string;
}
