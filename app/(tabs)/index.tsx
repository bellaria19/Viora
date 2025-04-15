import { useState, useEffect } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { FileItem } from "@/components/FileList";
import FileListItem from "@/components/FileListItem";
import { getFileList } from "@/utils/fileSystem";
import FileListContainer from "@/components/FileListContainer";
import { SortOption } from "@/components/types";

export default function HomeScreen() {
  const [isAddingFiles, setIsAddingFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    loadRecentFiles();
  }, []);

  const loadRecentFiles = async () => {
    setIsLoading(true);
    try {
      const fileList = await getFileList();
      // 날짜 기준으로 정렬하여 최근 파일만 표시
      const sortedFiles = fileList.sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
      // 최근 10개 파일만 표시
      const recentFiles = sortedFiles.slice(0, 10);
      setFiles(recentFiles);
    } catch (error) {
      console.error("최근 파일 로딩 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddFile = () => {
    setIsAddingFiles(true);
    // 여기서 importFile 함수를 호출하고 파일 목록을 업데이트할 수 있습니다
    // (생략)
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
        sortOption={SortOption.DATE_DESC}
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
