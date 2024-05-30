type InAppGuideItemType = {
  id: number;
  title: string;
  description: string;
  image: string;
};

type AppConfigType = {
  in_app_guides: InAppGuideItemType[];
};

type InAppGuidesStatus = {
  seen: number[];
  notSeen: number[];
};

type ConfigType = {
  appConfig: AppConfigType | null;
  setUser: ({
    user_id,
    name,
    email,
  }: {
    user_id?: string;
    name?: string;
    email?: string;
  }) => void;
  updateInAppGuidesSeenStatus: (data: InAppGuidesStatus) => Promise<null>;
  resetInAppGuides: () => void;
};

type RenderItemType = {
  item: {
    title: string;
    image: string;
    description: string;
  };
};

type GlobalDataType = {
  appId: number;
  appSecret: string;
  anonymousUserId: string;
};

type AppDataType = {
  appId: number;
  appSecret: string;
};

type GlobalDataReturnType = {
  getGlobalData: () => GlobalDataType;
  setAppData: (data: AppDataType) => void;
  getAnonymousUserId: () => Promise<string>;
};

declare module '*.jpg';