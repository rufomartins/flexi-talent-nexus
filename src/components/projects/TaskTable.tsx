import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProjectFilters } from "@/hooks/useProjectFilters";
import { SortableHeader } from "./components/SortableHeader";
import { FilterForm } from "./components/FilterForm";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { useState } from "react";

interface Task {
  id: string;
  name: string;
  language: string;
  translationStatus: string;
  reviewStatus: string;
  talentStatus: string;
  created_at: string;
}

interface TaskTableProps {
  tasks: Task[];
}

export function TaskTable({ tasks }: TaskTableProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { filters, sortConfig, updateFilters, resetFilters, updateSort } = useProjectFilters();

  const filteredAndSortedTasks = tasks
    .filter(task => {
      if (filters.language && task.language !== filters.language) return false;
      if (filters.translationStatus && task.translationStatus !== filters.translationStatus) return false;
      if (filters.reviewStatus && task.reviewStatus !== filters.reviewStatus) return false;
      if (filters.talentStatus && task.talentStatus !== filters.talentStatus) return false;
      if (filters.dateRange.start && new Date(task.created_at) < filters.dateRange.start) return false;
      if (filters.dateRange.end && new Date(task.created_at) > filters.dateRange.end) return false;
      return true;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.column as keyof Task];
      const bValue = b[sortConfig.column as keyof Task];
      const modifier = sortConfig.direction === 'asc' ? 1 : -1;
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * modifier;
      }
      return 0;
    });

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </DialogTrigger>
          <DialogContent>
            <FilterForm
              filters={filters}
              onUpdateFilters={updateFilters}
              onReset={resetFilters}
              onClose={() => setIsFilterOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <SortableHeader
                column="name"
                label="Task Name"
                sortConfig={sortConfig}
                onSort={updateSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="language"
                label="Language"
                sortConfig={sortConfig}
                onSort={updateSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="translationStatus"
                label="Translation Status"
                sortConfig={sortConfig}
                onSort={updateSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="reviewStatus"
                label="Review Status"
                sortConfig={sortConfig}
                onSort={updateSort}
              />
            </TableHead>
            <TableHead>
              <SortableHeader
                column="talentStatus"
                label="Talent Status"
                sortConfig={sortConfig}
                onSort={updateSort}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredAndSortedTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.name}</TableCell>
              <TableCell>{task.language}</TableCell>
              <TableCell>{task.translationStatus}</TableCell>
              <TableCell>{task.reviewStatus}</TableCell>
              <TableCell>{task.talentStatus}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}