import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { SortOption, sortOptions } from '@/types/sort';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

interface SortMenuProps {
  visible: boolean;
  onClose: () => void;
  currentSortOption: SortOption;
  onSelect: (option: SortOption) => void;
}

export default function SortMenu({ visible, onClose, currentSortOption, onSelect }: SortMenuProps) {
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>정렬</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome6 name="xmark" size={20} color={colors.secondaryText} />
            </TouchableOpacity>
          </View>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.modalItem,
                option.id === currentSortOption && [
                  styles.modalItemActive,
                  { backgroundColor: colors.primary + '20' }, // 20% 투명도 추가
                ],
              ]}
              onPress={() => onSelect(option.id as SortOption)}
            >
              <FontAwesome6
                name={option.icon as any}
                size={16}
                color={option.id === currentSortOption ? colors.primary : colors.secondaryText}
              />
              <Text
                style={[
                  styles.modalItemText,
                  { color: colors.secondaryText },
                  option.id === currentSortOption && [styles.modalItemTextActive, { color: colors.primary }],
                ]}
              >
                {option.label}
              </Text>
              {option.id === currentSortOption && <FontAwesome6 name="check" size={16} color={colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 16,
    width: '80%',
    maxWidth: 400,
    padding: 16,
    gap: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 12,
    borderRadius: 8,
  },
  modalItemActive: {
    backgroundColor: '#e3f2fd',
  },
  modalItemText: {
    flex: 1,
    fontSize: 16,
  },
  modalItemTextActive: {
    fontWeight: '600',
  },
});
