import { View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { WebView } from 'react-native-webview';
import React, { useState } from 'react';
import ViewerOverlay from './ViewerOverlay';
import { useNavigation } from '@react-navigation/native';

interface EPUBViewerProps {
  uri: string;
  onSettings?: () => void;
}

export default function EPUBViewer({ uri, onSettings }: EPUBViewerProps) {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const navigation = useNavigation();
  return (
    <TouchableWithoutFeedback onPress={() => setOverlayVisible((v) => !v)}>
      <View style={styles.container}>
        <WebView source={{ uri }} style={styles.webview} javaScriptEnabled={true} domStorageEnabled={true} />
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
  webview: {
    flex: 1,
  },
});
