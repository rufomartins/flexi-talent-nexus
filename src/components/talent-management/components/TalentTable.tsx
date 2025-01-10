import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TalentTableHeader } from "./table/TalentTableHeader";
import { TalentTableRow } from "./table/TalentTableRow";
import { TalentProfile } from "@/types/talent";
import { DatabaseUser } from "@/types/user";

interface TalentTableProps {
  talents: TalentProfile[];
  user: DatabaseUser;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export const TalentTable: React.FC<TalentTableProps> = ({
  talents,
  user,
  onEdit,
  onDelete,
  isLoading = false
}) => {
  const [sortColumn, setSortColumn] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedTalents = [...talents].sort((a, b) => {
    const aValue = a[sortColumn as keyof TalentProfile];
    const bValue = b[sortColumn as keyof TalentProfile];
    
    if (aValue === null) return 1;
    if (bValue === null) return -1;
    
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  if (isLoading) {
    return (
      <Card>
        <div className="p-8 text-center text-gray-500">
          Loading talents...
        </div>
      </Card>
    );
  }

  if (talents.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center text-gray-500">
          No talents found.
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="border rounded-md overflow-hidden">
        <table className="w-full">
          <TalentTableHeader
            onSort={handleSort}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
          />
          <tbody>
            {sortedTalents.map((talent) => (
              <TalentTableRow
                key={talent.id}
                talent={talent}
                user={user}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};