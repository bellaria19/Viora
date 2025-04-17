import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SortOption } from '@/types/sort';

// 각 뷰어별 설정 인터페이스 정의
interface TextViewerSettings {
  fontSize: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'sepia';
}

interface PDFViewerSettings {
  viewMode: 'scroll' | 'page';
  // rotation: number;
  enableRTL: boolean;
  showPageNumbers: boolean; // 추가: 페이지 번호 표시
}

interface ImageViewerSettings {
  defaultZoom: number;
  enableDoubleTapZoom: boolean;
}

interface EPUBViewerSettings {
  fontSize: number;
  fontFamily: string;
  theme: 'light' | 'dark' | 'sepia';
}

// 전체 사용자 설정 인터페이스
interface UserPreferences {
  // 앱 전체 설정
  darkMode: boolean;
  defaultSortOption: SortOption;
  brightness: number;

  // 뷰어별 설정
  textViewer: TextViewerSettings;
  pdfViewer: PDFViewerSettings;
  imageViewer: ImageViewerSettings;
  epubViewer: EPUBViewerSettings;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setDarkMode: (value: boolean) => void;
  setDefaultSortOption: (value: SortOption) => void;
  updateTextViewerSettings: (settings: Partial<TextViewerSettings>) => void;
  updatePDFViewerSettings: (settings: Partial<PDFViewerSettings>) => void;
  updateImageViewerSettings: (settings: Partial<ImageViewerSettings>) => void;
  updateEPUBViewerSettings: (settings: Partial<EPUBViewerSettings>) => void;
  isLoading: boolean;
}

// 기본 설정값 정의
export const defaultPreferences: UserPreferences = {
  // 앱 전체 설정 기본값
  darkMode: false,
  defaultSortOption: SortOption.NAME_ASC,
  brightness: 100,

  // 뷰어별 설정 기본값
  textViewer: {
    fontSize: 16,
    fontFamily: 'System',
    theme: 'light',
  },
  pdfViewer: {
    viewMode: 'scroll',
    // rotation: 0,
    enableRTL: false,
    showPageNumbers: true, // 추가: 기본값으로 페이지 번호 표시
  },
  imageViewer: {
    defaultZoom: 1.0,
    enableDoubleTapZoom: true,
  },
  epubViewer: {
    fontSize: 16,
    fontFamily: 'System',
    theme: 'light',
  },
};

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(null);

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};

interface UserPreferencesProviderProps {
  children: React.ReactNode;
}

export const UserPreferencesProvider = ({ children }: UserPreferencesProviderProps) => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const storedPreferences = await AsyncStorage.getItem('userPreferences');
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } catch (error) {
      console.error('사용자 설정을 불러오는데 실패했습니다:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      await AsyncStorage.setItem('userPreferences', JSON.stringify(newPreferences));
    } catch (error) {
      console.error('사용자 설정을 저장하는데 실패했습니다:', error);
    }
  };

  // 앱 전체 설정 업데이트 함수
  const setDarkMode = (value: boolean) => {
    const newPreferences = { ...preferences, darkMode: value };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const setDefaultSortOption = (value: SortOption) => {
    const newPreferences = { ...preferences, defaultSortOption: value };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  // 뷰어별 설정 업데이트 함수
  const updateTextViewerSettings = (settings: Partial<TextViewerSettings>) => {
    const newPreferences = {
      ...preferences,
      textViewer: { ...preferences.textViewer, ...settings },
    };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const updatePDFViewerSettings = (settings: Partial<PDFViewerSettings>) => {
    const newPreferences = {
      ...preferences,
      pdfViewer: { ...preferences.pdfViewer, ...settings },
    };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const updateImageViewerSettings = (settings: Partial<ImageViewerSettings>) => {
    const newPreferences = {
      ...preferences,
      imageViewer: { ...preferences.imageViewer, ...settings },
    };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const updateEPUBViewerSettings = (settings: Partial<EPUBViewerSettings>) => {
    const newPreferences = {
      ...preferences,
      epubViewer: { ...preferences.epubViewer, ...settings },
    };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        setDarkMode,
        setDefaultSortOption,
        updateTextViewerSettings,
        updatePDFViewerSettings,
        updateImageViewerSettings,
        updateEPUBViewerSettings,
        isLoading,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
