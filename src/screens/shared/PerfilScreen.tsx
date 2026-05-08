import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { COLORS } from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import { ONG, Adotante } from '../../types';
import { formatDate, formatarSexo } from '../../utils/helpers';

function InfoRow({ label, valor }: { label: string; valor: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValor}>{valor}</Text>
    </View>
  );
}

export default function PerfilScreen() {
  const { usuario, tipo, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sair', 'Deseja sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  if (!usuario) return null;

  const isONG = tipo === 'ong';
  const ong = isONG ? (usuario as ONG) : null;
  const adotante = !isONG ? (usuario as Adotante) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>{isONG ? '🏠' : '👤'}</Text>
          <Text style={styles.nome}>{usuario.nome}</Text>
          <View style={[styles.tipoBadge, { backgroundColor: isONG ? COLORS.primaryLight : COLORS.secondaryLight }]}>
            <Text style={[styles.tipoText, { color: isONG ? COLORS.primaryDark : COLORS.secondary }]}>
              {isONG ? 'ONG' : 'Adotante'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Dados da Conta</Text>
          <InfoRow label="E-mail" valor={usuario.email} />
          <InfoRow label="Contato" valor={usuario.contato} />
          <InfoRow label="Endereço" valor={usuario.endereco} />

          {ong && <InfoRow label="CNPJ" valor={ong.cnpj} />}

          {adotante && (
            <>
              <InfoRow label="Sexo" valor={formatarSexo(adotante.sexo)} />
              <InfoRow label="Data de Nascimento" valor={formatDate(adotante.dataNascimento)} />
            </>
          )}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Sair da conta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  container: { flexGrow: 1, paddingBottom: 40 },
  avatar: { alignItems: 'center', paddingVertical: 36, backgroundColor: COLORS.white },
  avatarEmoji: { fontSize: 64, marginBottom: 12 },
  nome: { fontSize: 22, fontWeight: '800', color: COLORS.textDark, marginBottom: 8 },
  tipoBadge: { paddingHorizontal: 16, paddingVertical: 4, borderRadius: 20 },
  tipoText: { fontSize: 13, fontWeight: '700' },
  section: { backgroundColor: COLORS.white, margin: 16, borderRadius: 14, padding: 20, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: COLORS.textLight, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexWrap: 'wrap', gap: 4 },
  infoLabel: { fontSize: 14, color: COLORS.textMedium },
  infoValor: { fontSize: 14, fontWeight: '600', color: COLORS.textDark, flexShrink: 1, textAlign: 'right' },
  logoutBtn: { marginHorizontal: 16, backgroundColor: COLORS.errorLight, padding: 16, borderRadius: 12, alignItems: 'center' },
  logoutText: { color: COLORS.error, fontWeight: '700', fontSize: 16 },
});
