import { View, StyleSheet } from "react-native";
import FileList, { FileItem } from "./FileList";
import FileListToolbar, { TabType, ViewMode } from "./FileListToolbar";
import { SortOption } from "./types";

interface FileListContainerProps {
  // FileList props
  data: FileItem[];
  renderItem: (item: FileItem) => React.ReactElement;
  isLoading?: boolean;
  isAddingFiles?: boolean;
  onAddFile: () => void;
  emptyMessage?: string;
  sortOption?: SortOption;
  // Toolbar props
  showToolbar?: boolean;
  toolbarProps?: {
    activeTab: TabType;
    currentFolderId: string;
    viewMode: ViewMode;
    isImporting: boolean;
    onNavigateUp: () => void;
    onRefresh: () => void;
    onToggleViewMode: () => void;
    onOpenSortModal: () => void;
    onOpenFolderModal: () => void;
    onPickDocuments: () => void;
  };
}

export default function FileListContainer({
  // FileList props
  data,
  renderItem,
  isLoading = false,
  isAddingFiles = false,
  onAddFile,
  emptyMessage,
  sortOption,
  // Toolbar props
  showToolbar = false,
  toolbarProps,
}: FileListContainerProps) {
  return (
    <View style={styles.container}>
      {showToolbar && data.length > 0 && toolbarProps && (
        <FileListToolbar {...toolbarProps} />
      )}
      <FileList
        data={data}
        renderItem={renderItem}
        isLoading={isLoading}
        isAddingFiles={isAddingFiles}
        onAddFile={onAddFile}
        emptyMessage={emptyMessage}
        sortOption={sortOption}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
