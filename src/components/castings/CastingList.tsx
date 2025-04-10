
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CastingCard } from './CastingCard';
import { CastingListControls } from './CastingListControls';
import { Casting, SortOption } from './types';

// Dummy castings data
const DUMMY_CASTINGS: Casting[] = [
  {
    id: "1",
    name: "Wolt Finland UGC Campaign",
    description: "Looking for food delivery talents for UGC campaign",
    status: 'open',
    logo_url: "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Wolt_logo.svg/1200px-Wolt_logo.svg.png",
    talent_count: 12,
    guest_remarks_count: 4,
    created_at: "2025-03-15T10:00:00Z",
    updated_at: "2025-03-20T14:30:00Z",
    client: { id: "c1", full_name: "Wolt Finland" },
    project_manager: { id: "pm1", full_name: "Maria Johnson" }
  },
  {
    id: "2",
    name: "Nike Running Shoes Campaign",
    description: "Seeking athletic talents for new running shoes promotion",
    status: 'open',
    logo_url: "https://cdn.iconscout.com/icon/free/png-256/free-nike-1-202653.png",
    talent_count: 8,
    guest_remarks_count: 2,
    created_at: "2025-03-18T09:15:00Z",
    updated_at: "2025-03-21T11:20:00Z",
    client: { id: "c2", full_name: "Nike Europe" },
    project_manager: { id: "pm2", full_name: "John Smith" }
  },
  {
    id: "3",
    name: "Royal Match Game Promo",
    description: "Looking for gamers to promote Royal Match mobile game",
    status: 'open',
    talent_count: 5,
    guest_remarks_count: 0,
    created_at: "2025-03-22T14:45:00Z",
    updated_at: "2025-03-22T14:45:00Z",
    client: { id: "c3", full_name: "Dream Games" },
    project_manager: { id: "pm1", full_name: "Maria Johnson" }
  },
  {
    id: "4",
    name: "Spotify Podcast Campaign",
    description: "Seeking voice talents for podcast promotions",
    status: 'closed',
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Spotify_icon.svg/232px-Spotify_icon.svg.png",
    talent_count: 15,
    guest_remarks_count: 8,
    created_at: "2025-02-10T08:30:00Z",
    updated_at: "2025-03-01T16:45:00Z",
    client: { id: "c4", full_name: "Spotify" },
    project_manager: { id: "pm3", full_name: "Alex Brown" }
  }
];

export default function CastingList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('name');
  const [showClosed, setShowClosed] = useState(false);
  const [filteredCastings, setFilteredCastings] = useState<Casting[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Filter and sort castings based on current state
    let filtered = [...DUMMY_CASTINGS];
    
    if (!showClosed) {
      filtered = filtered.filter(casting => casting.status === 'open');
    }
    
    if (search) {
      const lowerSearch = search.toLowerCase();
      filtered = filtered.filter(casting => 
        casting.name.toLowerCase().includes(lowerSearch) || 
        casting.description?.toLowerCase().includes(lowerSearch) ||
        casting.client?.full_name.toLowerCase().includes(lowerSearch)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'project_manager':
          return (a.project_manager?.full_name || '').localeCompare(b.project_manager?.full_name || '');
        case 'creation_date':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'client_remarks':
          return (b.guest_remarks_count || 0) - (a.guest_remarks_count || 0);
        default:
          return 0;
      }
    });
    
    setFilteredCastings(filtered);
  }, [search, sortBy, showClosed]);

  return (
    <div className="w-full max-w-7xl mx-auto">
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
        ) : filteredCastings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No castings found</div>
        ) : (
          filteredCastings.map((casting) => (
            <CastingCard key={casting.id} casting={casting} />
          ))
        )}
      </div>
    </div>
  );
}
