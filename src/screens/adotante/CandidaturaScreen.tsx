import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AdotanteExplorarStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { especieEmoji } from '../../utils/helpers';

type Props = {
  navigation: NativeStackNavigationProp<AdotanteExplorarStackParamList, 'Candidatura'>;
  route: RouteProp<AdotanteExplorarStackParamList, 'Candidatura'>;
};

export default function CandidaturaScreen({ navigation, route }: Props) {
  const { petId } = route.params;
  const { usuario } = useAuth();
  const { pets, adicionarProposta } = useData();
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const pet = pets.find(p => p.id === petId);

  if (!pet || !usuario) return <View style={styles.notFound}><Text>Pet não encontrado.</Text></View>;

  const handleEnviar = () => {
    if (descricao.trim().length < 20) {
      setErro('Por favor, escreva ao menos 20 caracteres se apresentando e explicando por que quer adotar.');
      return;
    }
    setErro('');
    setLoading(true);
    setTimeout(() => {
      const resultado = adicionarProposta({
        petId: pet.id,
        adotanteId: usuario.id,
        ongId: pet.ongId,
        descricaoAdotante: descricao.trim(),
        status: 'pendente',
      });
      setLoading(false);
      if (resultado.sucesso) {
        Alert.alert(
          '🎉 Candidatura enviada!',
          `Sua candidatura para adotar ${pet.nome} foi enviada. A ONG responsável entrará em contato.`,
          [{ text: 'OK', onPress: () => navigation.popToTop() }]
        );
      } else {
        Alert.alert('Ops!', resultado.erro ?? 'Não foi possível enviar a candidatura.');
      }
    }, 500);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Pet summary */}
        <View style={[styles.petCard, { backgroundColor: pet.especie === 'cao' ? '#FFF3E0' : '#E8F5E9' }]}>
          <Text style={styles.petEmoji}>{especieEmoji(pet.especie)}</Text>
          <View>
            <Text style={styles.petNome}>{pet.nome}</Text>
            <Text style={styles.petRaca}>{pet.raca}</Text>
          </View>
        </View>

        <View style={styles.form}>
          <Text style={styles.formTitulo}>Sua Candidatura</Text>
          <Text style={styles.formSubtitulo}>
            Apresente-se e explique por que você é o lar ideal para {pet.nome}. Esta mensagem será enviada à ONG responsável.
          </Text>

          <Input
            label="Sua mensagem"
            value={descricao}
            onChangeText={setDescricao}
            placeholder={`Conte sobre você, sua rotina, experiência com animais e por que quer adotar ${pet.nome}...`}
            multiline
            numberOfLines={8}
            style={{ height: 160, textAlignVertical: 'top' } as any}
            error={erro}
          />

          <Text style={styles.contador}>{descricao.length} caracteres (mínimo: 20)</Text>

          <Button
            title="Enviar Candidatura"
            onPress={handleEnviar}
            loading={loading}
            disabled={descricao.trim().length < 20}
            style={styles.btn}
          />
          <Button
            title="Cancelar"
            onPress={() => navigation.goBack()}
            variant="outline"
            style={styles.btnCancel}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: 16, paddingBottom: 32 },
  petCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, padding: 16, marginBottom: 16 },
  petEmoji: { fontSize: 44, marginRight: 16 },
  petNome: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  petRaca: { fontSize: 14, color: COLORS.textMedium, marginTop: 2 },
  form: { backgroundColor: COLORS.white, borderRadius: 16, padding: 20, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  formTitulo: { fontSize: 18, fontWeight: '700', color: COLORS.textDark, marginBottom: 6 },
  formSubtitulo: { fontSize: 14, color: COLORS.textMedium, marginBottom: 20, lineHeight: 20 },
  contador: { fontSize: 12, color: COLORS.textLight, textAlign: 'right', marginTop: -8, marginBottom: 16 },
  btn: { marginTop: 4 },
  btnCancel: { marginTop: 10 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
