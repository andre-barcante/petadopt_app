import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Pet, Proposta, NotaPrivada, StatusProposta } from '../types';
import { mockPets, mockPropostas } from '../data/mock';
import { generateId } from '../utils/helpers';

interface DataContextData {
  pets: Pet[];
  propostas: Proposta[];
  adicionarPet: (pet: Omit<Pet, 'id'>) => Pet;
  atualizarPet: (pet: Pet) => void;
  adicionarProposta: (proposta: Omit<Proposta, 'id' | 'notasPrivadas' | 'criadaEm'>) => { sucesso: boolean; erro?: string };
  adicionarNota: (propostaId: string, texto: string) => void;
  atualizarStatus: (propostaId: string, status: StatusProposta) => void;
}

const DataContext = createContext<DataContextData>({} as DataContextData);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [pets, setPets] = useState<Pet[]>(mockPets);
  const [propostas, setPropostas] = useState<Proposta[]>(mockPropostas);

  const adicionarPet = (dados: Omit<Pet, 'id'>): Pet => {
    const novo: Pet = { ...dados, id: generateId() };
    setPets(prev => [...prev, novo]);
    return novo;
  };

  const atualizarPet = (petAtualizado: Pet) => {
    setPets(prev => prev.map(p => p.id === petAtualizado.id ? petAtualizado : p));
  };

  const adicionarProposta = (dados: Omit<Proposta, 'id' | 'notasPrivadas' | 'criadaEm'>): { sucesso: boolean; erro?: string } => {
    const jaExiste = propostas.some(
      p => p.petId === dados.petId && p.adotanteId === dados.adotanteId && p.status === 'pendente'
    );
    if (jaExiste) return { sucesso: false, erro: 'Você já tem uma candidatura pendente para este pet.' };

    const nova: Proposta = {
      ...dados,
      id: generateId(),
      notasPrivadas: [],
      criadaEm: new Date().toISOString(),
    };
    setPropostas(prev => [...prev, nova]);
    return { sucesso: true };
  };

  const adicionarNota = (propostaId: string, texto: string) => {
    const nota: NotaPrivada = {
      id: generateId(),
      propostaId,
      texto,
      criadaEm: new Date().toISOString(),
    };
    setPropostas(prev =>
      prev.map(p =>
        p.id === propostaId ? { ...p, notasPrivadas: [...p.notasPrivadas, nota] } : p
      )
    );
  };

  const atualizarStatus = (propostaId: string, status: StatusProposta) => {
    setPropostas(prev =>
      prev.map(p => p.id === propostaId ? { ...p, status } : p)
    );
  };

  return (
    <DataContext.Provider value={{ pets, propostas, adicionarPet, atualizarPet, adicionarProposta, adicionarNota, atualizarStatus }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
