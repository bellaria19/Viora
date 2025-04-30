import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';

interface FloatingButtonProps {
  onPress: () => void;
  iconName?: string;
  backgroundColor: string;
  style?: ViewStyle;
}

export default function FloatingButton({ onPress, iconName = 'plus', backgroundColor, style }: FloatingButtonProps) {
  return (
    <TouchableOpacity style={[styles.floatingButton, { backgroundColor }, style]} onPress={onPress} activeOpacity={0.8}>
      <FontAwesome6 name={iconName} size={24} color="white" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
