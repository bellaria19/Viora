import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { getFileList, importFile, deleteFile } from '@/utils/fileSystem';
import { SortMenuItem, SortOption, sortOptions } from '@/types/sort';
import SearchBar from '@/components/common/SearchBar';
import FileListContainer from '@/components/file/FileListContainer';
import { ModalContainer } from '@/components/common/Modal';
import FileListItem from '@/components/file/FileListItem';
import { FileItem } from '@/types/file';
import { useUserPreferences } from '@/contexts/UserPreferences';
import { useTheme, Theme } from '@react-navigation/native';

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.background,
    },
    modalContainer: {
      padding: 20,
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      width: '80%',
    },
    modalContent: {
      width: '100%',
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 16,
      textAlign: 'center',
      color: theme.colors.text,
    },
    sortOption: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      marginVertical: 4,
      borderRadius: 8,
      backgroundColor: theme.colors.card,
    },
    sortOptionSelected: {
      backgroundColor: theme.colors.primary,
    },
    sortOptionText: {
      marginLeft: 12,
      fontSize: 16,
      color: theme.colors.text,
    },
    sortOptionTextSelected: {
      color: theme.colors.background,
    },
  });

export default function FilesScreen() {
  const { preferences, setDefaultSortOption } = useUserPreferences();
  const theme = useTheme();
  const styles = createStyles(theme);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingFiles, setIsAddingFiles] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOption>(preferences.defaultSortOption);

  const loadFiles = useCallback(async () => {
    if (!isRefreshing) {
      setIsLoading(true);
    }
    try {
      const fileList = await getFileList();
      setFiles(fileList);
      setFilteredFiles(fileList);
    } catch (error) {
      console.error('파일 목록 로딩 오류:', error);
    } finally {
      if (!isRefreshing) {
        setIsLoading(false);
      }
    }
  }, [isRefreshing]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles, preferences.defaultSortOption]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredFiles(files);
    } else {
      const filtered = files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
      setFilteredFiles(filtered);
    }
  }, [searchQuery, files]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadFiles();
    setIsRefreshing(false);
  };

  const onAddFile = async () => {
    setIsAddingFiles(true);
    try {
      const file = await importFile();
      if (file) {
        setFiles((prevFiles) => [...prevFiles, file]);
        Alert.alert('성공', '파일이 성공적으로 추가되었습니다.');
      }
    } catch (error) {
      console.error('파일 추가 오류:', error);
      Alert.alert('오류', '파일을 추가하는 중 오류가 발생했습니다.');
    } finally {
      setIsAddingFiles(false);
    }
  };

  const handleDeleteFile = async (file: FileItem) => {
    Alert.alert('파일 삭제', `"${file.name}" 파일을 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            const deleted = await deleteFile(file.uri);
            if (deleted) {
              setFiles((prevFiles) => prevFiles.filter((f) => f.id !== file.id));
              Alert.alert('성공', '파일이 삭제되었습니다.');
            }
          } catch (error) {
            console.error('파일 삭제 오류:', error);
            Alert.alert('오류', '파일을 삭제하는 중 오류가 발생했습니다.');
          }
        },
      },
    ]);
  };

  const handleSortOptionSelect = (option: SortMenuItem) => {
    setSortOrder(option.id as SortOption);
    setDefaultSortOption(option.id as SortOption);
    setSortModalVisible(false);
  };

  const renderFileItem = (item: FileItem) => <FileListItem item={item} onLongPress={() => handleDeleteFile(item)} />;

  const SortModal = () => (
    <ModalContainer
      visible={sortModalVisible}
      onClose={() => setSortModalVisible(false)}
      containerStyle={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>정렬 방식</Text>
        {sortOptions.map((option) => (
          <TouchableOpacity
            key={option.id + option.label}
            style={[styles.sortOption, sortOrder.startsWith(option.id) && styles.sortOptionSelected]}
            onPress={() => handleSortOptionSelect(option)}
          >
            <FontAwesome
              name={option.icon as keyof typeof FontAwesome.glyphMap}
              size={20}
              color={sortOrder.startsWith(option.id) ? '#FFFFFF' : '#007AFF'}
            />
            <Text style={[styles.sortOptionText, sortOrder.startsWith(option.id) && styles.sortOptionTextSelected]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ModalContainer>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <FileListContainer
        data={filteredFiles}
        renderItem={renderFileItem}
        isLoading={isLoading}
        isAddingFiles={isAddingFiles}
        onAddFile={onAddFile}
        sortOption={sortOrder}
        emptyMessage={searchQuery ? '검색 결과가 없습니다' : '파일이 없습니다'}
        onOpenSortModal={() => setSortModalVisible(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
      <SortModal />
    </View>
  );
}
