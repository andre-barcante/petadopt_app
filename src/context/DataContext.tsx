import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pet, Proposta, NotaPrivada, StatusProposta } from '../types';
import { supabase } from '../lib/supabase';

interface DataContextData {
  pets: Pet[];
  propostas: Proposta[];
  carregando: boolean;
  adicionarPet: (pet: Omit<Pet, 'id'>) => Promise<Pet | null>;
  atualizarPet: (pet: Pet) => Promise<void>;
  adicionarProposta: (proposta: Omit<Proposta, 'id' | 'notasPrivadas' | 'criadaEm'>) => Promise<{ sucesso: boolean; erro?: string }>;
  adicionarNota: (propostaId: string, texto: string) => Promise<void>;
  atualizarStatus: (propostaId: string, status: StatusProposta) => Promise<void>;
}

const DataContext = createContext<DataContextData>({} as DataContextData);

const toPet = (db: any): Pet => ({
  id: db.id,
  ongId: db.ong_id,
  nome: db.nome,
  dataNascimento: db.data_nascimento,
  raca: db.raca,
  especie: db.especie,
  cor: db.cor,
  descricao: db.descricao ?? '',
  disponivel: db.disponivel,
  fotoUrl: db.foto_url ?? undefined,
});

const toNota = (db: any): NotaPrivada => ({
  id: db.id,
  propostaId: db.proposta_id,
  texto: db.texto,
  criadaEm: db.criado_em,
});

const toProposta = (db: any): Proposta => ({
  id: db.id,
  petId: db.pet_id,
  adotanteId: db.adotante_id,
  ongId: db.ong_id,
  descricaoAdotante: db.descricao_adotante ?? '',
  notasPrivadas: (db.notas_privadas ?? []).map(toNota),
  status: db.status,
  criadaEm: db.criado_em,
});

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [carregando, setCarregando] = useState(true);

  const carregar = async () => {
    const [{ data: petsData }, { data: propostasData }] = await Promise.all([
      supabase.from('pets').select('*').order('criado_em', { ascending: false }),
      supabase.from('propostas').select('*, notas_privadas(*)').order('criado_em', { ascending: false }),
    ]);
    if (petsData) setPets(petsData.map(toPet));
    if (propostasData) setPropostas(propostasData.map(toProposta));
  };

  useEffect(() => {
    carregar().finally(() => setCarregando(false));
  }, []);

  const adicionarPet = async (dados: Omit<Pet, 'id'>): Promise<Pet | null> => {
    const { data, error } = await supabase
      .from('pets')
      .insert({
        ong_id: dados.ongId,
        nome: dados.nome,
        data_nascimento: dados.dataNascimento,
        raca: dados.raca,
        especie: dados.especie,
        cor: dados.cor,
        descricao: dados.descricao,
        disponivel: dados.disponivel,
        foto_url: dados.fotoUrl ?? null,
      })
      .select()
      .single();
    if (error || !data) return null;
    const novo = toPet(data);
    setPets((prev: Pet[]) => [novo, ...prev]);
    return novo;
  };

  const atualizarPet = async (pet: Pet): Promise<void> => {
    await supabase.from('pets').update({
      nome: pet.nome,
      data_nascimento: pet.dataNascimento,
      raca: pet.raca,
      especie: pet.especie,
      cor: pet.cor,
      descricao: pet.descricao,
      disponivel: pet.disponivel,
      foto_url: pet.fotoUrl ?? null,
    }).eq('id', pet.id);
    setPets((prev: Pet[]) => prev.map((p: Pet) => p.id === pet.id ? pet : p));
  };

  const adicionarProposta = async (
    dados: Omit<Proposta, 'id' | 'notasPrivadas' | 'criadaEm'>
  ): Promise<{ sucesso: boolean; erro?: string }> => {
    const { count } = await supabase
      .from('propostas')
      .select('*', { count: 'exact', head: true })
      .eq('pet_id', dados.petId)
      .eq('adotante_id', dados.adotanteId)
      .eq('status', 'pendente');

    if (count && count > 0) {
      return { sucesso: false, erro: 'Você já tem uma candidatura pendente para este pet.' };
    }

    const { data, error } = await supabase
      .from('propostas')
      .insert({
        pet_id: dados.petId,
        adotante_id: dados.adotanteId,
        ong_id: dados.ongId,
        descricao_adotante: dados.descricaoAdotante,
        status: 'pendente',
      })
      .select('*, notas_privadas(*)')
      .single();

    if (error || !data) return { sucesso: false, erro: 'Não foi possível enviar a candidatura.' };
    setPropostas((prev: Proposta[]) => [toProposta(data), ...prev]);
    return { sucesso: true };
  };

  const adicionarNota = async (propostaId: string, texto: string): Promise<void> => {
    const { data } = await supabase
      .from('notas_privadas')
      .insert({ proposta_id: propostaId, texto })
      .select()
      .single();
    if (!data) return;
    const nota = toNota(data);
    setPropostas((prev: Proposta[]) =>
      prev.map((p: Proposta) => p.id === propostaId
        ? { ...p, notasPrivadas: [...p.notasPrivadas, nota] }
        : p
      )
    );
  };

  const atualizarStatus = async (propostaId: string, status: StatusProposta): Promise<void> => {
    await supabase.from('propostas').update({ status }).eq('id', propostaId);
    setPropostas((prev: Proposta[]) =>
      prev.map((p: Proposta) => p.id === propostaId ? { ...p, status } : p)
    );
  };

  return (
    <DataContext.Provider value={{
      pets, propostas, carregando,
      adicionarPet, atualizarPet, adicionarProposta, adicionarNota, atualizarStatus,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
