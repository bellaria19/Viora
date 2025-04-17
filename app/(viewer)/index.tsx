import { useLocalSearchParams, Stack, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Share } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import FileTypeHandler from '@/components/file/FileTypeHandler';
import * as FileSystem from 'expo-file-system';

export default function FileViewerScreen() {
  const { id } = useLocalSearchParams();
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [fileType, setFileType] = useState<string>('application/octet-stream');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const uri = `${FileSystem.documentDirectory}${id}`;
      setFileUri(uri);

      // 파일 타입 추정
      const extension = String(id).split('.').pop()?.toLowerCase() || '';
      const mimeType = getMimeType(extension);
      setFileType(mimeType);

      setLoading(false);
    } else {
      Alert.alert('오류', '파일을 찾을 수 없습니다.');
      router.back();
    }
  }, [id]);

  const getMimeType = (extension: string): string => {
    const mimeTypes: Record<string, string> = {
      txt: 'text/plain',
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      pdf: 'application/pdf',
      epub: 'application/epub+zip',
      zip: 'application/zip',
    };

    return mimeTypes[extension] || 'application/octet-stream';
  };

  const handleShare = async () => {
    if (fileUri) {
      try {
        await Share.share({
          url: fileUri,
          title: `공유: ${id}`,
        });
      } catch (error) {
        console.error('파일 공유 오류:', error);
        Alert.alert('오류', '파일을 공유하는 중 오류가 발생했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: String(id),
          headerRight: () => (
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <FontAwesome name="share-alt" size={22} color="#007AFF" />
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {fileUri ? (
          <FileTypeHandler fileUri={fileUri} fileType={fileType} />
        ) : (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>파일을 로드할 수 없습니다.</Text>
          </View>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
  },
  shareButton: {
    padding: 10,
  },
});
