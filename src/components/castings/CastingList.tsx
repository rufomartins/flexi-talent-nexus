import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { CastingCard } from './CastingCard';
import { CastingListControls } from './CastingListControls';
import { Casting, SortOption } from './types';

export default function CastingList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showClosed, setShowClosed] = useState(false);

  const { data: castings, isLoading } = useQuery({
    queryKey: ['castings', search, sortBy, showClosed],
    queryFn: async () => {
      let query = supabase
        .from('castings')
        .select(`
          *,
          client:client_id(full_name),
          project_manager:project_manager_id(full_name)
        `);

      // Apply filters
      if (!showClosed) {
        query = query.eq('status', 'open');
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      // Apply sorting
      switch (sortBy) {
        case 'name':
          query = query.order('name');
          break;
        case 'project_manager':
          query = query.order('project_manager_id');
          break;
        case 'creation_date':
          query = query.order('created_at', { ascending: false });
          break;
        case 'client_remarks':
          // For now, we'll sort by created_at since guest_remarks is not implemented yet
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      
      return data as Casting[];
    }
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* Header Navigation */}
      <div className="flex items-center space-x-2 py-4 text-gray-600">
        <a href="/" className="text-gray-500 hover:text-gray-700">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </a>
        <span className="text-gray-400">/</span>
        <span>Castings</span>
      </div>

      <CastingListControls
        onSearch={setSearch}
        onSortChange={setSortBy}
        onShowClosedChange={setShowClosed}
        sortBy={sortBy}
        showClosed={showClosed}
        onNewCasting={() => navigate('/castings/new')}
      />

      {/* Casting Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading castings...</div>
        ) : castings?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No castings found</div>
        ) : (
          castings?.map((casting) => (
            <CastingCard key={casting.id} casting={casting} />
          ))
        )}
      </div>
    </div>
  );
}