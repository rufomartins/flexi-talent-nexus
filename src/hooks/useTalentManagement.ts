import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import type { TalentProfile, TalentCategory } from '@/types/talent-management'

interface BulkActionParams {
  ids: string[]
  value?: string
}

export function useTalentManagement() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const bulkApproveMutation = useMutation({
    mutationFn: async ({ ids }: BulkActionParams) => {
      const { error } = await supabase
        .from('talent_profiles')
        .update({ evaluation_status: 'APPROVED' })
        .in('id', ids)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talents'] })
      toast({
        title: 'Success',
        description: 'Talents approved successfully',
      })
    },
  })

  const bulkUpdateCategoryMutation = useMutation({
    mutationFn: async ({ ids, value }: BulkActionParams) => {
      if (!value) throw new Error('Category is required')
      
      const { error } = await supabase
        .from('talent_profiles')
        .update({ talent_category: value })
        .in('id', ids)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talents'] })
      toast({
        title: 'Success',
        description: 'Categories updated successfully',
      })
    },
  })

  const bulkUpdateStatusMutation = useMutation({
    mutationFn: async ({ ids, value }: BulkActionParams) => {
      if (!value) throw new Error('Status is required')
      
      const { error } = await supabase
        .from('talent_profiles')
        .update({ evaluation_status: value })
        .in('id', ids)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talents'] })
      toast({
        title: 'Success',
        description: 'Status updated successfully',
      })
    },
  })

  const bulkAssignAgentMutation = useMutation({
    mutationFn: async ({ ids, value }: BulkActionParams) => {
      if (!value) throw new Error('Agent ID is required')
      
      const { error } = await supabase
        .from('talent_profiles')
        .update({ agent_id: value })
        .in('id', ids)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['talents'] })
      toast({
        title: 'Success',
        description: 'Agent assigned successfully',
      })
    },
  })

  const handleBulkAction = async (action: string, value?: string) => {
    try {
      switch (action) {
        case 'approve':
          await bulkApproveMutation.mutateAsync({ ids: selectedIds })
          break
        case 'updateCategory':
          await bulkUpdateCategoryMutation.mutateAsync({ ids: selectedIds, value })
          break
        case 'updateStatus':
          await bulkUpdateStatusMutation.mutateAsync({ ids: selectedIds, value })
          break
        case 'assignAgent':
          await bulkAssignAgentMutation.mutateAsync({ ids: selectedIds, value })
          break
        default:
          throw new Error('Invalid action')
      }
      setSelectedIds([])
    } catch (error) {
      console.error('Bulk action failed:', error)
      toast({
        title: 'Error',
        description: 'Failed to perform bulk action',
        variant: 'destructive',
      })
    }
  }

  return {
    selectedIds,
    setSelectedIds,
    handleBulkAction,
    isLoading: 
      bulkApproveMutation.isPending || 
      bulkUpdateCategoryMutation.isPending || 
      bulkUpdateStatusMutation.isPending || 
      bulkAssignAgentMutation.isPending
  }
}