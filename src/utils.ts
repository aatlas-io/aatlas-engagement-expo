import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

import { ANONYMOUS_USER_ID_KEY } from './constants';

export const getAnonymousUserId = async (): Promise<string> => {
  let value = await AsyncStorage.getItem(ANONYMOUS_USER_ID_KEY);
  if (!value) {
    value = uuid.v4() as string;
    await AsyncStorage.setItem(ANONYMOUS_USER_ID_KEY, value);
  }

  return value;
};

export const aatlasFetch = async ({
  appKey,
  appSecret,
  url,
  body,
  scope,
}: {
  appKey: string;
  appSecret: string;
  url: string;
  body: object;
  scope: string;
}) => {
  try {
    const anonymous_user_id = await getAnonymousUserId();
    if (!appKey || !appSecret) {
      throw new Error('@aatlas/engagement app is not initialized. Please follow the documentation');
    }

    if (!anonymous_user_id) {
      throw new Error('Organization user does not exist');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'x-app-secret': appSecret,
      },
      body: JSON.stringify({ ...body, anonymous_user_id }),
    });

    const json = await response.json();

    if (!response.ok) {
      throw new Error(JSON.stringify(json));
    }

    return json;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${scope} failed: `, error.message);
    } else {
      console.error(`${scope} failed: `, error);
    }
    return null;
  }
};
