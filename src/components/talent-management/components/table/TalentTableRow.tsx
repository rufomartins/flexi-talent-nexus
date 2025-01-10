import { MoreHorizontalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { TalentProfile } from "@/types/talent";
import { DatabaseUser } from "@/types/user";

interface TalentTableRowProps {
  talent: TalentProfile;
  user: DatabaseUser;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TalentTableRow: React.FC<TalentTableRowProps> = ({
  talent,
  user,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'under_evaluation':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="border-t border-gray-200">
      <td className="px-4 py-4 text-sm text-gray-900">
        {talent.user_id}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">
        {talent.talent_category}
      </td>
      <td className="px-4 py-4 text-sm text-gray-500">
        {talent.country}
      </td>
      <td className="px-4 py-4 text-sm">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(talent.evaluation_status)}`}>
          {talent.evaluation_status}
        </span>
      </td>
      <td className="px-4 py-4 text-sm text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(talent.id)}>
              Edit
            </DropdownMenuItem>
            {user.role === 'super_admin' && (
              <DropdownMenuItem 
                onClick={() => onDelete(talent.id)}
                className="text-red-600"
              >
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};