import React from 'react';
import { Loader } from 'lucide-react';
import { useCastingForm } from './CastingFormContext';

export function CastingFormActions() {
  const { isSubmitting } = useCastingForm();

  return (
    <div className="flex justify-end space-x-4 pt-6">
      <button
        type="button"
        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
        onClick={() => window.history.back()}
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center disabled:opacity-50"
      >
        {isSubmitting ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Creating...
          </>
        ) : (
          <span className="flex items-center">
            <span className="mr-1">+</span> Save
          </span>
        )}
      </button>
    </div>
  );
}