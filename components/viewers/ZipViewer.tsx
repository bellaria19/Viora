import { View, Text, Image, StyleSheet, Dimensions, FlatList, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system';

interface ZipViewerProps {
  fileUri: string;
}

export default function ZipViewer({ fileUri }: ZipViewerProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const fileContent = await FileSystem.readAsStringAsync(fileUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const tempDir = `${FileSystem.cacheDirectory}temp_${Date.now()}/`;
        await FileSystem.makeDirectoryAsync(tempDir, { intermediates: true });

        const tempZipPath = `${tempDir}temp.zip`;
        await FileSystem.writeAsStringAsync(tempZipPath, fileContent, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const files = await FileSystem.readDirectoryAsync(tempDir);

        const imageFiles = files.filter((file) => {
          const ext = file.toLowerCase();
          return ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png') || ext.endsWith('.gif');
        });

        const imagePaths = imageFiles.map((file) => `${tempDir}${file}`);
        setImages(imagePaths);

        await FileSystem.deleteAsync(tempDir, { idempotent: true });
      } catch (err) {
        console.error('이미지 로딩 오류:', err);
        setError('이미지를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadImages();

    return () => {
      const cleanup = async () => {
        try {
          const tempDir = `${FileSystem.cacheDirectory}temp_${Date.now()}/`;
          await FileSystem.deleteAsync(tempDir, { idempotent: true });
        } catch (error) {
          console.error('임시 파일 정리 오류:', error);
        }
      };
      cleanup();
    };
  }, [fileUri]);

  const renderImage = ({ item }: { item: string }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} resizeMode="contain" />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>이미지를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (images.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>이미지 파일이 없습니다.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={images}
      renderItem={renderImage}
      keyExtractor={(item) => item}
      pagingEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666666',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});
