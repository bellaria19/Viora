import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface SectionHeaderProps {
  title: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children?: React.ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, style, textStyle, children }) => (
  <View style={[styles.sectionHeader, style]}>
    <Text style={[styles.sectionHeaderText, textStyle]}>{title}</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  sectionHeader: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default SectionHeader;
