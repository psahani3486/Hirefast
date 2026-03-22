import { Recruiter } from '@/types/job';

export type Profile = {
  _id: string;
  user: Recruiter;
  headline: string;
  about: string;
  location: string;
  photoUrl: string;
  bannerUrl: string;
  visibility: 'public' | 'connections' | 'private';
  skills: string[];
  experience: Array<{
    title?: string;
    company?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
  }>;
  education: Array<{
    school?: string;
    degree?: string;
    field?: string;
    startYear?: string;
    endYear?: string;
  }>;
};

export type DiscoverProfile = {
  user: Recruiter;
  profile: {
    headline?: string;
    location?: string;
    skills?: string[];
    photoUrl?: string;
  } | null;
  connectionStatus: 'none' | 'pending' | 'accepted' | 'rejected';
};

export type Connection = {
  _id: string;
  requester: Recruiter;
  recipient: Recruiter;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
};

export type ConnectionsBundle = {
  incoming: Connection[];
  outgoing: Connection[];
  accepted: Connection[];
};

export type Post = {
  _id: string;
  author: Recruiter;
  content: string;
  imageUrl: string;
  likes: string[];
  comments: Array<{
    _id: string;
    user: Recruiter;
    text: string;
    createdAt: string;
  }>;
  createdAt: string;
};

export type FeedResponse = {
  data: Post[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export type Notification = {
  _id: string;
  user: string;
  actor?: Recruiter;
  type: 'connection_request' | 'connection_accepted' | 'post_like' | 'post_comment';
  message: string;
  read: boolean;
  createdAt: string;
  post?: { _id: string; content: string };
};
