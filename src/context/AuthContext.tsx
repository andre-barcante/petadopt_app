import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ONG, Adotante, TipoUsuario } from '../types';
import { supabase } from '../lib/supabase';

interface AuthState {
  usuario: ONG | Adotante | null;
  tipo: TipoUsuario | null;
}

interface AuthContextData extends AuthState {
  ongs: ONG[];
  adotantes: Adotante[];
  carregando: boolean;
  login: (email: string, senha: string, tipo: TipoUsuario) => Promise<boolean>;
  logout: () => void;
  cadastrarONG: (dados: Omit<ONG, 'id'> & { senha: string }) => Promise<{ sucesso: boolean; erro?: string }>;
  cadastrarAdotante: (dados: Omit<Adotante, 'id'> & { senha: string }) => Promise<{ sucesso: boolean; erro?: string }>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const toONG = (db: any): ONG => ({
  id: db.id, nome: db.nome, cnpj: db.cnpj,
  email: db.email, endereco: db.endereco, contato: db.contato,
});

const toAdotante = (db: any): Adotante => ({
  id: db.id, nome: db.nome, sexo: db.sexo,
  dataNascimento: db.data_nascimento, email: db.email,
  contato: db.contato, endereco: db.endereco,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ usuario: null, tipo: null });
  const [ongs, setOngs] = useState<ONG[]>([]);
  const [adotantes, setAdotantes] = useState<Adotante[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregarListas = async () => {
    const [{ data: ongsData }, { data: adotantesData }] = await Promise.all([
      supabase.from('ongs').select('*'),
      supabase.from('adotantes').select('*'),
    ]);
    if (ongsData) setOngs(ongsData.map(toONG));
    if (adotantesData) setAdotantes(adotantesData.map(toAdotante));
  };

  const carregarPerfil = async (userId: string, tipo: TipoUsuario): Promise<ONG | Adotante | null> => {
    if (tipo === 'ong') {
      const { data } = await supabase.from('ongs').select('*').eq('id', userId).single();
      return data ? toONG(data) : null;
    }
    const { data } = await supabase.from('adotantes').select('*').eq('id', userId).single();
    return data ? toAdotante(data) : null;
  };

  const aplicarSessao = async (session: any) => {
    if (!session?.user) {
      setState({ usuario: null, tipo: null });
      setOngs([]);
      setAdotantes([]);
      return;
    }
    const tipo = session.user.user_metadata?.tipo as TipoUsuario | undefined;
    if (!tipo) return;
    const [usuario] = await Promise.all([
      carregarPerfil(session.user.id, tipo),
      carregarListas(),
    ]);
    if (usuario) setState({ usuario, tipo });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      aplicarSessao(session).finally(() => setCarregando(false));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string, session: any) => {
      if (event === 'SIGNED_IN') aplicarSessao(session);
      if (event === 'SIGNED_OUT') {
        setState({ usuario: null, tipo: null });
        setOngs([]);
        setAdotantes([]);
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, senha: string, _tipo: TipoUsuario): Promise<boolean> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    return !error;
  };

  const logout = () => { supabase.auth.signOut(); };

  const cadastrarONG = async (
    dados: Omit<ONG, 'id'> & { senha: string }
  ): Promise<{ sucesso: boolean; erro?: string }> => {
    const { nome, cnpj, email, endereco, contato, senha } = dados;

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { tipo: 'ong' } },
    });

    if (error) return { sucesso: false, erro: error.message };
    if (!data.user) return { sucesso: false, erro: 'Usuário não criado.' };

    const { error: insertError } = await supabase
      .from('ongs')
      .insert({ id: data.user.id, nome, cnpj, email, endereco, contato });

    if (insertError) {
      await supabase.auth.signOut();
      const msg = insertError.message.includes('unique')
        ? 'E-mail ou CNPJ já cadastrado.'
        : insertError.message;
      return { sucesso: false, erro: msg };
    }

    return { sucesso: true };
  };

  const cadastrarAdotante = async (
    dados: Omit<Adotante, 'id'> & { senha: string }
  ): Promise<{ sucesso: boolean; erro?: string }> => {
    const { nome, sexo, dataNascimento, email, contato, endereco, senha } = dados;

    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { tipo: 'adotante' } },
    });

    if (error) return { sucesso: false, erro: error.message };
    if (!data.user) return { sucesso: false, erro: 'Usuário não criado.' };

    const { error: insertError } = await supabase.from('adotantes').insert({
      id: data.user.id,
      nome,
      sexo,
      data_nascimento: dataNascimento,
      email,
      contato,
      endereco,
    });

    if (insertError) {
      await supabase.auth.signOut();
      const msg = insertError.message.includes('unique')
        ? 'E-mail já cadastrado.'
        : insertError.message;
      return { sucesso: false, erro: msg };
    }

    return { sucesso: true };
  };

  return (
    <AuthContext.Provider value={{
      ...state, ongs, adotantes, carregando,
      login, logout, cadastrarONG, cadastrarAdotante,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
