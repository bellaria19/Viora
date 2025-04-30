import { View, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { router } from 'expo-router';
import { FileInfo, getRecentFiles } from '@/utils/fileManager';
import DuplicateFileModal from '@/components/files/DuplicateModal';
import { useFilePicker } from '@/hooks/useFilePicker';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';
import FileItem from '@/components/files/FileItem';
import EmptyFileList from '@/components/files/EmptyFileList';

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
        renderItem={({ item }) => <FileItem file={item} onPress={handleFilePress} colors={colors} showSize={false} />}
        ListEmptyComponent={() => (
          <EmptyFileList
            iconName="clock-rotate-left"
            message="최근에 본 파일이 없습니다."
            buttonLabel="파일 추가하기"
            onPress={handleFilePick}
            colors={colors}
          />
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
});
