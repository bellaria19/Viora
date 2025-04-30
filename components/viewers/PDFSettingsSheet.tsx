import { View, Text, StyleSheet, Button, TouchableOpacity, Modal } from 'react-native';

interface PDFSettingsSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function PDFSettingsSheet({ visible, onClose }: PDFSettingsSheetProps) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>PDF 설정</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>임시 설정</Text>
            <View style={styles.settingItem}>
              <Text>페이지 보기 모드</Text>
              <Button title="스크롤" onPress={() => console.log('페이지 보기 모드 변경')} />
            </View>
            <View style={styles.settingItem}>
              <Text>페이지 간격</Text>
              <Button title="0" onPress={() => console.log('페이지 간격 변경')} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 32,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  content: {
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
