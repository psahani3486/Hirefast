export type Recruiter = {
  _id: string;
  name: string;
  email: string;
};

export type Job = {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills?: string[];
  salaryRange?: string;
  status: 'open' | 'closed';
  recruiter?: Recruiter;
  createdAt: string;
};

export type JobListResponse = {
  data: Job[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};
