import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { UserTable } from "@/components/users/UserTable";
import { Plus, Users as UsersIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Users = () => {
  const { user, userDetails } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAddingUser, setIsAddingUser] = useState(false);

  // Fetch users based on role and company
  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      let query = supabase.from("users").select("*");
      
      // If not super admin, only show users from same company
      if (userDetails?.role !== "super_admin") {
        query = query.eq("company_id", userDetails?.company_id);
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          title: "Error fetching users",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }
      
      return data;
    },
  });

  // Check if user has permission to access this page
  useEffect(() => {
    if (userDetails && userDetails.role !== "super_admin" && userDetails.role !== "admin") {
      toast({
        title: "Access denied",
        description: "You don't have permission to view this page",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [userDetails, navigate, toast]);

  if (!userDetails || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UsersIcon className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Manage Users</h1>
        </div>
        <Button onClick={() => setIsAddingUser(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="bg-card rounded-lg shadow-card">
        <UserTable users={users || []} />
      </div>
    </div>
  );
};

export default Users;