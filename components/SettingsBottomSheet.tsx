import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SectionList, SectionListRenderItemInfo } from 'react-native';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { FontAwesome6 } from '@expo/vector-icons';

// 설정 섹션 및 아이템 타입 정의
export interface SettingsSection {
  title: string;
  data: SettingsItem[];
}

export interface SettingsItem {
  key: string;
  renderItem: () => React.ReactElement;
}

interface SettingsBottomSheetProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
  sections: SettingsSection[];
}

export default function SettingsBottomSheet({ title, isVisible, onClose, sections }: SettingsBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

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

  // 섹션 헤더 렌더링 함수
  const renderSectionHeader = useCallback(
    ({ section }: { section: SettingsSection }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
      </View>
    ),
    [],
  );

  // 개별 아이템 렌더링 함수
  const renderItem = useCallback(({ item }: SectionListRenderItemInfo<SettingsItem>) => item.renderItem(), []);

  // 바텀 시트 열기/닫기
  React.useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const keyExtractor = useCallback((item: SettingsItem) => item.key, []);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose={true}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={styles.background}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <FontAwesome6 name="xmark" size={20} color="#666" />
        </TouchableOpacity>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
      />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#fff',
  },
  indicator: {
    backgroundColor: '#ccc',
    width: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  sectionHeader: {
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
