import { View, RefreshControl } from 'react-native';
import FileList from './FileList';
import SortToolbar from '@/components/file/SortBar';
import FloatingAddButton from '@/components/file/FloatingAddButton';
import { FileItem } from '@/types/file';
import { SortOption } from '@/types/sort';

interface FileListContainerProps {
  data: FileItem[];
  renderItem: (item: FileItem) => React.ReactElement;
  isLoading?: boolean;
  isAddingFiles?: boolean;
  onAddFile: () => void;
  emptyMessage?: string;
  sortOption?: SortOption;
  onOpenSortModal?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function FileListContainer({
  data,
  renderItem,
  isLoading = false,
  isAddingFiles = false,
  onAddFile,
  emptyMessage,
  sortOption = SortOption.NAME_ASC,
  onOpenSortModal,
  onRefresh,
  isRefreshing = false,
}: FileListContainerProps) {
  return (
    <View style={{ flex: 1 }}>
      {data.length > 0 && onOpenSortModal && <SortToolbar onOpenSortModal={onOpenSortModal} sortOption={sortOption} />}
      <FileList
        data={data}
        renderItem={renderItem}
        isLoading={isLoading}
        isAddingFiles={isAddingFiles}
        onAddFile={onAddFile}
        emptyMessage={emptyMessage}
        sortOption={sortOption}
        refreshControl={onRefresh ? <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} /> : undefined}
      />
      {data.length > 0 && <FloatingAddButton onPress={onAddFile} isDisabled={isAddingFiles} />}
    </View>
  );
}
