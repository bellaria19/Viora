import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

interface EPUBViewerProps {
  fileUri: string;
}

export default function EPUBViewer({ fileUri }: EPUBViewerProps) {
  return <WebView source={{ uri: fileUri }} style={styles.webview} />;
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
