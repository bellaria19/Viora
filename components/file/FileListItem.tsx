// components/FileListItem.tsx 파일 생성
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { FileItem } from '@/types/file';
import { router } from 'expo-router';
import { updateFileAccessTime } from '@/utils/fileSystem';
import { useTheme, Theme } from '@react-navigation/native';

interface FileListItemProps {
  item: FileItem;
  onLongPress?: (item: FileItem) => void;
}

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.card,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    iconContainer: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    infoContainer: {
      flex: 1,
      justifyContent: 'center',
    },
    fileName: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 4,
      color: theme.colors.text,
    },
    detailsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    fileDetails: {
      fontSize: 13,
      color: theme.colors.text + '80',
    },
    moreButton: {
      padding: 8,
    },
  });

export default function FileListItem({ item, onLongPress }: FileListItemProps) {
  const theme = useTheme();
  const styles = createStyles(theme);

  const getFileIcon = (fileType: string): string => {
    // 파일 타입에 따라 적절한 아이콘 반환
    switch (fileType) {
      case 'text/plain':
        return 'file-text-o';
      case 'image/jpeg':
      case 'image/png':
      case 'image/gif':
        return 'file-image-o';
      case 'application/pdf':
        return 'file-pdf-o';
      case 'application/epub+zip':
        return 'book';
      case 'application/zip':
      case 'application/x-zip-compressed':
        return 'file-archive-o';
      default:
        return 'file-o';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  //   const now = new Date();
  //   const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  //   const fileDate = new Date(
  //     date.getFullYear(),
  //     date.getMonth(),
  //     date.getDate()
  //   );

  //   if (fileDate.getTime() === today.getTime()) {
  //     return (
  //       "오늘 " +
  //       date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
  //     );
  //   }

  //   const yesterday = new Date(today);
  //   yesterday.setDate(today.getDate() - 1);

  //   if (fileDate.getTime() === yesterday.getTime()) {
  //     return (
  //       "어제 " +
  //       date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
  //     );
  //   }

  //   return date.toLocaleDateString("ko-KR", {
  //     year: "numeric",
  //     month: "short",
  //     day: "numeric",
  //   });
  // };

  const handlePress = async () => {
    await updateFileAccessTime(item.id);
    router.push(`/(viewer)?id=${item.id}`);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      onLongPress={() => onLongPress && onLongPress(item)}
    >
      <View style={styles.iconContainer}>
        <FontAwesome
          name={getFileIcon(item.type) as keyof typeof FontAwesome.glyphMap}
          size={28}
          color={theme.colors.primary}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
          {item.name}
        </Text>
        <View style={styles.detailsContainer}>
          <Text style={styles.fileDetails}>{formatFileSize(item.size)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <FontAwesome name="ellipsis-v" size={18} color={theme.colors.text + '80'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}
