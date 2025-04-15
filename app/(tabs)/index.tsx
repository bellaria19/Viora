import { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { FileItem } from "@/types/file";
import FileListItem from "@/components/file/FileListItem";
import { getRecentFiles, importFile } from "@/utils/fileSystem";
import FileListContainer from "@/components/file/FileListContainer";
import { SortOption } from "@/types/sort";

export default function HomeScreen() {
  const [isAddingFiles, setIsAddingFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    loadRecentFiles();
  }, []);

  const loadRecentFiles = async () => {
    if (!isRefreshing) {
      setIsLoading(true);
    }
    try {
      const recentFiles = await getRecentFiles();
      setFiles(recentFiles);
    } catch (error) {
      console.error("최근 파일 로딩 오류:", error);
    } finally {
      if (!isRefreshing) {
        setIsLoading(false);
      }
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRecentFiles();
    setIsRefreshing(false);
  };

  const onAddFile = async () => {
    setIsAddingFiles(true);
    try {
      const file = await importFile();
      if (file) {
        setFiles((prevFiles) => [...prevFiles, file]);
        Alert.alert("성공", "파일이 성공적으로 추가되었습니다.");
      }
    } catch (error) {
      console.error("파일 추가 오류:", error);
      Alert.alert("오류", "파일을 추가하는 중 오류가 발생했습니다.");
    } finally {
      setIsAddingFiles(false);
    }
  };

  const renderFileItem = (item: FileItem) => <FileListItem item={item} />;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FileListContainer
        data={files}
        renderItem={renderFileItem}
        isLoading={isLoading}
        isAddingFiles={isAddingFiles}
        onAddFile={onAddFile}
        emptyMessage="최근에 열어본 파일이 없습니다"
        sortOption={SortOption.NAME_ASC}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
