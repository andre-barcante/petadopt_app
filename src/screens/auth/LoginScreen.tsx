import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AuthStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../context/AuthContext';

type Props = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Login'>;
  route: RouteProp<AuthStackParamList, 'Login'>;
};

export default function LoginScreen({ navigation, route }: Props) {
  const { tipo } = route.params;
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const isONG = tipo === 'ong';
  const titulo = isONG ? 'Acesso para ONGs' : 'Acesso para Adotantes';
  const registroScreen = isONG ? 'RegisterONG' : 'RegisterAdotante';

  const handleLogin = () => {
    if (!email.trim() || !senha.trim()) {
      Alert.alert('Atenção', 'Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const ok = login(email.trim(), senha, tipo);
      setLoading(false);
      if (!ok) Alert.alert('Erro', 'E-mail ou senha incorretos.');
    }, 400);
  };

  const dica = isONG
    ? 'Teste: contato@patinhasfelizes.org / 123456'
    : 'Teste: ana@email.com / 123456';

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.emoji}>{isONG ? '🏠' : '❤️'}</Text>
          <Text style={styles.titulo}>{titulo}</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="••••••"
            secureTextEntry
          />

          <Text style={styles.dica}>{dica}</Text>

          <Button title="Entrar" onPress={handleLogin} loading={loading} style={styles.btn} />

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate(registroScreen as any)}>
              <Text style={styles.link}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, padding: 24 },
  header: { alignItems: 'center', paddingVertical: 32 },
  emoji: { fontSize: 48, marginBottom: 8 },
  titulo: { fontSize: 22, fontWeight: '700', color: COLORS.textDark },
  form: { backgroundColor: COLORS.white, borderRadius: 16, padding: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
  dica: { fontSize: 12, color: COLORS.textLight, marginBottom: 16, textAlign: 'center', fontStyle: 'italic' },
  btn: { marginTop: 4 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  registerText: { color: COLORS.textMedium, fontSize: 14 },
  link: { color: COLORS.primary, fontWeight: '700', fontSize: 14 },
});
