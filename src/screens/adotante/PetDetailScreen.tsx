import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AdotanteExplorarStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { especieEmoji, formatarEspecie, calcularIdade, formatDate } from '../../utils/helpers';

type Props = {
  navigation: NativeStackNavigationProp<AdotanteExplorarStackParamList, 'PetDetail'>;
  route: RouteProp<AdotanteExplorarStackParamList, 'PetDetail'>;
};

function InfoRow({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  );
}

export default function PetDetailScreen({ navigation, route }: Props) {
  const { petId } = route.params;
  const { usuario, ongs } = useAuth();
  const { pets, propostas } = useData();

  const pet = pets.find(p => p.id === petId);
  const ong = ongs.find(o => o.id === pet?.ongId);

  if (!pet) return <View style={styles.notFound}><Text>Pet não encontrado.</Text></View>;

  const propostaPendente = propostas.some(
    p => p.petId === petId && p.adotanteId === usuario?.id && p.status === 'pendente'
  );

  const bgColor = pet.especie === 'cao' ? '#FFF3E0' : '#E8F5E9';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.hero, { backgroundColor: bgColor }]}>
          <Text style={styles.heroEmoji}>{especieEmoji(pet.especie)}</Text>
          <Text style={styles.heroNome}>{pet.nome}</Text>
          <Text style={styles.heroRaca}>{pet.raca} · {formatarEspecie(pet.especie)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <InfoRow label="Espécie" valor={formatarEspecie(pet.especie)} />
          <InfoRow label="Raça" valor={pet.raca} />
          <InfoRow label="Cor" valor={pet.cor} />
          <InfoRow label="Idade" valor={calcularIdade(pet.dataNascimento)} />
          <InfoRow label="Nascimento" valor={formatDate(pet.dataNascimento)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre {pet.nome}</Text>
          <Text style={styles.descricao}>{pet.descricao}</Text>
        </View>

        {ong && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Responsável</Text>
            <Text style={styles.ongNome}>{ong.nome}</Text>
            <Text style={styles.ongInfo}>📞 {ong.contato}</Text>
            <Text style={styles.ongInfo}>✉️ {ong.email}</Text>
            <Text style={styles.ongInfo}>📍 {ong.endereco}</Text>
          </View>
        )}

        <View style={styles.actions}>
          {propostaPendente ? (
            <View style={styles.pendenteBanner}>
              <Text style={styles.pendenteText}>⏳ Você já tem uma candidatura pendente para {pet.nome}.</Text>
            </View>
          ) : (
            <Button
              title={`❤️  Me candidatar para adotar ${pet.nome}`}
              onPress={() => navigation.navigate('Candidatura', { petId: pet.id })}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, paddingBottom: 32 },
  hero: { alignItems: 'center', paddingVertical: 32 },
  heroEmoji: { fontSize: 80, marginBottom: 12 },
  heroNome: { fontSize: 28, fontWeight: '800', color: COLORS.textDark },
  heroRaca: { fontSize: 15, color: COLORS.textMedium, marginTop: 4 },
  section: { backgroundColor: COLORS.white, marginHorizontal: 16, marginTop: 12, borderRadius: 14, padding: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { fontSize: 14, color: COLORS.textMedium },
  infoValor: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  descricao: { fontSize: 15, color: COLORS.textMedium, lineHeight: 22 },
  ongNome: { fontSize: 16, fontWeight: '700', color: COLORS.textDark, marginBottom: 8 },
  ongInfo: { fontSize: 14, color: COLORS.textMedium, marginBottom: 4 },
  actions: { padding: 16, marginTop: 4 },
  pendenteBanner: { backgroundColor: COLORS.warningLight, borderRadius: 12, padding: 16 },
  pendenteText: { color: COLORS.warning, fontSize: 14, fontWeight: '600', textAlign: 'center' },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
