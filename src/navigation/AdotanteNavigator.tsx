import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { AdotanteExplorarStackParamList, AdotanteCandidaturasStackParamList } from './types';

import ExplorarScreen from '../screens/adotante/ExplorarScreen';
import PetDetailScreen from '../screens/adotante/PetDetailScreen';
import CandidaturaScreen from '../screens/adotante/CandidaturaScreen';
import MinhasCandidaturasScreen from '../screens/adotante/MinhasCandidaturasScreen';
import PerfilScreen from '../screens/shared/PerfilScreen';

const ExplorarStack = createNativeStackNavigator<AdotanteExplorarStackParamList>();
const CandidaturasStack = createNativeStackNavigator<AdotanteCandidaturasStackParamList>();
const Tab = createBottomTabNavigator();

function ExplorarNavigator() {
  return (
    <ExplorarStack.Navigator screenOptions={{ headerTintColor: COLORS.primary }}>
      <ExplorarStack.Screen name="Explorar" component={ExplorarScreen} options={{ title: 'Explorar Pets' }} />
      <ExplorarStack.Screen name="PetDetail" component={PetDetailScreen} options={{ title: 'Detalhes' }} />
      <ExplorarStack.Screen name="Candidatura" component={CandidaturaScreen} options={{ title: 'Minha Candidatura' }} />
    </ExplorarStack.Navigator>
  );
}

function CandidaturasNavigator() {
  return (
    <CandidaturasStack.Navigator screenOptions={{ headerTintColor: COLORS.primary }}>
      <CandidaturasStack.Screen name="MinhasCandidaturas" component={MinhasCandidaturasScreen} options={{ title: 'Minhas Candidaturas' }} />
    </CandidaturasStack.Navigator>
  );
}

export default function AdotanteNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: { borderTopColor: COLORS.border },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Explorar: 'search',
            Candidaturas: 'heart',
            Perfil: 'person',
          };
          return <Ionicons name={icons[route.name] ?? 'ellipse'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Explorar" component={ExplorarNavigator} />
      <Tab.Screen name="Candidaturas" component={CandidaturasNavigator} options={{ title: 'Candidaturas' }} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: true, title: 'Meu Perfil', headerTintColor: COLORS.primary }} />
    </Tab.Navigator>
  );
}
