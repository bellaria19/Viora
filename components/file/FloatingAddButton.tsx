import { TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface FloatingAddButtonProps {
  onPress: () => void;
  isDisabled?: boolean;
}

export default function FloatingAddButton({ onPress, isDisabled = false }: FloatingAddButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isDisabled}
    >
      <FontAwesome name="plus" size={24} color={isDisabled ? '#FFFFFF80' : '#FFFFFF'} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    backgroundColor: '#007AFF80',
  },
});
