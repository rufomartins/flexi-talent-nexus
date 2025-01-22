import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'

export function useEquipment(shotListId: string) {
  return useQuery({
    queryKey: ['equipment', shotListId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipment')
        .select('*')
        .eq('shot_list_id', shotListId)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })
}