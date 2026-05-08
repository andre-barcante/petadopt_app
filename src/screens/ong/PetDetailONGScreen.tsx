import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ONGPetsStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { useData } from '../../context/DataContext';
import { especieEmoji, formatarEspecie, calcularIdade, formatDate } from '../../utils/helpers';

type Props = {
  navigation: NativeStackNavigationProp<ONGPetsStackParamList, 'PetDetailONG'>;
  route: RouteProp<ONGPetsStackParamList, 'PetDetailONG'>;
};

function InfoRow({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  );
}

export default function PetDetailONGScreen({ navigation, route }: Props) {
  const { petId } = route.params;
  const { pets } = useData();
  const pet = pets.find(p => p.id === petId);

  if (!pet) return (
    <View style={styles.notFound}><Text>Pet não encontrado.</Text></View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.hero, { backgroundColor: pet.especie === 'cao' ? '#FFF3E0' : '#E8F5E9' }]}>
          <Text style={styles.heroEmoji}>{especieEmoji(pet.especie)}</Text>
          <Text style={styles.heroNome}>{pet.nome}</Text>
          <View style={[styles.badge, { backgroundColor: pet.disponivel ? COLORS.successLight : COLORS.errorLight }]}>
            <Text style={[styles.badgeText, { color: pet.disponivel ? COLORS.success : COLORS.error }]}>
              {pet.disponivel ? '✓ Disponível para adoção' : '✗ Já adotado'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações</Text>
          <InfoRow label="Espécie" valor={formatarEspecie(pet.especie)} />
          <InfoRow label="Raça" valor={pet.raca} />
          <InfoRow label="Cor" valor={pet.cor} />
          <InfoRow label="Idade" valor={calcularIdade(pet.dataNascimento)} />
          <InfoRow label="Data de Nascimento" valor={formatDate(pet.dataNascimento)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descrição</Text>
          <Text style={styles.descricao}>{pet.descricao}</Text>
        </View>

        <Button
          title="Editar informações"
          onPress={() => navigation.navigate('AdicionarEditarPet', { petId: pet.id })}
          variant="outline"
          style={styles.btn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, paddingBottom: 32 },
  hero: { alignItems: 'center', paddingVertical: 32, paddingHorizontal: 24 },
  heroEmoji: { fontSize: 80, marginBottom: 12 },
  heroNome: { fontSize: 28, fontWeight: '800', color: COLORS.textDark, marginBottom: 12 },
  badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  badgeText: { fontSize: 14, fontWeight: '600' },
  section: { backgroundColor: COLORS.white, margin: 16, marginTop: 0, marginBottom: 12, borderRadius: 14, padding: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoLabel: { fontSize: 14, color: COLORS.textMedium },
  infoValor: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  descricao: { fontSize: 15, color: COLORS.textMedium, lineHeight: 22 },
  btn: { marginHorizontal: 16 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
