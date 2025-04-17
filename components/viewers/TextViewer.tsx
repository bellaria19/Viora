import { View, Text, StyleSheet } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';

interface TextViewerProps {
  fileUri: string;
}

export default function TextViewer({ fileUri }: TextViewerProps) {
  const [content, setContent] = useState<string>('로딩 중...');

  useEffect(() => {
    const loadTextFile = async () => {
      try {
        const fileContent = await FileSystem.readAsStringAsync(fileUri);
        setContent(fileContent);
      } catch (error) {
        console.error('텍스트 파일 읽기 오류:', error);
        setContent('파일을 읽을 수 없습니다.');
      }
    };

    loadTextFile();
  }, [fileUri]);

  return (
    <View style={styles.textContainer}>
      <Text style={styles.textContent}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    padding: 16,
  },
  textContent: {
    fontSize: 16,
    lineHeight: 24,
  },
});
