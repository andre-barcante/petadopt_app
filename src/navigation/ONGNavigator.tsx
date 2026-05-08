import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { ONGPetsStackParamList, ONGPropostasStackParamList } from './types';

import MeusAnimaisScreen from '../screens/ong/MeusAnimaisScreen';
import AdicionarEditarPetScreen from '../screens/ong/AdicionarEditarPetScreen';
import PetDetailONGScreen from '../screens/ong/PetDetailONGScreen';
import PropostasScreen from '../screens/ong/PropostasScreen';
import PropostaDetailScreen from '../screens/ong/PropostaDetailScreen';
import PerfilScreen from '../screens/shared/PerfilScreen';

const PetsStack = createNativeStackNavigator<ONGPetsStackParamList>();
const PropostasStack = createNativeStackNavigator<ONGPropostasStackParamList>();
const Tab = createBottomTabNavigator();

function PetsNavigator() {
  return (
    <PetsStack.Navigator screenOptions={{ headerTintColor: COLORS.primary }}>
      <PetsStack.Screen name="MeusAnimais" component={MeusAnimaisScreen} options={{ title: 'Meus Pets' }} />
      <PetsStack.Screen name="AdicionarEditarPet" component={AdicionarEditarPetScreen} options={({ route }) => ({ title: route.params?.petId ? 'Editar Pet' : 'Novo Pet' })} />
      <PetsStack.Screen name="PetDetailONG" component={PetDetailONGScreen} options={{ title: 'Detalhes do Pet' }} />
    </PetsStack.Navigator>
  );
}

function PropostasNavigator() {
  return (
    <PropostasStack.Navigator screenOptions={{ headerTintColor: COLORS.primary }}>
      <PropostasStack.Screen name="Propostas" component={PropostasScreen} options={{ title: 'Propostas' }} />
      <PropostasStack.Screen name="PropostaDetail" component={PropostaDetailScreen} options={{ title: 'Detalhe da Proposta' }} />
    </PropostasStack.Navigator>
  );
}

export default function ONGNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textLight,
        tabBarStyle: { borderTopColor: COLORS.border },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Pets: 'paw',
            Propostas: 'document-text',
            Perfil: 'person',
          };
          return <Ionicons name={icons[route.name] ?? 'ellipse'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Pets" component={PetsNavigator} options={{ title: 'Meus Pets' }} />
      <Tab.Screen name="Propostas" component={PropostasNavigator} />
      <Tab.Screen name="Perfil" component={PerfilScreen} options={{ headerShown: true, title: 'Meu Perfil', headerTintColor: COLORS.primary }} />
    </Tab.Navigator>
  );
}
