// utils/fileSystem.ts 파일 생성
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { FileItem } from "@/types/file";

export async function getFileList(
  directory: string = FileSystem.documentDirectory || ""
): Promise<FileItem[]> {
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
    console.error("파일 목록 가져오기 오류:", error);
    return [];
  }
}

export async function importFile(): Promise<FileItem | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["*/*"],
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

    const fileInfo = await FileSystem.getInfoAsync(destinationUri, {
      size: true,
    });

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
    console.error("파일 가져오기 오류:", error);
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
    console.error("파일 공유 오류:", error);
    return false;
  }
}

export async function deleteFile(fileUri: string): Promise<boolean> {
  try {
    await FileSystem.deleteAsync(fileUri);
    return true;
  } catch (error) {
    console.error("파일 삭제 오류:", error);
    return false;
  }
}

export function determineFileType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";

  const mimeTypes: Record<string, string> = {
    txt: "text/plain",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    pdf: "application/pdf",
    epub: "application/epub+zip",
    zip: "application/zip",
  };

  return mimeTypes[extension] || "application/octet-stream";
}
