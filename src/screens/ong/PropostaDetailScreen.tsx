import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { ONGPropostasStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { especieEmoji, formatDate, labelStatus } from '../../utils/helpers';

type Props = {
  navigation: NativeStackNavigationProp<ONGPropostasStackParamList, 'PropostaDetail'>;
  route: RouteProp<ONGPropostasStackParamList, 'PropostaDetail'>;
};

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  pendente: { bg: COLORS.warningLight, text: COLORS.warning },
  aceita: { bg: COLORS.successLight, text: COLORS.success },
  recusada: { bg: COLORS.errorLight, text: COLORS.error },
};

export default function PropostaDetailScreen({ navigation, route }: Props) {
  const { propostaId } = route.params;
  const { adotantes } = useAuth();
  const { pets, propostas, adicionarNota, atualizarStatus } = useData();
  const [novaNota, setNovaNota] = useState('');

  const proposta = propostas.find((p: any) => p.id === propostaId);
  const pet = pets.find((p: any) => p.id === proposta?.petId);
  const adotante = adotantes.find((a: any) => a.id === proposta?.adotanteId);

  if (!proposta || !pet || !adotante) {
    return <View style={styles.notFound}><Text>Proposta não encontrada.</Text></View>;
  }

  const corStatus = STATUS_STYLE[proposta.status];

  const handleAdicionarNota = () => {
    if (!novaNota.trim()) return;
    adicionarNota(proposta.id, novaNota.trim());
    setNovaNota('');
  };

  const handleDecisao = (decisao: 'aceita' | 'recusada') => {
    const label = decisao === 'aceita' ? 'aceitar' : 'recusar';
    Alert.alert(
      `Confirmar ${label}`,
      `Tem certeza que deseja ${label} esta proposta? Esta ação não pode ser desfeita.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: decisao === 'aceita' ? 'Aceitar' : 'Recusar',
          style: decisao === 'aceita' ? 'default' : 'destructive',
          onPress: async () => {
            await atualizarStatus(proposta.id, decisao);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={[styles.statusBanner, { backgroundColor: corStatus.bg }]}>
          <Text style={[styles.statusText, { color: corStatus.text }]}>
            Status: {labelStatus(proposta.status)}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pet</Text>
          <View style={styles.petRow}>
            <View style={[styles.petThumb, { backgroundColor: pet.especie === 'cao' ? '#FFF3E0' : '#E8F5E9' }]}>
              {pet.fotoUrl
                ? <Image source={{ uri: pet.fotoUrl }} style={styles.petThumbPhoto} />
                : <Text style={styles.petEmoji}>{especieEmoji(pet.especie)}</Text>
              }
            </View>
            <View>
              <Text style={styles.petNome}>{pet.nome}</Text>
              <Text style={styles.petInfo}>{pet.raca} · {pet.cor}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Candidato</Text>
          <Text style={styles.adotanteNome}>{adotante.nome}</Text>
          <Text style={styles.adotanteInfo}>📞 {adotante.contato}</Text>
          <Text style={styles.adotanteInfo}>✉️ {adotante.email}</Text>
          <Text style={styles.adotanteInfo}>📍 {adotante.endereco}</Text>
          <Text style={styles.adotanteInfo}>🎂 {formatDate(adotante.dataNascimento)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mensagem do Candidato</Text>
          <Text style={styles.mensagem}>{proposta.descricaoAdotante}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notas Privadas ({proposta.notasPrivadas.length})</Text>
          {proposta.notasPrivadas.map((nota: any) => (
            <View key={nota.id} style={styles.nota}>
              <Text style={styles.notaTexto}>{nota.texto}</Text>
              <Text style={styles.notaData}>{new Date(nota.criadaEm).toLocaleDateString('pt-BR')}</Text>
            </View>
          ))}
          {proposta.status === 'pendente' && (
            <View style={styles.notaInput}>
              <TextInput
                style={styles.notaField}
                value={novaNota}
                onChangeText={setNovaNota}
                placeholder="Adicionar nota privada..."
                placeholderTextColor={COLORS.textLight}
                multiline
                numberOfLines={2}
              />
              <TouchableOpacity style={styles.notaBtn} onPress={handleAdicionarNota}>
                <Text style={styles.notaBtnText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {proposta.status === 'pendente' && (
          <View style={styles.acoes}>
            <Button
              title="✓ Aceitar Proposta"
              onPress={() => handleDecisao('aceita')}
              variant="success"
              style={{ flex: 1, marginRight: 8 }}
            />
            <Button
              title="✗ Recusar"
              onPress={() => handleDecisao('recusada')}
              variant="danger"
              style={{ flex: 1 }}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, paddingBottom: 32 },
  statusBanner: { padding: 14, alignItems: 'center', margin: 16, borderRadius: 12 },
  statusText: { fontSize: 15, fontWeight: '700' },
  section: { backgroundColor: COLORS.white, marginHorizontal: 16, marginBottom: 12, borderRadius: 14, padding: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  petRow: { flexDirection: 'row', alignItems: 'center' },
  petThumb: { width: 60, height: 60, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 14, overflow: 'hidden' },
  petThumbPhoto: { width: 60, height: 60, resizeMode: 'cover' },
  petEmoji: { fontSize: 32 },
  petNome: { fontSize: 18, fontWeight: '700', color: COLORS.textDark },
  petInfo: { fontSize: 14, color: COLORS.textMedium, marginTop: 2 },
  adotanteNome: { fontSize: 17, fontWeight: '700', color: COLORS.textDark, marginBottom: 10 },
  adotanteInfo: { fontSize: 14, color: COLORS.textMedium, marginBottom: 6 },
  mensagem: { fontSize: 15, color: COLORS.textMedium, lineHeight: 22, fontStyle: 'italic' },
  nota: { backgroundColor: COLORS.background, borderRadius: 8, padding: 12, marginBottom: 8 },
  notaTexto: { fontSize: 14, color: COLORS.textDark, lineHeight: 20 },
  notaData: { fontSize: 11, color: COLORS.textLight, marginTop: 6, textAlign: 'right' },
  notaInput: { marginTop: 8 },
  notaField: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, padding: 12, fontSize: 14, color: COLORS.textDark, backgroundColor: COLORS.background, minHeight: 60, textAlignVertical: 'top' },
  notaBtn: { backgroundColor: COLORS.primary, paddingVertical: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  notaBtnText: { color: COLORS.white, fontWeight: '600', fontSize: 14 },
  acoes: { flexDirection: 'row', paddingHorizontal: 16, marginTop: 4 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
