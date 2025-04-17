import { SortOption } from '@/types/sort';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uri: string;
}

export interface FileListProps {
  data: FileItem[];
  renderItem: (item: FileItem) => React.ReactElement;
  isLoading?: boolean;
  isAddingFiles?: boolean;
  onAddFile: () => void;
  emptyMessage?: string;
  sortOption?: SortOption;
}
