import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FileInfo, getDirectoryContents } from '@/utils/fileManager';
import { formatFileSize, formatDate, getFileIcon } from '@/utils/formatters';
import { SortOption } from '@/types/sort';
import SortButton from '@/components/files/SortButton';
import SortMenu from '@/components/files/SortMenu';
import { sortFiles } from '@/utils/sorting';
import DuplicateFileModal from '@/components/files/DuplicateFileModal';
import { useFilePicker } from '@/hooks/useFilePicker';

export default function FilesScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileInfo[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.DATE_DESC);
  const [showSortMenu, setShowSortMenu] = useState(false);

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
    let filtered = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
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
    <View style={styles.container}>
      {(files.length > 0 || searchQuery) && (
        <View style={styles.header}>
          <View style={[styles.searchContainer, { marginRight: 0 }]}>
            <FontAwesome6 name="magnifying-glass" size={20} color="#666" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="파일 검색..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      )}

      {files.length > 0 && (
        <View style={styles.sortContainer}>
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
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.fileItem} onPress={() => handleFilePress(item)}>
            <FontAwesome6 name={getFileIcon(item.type)} size={24} color="#666" style={styles.fileIcon} />
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{item.name}</Text>
              <Text style={styles.fileDetail}>
                {formatFileSize(item.size)} • {formatDate(item.modifiedTime)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {searchQuery ? (
              <>
                <FontAwesome6 name="magnifying-glass-minus" size={40} color="#ccc" />
                <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
              </>
            ) : (
              <>
                <FontAwesome6 name="folder-open" size={40} color="#ccc" />
                <Text style={styles.emptyText}>파일을 추가해주세요.</Text>
                <TouchableOpacity style={styles.emptyAddButton} onPress={handleFilePick}>
                  <FontAwesome6 name="plus" size={20} color="#fff" />
                  <Text style={styles.emptyAddButtonText}>파일 추가하기</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        )}
      />

      {files.length > 0 && (
        <TouchableOpacity style={styles.floatingButton} onPress={handleFilePick}>
          <FontAwesome6 name="plus" size={24} color="white" />
        </TouchableOpacity>
      )}

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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  searchIcon: {
    marginHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  floatingButton: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
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
    color: '#666',
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
    color: '#666',
  },
  emptyAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
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
  sortContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    width: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginVertical: 16,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonSkip: {
    backgroundColor: '#f5f5f5',
  },
  modalButtonOverwrite: {
    backgroundColor: '#007AFF',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  modalButtonTextOverwrite: {
    color: '#fff',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});
