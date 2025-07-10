import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Get from local storage then parse stored json or return initialValue
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remove item from localStorage
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}

// Hook for managing theme preference
export function useTheme() {
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
}

// Hook for managing user preferences
export function useUserPreferences() {
  const [preferences, setPreferences] = useLocalStorage('user-preferences', {
    autoRefresh: true,
    refreshInterval: 5000,
    showNotifications: true,
    defaultReportFormat: 'pdf' as 'pdf' | 'html',
  });

  return { preferences, setPreferences };
}

// Hook for managing scan history
export function useScanHistory() {
  const [scanHistory, setScanHistory] = useLocalStorage('scan-history', [] as string[]);

  const addToHistory = (scanId: string) => {
    setScanHistory(prev => {
      const filtered = prev.filter(id => id !== scanId);
      return [scanId, ...filtered].slice(0, 10); // Keep last 10 scans
    });
  };

  const clearHistory = () => {
    setScanHistory([]);
  };

  return { scanHistory, addToHistory, clearHistory };
} 