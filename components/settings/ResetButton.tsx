import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface ResetButtonProps {
  label: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  color?: string;
}

const ResetButton: React.FC<ResetButtonProps> = ({ label, onPress, style, textStyle, color }) => (
  <TouchableOpacity style={[styles.resetButton, color && { backgroundColor: color }, style]} onPress={onPress}>
    <Text style={[styles.resetButtonText, textStyle]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  resetButton: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ResetButton;
