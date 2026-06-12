import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DateInput } from '../../components/ui/DateInput';
import { useAuth } from '../../context/AuthContext';
import { Sexo } from '../../types';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'RegisterAdotante'> };

type FormAdotante = {
  nome: string; sexo: Sexo; dataNascimento: string; email: string;
  contato: string; endereco: string; senha: string; confirmarSenha: string;
};

const SEXOS: { valor: Sexo; label: string }[] = [
  { valor: 'M', label: 'Masculino' },
  { valor: 'F', label: 'Feminino' },
  { valor: 'outro', label: 'Outro' },
];

export default function RegisterAdotanteScreen({ navigation }: Props) {
  const { cadastrarAdotante } = useAuth();
  const [form, setForm] = useState<FormAdotante>({
    nome: '', sexo: 'M', dataNascimento: '', email: '',
    contato: '', endereco: '', senha: '', confirmarSenha: '',
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (campo: string) => (valor: string) =>
    setForm((prev: FormAdotante) => ({ ...prev, [campo]: valor }));

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = 'Nome obrigatório.';
    if (!form.dataNascimento.match(/^\d{4}-\d{2}-\d{2}$/)) e.dataNascimento = 'Preencha a data completa.';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'E-mail inválido.';
    if (!form.contato.trim()) e.contato = 'Contato obrigatório.';
    if (!form.endereco.trim()) e.endereco = 'Endereço obrigatório.';
    if (form.senha.length < 6) e.senha = 'Senha deve ter ao menos 6 caracteres.';
    if (form.senha !== form.confirmarSenha) e.confirmarSenha = 'Senhas não coincidem.';
    setErros(e);
    return Object.keys(e).length === 0;
  };

  const handleCadastrar = async () => {
    if (!validar()) return;
    setLoading(true);
    try {
      const { confirmarSenha, ...dados } = form;
      const resultado = await cadastrarAdotante(dados);
      if (!resultado.sucesso) Alert.alert('Erro', resultado.erro ?? 'Erro desconhecido.');
    } catch (e: any) {
      Alert.alert('Erro de conexão', e?.message ?? 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.titulo}>Criar Conta</Text>
        <Text style={styles.subtitulo}>Preencha seus dados para adotar</Text>

        <View style={styles.form}>
          <Input label="Nome completo" value={form.nome} onChangeText={set('nome')} placeholder="Seu nome" error={erros.nome} />

          <Text style={styles.fieldLabel}>Sexo</Text>
          <View style={styles.sexoRow}>
            {SEXOS.map(s => (
              <TouchableOpacity
                key={s.valor}
                style={[styles.sexoBtn, form.sexo === s.valor && styles.sexoBtnAtivo]}
                onPress={() => setForm((prev: FormAdotante) => ({ ...prev, sexo: s.valor }))}
              >
                <Text style={[styles.sexoBtnText, form.sexo === s.valor && styles.sexoBtnTextAtivo]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <DateInput label="Data de Nascimento" value={form.dataNascimento} onChangeDate={set('dataNascimento')} error={erros.dataNascimento} />
          <Input label="E-mail" value={form.email} onChangeText={set('email')} placeholder="seu@email.com" keyboardType="email-address" autoCapitalize="none" error={erros.email} />
          <Input label="Contato (WhatsApp/Telefone)" value={form.contato} onChangeText={set('contato')} placeholder="(00) 00000-0000" keyboardType="phone-pad" error={erros.contato} />
          <Input label="Endereço" value={form.endereco} onChangeText={set('endereco')} placeholder="Rua, número - Cidade, UF" error={erros.endereco} />
          <Input label="Senha" value={form.senha} onChangeText={set('senha')} placeholder="Mínimo 6 caracteres" secureTextEntry error={erros.senha} />
          <Input label="Confirmar Senha" value={form.confirmarSenha} onChangeText={set('confirmarSenha')} placeholder="Repita a senha" secureTextEntry error={erros.confirmarSenha} />

          <Button title="Criar Conta" onPress={handleCadastrar} loading={loading} style={styles.btn} />
          <Button title="Já tenho conta" onPress={() => navigation.goBack()} variant="outline" style={styles.btnOutline} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: 24 },
  titulo: { fontSize: 24, fontWeight: '700', color: COLORS.textDark, marginBottom: 4 },
  subtitulo: { fontSize: 14, color: COLORS.textMedium, marginBottom: 24 },
  form: { backgroundColor: COLORS.white, borderRadius: 16, padding: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textMedium, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  sexoRow: { flexDirection: 'row', marginBottom: 14, gap: 8 },
  sexoBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center' },
  sexoBtnAtivo: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  sexoBtnText: { color: COLORS.textMedium, fontWeight: '500', fontSize: 14 },
  sexoBtnTextAtivo: { color: COLORS.primaryDark, fontWeight: '700' },
  btn: { marginTop: 8 },
  btnOutline: { marginTop: 10 },
});
