import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MoreVertical, Copy, Trash, Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import type { ShareLink } from "../../types";

interface ShareLinksListProps {
  castingId: string;
}

const TableSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="h-8 w-full" />
    <Skeleton className="h-20 w-full" />
  </div>
);

export const ShareLinksList: React.FC<ShareLinksListProps> = ({ castingId }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: shareLinks, isLoading } = useQuery({
    queryKey: ['share-links', castingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('share_links')
        .select(`
          *,
          casting:castings (name),
          guest:casting_guests (full_name)
        `)
        .eq('casting_id', castingId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ShareLink[];
    }
  });

  const { mutate: revokeLink } = useMutation({
    mutationFn: async (linkId: string) => {
      const { error } = await supabase
        .from('share_links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['share-links', castingId]);
      toast({
        title: "Success",
        description: "Share link revoked",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to revoke share link",
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return <TableSkeleton />;
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Created</TableHead>
            <TableHead>Expires</TableHead>
            <TableHead>Access</TableHead>
            <TableHead>Comments</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shareLinks?.map((link) => (
            <TableRow key={link.id}>
              <TableCell>
                {format(new Date(link.created_at), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {format(new Date(link.expires_at), 'MMM d, yyyy')}
                  {new Date(link.expires_at) < new Date() && (
                    <Badge variant="destructive">Expired</Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {link.readonly ? (
                  <Badge variant="secondary">Read Only</Badge>
                ) : (
                  <Badge>Full Access</Badge>
                )}
              </TableCell>
              <TableCell>
                {link.allow_comments ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <X className="w-4 h-4 text-gray-400" />
                )}
              </TableCell>
              <TableCell>
                {new Date(link.expires_at) < new Date() ? (
                  <Badge variant="destructive">Expired</Badge>
                ) : (
                  <Badge variant="default">Active</Badge>
                )}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/share/${link.token}`
                        );
                        toast({
                          title: "Success",
                          description: "Link copied to clipboard"
                        });
                      }}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => {
                        if (confirm('Are you sure you want to revoke this link?')) {
                          revokeLink(link.id);
                        }
                      }}
                    >
                      <Trash className="w-4 h-4 mr-2" />
                      Revoke Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
          {shareLinks?.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No share links created yet
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};