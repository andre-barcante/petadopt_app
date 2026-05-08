import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ONG, Adotante, TipoUsuario } from '../types';
import { mockONGs, mockAdotantes } from '../data/mock';
import { generateId } from '../utils/helpers';

interface AuthState {
  usuario: ONG | Adotante | null;
  tipo: TipoUsuario | null;
}

interface AuthContextData extends AuthState {
  ongs: ONG[];
  adotantes: Adotante[];
  login: (email: string, senha: string, tipo: TipoUsuario) => boolean;
  logout: () => void;
  cadastrarONG: (dados: Omit<ONG, 'id'>) => { sucesso: boolean; erro?: string };
  cadastrarAdotante: (dados: Omit<Adotante, 'id'>) => { sucesso: boolean; erro?: string };
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({ usuario: null, tipo: null });
  const [ongs, setOngs] = useState<ONG[]>(mockONGs);
  const [adotantes, setAdotantes] = useState<Adotante[]>(mockAdotantes);

  const login = (email: string, senha: string, tipo: TipoUsuario): boolean => {
    if (tipo === 'ong') {
      const ong = ongs.find(o => o.email === email && o.senha === senha);
      if (ong) { setState({ usuario: ong, tipo: 'ong' }); return true; }
    } else {
      const adotante = adotantes.find(a => a.email === email && a.senha === senha);
      if (adotante) { setState({ usuario: adotante, tipo: 'adotante' }); return true; }
    }
    return false;
  };

  const logout = () => setState({ usuario: null, tipo: null });

  const cadastrarONG = (dados: Omit<ONG, 'id'>): { sucesso: boolean; erro?: string } => {
    if (ongs.some(o => o.email === dados.email)) {
      return { sucesso: false, erro: 'E-mail já cadastrado.' };
    }
    if (ongs.some(o => o.cnpj === dados.cnpj)) {
      return { sucesso: false, erro: 'CNPJ já cadastrado.' };
    }
    const nova: ONG = { ...dados, id: generateId() };
    setOngs(prev => [...prev, nova]);
    setState({ usuario: nova, tipo: 'ong' });
    return { sucesso: true };
  };

  const cadastrarAdotante = (dados: Omit<Adotante, 'id'>): { sucesso: boolean; erro?: string } => {
    if (adotantes.some(a => a.email === dados.email)) {
      return { sucesso: false, erro: 'E-mail já cadastrado.' };
    }
    const novo: Adotante = { ...dados, id: generateId() };
    setAdotantes(prev => [...prev, novo]);
    setState({ usuario: novo, tipo: 'adotante' });
    return { sucesso: true };
  };

  return (
    <AuthContext.Provider value={{ ...state, ongs, adotantes, login, logout, cadastrarONG, cadastrarAdotante }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
