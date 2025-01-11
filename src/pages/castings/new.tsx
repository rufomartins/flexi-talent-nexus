import React from 'react';
import { CastingCreationWizard } from '@/components/castings/create/CastingCreationWizard';

export default function NewCastingPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Casting</h1>
      <CastingCreationWizard />
    </div>
  );
}