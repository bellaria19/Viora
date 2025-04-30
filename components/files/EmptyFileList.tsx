import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface EmptyFileListProps {
  iconName: string;
  message: string;
  buttonLabel: string;
  onPress: () => void;
  colors: {
    secondaryText: string;
    primary: string;
  };
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function EmptyFileList({
  iconName,
  message,
  buttonLabel,
  onPress,
  colors,
  style,
  textStyle,
}: EmptyFileListProps) {
  return (
    <View style={[styles.emptyContainer, style]}>
      <FontAwesome6 name={iconName} size={40} color={colors.secondaryText} />
      <Text style={[styles.emptyText, { color: colors.secondaryText }, textStyle]}>{message}</Text>
      <TouchableOpacity style={[styles.emptyAddButton, { backgroundColor: colors.primary }]} onPress={onPress}>
        <FontAwesome6 name="plus" size={20} color="#fff" />
        <Text style={styles.emptyAddButtonText}>{buttonLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
