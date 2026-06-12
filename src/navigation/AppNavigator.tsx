import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/colors';
import AuthNavigator from './AuthNavigator';
import ONGNavigator from './ONGNavigator';
import AdotanteNavigator from './AdotanteNavigator';

export default function AppNavigator() {
  const { usuario, tipo, carregando } = useAuth();

  if (carregando) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!usuario && <AuthNavigator />}
      {usuario && tipo === 'ong' && <ONGNavigator />}
      {usuario && tipo === 'adotante' && <AdotanteNavigator />}
    </NavigationContainer>
  );
}
