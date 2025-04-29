import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { SortOption, sortOptions } from '@/types/sort';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

interface SortButtonProps {
  currentSortOption: SortOption;
  onPress: () => void;
}

export default function SortButton({ currentSortOption, onPress }: SortButtonProps) {
  const option = sortOptions.find((opt) => opt.id === currentSortOption);
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  return (
    <TouchableOpacity style={[styles.sortButton, { backgroundColor: colors.buttonBackground }]} onPress={onPress}>
      <View style={styles.sortButtonContent}>
        <FontAwesome6 name="sort" size={16} color={colors.secondaryText} />
        <Text style={[styles.sortButtonText, { color: colors.text }]}>{option?.label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 8,
  },
  sortButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sortButtonText: {
    fontSize: 14,
  },
});
