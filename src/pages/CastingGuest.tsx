import React, { Suspense } from 'react';
import { ErrorBoundary } from '@/components/error-boundary/ErrorBoundary';
import { TalentGridSkeleton } from '@/components/loading/LoadingStates';
import { GuestLanding } from '@/components/castings/guest/GuestLanding';

const CastingGuestPage: React.FC = () => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<TalentGridSkeleton />}>
        <GuestLanding />
      </Suspense>
    </ErrorBoundary>
  );
};

export default CastingGuestPage;