// utils/fileSystem.ts 파일 생성
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { FileItem } from '@/types/file';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FILE_ACCESS_HISTORY_KEY = 'file_access_history';

interface FileAccessRecord {
  fileId: string;
  lastAccessed: number;
}

export async function getFileList(directory: string = FileSystem.documentDirectory || ''): Promise<FileItem[]> {
  try {
    const result = await FileSystem.readDirectoryAsync(directory);
    const files: FileItem[] = [];

    for (const name of result) {
      const fileUri = `${directory}${name}`;
      const fileInfo = await FileSystem.getInfoAsync(fileUri);

      if (fileInfo.exists) {
        const fileType = determineFileType(name);

        files.push({
          id: name,
          name: name,
          size: fileInfo.size || 0,
          type: fileType,
          uri: fileUri,
        });
      }
    }

    return files;
  } catch (error) {
    console.error('파일 목록 가져오기 오류:', error);
    return [];
  }
}

export async function importFile(): Promise<FileItem | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['*/*'],
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      return null;
    }

    const asset = result.assets[0];
    const fileName = asset.name;
    const fileUri = asset.uri;

    // 파일을 앱의 문서 디렉토리로 복사
    const destinationUri = `${FileSystem.documentDirectory}${fileName}`;
    await FileSystem.copyAsync({
      from: fileUri,
      to: destinationUri,
    });

    const fileInfo = await FileSystem.getInfoAsync(destinationUri);

    if (fileInfo.exists) {
      const fileType = determineFileType(fileName);

      return {
        id: fileName,
        name: fileName,
        size: fileInfo.size || 0,
        type: fileType,
        uri: destinationUri,
      };
    }
    return null;
  } catch (error) {
    console.error('파일 가져오기 오류:', error);
    return null;
  }
}

export async function shareFile(fileUri: string): Promise<boolean> {
  try {
    const canShare = await Sharing.isAvailableAsync();

    if (canShare) {
      await Sharing.shareAsync(fileUri);
      return true;
    }

    return false;
  } catch (error) {
    console.error('파일 공유 오류:', error);
    return false;
  }
}

export async function deleteFile(fileUri: string): Promise<boolean> {
  try {
    await FileSystem.deleteAsync(fileUri);
    return true;
  } catch (error) {
    console.error('파일 삭제 오류:', error);
    return false;
  }
}

export function determineFileType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';

  const mimeTypes: Record<string, string> = {
    txt: 'text/plain',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    epub: 'application/epub+zip',
    zip: 'application/zip',
  };

  return mimeTypes[extension] || 'application/octet-stream';
}

export async function updateFileAccessTime(fileId: string) {
  try {
    const history = await getFileAccessHistory();
    const updatedHistory = [
      { fileId, lastAccessed: Date.now() },
      ...history.filter((record) => record.fileId !== fileId),
    ].slice(0, 50); // 최대 50개까지만 기록 유지

    await AsyncStorage.setItem(FILE_ACCESS_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('파일 접근 시간 업데이트 오류:', error);
  }
}

export async function getFileAccessHistory(): Promise<FileAccessRecord[]> {
  try {
    const history = await AsyncStorage.getItem(FILE_ACCESS_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('파일 접근 기록 조회 오류:', error);
    return [];
  }
}

export async function getRecentFiles(): Promise<FileItem[]> {
  try {
    const [allFiles, accessHistory] = await Promise.all([getFileList(), getFileAccessHistory()]);

    const recentFiles = allFiles
      .filter((file) => accessHistory.some((record) => record.fileId === file.id))
      .sort((a, b) => {
        const aAccess = accessHistory.find((record) => record.fileId === a.id)?.lastAccessed || 0;
        const bAccess = accessHistory.find((record) => record.fileId === b.id)?.lastAccessed || 0;
        return bAccess - aAccess;
      })
      .slice(0, 10);

    return recentFiles;
  } catch (error) {
    console.error('최근 파일 조회 오류:', error);
    return [];
  }
}
