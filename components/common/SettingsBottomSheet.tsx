import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

interface SettingsBottomSheetProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function SettingsBottomSheet({ title, isVisible, onClose, children }: SettingsBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  // 바텀 시트 스냅 포인트 설정 (화면의 80%)
  const snapPoints = useMemo(() => ['80%'], []);

  // 바텀 시트가 닫힐 때 실행되는 콜백
  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose],
  );

  // 백드롭 렌더링 함수
  const renderBackdrop = useCallback(
    (props: any) => <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />,
    [],
  );

  // 바텀 시트 열기/닫기
  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={[styles.indicator, { backgroundColor: colors.secondaryText }]}
      backgroundStyle={[styles.background, { backgroundColor: colors.background }]}
    >
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <FontAwesome6 name="xmark" size={20} color={colors.secondaryText} />
        </TouchableOpacity>
      </View>
      <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>{children}</BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
  },
  indicator: {
    width: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
