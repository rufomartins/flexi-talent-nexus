import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface TalentTableHeaderProps {
  onSort: (column: string) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
}

export const TalentTableHeader: React.FC<TalentTableHeaderProps> = ({
  onSort,
  sortColumn,
  sortDirection,
}) => {
  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? 
      <ArrowUpIcon className="w-4 h-4 ml-1" /> : 
      <ArrowDownIcon className="w-4 h-4 ml-1" />;
  };

  const handleSort = (column: string) => {
    onSort(column);
  };

  return (
    <thead className="bg-gray-50">
      <tr>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
          <button 
            onClick={() => handleSort('name')}
            className="flex items-center hover:text-gray-700"
          >
            Name {renderSortIcon('name')}
          </button>
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
          <button 
            onClick={() => handleSort('category')}
            className="flex items-center hover:text-gray-700"
          >
            Category {renderSortIcon('category')}
          </button>
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
          <button 
            onClick={() => handleSort('country')}
            className="flex items-center hover:text-gray-700"
          >
            Country {renderSortIcon('country')}
          </button>
        </th>
        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
          <button 
            onClick={() => handleSort('status')}
            className="flex items-center hover:text-gray-700"
          >
            Status {renderSortIcon('status')}
          </button>
        </th>
        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
          Actions
        </th>
      </tr>
    </thead>
  );
};