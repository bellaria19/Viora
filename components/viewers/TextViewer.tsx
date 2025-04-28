import { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableWithoutFeedback } from 'react-native';
import * as FileSystem from 'expo-file-system';
import ViewerOverlay from './ViewerOverlay';
import { useNavigation } from '@react-navigation/native';

interface TextViewerProps {
  uri: string;
  onSettings?: () => void;
}

export default function TextViewer({ uri, onSettings }: TextViewerProps) {
  const [content, setContent] = useState<string>('');
  const [overlayVisible, setOverlayVisible] = useState(false);
  const navigation = useNavigation();

  const loadTextContent = useCallback(async () => {
    try {
      const fileContent = await FileSystem.readAsStringAsync(uri);
      setContent(fileContent);
    } catch (error) {
      console.error('Error reading text file:', error);
      setContent('파일을 읽을 수 없습니다.');
    }
  }, [uri]);

  useEffect(() => {
    loadTextContent();
  }, [loadTextContent]);

  return (
    <TouchableWithoutFeedback onPress={() => setOverlayVisible((v) => !v)}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.text}>{content}</Text>
        </ScrollView>
        <ViewerOverlay visible={overlayVisible} onBack={() => navigation.goBack()} onSettings={onSettings} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});
