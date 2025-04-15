import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import FileList, { FileItem } from "@/components/FileList";

export default function HomeScreen() {
  const [isAddingFiles, setIsAddingFiles] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);

  const onAddFile = () => {
    setIsAddingFiles(true);
  };

  const renderFileItem = (item: FileItem) => (
    <View style={styles.fileItem}>
      <Text>{item.name}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <FileList
        data={files}
        renderItem={renderFileItem}
        isLoading={isLoading}
        isAddingFiles={isAddingFiles}
        onAddFile={onAddFile}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  fileItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
  },
});
