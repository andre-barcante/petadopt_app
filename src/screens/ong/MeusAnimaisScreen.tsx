import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ONGPetsStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Pet } from '../../types';
import { especieEmoji, calcularIdade } from '../../utils/helpers';

type Props = { navigation: NativeStackNavigationProp<ONGPetsStackParamList, 'MeusAnimais'> };

function PetCard({ pet, onPress }: { pet: Pet; onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.cardEmoji, { backgroundColor: pet.especie === 'cao' ? '#FFF3E0' : '#E8F5E9' }]}>
        <Text style={styles.emoji}>{especieEmoji(pet.especie)}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNome}>{pet.nome}</Text>
        <Text style={styles.cardRaca}>{pet.raca} · {calcularIdade(pet.dataNascimento)}</Text>
        <Text style={styles.cardCor}>Cor: {pet.cor}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: pet.disponivel ? COLORS.successLight : COLORS.errorLight }]}>
        <Text style={[styles.badgeText, { color: pet.disponivel ? COLORS.success : COLORS.error }]}>
          {pet.disponivel ? 'Disponível' : 'Adotado'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function MeusAnimaisScreen({ navigation }: Props) {
  const { usuario } = useAuth();
  const { pets } = useData();
  const meusPets = pets.filter(p => p.ongId === usuario?.id);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <FlatList
          data={meusPets}
          keyExtractor={p => p.id}
          renderItem={({ item }) => (
            <PetCard pet={item} onPress={() => navigation.navigate('PetDetailONG', { petId: item.id })} />
          )}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🐾</Text>
              <Text style={styles.emptyText}>Nenhum animal cadastrado ainda.</Text>
              <Text style={styles.emptySubtext}>Toque no botão + para adicionar.</Text>
            </View>
          }
        />

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AdicionarEditarPet', {})}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flex: 1 },
  list: { padding: 16, paddingBottom: 80 },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardEmoji: { width: 54, height: 54, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  emoji: { fontSize: 28 },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  cardRaca: { fontSize: 13, color: COLORS.textMedium, marginTop: 2 },
  cardCor: { fontSize: 13, color: COLORS.textLight, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  fabText: { color: COLORS.white, fontSize: 28, fontWeight: '300', lineHeight: 32 },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.textMedium },
  emptySubtext: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
});
