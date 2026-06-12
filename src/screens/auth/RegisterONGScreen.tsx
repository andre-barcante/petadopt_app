import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'RegisterONG'> };

export default function RegisterONGScreen({ navigation }: Props) {
  const { cadastrarONG } = useAuth();
  type FormONG = { nome: string; cnpj: string; email: string; endereco: string; contato: string; senha: string; confirmarSenha: string };
  const [form, setForm] = useState<FormONG>({
    nome: '', cnpj: '', email: '', endereco: '', contato: '', senha: '', confirmarSenha: '',
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (campo: string) => (valor: string) => setForm((prev: FormONG) => ({ ...prev, [campo]: valor }));

  const validar = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = 'Nome obrigatório.';
    if (!form.cnpj.trim()) e.cnpj = 'CNPJ obrigatório.';
    if (!form.email.trim() || !form.email.includes('@')) e.email = 'E-mail inválido.';
    if (!form.endereco.trim()) e.endereco = 'Endereço obrigatório.';
    if (!form.contato.trim()) e.contato = 'Contato obrigatório.';
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
      const resultado = await cadastrarONG(dados);
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
        <Text style={styles.titulo}>Cadastro de ONG</Text>
        <Text style={styles.subtitulo}>Preencha os dados da sua organização</Text>

        <View style={styles.form}>
          <Input label="Nome da ONG" value={form.nome} onChangeText={set('nome')} placeholder="Ex: Patinhas Felizes" error={erros.nome} />
          <Input label="CNPJ" value={form.cnpj} onChangeText={set('cnpj')} placeholder="00.000.000/0001-00" error={erros.cnpj} keyboardType="numeric" />
          <Input label="E-mail" value={form.email} onChangeText={set('email')} placeholder="contato@ong.org" keyboardType="email-address" autoCapitalize="none" error={erros.email} />
          <Input label="Endereço" value={form.endereco} onChangeText={set('endereco')} placeholder="Rua, número - Cidade, UF" error={erros.endereco} />
          <Input label="Contato (WhatsApp/Telefone)" value={form.contato} onChangeText={set('contato')} placeholder="(00) 00000-0000" keyboardType="phone-pad" error={erros.contato} />
          <Input label="Senha" value={form.senha} onChangeText={set('senha')} placeholder="Mínimo 6 caracteres" secureTextEntry error={erros.senha} />
          <Input label="Confirmar Senha" value={form.confirmarSenha} onChangeText={set('confirmarSenha')} placeholder="Repita a senha" secureTextEntry error={erros.confirmarSenha} />

          <Button title="Cadastrar ONG" onPress={handleCadastrar} loading={loading} style={styles.btn} />
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
  btn: { marginTop: 8 },
  btnOutline: { marginTop: 10 },
});
