import { FileItem } from '@/types/file';
import { SortOption } from '@/types/sort';

export function sortFiles(files: FileItem[], sortOption: SortOption): FileItem[] {
  const sortedFiles = [...files];

  switch (sortOption) {
    case SortOption.NAME_ASC:
      return sortedFiles.sort((a, b) => a.name.localeCompare(b.name));
    case SortOption.NAME_DESC:
      return sortedFiles.sort((a, b) => b.name.localeCompare(a.name));
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
}
