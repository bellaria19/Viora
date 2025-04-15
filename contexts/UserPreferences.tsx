// contexts/UserPreferences.tsx 파일 생성
import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SortOption } from "@/types/sort";

interface UserPreferences {
  darkMode: boolean;
  autoOpenLastFile: boolean; // Deprecated: 자동 열기 기능 제거 (2024-03-26)
  showThumbnails: boolean;
  defaultSortOption: SortOption;
  lastOpenedFileId: string | null; // Deprecated: 자동 열기 기능 제거 (2024-03-26)
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setDarkMode: (value: boolean) => void;
  setAutoOpenLastFile: (value: boolean) => void; // Deprecated: 자동 열기 기능 제거 (2024-03-26)
  setShowThumbnails: (value: boolean) => void;
  setDefaultSortOption: (value: SortOption) => void;
  setLastOpenedFileId: (value: string | null) => void; // Deprecated: 자동 열기 기능 제거 (2024-03-26)
  isLoading: boolean;
  defaultSortOption: SortOption;
}

const defaultPreferences: UserPreferences = {
  darkMode: false,
  autoOpenLastFile: false, // Deprecated: 기본값을 false로 설정
  showThumbnails: true,
  defaultSortOption: SortOption.NAME_ASC,
  lastOpenedFileId: null,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | null>(
  null
);

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (!context) {
    throw new Error(
      "useUserPreferences must be used within a UserPreferencesProvider"
    );
  }
  return context;
};

export const UserPreferencesProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const storedPreferences = await AsyncStorage.getItem("userPreferences");
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
    } catch (error) {
      console.error("사용자 설정을 불러오는데 실패했습니다:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePreferences = async (newPreferences: UserPreferences) => {
    try {
      await AsyncStorage.setItem(
        "userPreferences",
        JSON.stringify(newPreferences)
      );
    } catch (error) {
      console.error("사용자 설정을 저장하는데 실패했습니다:", error);
    }
  };

  const setDarkMode = (value: boolean) => {
    const newPreferences = { ...preferences, darkMode: value };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  // Deprecated: 자동 열기 기능 제거 (2024-03-26)
  const setAutoOpenLastFile = (value: boolean) => {
    console.warn(
      "Deprecated: setAutoOpenLastFile is deprecated and will be removed in future versions"
    );
    const newPreferences = { ...preferences, autoOpenLastFile: value };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const setShowThumbnails = (value: boolean) => {
    const newPreferences = { ...preferences, showThumbnails: value };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  const setDefaultSortOption = (value: SortOption) => {
    const newPreferences = { ...preferences, defaultSortOption: value };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  // Deprecated: 자동 열기 기능 제거 (2024-03-26)
  const setLastOpenedFileId = (value: string | null) => {
    console.warn(
      "Deprecated: setLastOpenedFileId is deprecated and will be removed in future versions"
    );
    const newPreferences = { ...preferences, lastOpenedFileId: value };
    setPreferences(newPreferences);
    savePreferences(newPreferences);
  };

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        setDarkMode,
        setAutoOpenLastFile,
        setShowThumbnails,
        setDefaultSortOption,
        setLastOpenedFileId,
        isLoading,
        defaultSortOption: preferences.defaultSortOption,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
