import { useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface User {
  id: string;
  full_name: string;
  role: string;
}

interface AssignmentSectionProps {
  form: any;
  roleType: 'translator' | 'reviewer' | 'ugc_talent';
  label: string;
}

export function AssignmentSection({ form, roleType, label }: AssignmentSectionProps) {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users', roleType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, role')
        .eq('role', roleType);
      
      if (error) throw error;
      return data as User[];
    }
  });

  return (
    <FormField
      control={form.control}
      name={`${roleType}Id`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={isLoading}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {users?.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormItem>
      )}
    />
  );
}