import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';

// Update the type definitions to match the database schema
type CastingType = 'internal' | 'external';
type CastingStatus = 'open' | 'closed';

interface CastingClient {
  full_name: string | null;
}

interface Casting {
  id: string;
  name: string;
  type: CastingType;
  status: CastingStatus;
  logo_url: string | null;
  client_id: string | null;
  client?: CastingClient | null;
  _count?: {
    talents: number;
    guest_remarks: number;
  };
}

const CastingList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [showClosed, setShowClosed] = useState(false);

  const { data: castings, isLoading } = useQuery({
    queryKey: ['castings', search, sortBy, showClosed],
    queryFn: async () => {
      let query = supabase
        .from('castings')
        .select(`
          *,
          client:client_id(full_name)
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
        case 'pm':
          query = query.order('project_manager_id');
          break;
        case 'date':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Transform the data to match our Casting type
      return (data as any[]).map(casting => ({
        id: casting.id,
        name: casting.name,
        type: casting.type,
        status: casting.status,
        logo_url: casting.logo_url,
        client_id: casting.client_id,
        client: casting.client,
        _count: {
          talents: 0, // We'll need to add this count from the database
          guest_remarks: 0 // We'll need to add this count from the database
        }
      })) as Casting[];
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

      {/* Search and Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="pm">Project Manager</SelectItem>
              <SelectItem value="date">Creation date</SelectItem>
              <SelectItem value="remarks">Client remarks</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="showClosed" 
              checked={showClosed}
              onCheckedChange={(checked) => setShowClosed(checked as boolean)}
            />
            <label htmlFor="showClosed" className="text-sm text-gray-600">
              Show closed
            </label>
          </div>
          
          <Button onClick={() => navigate('/castings/new')}>
            + New casting
          </Button>
        </div>
      </div>

      {/* Casting Cards */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading castings...</div>
        ) : castings?.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No castings found</div>
        ) : (
          castings?.map((casting) => (
            <div key={casting.id} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex">
                <div className="w-24 h-24 flex-shrink-0">
                  {casting.logo_url ? (
                    <img 
                      src={casting.logo_url} 
                      alt={casting.name} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No logo</span>
                    </div>
                  )}
                </div>
                <div className="ml-6 flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {casting.name}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        {casting.type === 'internal' ? 'Internal' : 'External'} Casting
                      </p>
                    </div>
                    {casting.client && (
                      <div className="text-sm text-gray-600">
                        Client: {casting.client.full_name}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 mt-4">
                    <span className="inline-flex items-center space-x-1 text-sm">
                      <span className={`w-2 h-2 rounded-full ${
                        casting.status === 'open' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span>{casting.status === 'open' ? 'Open' : 'Closed'}</span>
                    </span>
                    <span className="text-sm text-gray-600">
                      {casting._count?.talents || 0} Talents
                    </span>
                    <span className="inline-flex items-center space-x-1 text-sm">
                      <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                      <span>{casting._count?.guest_remarks || 0} Guest remarks</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CastingList;