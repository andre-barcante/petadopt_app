import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { COLORS } from '../../constants/colors';
import { Button } from '../../components/ui/Button';

type Props = { navigation: NativeStackNavigationProp<AuthStackParamList, 'Welcome'> };

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.emoji}>🐾</Text>
          <Text style={styles.title}>PetAdopt</Text>
          <Text style={styles.subtitle}>Conectando pets a lares amorosos</Text>
        </View>

        <View style={styles.actions}>
          <Text style={styles.label}>Como você quer entrar?</Text>

          <Button
            title="🏠  Sou uma ONG"
            onPress={() => navigation.navigate('Login', { tipo: 'ong' })}
            style={styles.btn}
          />

          <Button
            title="❤️  Quero Adotar"
            onPress={() => navigation.navigate('Login', { tipo: 'adotante' })}
            variant="secondary"
            style={styles.btn}
          />

          <View style={styles.registerRow}>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterONG')}>
              <Text style={styles.link}>Cadastrar ONG</Text>
            </TouchableOpacity>
            <Text style={styles.divider}>  |  </Text>
            <TouchableOpacity onPress={() => navigation.navigate('RegisterAdotante')}>
              <Text style={styles.link}>Criar conta de adotante</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.primary },
  container: { flex: 1, backgroundColor: COLORS.primary },
  hero: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 72, marginBottom: 12 },
  title: { fontSize: 42, fontWeight: '800', color: COLORS.white, letterSpacing: 1 },
  subtitle: { fontSize: 16, color: COLORS.white, opacity: 0.85, marginTop: 8 },
  actions: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 40,
  },
  label: { fontSize: 16, fontWeight: '600', color: COLORS.textDark, marginBottom: 20, textAlign: 'center' },
  btn: { marginBottom: 12 },
  registerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' },
  link: { color: COLORS.primary, fontSize: 14, fontWeight: '600' },
  divider: { color: COLORS.textLight, fontSize: 14 },
});
