import { View, Text, StyleSheet } from "react-native";

interface UnsupportedFileProps {
  fileType: string;
}

export default function UnsupportedFile({ fileType }: UnsupportedFileProps) {
  return (
    <View style={styles.unsupportedContainer}>
      <Text style={styles.unsupportedText}>
        지원하지 않는 파일 형식입니다: {fileType}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  unsupportedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  unsupportedText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
  },
});
