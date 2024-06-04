import React, { useContext, createContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import Constants from 'expo-constants';
import isEqual from 'lodash.isequal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';
import { ANONYMOUS_USER_ID_KEY, ENGAGEMENT_API, IN_APP_GUIDE_SEEN_API, SET_USER_API } from '../constants';

const AatlasServiceContext = createContext<ConfigType>({
  appConfig: null,
  setUser: async ({ user_id, name, email }) => {
    console.log({ user_id, name, email });
  },
  updateInAppGuidesSeenStatus: async (data) => {
    console.log(data);
    return null;
  },
  resetInAppGuides: () => {},
});

AatlasServiceContext.displayName = 'useAatlasServiceContext';

export const useAatlasService = () => {
  const context = useContext(AatlasServiceContext);

  if (!context) {
    throw new Error('Children should be wrapped inside AatlasProvider');
  }

  return context;
};

export const AatlasProvider = ({
  appKey,
  appSecret,
  children,
}: {
  appKey: string;
  appSecret: string;
  children: ReactNode;
}) => {
  const [appConfig, setAppConfig] = useState<AppConfigType | null>(null);
  const appState = useRef(AppState.currentState);
  const [userDetails, setUserDetails] = useState<{
    user_id?: string;
    name?: string;
    email?: string;
  }>({ user_id: '', name: '', email: '' });

  const resetInAppGuides = useCallback(() => {
    setAppConfig({ in_app_guides: [] });
  }, []);

  const setUser = useCallback(
    ({ user_id, name, email }: { user_id?: string; name?: string; email?: string }) => {
      setUserDetails({ user_id, name, email });
    },
    [setUserDetails]
  );

  const getAnonymousUserId = useCallback(async (): Promise<string> => {
    let value = await AsyncStorage.getItem(ANONYMOUS_USER_ID_KEY);
    if (!value) {
      value = uuid.v4() as string;
      await AsyncStorage.setItem(ANONYMOUS_USER_ID_KEY, value);
    }

    return value;
  }, []);

  const updateUser = useCallback(
    async ({ user_id = '', name = '', email = '' }: { user_id?: string; name?: string; email?: string }) => {
      try {
        const anonymous_user_id = await getAnonymousUserId();
        if (!appSecret) {
          throw new Error('@aatlas/engagement app is not initialized. Please follow the documentation');
        }

        if (!anonymous_user_id) {
          throw new Error('Organization user does not exist');
        }

        const response = await fetch(SET_USER_API, {
          method: 'POST',
          headers: {
            'x-app-secret': appSecret,
          },
          body: JSON.stringify({
            app_key: appKey,
            user_id,
            name,
            email,
            anonymous_user_id,
            app_version: Constants.expoConfig?.version,
            platform: Platform.OS,
          }),
        });

        if (!response.ok) {
          const json = await response.json();
          throw new Error(JSON.stringify(json));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Aatlas setUser failed: ', error.message);
        } else {
          console.error('Aatlas setUser failed: ', error);
        }
      }

      return null;
    },
    [appSecret, appKey, getAnonymousUserId]
  );

  const getAppConfig = useCallback(async () => {
    if (!appKey || !appSecret) {
      console.error('Invalid appKey or appSecret');
    } else {
      try {
        const anonymous_user_id = await getAnonymousUserId();

        const response = await fetch(ENGAGEMENT_API, {
          method: 'POST',
          headers: {
            'x-app-secret': appSecret,
          },
          body: JSON.stringify({
            app_key: appKey,
            anonymous_user_id,
            app_version: Constants.expoConfig?.version,
            platform: Platform.OS,
          }),
        });
        const json: AppConfigType = await response.json();

        if (!response.ok) {
          throw new Error(JSON.stringify(json));
        }

        if (!isEqual(json, appConfig)) {
          setAppConfig(json);
        }

        if (userDetails?.user_id || userDetails?.name || userDetails?.email) {
          updateUser(userDetails);
        }
      } catch (error) {
        console.error('Failed to fetch engagement config: ', error);
      }
    }
  }, [appConfig, appSecret, appKey, getAnonymousUserId, userDetails, updateUser]);

  const updateInAppGuidesSeenStatus = useCallback(
    async (data: InAppGuidesStatus) => {
      const anonymous_user_id = await getAnonymousUserId();
      try {
        if (!appKey || !appSecret) {
          throw new Error('@aatlas/engagement app is not initialized. Please follow the documentation');
        }

        if (!anonymous_user_id) {
          throw new Error('Organization user does not exist');
        }

        const response = await fetch(IN_APP_GUIDE_SEEN_API, {
          method: 'POST',
          headers: {
            'x-app-secret': appSecret,
          },
          body: JSON.stringify({
            app_key: appKey,
            anonymous_user_id,
            in_app_guide_ids: data,
            platform: Platform.OS,
          }),
        });

        if (!response.ok) {
          const json = await response.json();
          throw new Error(JSON.stringify(json));
        }
      } catch (error) {
        if (error instanceof Error) {
          console.error('Aatlas updateInAppGuidesSeenStatus failed: ', error.message);
        } else {
          console.error('Aatlas updateInAppGuidesSeenStatus failed: ', error);
        }
      }

      return null;
    },
    [appSecret, appKey, getAnonymousUserId]
  );

  useEffect(() => {
    if (!appConfig) {
      getAppConfig();
    }
  }, [appConfig, getAppConfig]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        getAppConfig();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [getAppConfig]);

  const values = useMemo(
    () => ({
      appConfig,
      updateInAppGuidesSeenStatus,
      setUser,
      resetInAppGuides,
    }),
    [appConfig, updateInAppGuidesSeenStatus, setUser, resetInAppGuides]
  );

  return <AatlasServiceContext.Provider value={values}>{children}</AatlasServiceContext.Provider>;
};
