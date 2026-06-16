import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ONGPropostasStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Proposta, StatusProposta } from '../../types';
import { labelStatus, especieEmoji } from '../../utils/helpers';

type Props = { navigation: NativeStackNavigationProp<ONGPropostasStackParamList, 'Propostas'> };

const FILTROS: { valor: StatusProposta | 'todas'; label: string }[] = [
  { valor: 'todas', label: 'Todas' },
  { valor: 'pendente', label: 'Pendentes' },
  { valor: 'aceita', label: 'Aceitas' },
  { valor: 'recusada', label: 'Recusadas' },
];

const STATUS_COLORS: Record<StatusProposta, { bg: string; text: string }> = {
  pendente: { bg: COLORS.warningLight, text: COLORS.warning },
  aceita: { bg: COLORS.successLight, text: COLORS.success },
  recusada: { bg: COLORS.errorLight, text: COLORS.error },
};

function PropostaCard({ proposta, petNome, petEspecie, petFotoUrl, adotanteNome, onPress }: {
  proposta: Proposta; petNome: string; petEspecie: 'cao' | 'gato'; petFotoUrl?: string; adotanteNome: string; onPress: () => void;
}) {
  const cor = STATUS_COLORS[proposta.status];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.cardThumb, { backgroundColor: petEspecie === 'cao' ? '#FFF3E0' : '#E8F5E9' }]}>
        {petFotoUrl
          ? <Image source={{ uri: petFotoUrl }} style={styles.cardThumbPhoto} />
          : <Text style={styles.cardEmoji}>{especieEmoji(petEspecie)}</Text>
        }
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardPet}>{petNome}</Text>
        <Text style={styles.cardAdotante}>👤 {adotanteNome}</Text>
        <Text style={styles.cardData}>{new Date(proposta.criadaEm).toLocaleDateString('pt-BR')}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: cor.bg }]}>
        <Text style={[styles.badgeText, { color: cor.text }]}>{labelStatus(proposta.status)}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function PropostasScreen({ navigation }: Props) {
  const { usuario, adotantes } = useAuth();
  const { pets, propostas } = useData();
  const [filtro, setFiltro] = useState<StatusProposta | 'todas'>('todas');

  const minhasPropostas = propostas
    .filter(p => p.ongId === usuario?.id)
    .filter(p => filtro === 'todas' || p.status === filtro)
    .sort((a, b) => {
      if (a.status === 'pendente' && b.status !== 'pendente') return -1;
      if (a.status !== 'pendente' && b.status === 'pendente') return 1;
      return new Date(b.criadaEm).getTime() - new Date(a.criadaEm).getTime();
    });

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
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
          data={minhasPropostas}
          keyExtractor={p => p.id}
          renderItem={({ item }) => {
            const pet = pets.find(p => p.id === item.petId);
            const adotante = adotantes.find(a => a.id === item.adotanteId);
            return (
              <PropostaCard
                proposta={item}
                petNome={pet?.nome ?? 'Pet removido'}
                petEspecie={pet?.especie ?? 'cao'}
                petFotoUrl={pet?.fotoUrl}
                adotanteNome={adotante?.nome ?? 'Usuário removido'}
                onPress={() => navigation.navigate('PropostaDetail', { propostaId: item.id })}
              />
            );
          }}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>📋</Text>
              <Text style={styles.emptyText}>Nenhuma proposta encontrada.</Text>
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
  filtros: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, gap: 8 },
  filtroBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: COLORS.white, borderWidth: 1, borderColor: COLORS.border },
  filtroBtnAtivo: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filtroText: { fontSize: 13, color: COLORS.textMedium, fontWeight: '500' },
  filtroTextAtivo: { color: COLORS.white, fontWeight: '700' },
  list: { padding: 16, paddingTop: 8, paddingBottom: 32 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  cardThumb: { width: 50, height: 50, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 14, overflow: 'hidden' },
  cardThumbPhoto: { width: 50, height: 50, resizeMode: 'cover' },
  cardEmoji: { fontSize: 26 },
  cardInfo: { flex: 1 },
  cardPet: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  cardAdotante: { fontSize: 13, color: COLORS.textMedium, marginTop: 2 },
  cardData: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: COLORS.textMedium },
});
