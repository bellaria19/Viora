import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, SectionListData, SectionListRenderItem } from 'react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { FontAwesome6 } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { useTheme } from '@/hooks/useTheme';
import { Colors } from '@/constants/Colors';

// 옵션 타입 정의
export interface SettingOption {
  key: string;
  type: 'button-group' | 'slider' | 'switch' | 'color-group';
  value: any;
  label?: string;
  options?: { value: any; label: string; icon?: string }[]; // button-group, color-group
  min?: number; // slider
  max?: number; // slider
  step?: number; // slider
  unit?: string; // slider
  colorOptions?: string[]; // color-group
  icon?: string; // button-group
}

export interface SettingsSection {
  title: string;
  data: SettingOption[];
}

interface SettingsBottomSheetProps {
  title: string;
  isVisible: boolean;
  onClose: () => void;
  sections: SettingsSection[];
  onOptionChange: (key: string, value: any) => void;
}

export default function SettingsBottomSheet({
  title,
  isVisible,
  onClose,
  sections,
  onOptionChange,
}: SettingsBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { currentTheme } = useTheme();
  const colors = Colors[currentTheme];

  // 바텀 시트 스냅 포인트 설정 (화면의 80%)
  const snapPoints = useMemo(() => ['40%', '80%'], []);

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

  // 섹션 헤더 렌더러
  const renderSectionHeader = ({ section }: { section: SectionListData<SettingOption> }) => (
    <Text style={styles.sectionTitle}>{(section as any).title}</Text>
  );

  // 옵션별 렌더러
  const renderItem: SectionListRenderItem<SettingOption> = ({ item }) => {
    switch (item.type) {
      case 'button-group':
        return (
          <View style={styles.buttonGroupRow}>
            {item.options?.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.button, item.value === opt.value && styles.buttonActive]}
                onPress={() => onOptionChange(item.key, opt.value)}
              >
                {opt.icon && (
                  <FontAwesome6
                    name={opt.icon as any}
                    size={16}
                    color={item.value === opt.value ? '#fff' : '#666'}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={[styles.buttonText, item.value === opt.value && styles.buttonTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      case 'slider':
        return (
          <View style={styles.sliderRow}>
            <Text style={styles.sliderLabel}>{item.label}</Text>
            <Slider
              style={styles.slider}
              minimumValue={item.min ?? 0}
              maximumValue={item.max ?? 100}
              step={item.step ?? 1}
              value={item.value}
              onValueChange={(value) => onOptionChange(item.key, value)}
              minimumTrackTintColor="#007AFF"
              maximumTrackTintColor="#ddd"
              thumbTintColor="#007AFF"
            />
            <Text style={styles.sliderValue}>
              {item.value}
              {item.unit ?? ''}
            </Text>
          </View>
        );
      case 'switch':
        return (
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{item.label}</Text>
            <Switch
              value={item.value}
              onValueChange={(value) => onOptionChange(item.key, value)}
              trackColor={{ false: '#ddd', true: '#007AFF' }}
            />
          </View>
        );
      case 'color-group':
        return (
          <View style={styles.colorGroupRow}>
            <Text style={styles.colorLabel}>{item.label}</Text>
            <View style={styles.colorOptionsRow}>
              {item.colorOptions?.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorOption,
                    { backgroundColor: color === 'transparent' ? 'white' : color },
                    item.value === color && styles.selectedColorOption,
                  ]}
                  onPress={() => onOptionChange(item.key, color)}
                >
                  {color === 'transparent' && <FontAwesome6 name="slash" size={16} color="#ddd" />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );
      default:
        return null;
    }
  };

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
      <BottomSheetSectionList
        sections={sections}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.contentContainer}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
      />
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  buttonGroupRow: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
  },
  buttonActive: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#666',
    fontSize: 14,
  },
  buttonTextActive: {
    color: '#fff',
  },
  sliderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  sliderLabel: {
    width: 80,
    fontSize: 15,
    color: '#333',
  },
  slider: {
    flex: 1,
    marginLeft: 16,
  },
  sliderValue: {
    marginLeft: 8,
    fontSize: 15,
    color: '#333',
    width: 48,
    textAlign: 'right',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 15,
    color: '#333',
  },
  colorGroupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  colorLabel: {
    fontSize: 15,
    color: '#333',
    marginRight: 12,
  },
  colorOptionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  colorOption: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  selectedColorOption: {
    borderWidth: 2,
    borderColor: '#007AFF',
  },
});
