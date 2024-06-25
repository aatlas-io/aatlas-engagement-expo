import React, { useContext, createContext, useState, useEffect, useMemo, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import { AppState, Platform } from 'react-native';
import Constants from 'expo-constants';
import isEqual from 'lodash.isequal';
import {
  ENGAGEMENT_API,
  LAST_SEEN_API,
  PAGE_VISIT_API,
  SEND_FEEDBACK_API,
  SESSION_API,
  SET_USER_API,
} from '../constants';
import { aatlasFetch } from '../utils';

const AatlasServiceContext = createContext<ConfigType>({
  appConfig: null,
  setUser: async ({ user_id, name, email }) => {
    console.log({ user_id, name, email });
  },
  sendFeedback: async (data) => {
    console.log(data);
  },
  setLastSeen: async () => {},
  logPageVisit: async () => {},
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

  const resetInAppGuides = useCallback(() => {
    if (appConfig) {
      setAppConfig({ ...appConfig, in_app_guides: [] });
    }
  }, [appConfig]);

  const resetNPSEligibility = useCallback(() => {
    if (appConfig) {
      setAppConfig({ ...appConfig, nps_eligible: false });
    }
  }, [appConfig]);

  const resetAnnouncement = useCallback(() => {
    if (appConfig) {
      setAppConfig({ ...appConfig, announcement: null });
    }
  }, [appConfig]);

  const setUser = useCallback(
    async ({ user_id = '', name = '', email = '' }: { user_id: string; name?: string; email?: string }) => {
      if (!user_id) {
        console.error('user_id is required');
      } else {
        await aatlasFetch({
          appKey,
          appSecret,
          url: SET_USER_API,
          body: {
            app_key: appKey,
            user_id,
            name,
            email,
            app_version: Constants.expoConfig?.version,
            platform: Platform.OS,
          },
          scope: 'setUser',
        });
      }
    },
    [appSecret, appKey]
  );

  const getAppConfig = useCallback(async () => {
    const data: AppConfigType = await aatlasFetch({
      appKey,
      appSecret,
      url: ENGAGEMENT_API,
      body: {
        app_key: appKey,
        app_version: Constants.expoConfig?.version,
        platform: Platform.OS,
      },
      scope: 'getAppConfig',
    });

    if (data) {
      if (!isEqual(data, appConfig)) {
        setAppConfig(data);
      }
    }
  }, [appConfig, appSecret, appKey]);

  const sendFeedback = useCallback(
    async ({ message, type, nps_score }: FeedbackType) => {
      await aatlasFetch({
        appKey,
        appSecret,
        url: SEND_FEEDBACK_API,
        body: {
          app_key: appKey,
          message,
          type,
          platform: Platform.OS,
          nps_score,
        },
        scope: `${type}_${sendFeedback}`,
      });
      if (type === 'nps') {
        resetNPSEligibility();
      }
    },
    [appSecret, appKey, resetNPSEligibility]
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

  useEffect(() => {
    const logSession = async () => {
      await aatlasFetch({
        appKey,
        appSecret,
        url: SESSION_API,
        body: {
          app_key: appKey,
          platform: Platform.OS,
        },
        scope: 'logSession',
      });
    };
    logSession();
  }, [appKey, appSecret]);

  const setLastSeen = useCallback(
    async ({ key }: { key: string }) => {
      switch (key) {
        case 'announcement':
          resetAnnouncement();
          break;
        case 'iag_last_seen_mobile':
          resetInAppGuides();
          break;
        default:
          break;
      }

      await aatlasFetch({
        appKey,
        appSecret,
        url: LAST_SEEN_API,
        body: {
          app_key: appKey,
          last_seen_key: key,
        },
        scope: `${key}_setLastSeen`,
      });
    },
    [appSecret, appKey, resetAnnouncement, resetInAppGuides]
  );

  const logPageVisit = useCallback(
    async ({ page }: { page: string }) => {
      await aatlasFetch({
        appKey,
        appSecret,
        url: PAGE_VISIT_API,
        body: {
          app_key: appKey,
          platform: Platform.OS,
          page,
        },
        scope: 'logPageVisit',
      });
    },
    [appSecret, appKey]
  );

  const values = useMemo(
    () => ({
      appConfig,
      setUser,
      sendFeedback,
      setLastSeen,
      logPageVisit,
    }),
    [appConfig, setUser, sendFeedback, setLastSeen, logPageVisit]
  );

  return <AatlasServiceContext.Provider value={values}>{children}</AatlasServiceContext.Provider>;
};
