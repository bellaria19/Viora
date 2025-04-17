import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme, Theme } from '@react-navigation/native';

interface AddFileButtonProps {
  onPress: () => void;
  isDisabled?: boolean;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    addButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButtonDisabled: {
      opacity: 0.5,
    },
    addButtonText: {
      color: theme.dark ? theme.colors.text : '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  });

export default function AddFileButton({ onPress, isDisabled = false }: AddFileButtonProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      style={[styles.addButton, isDisabled && styles.addButtonDisabled]}
    >
      <Text style={styles.addButtonText}>파일 추가하기</Text>
    </TouchableOpacity>
  );
}
