import { ONG, Pet, Adotante, Proposta } from '../types';

export const mockONGs: ONG[] = [
  {
    id: 'ong1',
    nome: 'Patinhas Felizes',
    cnpj: '12.345.678/0001-90',
    email: 'contato@patinhasfelizes.org',
    endereco: 'Rua das Flores, 123 - São Paulo, SP',
    contato: '(11) 91234-5678',
    senha: '123456',
  },
  {
    id: 'ong2',
    nome: 'Lar Animal',
    cnpj: '98.765.432/0001-10',
    email: 'lar@laranimal.org',
    endereco: 'Av. Brasil, 456 - São Paulo, SP',
    contato: '(11) 99876-5432',
    senha: '123456',
  },
];

export const mockPets: Pet[] = [
  {
    id: 'pet1',
    ongId: 'ong1',
    nome: 'Rex',
    dataNascimento: '2022-03-15',
    raca: 'Labrador',
    especie: 'cao',
    cor: 'Amarelo',
    descricao: 'Rex é um cão muito carinhoso e ativo. Adora brincar e se dá bem com crianças e outros animais.',
    disponivel: true,
  },
  {
    id: 'pet2',
    ongId: 'ong1',
    nome: 'Luna',
    dataNascimento: '2023-07-20',
    raca: 'Vira-lata',
    especie: 'gato',
    cor: 'Preto e branco',
    descricao: 'Luna é uma gatinha tranquila e carinhosa. Gosta de colos e é ótima para apartamento.',
    disponivel: true,
  },
  {
    id: 'pet3',
    ongId: 'ong1',
    nome: 'Toby',
    dataNascimento: '2021-11-05',
    raca: 'Beagle',
    especie: 'cao',
    cor: 'Tricolor',
    descricao: 'Toby é esperto e curioso. Precisa de espaço para se exercitar e muito amor.',
    disponivel: false,
  },
  {
    id: 'pet4',
    ongId: 'ong2',
    nome: 'Mimi',
    dataNascimento: '2023-02-14',
    raca: 'Persa',
    especie: 'gato',
    cor: 'Cinza',
    descricao: 'Mimi é uma gatinha elegante e calma. Adora ambientes tranquilos e rotinas estáveis.',
    disponivel: true,
  },
  {
    id: 'pet5',
    ongId: 'ong2',
    nome: 'Bob',
    dataNascimento: '2022-09-01',
    raca: 'Golden Retriever',
    especie: 'cao',
    cor: 'Dourado',
    descricao: 'Bob é um Golden Retriever amoroso. Muito brincalhão e perfeito para famílias com crianças.',
    disponivel: true,
  },
];

export const mockAdotantes: Adotante[] = [
  {
    id: 'adotante1',
    nome: 'Ana Silva',
    sexo: 'F',
    dataNascimento: '1990-05-12',
    email: 'ana@email.com',
    contato: '(11) 91111-2222',
    endereco: 'Rua A, 10 - São Paulo, SP',
    senha: '123456',
  },
  {
    id: 'adotante2',
    nome: 'Carlos Souza',
    sexo: 'M',
    dataNascimento: '1985-08-25',
    email: 'carlos@email.com',
    contato: '(11) 93333-4444',
    endereco: 'Rua B, 20 - São Paulo, SP',
    senha: '123456',
  },
];

export const mockPropostas: Proposta[] = [
  {
    id: 'proposta1',
    petId: 'pet1',
    adotanteId: 'adotante1',
    ongId: 'ong1',
    descricaoAdotante:
      'Tenho uma casa com quintal e muito amor para dar. Sempre tive cachorros e sei cuidar bem. Trabalho em home office e posso acompanhá-lo o dia todo.',
    notasPrivadas: [
      {
        id: 'nota1',
        propostaId: 'proposta1',
        texto: 'Candidata parece responsável. Verificar referências antes de confirmar.',
        criadaEm: '2026-05-01T10:00:00Z',
      },
    ],
    status: 'pendente',
    criadaEm: '2026-05-01T09:00:00Z',
  },
  {
    id: 'proposta2',
    petId: 'pet2',
    adotanteId: 'adotante2',
    ongId: 'ong1',
    descricaoAdotante:
      'Moro em apartamento tranquilo no 3º andar. Sou home office e posso dar atenção integral. Já tive gatos antes.',
    notasPrivadas: [],
    status: 'aceita',
    criadaEm: '2026-04-28T15:00:00Z',
  },
];
