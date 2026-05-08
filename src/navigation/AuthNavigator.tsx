import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from './types';
import { COLORS } from '../constants/colors';
import WelcomeScreen from '../screens/auth/WelcomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterONGScreen from '../screens/auth/RegisterONGScreen';
import RegisterAdotanteScreen from '../screens/auth/RegisterAdotanteScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerTintColor: COLORS.primary, headerBackTitle: 'Voltar' }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Entrar' }} />
      <Stack.Screen name="RegisterONG" component={RegisterONGScreen} options={{ title: 'Cadastro ONG' }} />
      <Stack.Screen name="RegisterAdotante" component={RegisterAdotanteScreen} options={{ title: 'Criar Conta' }} />
    </Stack.Navigator>
  );
}
