
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { TalentProfile } from "@/types/talent";

// Dummy data for visualization
const dummyTalents: TalentProfile[] = [
  {
    id: "1",
    user_id: "user1",
    talent_category: "UGC",
    country: "United States",
    evaluation_status: "approved",
    is_duo: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: {
      id: "user1",
      full_name: "John Smith",
      avatar_url: "https://i.pravatar.cc/150?img=1"
    },
    native_language: "English",
    experience_level: "Expert",
    casting_talents: [
      {
        id: "ct1",
        casting_id: "casting1",
        castings: { name: "Spring Collection 2024" }
      }
    ]
  },
  {
    id: "2",
    user_id: "user2",
    talent_category: "UGC",
    country: "Spain",
    evaluation_status: "approved",
    is_duo: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: {
      id: "user2",
      full_name: "Maria Rodriguez",
      avatar_url: "https://i.pravatar.cc/150?img=5"
    },
    native_language: "Spanish",
    experience_level: "Intermediate",
    casting_talents: [
      {
        id: "ct2",
        casting_id: "casting1",
        castings: { name: "Spring Collection 2024" }
      },
      {
        id: "ct3",
        casting_id: "casting2",
        castings: { name: "Tech Product Launch" }
      }
    ]
  },
  {
    id: "3",
    user_id: "user3",
    talent_category: "TRANSLATOR",
    country: "Germany",
    evaluation_status: "approved",
    is_duo: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: {
      id: "user3",
      full_name: "Hans Mueller",
      avatar_url: "https://i.pravatar.cc/150?img=8"
    },
    native_language: "German",
    experience_level: "Expert",
    casting_talents: []
  },
  {
    id: "4",
    user_id: "user4",
    talent_category: "UGC",
    country: "Japan",
    evaluation_status: "under_evaluation",
    is_duo: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: {
      id: "user4",
      full_name: "Akira Tanaka",
      avatar_url: "https://i.pravatar.cc/150?img=12"
    },
    native_language: "Japanese",
    experience_level: "Beginner",
    casting_talents: []
  },
  {
    id: "5",
    user_id: "user5",
    talent_category: "VOICE_OVER",
    country: "United Kingdom",
    evaluation_status: "approved",
    is_duo: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: {
      id: "user5",
      full_name: "Emma Williams",
      avatar_url: "https://i.pravatar.cc/150?img=9"
    },
    native_language: "English",
    experience_level: "Expert",
    fee_range: { min: 100, max: 300, currency: "USD" },
    casting_talents: [
      {
        id: "ct4",
        casting_id: "casting3",
        castings: { name: "Voice Acting Project" }
      }
    ]
  },
  {
    id: "6",
    user_id: "user6a",
    talent_category: "UGC",
    country: "Brazil",
    evaluation_status: "approved",
    is_duo: true,
    duo_name: "Silva Duo",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: {
      id: "user6a",
      full_name: "Paulo Silva",
      avatar_url: "https://i.pravatar.cc/150?img=11"
    },
    partner: {
      id: "6b",
      user_id: "user6b",
      users: {
        id: "user6b",
        full_name: "Ana Silva",
        avatar_url: "https://i.pravatar.cc/150?img=10"
      }
    },
    native_language: "Portuguese",
    experience_level: "Advanced",
    casting_talents: [
      {
        id: "ct5",
        casting_id: "casting4",
        castings: { name: "Couple Lifestyle Campaign" }
      }
    ]
  },
  {
    id: "7",
    user_id: "user7",
    talent_category: "REVIEWER",
    country: "France",
    evaluation_status: "approved",
    is_duo: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: {
      id: "user7",
      full_name: "Sophie Dubois",
      avatar_url: "https://i.pravatar.cc/150?img=3"
    },
    native_language: "French",
    experience_level: "Expert",
    casting_talents: []
  },
  {
    id: "8",
    user_id: "user8",
    talent_category: "UGC",
    country: "Italy",
    evaluation_status: "rejected",
    is_duo: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    users: {
      id: "user8",
      full_name: "Marco Rossi",
      avatar_url: "https://i.pravatar.cc/150?img=21"
    },
    native_language: "Italian",
    experience_level: "Intermediate",
    casting_talents: []
  }
];

export function useTalents(castingId?: string) {
  return useQuery<TalentProfile[]>({
    queryKey: ['talents', castingId],
    queryFn: async () => {
      // Try to fetch from the database first
      try {
        const { data, error } = await supabase
          .from('talent_profiles')
          .select(`
            id,
            user_id,
            talent_category,
            country,
            evaluation_status,
            is_duo,
            duo_name,
            created_at,
            updated_at,
            users:user_id (
              id,
              full_name,
              avatar_url
            ),
            casting_talents (
              id,
              casting_id,
              castings (
                name
              )
            ),
            partner:partner_id (
              id,
              user_id,
              users:user_id (
                id,
                full_name,
                avatar_url
              )
            ),
            native_language,
            experience_level,
            fee_range,
            availability,
            category,
            whatsapp_number
          `);

        if (error) {
          console.error('Error loading talents:', error.message);
          throw error;
        }

        // If we have real data, use it
        if (data && data.length > 0) {
          return data.map(talent => ({
            ...talent,
            users: talent.users || { 
              id: talent.user_id,
              full_name: 'Unknown',
              avatar_url: null
            },
            partner: talent.partner ? {
              id: talent.partner.id,
              user_id: talent.partner.user_id,
              users: talent.partner.users || {
                id: talent.partner.user_id,
                full_name: 'Unknown Partner',
                avatar_url: null
              }
            } : null,
            casting_talents: talent.casting_talents || []
          })) as TalentProfile[];
        }
        
        // If no data, return dummy data
        console.log('No talents found in database, returning dummy data');
        return dummyTalents;
      } catch (error) {
        // If there's an error (e.g., table doesn't exist yet), return dummy data
        console.warn('Error fetching talents, using dummy data instead:', error);
        return dummyTalents;
      }
    }
  });
}
