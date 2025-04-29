import { View, Text, FlatList, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { FileInfo, getRecentFiles } from '@/utils/fileManager';
import { formatDate, getFileIcon } from '@/utils/formatters';
import { FontAwesome6 } from '@expo/vector-icons';
import DuplicateFileModal from '@/components/files/DuplicateFileModal';
import { useFilePicker } from '@/hooks/useFilePicker';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

export default function RecentScreen() {
  const [recentFiles, setRecentFiles] = useState<FileInfo[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  const {
    showDuplicateModal,
    currentDuplicateFile,
    currentDuplicateIndex,
    duplicateFiles,
    handleFilePick,
    handleDuplicateSkip,
    handleDuplicateOverwrite,
  } = useFilePicker({
    existingFiles: recentFiles,
    onFilesProcessed: () => router.push('/files'),
  });

  useEffect(() => {
    loadRecentFiles();
  }, []);

  const loadRecentFiles = async () => {
    const files = await getRecentFiles();
    setRecentFiles(files);
  };

  const handleFilePress = useCallback((file: FileInfo) => {
    router.push({
      pathname: '/viewer/[id]',
      params: {
        id: file.id,
        type: file.type,
        uri: file.uri,
        title: file.name,
      },
    });
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecentFiles();
    setRefreshing(false);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={recentFiles}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.fileItem, { borderBottomColor: colors.border }]}
            onPress={() => handleFilePress(item)}
          >
            <FontAwesome6
              name={getFileIcon(item.type)}
              size={24}
              color={colors.secondaryText}
              style={styles.fileIcon}
            />
            <View style={styles.fileInfo}>
              <Text style={[styles.fileName, { color: colors.text }]}>{item.name}</Text>
              <Text style={[styles.fileDetail, { color: colors.secondaryText }]}>{formatDate(item.modifiedTime)}</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <FontAwesome6 name="clock-rotate-left" size={40} color={colors.secondaryText} />
            <Text style={[styles.emptyText, { color: colors.secondaryText }]}>최근에 본 파일이 없습니다.</Text>
            <TouchableOpacity
              style={[styles.emptyAddButton, { backgroundColor: colors.primary }]}
              onPress={handleFilePick}
            >
              <FontAwesome6 name="plus" size={20} color="#fff" />
              <Text style={styles.emptyAddButtonText}>파일 추가하기</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <DuplicateFileModal
        visible={showDuplicateModal}
        currentFile={currentDuplicateFile}
        currentIndex={currentDuplicateIndex}
        totalCount={duplicateFiles.length}
        onSkip={handleDuplicateSkip}
        onOverwrite={handleDuplicateOverwrite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  fileIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    marginBottom: 4,
  },
  fileDetail: {
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
    fontSize: 16,
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});
