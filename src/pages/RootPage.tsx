import { Redirect } from 'wouter';
﻿import { lazy, Suspense } from 'react';
import { useLearning } from '../lib/learningContext';
import { LandingPage } from './LandingPage';
import { PageLoading } from '../components/PageLoading';

const Dashboard = lazy(() => import('./HomePage').then((module) => ({ default: module.HomePage })));
export function RootPage() {
  const { session, preview, loading, profile } = useLearning();
  if (loading) return <PageLoading />;
  if(profile?.role==='tutor'&&!preview)return <Redirect to="/tutor" replace/>;
  if (!session && !preview) return <LandingPage />;
  return <Suspense fallback={<PageLoading />}><Dashboard /></Suspense>;
}
