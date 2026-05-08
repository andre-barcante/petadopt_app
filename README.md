# PetAdopt 🐾

App mobile de adoção de pets conectando ONGs e adotantes. Desenvolvido com Expo + TypeScript.

## Funcionalidades

**ONGs**
- Cadastro e login
- Gerenciamento de pets (cadastrar, editar, marcar como adotado)
- Visualização de propostas de adoção com filtro por status
- Adição de notas privadas em cada proposta
- Aceite ou recusa de propostas

**Adotantes**
- Cadastro e login
- Exploração de pets disponíveis com filtro por espécie (cão / gato)
- Visualização de detalhes do pet e da ONG responsável
- Envio de candidatura com mensagem personalizada
- Acompanhamento do status das candidaturas

## Como rodar

### Opção 1 — Snack (recomendado para apresentação)

1. Acesse [snack.expo.dev](https://snack.expo.dev)
2. Crie um novo projeto
3. Importe o repositório via **"Import from GitHub"**
4. Escaneie o QR code com o app **Expo Go** no celular

### Opção 2 — Local

> Requer Node.js instalado

```bash
cd petadopt
npm install
npx expo start
```

Escaneie o QR code com o **Expo Go** (Android/iOS).

## Credenciais de teste

| Tipo | E-mail | Senha |
|---|---|---|
| ONG | contato@patinhasfelizes.org | 123456 |
| ONG | lar@laranimal.org | 123456 |
| Adotante | ana@email.com | 123456 |
| Adotante | carlos@email.com | 123456 |

## Estrutura do projeto

```
petadopt/
├── App.tsx                        # Raiz — monta os providers e o navegador
├── src/
│   ├── types/index.ts             # Interfaces: ONG, Pet, Adotante, Proposta
│   ├── constants/colors.ts        # Paleta de cores
│   ├── utils/helpers.ts           # Formatadores de data, idade, espécie
│   ├── data/mock.ts               # Dados de exemplo (ONGs, pets, adotantes, propostas)
│   ├── context/
│   │   ├── AuthContext.tsx        # Estado de autenticação global
│   │   └── DataContext.tsx        # Estado de pets e propostas
│   ├── components/ui/
│   │   ├── Button.tsx             # Botão reutilizável (variantes: primary, secondary, outline, danger, success)
│   │   └── Input.tsx              # Campo de texto com label e mensagem de erro
│   ├── navigation/
│   │   ├── types.ts               # Tipos dos parâmetros de navegação
│   │   ├── AppNavigator.tsx       # Raiz: decide qual fluxo exibir
│   │   ├── AuthNavigator.tsx      # Stack: Welcome → Login → Register
│   │   ├── ONGNavigator.tsx       # Tabs: Pets | Propostas | Perfil
│   │   └── AdotanteNavigator.tsx  # Tabs: Explorar | Candidaturas | Perfil
│   └── screens/
│       ├── auth/                  # WelcomeScreen, LoginScreen, RegisterONGScreen, RegisterAdotanteScreen
│       ├── ong/                   # MeusAnimais, AdicionarEditarPet, PetDetailONG, Propostas, PropostaDetail
│       ├── adotante/              # Explorar, PetDetail, Candidatura, MinhasCandidaturas
│       └── shared/                # PerfilScreen (compartilhada entre ONG e Adotante)
```

## Dados e persistência

O app usa dados em memória via **Context API**. Os dados são reiniciados ao fechar o app — comportamento esperado nesta fase de protótipo.

A camada de dados está centralizada em `AuthContext` e `DataContext`, preparada para substituição por chamadas ao **Supabase** na próxima fase.

## Próximos passos

- [ ] Integração com Supabase (banco PostgreSQL na AWS)
- [ ] Autenticação real com tokens
- [ ] Upload e exibição de fotos dos pets via Supabase Storage
- [ ] Notificações para a ONG ao receber nova proposta
