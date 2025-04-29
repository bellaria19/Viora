import { View, Text, Modal, Pressable, TouchableOpacity, StyleSheet } from 'react-native';
import { DuplicateFile } from '@/utils/filePickerManager';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

interface DuplicateFileModalProps {
  visible: boolean;
  currentFile: DuplicateFile | null;
  currentIndex: number;
  totalCount: number;
  onSkip: () => void;
  onOverwrite: () => void;
}

export default function DuplicateFileModal({
  visible,
  currentFile,
  currentIndex,
  totalCount,
  onSkip,
  onOverwrite,
}: DuplicateFileModalProps) {
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  return (
    <Modal animationType="fade" transparent={true} visible={visible}>
      <Pressable style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>중복된 파일</Text>
            <Text style={[styles.modalSubtitle, { color: colors.secondaryText }]}>
              {currentIndex + 1} / {totalCount}
            </Text>
          </View>
          <Text style={[styles.modalText, { color: colors.text }]}>
            '{currentFile?.fileName}' 파일이 이미 존재합니다.{'\n'}어떻게 처리하시겠습니까?
          </Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSkip, { backgroundColor: colors.buttonBackground }]}
              onPress={onSkip}
            >
              <Text style={[styles.modalButtonText, { color: colors.secondaryText }]}>건너뛰기</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonOverwrite, { backgroundColor: colors.primary }]}
              onPress={onOverwrite}
            >
              <Text style={[styles.modalButtonText, styles.modalButtonTextOverwrite]}>덮어쓰기</Text>
            </TouchableOpacity>
          </View>
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
    padding: 24,
    borderRadius: 16,
    width: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalSubtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'left',
    marginVertical: 16,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSkip: {
    backgroundColor: '#f5f5f5',
  },
  modalButtonOverwrite: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextOverwrite: {
    color: '#fff',
  },
});
