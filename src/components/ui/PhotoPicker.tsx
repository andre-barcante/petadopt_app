import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import { COLORS } from '../../constants/colors';

type Props = {
  value?: string;
  onChange: (uri: string | undefined) => void;
};

export function PhotoPicker({ value, onChange }: Props) {
  const handlePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Permita o acesso à galeria nas configurações do dispositivo.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const resized = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 400 } }],
        { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG, base64: true }
      );
      if (resized.base64) {
        onChange(`data:image/jpeg;base64,${resized.base64}`);
      }
    }
  };

  const handleRemove = () => {
    Alert.alert('Remover foto', 'Deseja remover a foto?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Remover', style: 'destructive', onPress: () => onChange(undefined) },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.container} onPress={handlePick} activeOpacity={0.8}>
        {value ? (
          <Image source={{ uri: value }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.icon}>📷</Text>
            <Text style={styles.placeholderText}>Adicionar foto</Text>
          </View>
        )}
      </TouchableOpacity>
      {value && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionBtn} onPress={handlePick}>
            <Text style={styles.actionText}>Trocar foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]} onPress={handleRemove}>
            <Text style={[styles.actionText, styles.actionTextDanger]}>Remover</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  container: { borderRadius: 12, overflow: 'hidden', borderWidth: 1.5, borderColor: COLORS.border, borderStyle: 'dashed' },
  preview: { width: '100%', aspectRatio: 1, resizeMode: 'cover' },
  placeholder: { alignItems: 'center', justifyContent: 'center', paddingVertical: 32, backgroundColor: COLORS.background },
  icon: { fontSize: 36, marginBottom: 8 },
  placeholderText: { fontSize: 14, color: COLORS.textLight, fontWeight: '500' },
  actions: { flexDirection: 'row', marginTop: 8, gap: 8 },
  actionBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, backgroundColor: COLORS.background, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  actionBtnDanger: { borderColor: COLORS.error + '66' },
  actionText: { fontSize: 13, color: COLORS.textMedium, fontWeight: '600' },
  actionTextDanger: { color: COLORS.error },
});
