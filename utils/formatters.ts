import { FileInfo } from '@/types/files';

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}/${month}/${day}`;
};

export const getFileIcon = (type: FileInfo['type']): string => {
  switch (type) {
    case 'text':
      return 'file-lines';
    case 'image':
      return 'image';
    case 'pdf':
      return 'file-pdf';
    case 'epub':
      return 'book';
    case 'zip':
      return 'file-zipper';
    default:
      return 'file';
  }
};
