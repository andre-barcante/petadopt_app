import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AdotanteExplorarStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Pet, Especie } from '../../types';
import { especieEmoji, formatarEspecie, calcularIdade } from '../../utils/helpers';

type Props = { navigation: NativeStackNavigationProp<AdotanteExplorarStackParamList, 'Explorar'> };

const FILTROS: { valor: Especie | 'todos'; label: string }[] = [
  { valor: 'todos', label: '🐾 Todos' },
  { valor: 'cao', label: '🐕 Cães' },
  { valor: 'gato', label: '🐈 Gatos' },
];

function PetCard({ pet, ongNome, onPress }: { pet: Pet; ongNome: string; onPress: () => void }) {
  const bgColor = pet.especie === 'cao' ? '#FFF3E0' : '#E8F5E9';
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={[styles.cardTop, { backgroundColor: bgColor }]}>
        <Text style={styles.cardEmoji}>{especieEmoji(pet.especie)}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardNome}>{pet.nome}</Text>
        <Text style={styles.cardRaca}>{pet.raca} · {formatarEspecie(pet.especie)}</Text>
        <Text style={styles.cardIdade}>{calcularIdade(pet.dataNascimento)}</Text>
        <Text style={styles.cardONG}>🏠 {ongNome}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function ExplorarScreen({ navigation }: Props) {
  const { ongs } = useAuth();
  const { pets } = useData();
  const [filtro, setFiltro] = useState<Especie | 'todos'>('todos');

  const petsDisponiveis = pets
    .filter(p => p.disponivel)
    .filter(p => filtro === 'todos' || p.especie === filtro);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Pets para Adotar</Text>
          <Text style={styles.headerSubtitle}>{petsDisponiveis.length} disponíveis</Text>
        </View>

        <View style={styles.filtros}>
          {FILTROS.map(f => (
            <TouchableOpacity
              key={f.valor}
              style={[styles.filtroBtn, filtro === f.valor && styles.filtroBtnAtivo]}
              onPress={() => setFiltro(f.valor)}
            >
              <Text style={[styles.filtroText, filtro === f.valor && styles.filtroTextAtivo]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={petsDisponiveis}
          keyExtractor={p => p.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => {
            const ong = ongs.find(o => o.id === item.ongId);
            return (
              <PetCard
                pet={item}
                ongNome={ong?.nome ?? 'ONG desconhecida'}
                onPress={() => navigation.navigate('PetDetail', { petId: item.id })}
              />
            );
          }}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🔍</Text>
              <Text style={styles.emptyText}>Nenhum pet disponível no momento.</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  headerTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textDark },
  headerSubtitle: { fontSize: 14, color: COLORS.textLight, marginTop: 2 },
  filtros: { flexDirection: 'row', paddingHorizontal: 16, paddingBottom: 12, gap: 8 },
  filtroBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  filtroBtnAtivo: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filtroText: { fontSize: 13, color: COLORS.textMedium, fontWeight: '500' },
  filtroTextAtivo: { color: COLORS.white, fontWeight: '700' },
  list: { paddingHorizontal: 12, paddingBottom: 32 },
  row: { justifyContent: 'space-between' },
  card: { backgroundColor: COLORS.white, borderRadius: 16, marginBottom: 14, width: '48%', overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 4 },
  cardTop: { alignItems: 'center', paddingVertical: 20 },
  cardEmoji: { fontSize: 44 },
  cardBody: { padding: 12 },
  cardNome: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  cardRaca: { fontSize: 12, color: COLORS.textMedium, marginTop: 2 },
  cardIdade: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  cardONG: { fontSize: 11, color: COLORS.primary, marginTop: 6, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMedium },
});
