import { View, Text, Switch, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { resetAllFiles } from '@/utils/fileManager';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [autoOpen, setAutoOpen] = useState(true);

  const handleResetFiles = () => {
    Alert.alert('파일 초기화', '모든 파일이 삭제됩니다. 계속하시겠습니까?', [
      {
        text: '취소',
        style: 'cancel',
      },
      {
        text: '초기화',
        style: 'destructive',
        onPress: async () => {
          try {
            await resetAllFiles();
            Alert.alert('완료', '모든 파일이 초기화되었습니다.');
          } catch (error) {
            Alert.alert('오류', '파일 초기화 중 오류가 발생했습니다.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>다크 모드</Text>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>파일 자동 열기</Text>
        <Switch value={autoOpen} onValueChange={setAutoOpen} />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingText}>버전</Text>
        <Text>1.0.0</Text>
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={handleResetFiles}>
        <Text style={styles.resetButtonText}>모든 파일 초기화</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  settingText: {
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#ff3b30',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
