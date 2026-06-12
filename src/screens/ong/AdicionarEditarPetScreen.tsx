import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ONGPetsStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DateInput } from '../../components/ui/DateInput';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Especie } from '../../types';

type Props = {
  navigation: NativeStackNavigationProp<ONGPetsStackParamList, 'AdicionarEditarPet'>;
  route: RouteProp<ONGPetsStackParamList, 'AdicionarEditarPet'>;
};

type FormPet = { nome: string; dataNascimento: string; raca: string; especie: Especie; cor: string; descricao: string; disponivel: boolean };

const ESPECIES: { valor: Especie; label: string; emoji: string }[] = [
  { valor: 'cao', label: 'Cão', emoji: '🐕' },
  { valor: 'gato', label: 'Gato', emoji: '🐈' },
];

export default function AdicionarEditarPetScreen({ navigation, route }: Props) {
  const petId = route.params?.petId;
  const { usuario } = useAuth();
  const { pets, adicionarPet, atualizarPet } = useData();

  const [form, setForm] = useState<FormPet>({
    nome: '', dataNascimento: '', raca: '', especie: 'cao',
    cor: '', descricao: '', disponivel: true,
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (petId) {
      const pet = pets.find((p: any) => p.id === petId);
      if (pet) setForm({ nome: pet.nome, dataNascimento: pet.dataNascimento, raca: pet.raca, especie: pet.especie, cor: pet.cor, descricao: pet.descricao, disponivel: pet.disponivel });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petId]);

  const set = (campo: string) => (valor: string) =>
    setForm((prev: FormPet) => ({ ...prev, [campo]: valor }));

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = 'Nome obrigatório.';
    if (!form.dataNascimento.match(/^\d{4}-\d{2}-\d{2}$/)) e.dataNascimento = 'Preencha a data completa.';
    if (!form.raca.trim()) e.raca = 'Raça obrigatória.';
    if (!form.cor.trim()) e.cor = 'Cor obrigatória.';
    if (!form.descricao.trim()) e.descricao = 'Descrição obrigatória.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleSalvar = async () => {
    if (!validar()) return;
    setLoading(true);
    if (petId) {
      const pet = pets.find(p => p.id === petId)!;
      await atualizarPet({ ...pet, ...form });
      setLoading(false);
      Alert.alert('Sucesso', 'Pet atualizado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } else {
      await adicionarPet({ ...form, ongId: usuario!.id });
      setLoading(false);
      Alert.alert('Sucesso', 'Pet cadastrado!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>{petId ? 'Editar Pet' : 'Novo Pet'}</Text>

        <View style={styles.form}>
          <Input label="Nome" value={form.nome} onChangeText={set('nome')} placeholder="Nome do animal" error={erros.nome} />
          <DateInput label="Data de Nascimento" value={form.dataNascimento} onChangeDate={set('dataNascimento')} error={erros.dataNascimento} />

          <Text style={styles.fieldLabel}>Espécie</Text>
          <View style={styles.especieRow}>
            {ESPECIES.map(e => (
              <TouchableOpacity
                key={e.valor}
                style={[styles.especieBtn, form.especie === e.valor && styles.especieBtnAtivo]}
                onPress={() => setForm((prev: FormPet) => ({ ...prev, especie: e.valor }))}
              >
                <Text style={styles.especieEmoji}>{e.emoji}</Text>
                <Text style={[styles.especieBtnText, form.especie === e.valor && styles.especieBtnTextAtivo]}>{e.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Input label="Raça" value={form.raca} onChangeText={set('raca')} placeholder="Ex: Labrador" error={erros.raca} />
          <Input label="Cor" value={form.cor} onChangeText={set('cor')} placeholder="Ex: Amarelo" error={erros.cor} />
          <Input
            label="Descrição"
            value={form.descricao}
            onChangeText={set('descricao')}
            placeholder="Conte sobre a personalidade e necessidades do animal..."
            multiline
            numberOfLines={4}
            style={{ height: 100, textAlignVertical: 'top' } as any}
            error={erros.descricao}
          />

          {petId && (
            <>
              <Text style={styles.fieldLabel}>Disponibilidade</Text>
              <View style={styles.especieRow}>
                {[{ valor: true, label: 'Disponível', color: COLORS.success }, { valor: false, label: 'Adotado', color: COLORS.error }].map(op => (
                  <TouchableOpacity
                    key={String(op.valor)}
                    style={[styles.especieBtn, form.disponivel === op.valor && { ...styles.especieBtnAtivo, backgroundColor: op.color + '22', borderColor: op.color }]}
                    onPress={() => setForm((prev: FormPet) => ({ ...prev, disponivel: op.valor }))}
                  >
                    <Text style={[styles.especieBtnText, form.disponivel === op.valor && { color: op.color, fontWeight: '700' }]}>{op.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <Button title={petId ? 'Salvar Alterações' : 'Cadastrar Pet'} onPress={handleSalvar} loading={loading} style={styles.btn} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: 24 },
  titulo: { fontSize: 24, fontWeight: '700', color: COLORS.textDark, marginBottom: 20 },
  form: { backgroundColor: COLORS.white, borderRadius: 16, padding: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textMedium, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  especieRow: { flexDirection: 'row', marginBottom: 14, gap: 10 },
  especieBtn: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  especieBtnAtivo: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  especieEmoji: { fontSize: 22, marginBottom: 4 },
  especieBtnText: { color: COLORS.textMedium, fontWeight: '500', fontSize: 14 },
  especieBtnTextAtivo: { color: COLORS.primaryDark, fontWeight: '700' },
  btn: { marginTop: 8 },
});
