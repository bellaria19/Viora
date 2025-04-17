// contexts/UserPreferences.tsx 파일 생성
import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SortOption } from "@/types/sort";

interface UserPreferences {
  darkMode: boolean;
  showThumbnails: boolean;
  defaultSortOption: SortOption;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  setDarkMode: (value: boolean) => void;
  setShowThumbnails: (value: boolean) => void;
  setDefaultSortOption: (value: SortOption) => void;
  isLoading: boolean;
  defaultSortOption: SortOption;
}

const defaultPreferences: UserPreferences = {
  darkMode: false,
  showThumbnails: true,
  defaultSortOption: SortOption.NAME_ASC,
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

  return (
    <UserPreferencesContext.Provider
      value={{
        preferences,
        setDarkMode,
        setShowThumbnails,
        setDefaultSortOption,
        isLoading,
        defaultSortOption: preferences.defaultSortOption,
      }}
    >
      {children}
    </UserPreferencesContext.Provider>
  );
};
