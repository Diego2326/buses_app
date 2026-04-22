import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

import { setAuthToken } from '../services/apiClient';
import type { User } from '../types/domain';

const AUTH_STORAGE_KEY = 'passenger-auth';

type AuthState = {
  user?: User;
  token?: string;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  signIn: (user: User, token: string) => Promise<void>;
  signOut: () => Promise<void>;
  setHydrated: (value: boolean) => void;
};

type StoredAuth = {
  user?: User;
  token?: string;
};

export const useAuthStore = create<AuthState>()(set => ({
  hydrated: false,
  hydrate: async () => {
    try {
      const storedValue = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      const storedAuth = storedValue
        ? (JSON.parse(storedValue) as StoredAuth)
        : undefined;

      if (storedAuth?.token) {
        setAuthToken(storedAuth.token);
      }

      set({
        user: storedAuth?.user,
        token: storedAuth?.token,
        hydrated: true,
      });
    } catch {
      setAuthToken(undefined);
      set({user: undefined, token: undefined, hydrated: true});
    }
  },
  signIn: async (user, token) => {
    setAuthToken(token);
    set({user, token});
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({user, token}));
  },
  signOut: async () => {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    } finally {
        setAuthToken(undefined);
        set({user: undefined, token: undefined});
    }
  },
  setHydrated: hydrated => set({hydrated}),
}));
