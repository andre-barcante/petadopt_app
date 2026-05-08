import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import ONGNavigator from './ONGNavigator';
import AdotanteNavigator from './AdotanteNavigator';

export default function AppNavigator() {
  const { usuario, tipo } = useAuth();

  return (
    <NavigationContainer>
      {!usuario && <AuthNavigator />}
      {usuario && tipo === 'ong' && <ONGNavigator />}
      {usuario && tipo === 'adotante' && <AdotanteNavigator />}
    </NavigationContainer>
  );
}
