import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme, Theme } from '@react-navigation/native';
import { SortOption, sortOptions } from '@/types/sort';

interface SortToolbarProps {
  onOpenSortModal: () => void;
  sortOption: SortOption;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: theme.colors.card,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    toolbarButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      marginHorizontal: 4,
    },
    sortLabel: {
      marginLeft: 8,
      fontSize: 14,
      color: theme.colors.primary,
    },
  });

export default function SortToolbar({ onOpenSortModal, sortOption }: SortToolbarProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  // 현재 선택된 정렬 옵션의 라벨 찾기
  const currentSortLabel = sortOptions.find((option) => option.id === sortOption)?.label || '정렬';

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toolbarButton} onPress={onOpenSortModal}>
        <FontAwesome name="sort" size={20} color={theme.colors.primary} />
        <Text style={styles.sortLabel}>{currentSortLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}
