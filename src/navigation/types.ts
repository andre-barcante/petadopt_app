export type AuthStackParamList = {
  Welcome: undefined;
  Login: { tipo: 'ong' | 'adotante' };
  RegisterONG: undefined;
  RegisterAdotante: undefined;
};

export type ONGPetsStackParamList = {
  MeusAnimais: undefined;
  AdicionarEditarPet: { petId?: string } | undefined;
  PetDetailONG: { petId: string };
};

export type ONGPropostasStackParamList = {
  Propostas: undefined;
  PropostaDetail: { propostaId: string };
};

export type AdotanteExplorarStackParamList = {
  Explorar: undefined;
  PetDetail: { petId: string };
  Candidatura: { petId: string };
};

export type AdotanteCandidaturasStackParamList = {
  MinhasCandidaturas: undefined;
};
