import { StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import EmptyFileList from "./EmptyFileList";
import { SortOption } from "@/types/sort";
import { FileListProps } from "@/types/file";
import { sortFiles } from "@/utils/sorting";

export default function FileList({
  data,
  renderItem,
  isLoading = false,
  isAddingFiles = false,
  onAddFile,
  emptyMessage,
  sortOption = SortOption.NAME_ASC,
}: FileListProps) {
  const sortedData = sortOption ? sortFiles(data, sortOption) : data;

  return (
    <FlashList
      data={sortedData}
      renderItem={({ item }) => renderItem(item)}
      ListEmptyComponent={
        <EmptyFileList
          onAddFile={onAddFile}
          isAddingFiles={isAddingFiles}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
        />
      }
      keyExtractor={(item) => item.id}
      estimatedItemSize={200}
    />
  );
}
