// contexts/UserPreferences.tsx 파일 생성
import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SortOption } from "@/types/sort";

interface UserPreferencesState {
  darkMode: boolean;
  autoOpenLastFile: boolean;
  showThumbnails: boolean;
  defaultSortOption: SortOption;
  lastOpenedFileId: string | null;
}

interface UserPreferencesContextType {
  preferences: UserPreferencesState;
  setDarkMode: (value: boolean) => void;
  setAutoOpenLastFile: (value: boolean) => void;
  setShowThumbnails: (value: boolean) => void;
  setDefaultSortOption: (value: SortOption) => void;
  setLastOpenedFileId: (value: string | null) => void;
  isLoading: boolean;
  defaultSortOption: SortOption;
}

const defaultPreferences: UserPreferencesState = {
  darkMode: false,
  autoOpenLastFile: true,
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
    useState<UserPreferencesState>(defaultPreferences);
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

  const savePreferences = async (newPreferences: UserPreferencesState) => {
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

  const setAutoOpenLastFile = (value: boolean) => {
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

  const setLastOpenedFileId = (value: string | null) => {
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
