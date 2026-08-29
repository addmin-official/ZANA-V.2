import React, { useEffect, useState } from 'react';
import { fetchNextBestAction, NextBestAction } from '../api/studyService.ts';
import { NextBestActionCard } from '../components/dashboard/NextBestActionCard.tsx';

interface StudentDashboardProps {
  onNavigate?: (routeOrTab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const [nba, setNba] = useState<NextBestAction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pilot constraints: Grade 12 Chemistry
  const pilotGrade = 12;
  const pilotSubject = 'chemistry';

  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError(null);
        const action = await fetchNextBestAction(pilotGrade, pilotSubject);
        if (isMounted) setNba(action);
      } catch (err) {
        console.error('[Dashboard Error]', err);
        if (isMounted) setError('هەڵەیەک ڕوویدا لە هێنانەدی پلانەکەت. تکایە دووبارە هەوڵبدەرەوە.'); // Error fetching plan
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadDashboard();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleStartLearning = (topicId: string) => {
    // Route into the active learning/tutor session loop
    if (onNavigate) {
      onNavigate(`chat:${topicId}`);
    } else if (typeof window !== 'undefined') {
      window.location.hash = `#/tutor/${pilotSubject}/${topicId}`;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8" dir="rtl">
      <header className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">سڵاو، بەخێربێیتەوە</h1>
        <p className="text-slate-500 mt-2">ئامادەی بۆ بەردەوامبوون لە فێربوون؟</p>
      </header>

      <main>
        <section className="mb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-4">هەنگاوی داهاتوو</h2>

          {loading ? (
            <div className="animate-pulse bg-slate-100 h-32 rounded-2xl w-full border border-slate-200" />
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">{error}</div>
          ) : nba ? (
            <NextBestActionCard action={nba} onActionClick={handleStartLearning} />
          ) : (
            <div className="bg-slate-50 text-slate-600 p-6 rounded-xl border border-slate-100 text-center">
              زانیاری نەدۆزرایەوە.
            </div>
          )}
        </section>

        {/* Existing dashboard components (Mastery overview, recent activity) remain below */}
      </main>
    </div>
  );
};
