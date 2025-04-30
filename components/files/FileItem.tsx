import { TouchableOpacity, View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { FileInfo } from '@/types/files';
import { getFileIcon, formatFileSize, formatDate } from '@/utils/formatters';

interface FileItemProps {
  file: FileInfo;
  onPress: (file: FileInfo) => void;
  colors: {
    text: string;
    secondaryText: string;
    border: string;
  };
  showSize?: boolean; // 파일 크기 표시 여부 (files.tsx에서는 true, index.tsx에서는 false)
  style?: ViewStyle;
  fileNameStyle?: TextStyle;
  fileDetailStyle?: TextStyle;
}

export default function FileItem({
  file,
  onPress,
  colors,
  showSize = false,
  style,
  fileNameStyle,
  fileDetailStyle,
}: FileItemProps) {
  return (
    <TouchableOpacity
      style={[styles.fileItem, { borderBottomColor: colors.border }, style]}
      onPress={() => onPress(file)}
    >
      <FontAwesome6 name={getFileIcon(file.type)} size={24} color={colors.secondaryText} style={styles.fileIcon} />
      <View style={styles.fileInfo}>
        <Text style={[styles.fileName, { color: colors.text }, fileNameStyle]}>{file.name}</Text>
        <Text style={[styles.fileDetail, { color: colors.secondaryText }, fileDetailStyle]}>
          {showSize ? `${formatFileSize(file.size)} • ${formatDate(file.modifiedTime)}` : formatDate(file.modifiedTime)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  fileIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    marginBottom: 4,
  },
  fileDetail: {
    fontSize: 12,
  },
});
