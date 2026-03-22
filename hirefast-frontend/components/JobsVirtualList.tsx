'use client';

import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import JobCard from '@/components/JobCard';
import { Job } from '@/types/job';

type Props = {
  jobs: Job[];
};

const Row = ({ index, style, data }: ListChildComponentProps<Job[]>) => {
  const job = data[index];
  return (
    <div style={{ ...style, paddingBottom: '1rem' }}>
      <JobCard job={job} />
    </div>
  );
};

export default function JobsVirtualList({ jobs }: Props) {
  const height = Math.min(700, Math.max(360, jobs.length * 145));

  return (
    <List height={height} width="100%" itemCount={jobs.length} itemSize={145} itemData={jobs}>
      {Row}
    </List>
  );
}
