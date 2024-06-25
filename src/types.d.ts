type InAppGuideItemType = {
  id: number;
  title: string;
  description: string;
  image: string;
};

type AppConfigType = {
  in_app_guides: InAppGuideItemType[];
  nps_eligible: boolean;
  announcement: {
    title: string;
    message: string;
  } | null;
};

type FeedbackType = {
  message: string;
  type: 'nps' | 'general';
  nps_score?: number;
};

type ConfigType = {
  appConfig: AppConfigType | null;
  setUser: ({ user_id, name, email }: { user_id: string; name?: string; email?: string }) => Promise<void>;
  sendFeedback: (data: FeedbackType) => Promise<void>;
  setLastSeen: ({ key }: { key: string }) => Promise<void>;
  logPageVisit: ({ page }: { page: string }) => Promise<void>;
};

declare module '*.jpg';
