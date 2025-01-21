import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ExcelRowData, ValidationError } from "@/utils/excelValidation";

interface DataPreviewProps {
  data: ExcelRowData[];
  errors: ValidationError[];
  onConfirm: (selectedData: ExcelRowData[]) => void;
  onCancel: () => void;
}

export function DataPreview({ data, errors, onConfirm, onCancel }: DataPreviewProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set(data.map((_, i) => i)));
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const errorsByRow = errors.reduce((acc, error) => {
    acc[error.row - 2] = error.errors; // -2 to account for header and 0-based index
    return acc;
  }, {} as Record<number, Record<string, string>>);

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const toggleRow = (index: number) => {
    const actualIndex = startIndex + index;
    const newSelected = new Set(selectedRows);
    if (newSelected.has(actualIndex)) {
      newSelected.delete(actualIndex);
    } else {
      newSelected.add(actualIndex);
    }
    setSelectedRows(newSelected);
  };

  const toggleAll = () => {
    const pageIndices = currentData.map((_, i) => startIndex + i);
    const allSelected = pageIndices.every(i => selectedRows.has(i));
    
    const newSelected = new Set(selectedRows);
    pageIndices.forEach(i => {
      if (allSelected) {
        newSelected.delete(i);
      } else {
        newSelected.add(i);
      }
    });
    setSelectedRows(newSelected);
  };

  const handleConfirm = () => {
    const selectedData = data.filter((_, i) => selectedRows.has(i));
    onConfirm(selectedData);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      items.push(
        <PaginationItem key="start">
          <PaginationLink onClick={() => setCurrentPage(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (start > 2) {
        items.push(
          <PaginationItem key="start-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            isActive={currentPage === i}
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        items.push(
          <PaginationItem key="end-ellipsis">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      items.push(
        <PaginationItem key="end">
          <PaginationLink onClick={() => setCurrentPage(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Preview Data</h2>
        <div className="space-x-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Import ({selectedRows.size} rows)
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={currentData.length > 0 && currentData.every((_, i) => 
                    selectedRows.has(startIndex + i)
                  )}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Full Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Followers</TableHead>
              <TableHead>Following</TableHead>
              <TableHead>Profile URL</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.map((row, index) => {
              const actualIndex = startIndex + index;
              const rowErrors = errorsByRow[actualIndex];
              const hasErrors = !!rowErrors;

              return (
                <TableRow 
                  key={index}
                  className={hasErrors ? "bg-destructive/10" : undefined}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRows.has(actualIndex)}
                      onCheckedChange={() => toggleRow(index)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span>{row.full_name}</span>
                      {rowErrors?.full_name && (
                        <p className="text-xs text-destructive">
                          {rowErrors.full_name}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span>{row.public_email}</span>
                      {rowErrors?.public_email && (
                        <p className="text-xs text-destructive">
                          {rowErrors.public_email}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{row.public_phone}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.followers_count}</TableCell>
                  <TableCell>{row.following_count}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <span>{row.profile_url}</span>
                      {rowErrors?.profile_url && (
                        <p className="text-xs text-destructive">
                          {rowErrors.profile_url}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {hasErrors ? (
                      <span className="text-destructive font-medium">Error</span>
                    ) : (
                      <span className="text-muted-foreground">Ready</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Card>
  );
}