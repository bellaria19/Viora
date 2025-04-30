import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';

interface SettingItemProps {
  title: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  children?: React.ReactNode;
}

const SettingItem: React.FC<SettingItemProps> = ({
  title,
  rightElement,
  onPress,
  disabled = false,
  style,
  titleStyle,
  children,
}) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={[styles.settingItem, style, disabled && { opacity: 0.5 }]} onPress={onPress} disabled={disabled}>
      <Text style={[styles.settingText, titleStyle]}>{title}</Text>
      <View style={styles.right}>{rightElement}</View>
      {children}
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  settingText: {
    fontSize: 16,
    flex: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
});

export default SettingItem;
