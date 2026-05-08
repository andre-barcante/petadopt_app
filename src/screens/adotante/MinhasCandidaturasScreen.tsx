import React from 'react';
import { View, Text, StyleSheet, FlatList, SafeAreaView } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Proposta, StatusProposta } from '../../types';
import { especieEmoji, labelStatus } from '../../utils/helpers';

const STATUS_STYLE: Record<StatusProposta, { bg: string; text: string; icon: string }> = {
  pendente: { bg: COLORS.warningLight, text: COLORS.warning, icon: '⏳' },
  aceita: { bg: COLORS.successLight, text: COLORS.success, icon: '✅' },
  recusada: { bg: COLORS.errorLight, text: COLORS.error, icon: '❌' },
};

function CandidaturaCard({ proposta, petNome, petEspecie, ongNome }: {
  proposta: Proposta; petNome: string; petEspecie: 'cao' | 'gato'; ongNome: string;
}) {
  const cor = STATUS_STYLE[proposta.status];
  return (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardEmoji}>{especieEmoji(petEspecie)}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardNome}>{petNome}</Text>
        <Text style={styles.cardONG}>🏠 {ongNome}</Text>
        <Text style={styles.cardData}>{new Date(proposta.criadaEm).toLocaleDateString('pt-BR')}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: cor.bg }]}>
        <Text style={styles.badgeIcon}>{cor.icon}</Text>
        <Text style={[styles.badgeText, { color: cor.text }]}>{labelStatus(proposta.status)}</Text>
      </View>
    </View>
  );
}

export default function MinhasCandidaturasScreen() {
  const { usuario, ongs } = useAuth();
  const { pets, propostas } = useData();

  const minhas = propostas
    .filter(p => p.adotanteId === usuario?.id)
    .sort((a, b) => new Date(b.criadaEm).getTime() - new Date(a.criadaEm).getTime());

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <FlatList
          data={minhas}
          keyExtractor={p => p.id}
          renderItem={({ item }) => {
            const pet = pets.find(p => p.id === item.petId);
            const ong = ongs.find(o => o.id === item.ongId);
            return (
              <CandidaturaCard
                proposta={item}
                petNome={pet?.nome ?? 'Pet removido'}
                petEspecie={pet?.especie ?? 'cao'}
                ongNome={ong?.nome ?? 'ONG desconhecida'}
              />
            );
          }}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyText}>Você ainda não tem candidaturas.</Text>
              <Text style={styles.emptySubtext}>Explore os pets disponíveis e se candidate!</Text>
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
  list: { padding: 16, paddingBottom: 32 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  cardLeft: { marginRight: 14 },
  cardEmoji: { fontSize: 32 },
  cardInfo: { flex: 1 },
  cardNome: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  cardONG: { fontSize: 13, color: COLORS.textMedium, marginTop: 2 },
  cardData: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  badge: { alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  badgeIcon: { fontSize: 16, marginBottom: 2 },
  badgeText: { fontSize: 11, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 56, marginBottom: 16 },
  emptyText: { fontSize: 16, fontWeight: '600', color: COLORS.textMedium },
  emptySubtext: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
});
