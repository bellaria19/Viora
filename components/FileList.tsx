import { View, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import EmptyFileList from "./EmptyFileList";
import { SortOption } from "./types";

export interface FileItem {
  id: string;
  name: string;
  date: Date;
  size: number;
  type: string;
  [key: string]: any; // 추가 속성을 위한 인덱스 시그니처
}

interface FileListProps {
  data: FileItem[];
  renderItem: (item: FileItem) => React.ReactElement;
  isLoading?: boolean;
  isAddingFiles?: boolean;
  onAddFile: () => void;
  emptyMessage?: string;
  sortOption?: SortOption;
}

const sortFiles = (files: FileItem[], sortOption: SortOption): FileItem[] => {
  const sortedFiles = [...files];

  switch (sortOption) {
    case SortOption.NAME_ASC:
      return sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
    case SortOption.NAME_DESC:
      return sortedFiles.sort((a, b) => b.name.localeCompare(a.name));
    case SortOption.DATE_ASC:
      return sortedFiles.sort((a, b) => a.date.getTime() - b.date.getTime());
    case SortOption.DATE_DESC:
      return sortedFiles.sort((a, b) => b.date.getTime() - a.date.getTime());
    case SortOption.SIZE_ASC:
      return sortedFiles.sort((a, b) => a.size - b.size);
    case SortOption.SIZE_DESC:
      return sortedFiles.sort((a, b) => b.size - a.size);
    case SortOption.TYPE_ASC:
      return sortedFiles.sort((a, b) => a.type.localeCompare(b.type));
    case SortOption.TYPE_DESC:
      return sortedFiles.sort((a, b) => b.type.localeCompare(a.type));
    default:
      return sortedFiles;
  }
};

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
