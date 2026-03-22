'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { useAiJobRecommendations, useScoreResumeAgainstJobs } from '@/hooks/useAi';

export default function AiMatchPage() {
  const [resumeText, setResumeText] = useState('');

  const recQuery = useAiJobRecommendations();
  const scoreMutation = useScoreResumeAgainstJobs();

  const submit = (event: FormEvent) => {
    event.preventDefault();
    scoreMutation.mutate(resumeText);
  };

  return (
    <section className="grid" style={{ gap: '1rem' }}>
      <h1 style={{ margin: 0 }}>AI Job Match</h1>

      <form className="card grid" onSubmit={submit}>
        <textarea
          className="input"
          rows={8}
          placeholder="Paste your resume text here"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          required
        />
        <button className="btn btn-primary" type="submit" disabled={scoreMutation.isPending}>
          {scoreMutation.isPending ? 'Scoring...' : 'Score Resume Against Jobs'}
        </button>
      </form>

      <div className="card grid">
        <h3 style={{ margin: 0 }}>AI Recommendations From Profile</h3>
        {recQuery.data?.map((item) => (
          <p key={item.job._id} style={{ margin: '0.3rem 0' }}>
            <Link href={`/jobs/${item.job._id}`}>{item.job.title}</Link> - {item.aiMatchScore}% ({item.rationale})
          </p>
        ))}
      </div>

      {scoreMutation.data ? (
        <div className="card grid">
          <h3 style={{ margin: 0 }}>Resume Match Results</h3>
          {scoreMutation.data.map((item) => (
            <p key={item.job._id} style={{ margin: '0.3rem 0' }}>
              <Link href={`/jobs/${item.job._id}`}>{item.job.title}</Link> - {item.aiMatchScore}% ({item.rationale})
            </p>
          ))}
        </div>
      ) : null}
    </section>
  );
}
