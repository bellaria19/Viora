import { View, StyleSheet, RefreshControl } from "react-native";
import { FlashList } from "@shopify/flash-list";
import EmptyComponent from "./EmptyFileList";
import { SortOption } from "@/types/sort";
import { FileItem } from "@/types/file";
import { sortFiles } from "@/utils/sorting";

interface FileListProps {
  data: FileItem[];
  renderItem: (item: FileItem) => React.ReactElement;
  isLoading?: boolean;
  isAddingFiles?: boolean;
  onAddFile: () => void;
  emptyMessage?: string;
  sortOption?: SortOption;
  refreshControl?: React.ReactElement;
}

export default function FileList({
  data,
  renderItem,
  isLoading = false,
  isAddingFiles = false,
  onAddFile,
  emptyMessage,
  sortOption = SortOption.NAME_ASC,
  refreshControl,
}: FileListProps) {
  const sortedData = sortOption ? sortFiles(data, sortOption) : data;

  return (
    <FlashList
      data={sortedData}
      renderItem={({ item }) => renderItem(item)}
      ListEmptyComponent={
        <EmptyComponent
          onAddFile={onAddFile}
          isAddingFiles={isAddingFiles}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
        />
      }
      keyExtractor={(item) => item.id}
      estimatedItemSize={200}
      refreshControl={refreshControl}
    />
  );
}
