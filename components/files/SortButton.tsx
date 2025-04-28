import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { SortOption, sortOptions } from '@/types/sort';

interface SortButtonProps {
  currentSortOption: SortOption;
  onPress: () => void;
}

export default function SortButton({ currentSortOption, onPress }: SortButtonProps) {
  const option = sortOptions.find((opt) => opt.id === currentSortOption);

  return (
    <TouchableOpacity style={styles.sortButton} onPress={onPress}>
      <View style={styles.sortButtonContent}>
        <FontAwesome6 name="sort" size={16} color="#666" />
        <Text style={styles.sortButtonText}>{option?.label}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
    color: '#333',
  },
});
