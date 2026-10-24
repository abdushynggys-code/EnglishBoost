import { useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { useLearning } from '../lib/learningContext';
import { PageLoading } from '../components/PageLoading';

export function DemoPage() {
  const { exploreDemo, loading } = useLearning();
  const [, navigate] = useLocation();
  const started = useRef(false);
  useEffect(() => {
    if (loading || started.current) return;
    started.current = true;
    void exploreDemo().then(() => navigate('/course', { replace: true }));
  }, [exploreDemo, navigate, loading]);
  return <PageLoading />;
}
