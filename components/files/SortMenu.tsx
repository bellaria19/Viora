import { View, Text, TouchableOpacity, Modal, Pressable, StyleSheet } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { SortOption, sortOptions } from '@/types/sort';

interface SortMenuProps {
  visible: boolean;
  onClose: () => void;
  currentSortOption: SortOption;
  onSelect: (option: SortOption) => void;
}

export default function SortMenu({ visible, onClose, currentSortOption, onSelect }: SortMenuProps) {
  return (
    <Modal animationType="fade" transparent={true} visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>정렬</Text>
            <TouchableOpacity onPress={onClose}>
              <FontAwesome6 name="xmark" size={20} color="#666" />
            </TouchableOpacity>
          </View>
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.modalItem, option.id === currentSortOption && styles.modalItemActive]}
              onPress={() => onSelect(option.id as SortOption)}
            >
              <FontAwesome6
                name={option.icon as any}
                size={16}
                color={option.id === currentSortOption ? '#007AFF' : '#666'}
              />
              <Text style={[styles.modalItemText, option.id === currentSortOption && styles.modalItemTextActive]}>
                {option.label}
              </Text>
              {option.id === currentSortOption && <FontAwesome6 name="check" size={16} color="#007AFF" />}
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
    backgroundColor: '#fff',
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
    borderBottomColor: '#eee',
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
    color: '#666',
  },
  modalItemTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
