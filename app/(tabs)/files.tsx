import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { router } from 'expo-router';
import { FileInfo, getDirectoryContents } from '@/utils/fileManager';
import { SortOption } from '@/types/sort';
import SortButton from '@/components/files/SortButton';
import SortMenu from '@/components/files/SortMenu';
import { sortFiles } from '@/utils/sorting';
import DuplicateFileModal from '@/components/files/DuplicateModal';
import { useFilePicker } from '@/hooks/useFilePicker';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

import EmptyFileList from '@/components/files/EmptyFileList';
import FloatingButton from '@/components/common/FloatingButton';
import SearchBar from '@/components/files/SearchBar';
import FileItem from '@/components/files/FileItem';

export default function FilesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileInfo[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.DATE_DESC);
  const [showSortMenu, setShowSortMenu] = useState(false);
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
    existingFiles: files,
    onFilesProcessed: (newFiles) => setFiles((prev) => [...prev, ...newFiles]),
  });

  const loadFiles = async () => {
    const fileList = await getDirectoryContents();
    setFiles(fileList);
  };

  const filterAndSortFiles = useCallback(() => {
    let filtered = files.filter((file) => file.name.normalize('NFC').toLowerCase().includes(searchQuery.toLowerCase()));
    filtered = sortFiles(filtered, sortOption);
    setFilteredFiles(filtered);
  }, [files, searchQuery, sortOption]);

  useEffect(() => {
    loadFiles();
  }, []);

  useEffect(() => {
    filterAndSortFiles();
  }, [filterAndSortFiles]);

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
    await loadFiles();
    setRefreshing(false);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {(files.length > 0 || searchQuery) && (
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} placeholder="파일 검색..." colors={colors} />
        </View>
      )}

      {files.length > 0 && (
        <View style={[styles.sortContainer, { borderBottomColor: colors.border }]}>
          <SortButton currentSortOption={sortOption} onPress={() => setShowSortMenu(true)} />
        </View>
      )}

      <SortMenu
        visible={showSortMenu}
        onClose={() => setShowSortMenu(false)}
        currentSortOption={sortOption}
        onSelect={(option) => {
          setSortOption(option);
          setShowSortMenu(false);
        }}
      />

      <FlatList
        data={filteredFiles}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        renderItem={({ item }) => <FileItem file={item} onPress={handleFilePress} colors={colors} showSize={true} />}
        ListEmptyComponent={() =>
          searchQuery ? (
            <EmptyFileList
              iconName="magnifying-glass-minus"
              message="검색 결과가 없습니다."
              buttonLabel="파일 추가하기"
              onPress={handleFilePick}
              colors={colors}
            />
          ) : (
            <EmptyFileList
              iconName="folder-open"
              message="파일을 추가해주세요."
              buttonLabel="파일 추가하기"
              onPress={handleFilePick}
              colors={colors}
            />
          )
        }
      />

      {files.length > 0 && <FloatingButton onPress={handleFilePick} backgroundColor={colors.primary} />}

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
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  sortContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
});
