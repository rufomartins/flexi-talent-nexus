import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { ExcelRowData, ValidationError } from "@/utils/excelValidation";
import { PreviewHeader } from "./preview/PreviewHeader";
import { PreviewTable } from "./preview/PreviewTable";
import { PreviewPagination } from "./preview/PreviewPagination";

interface DataPreviewProps {
  data: ExcelRowData[];
  errors: ValidationError[];
  onConfirm: (selectedData: ExcelRowData[]) => void;
  onCancel: () => void;
  isImporting: boolean;
}

export function DataPreview({ data, errors, onConfirm, onCancel, isImporting }: DataPreviewProps) {
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set(data.map((_, i) => i)));
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 50;

  const errorsByRow = errors.reduce((acc, error) => {
    acc[error.row - 2] = error.errors;
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

  return (
    <Card className="p-6 space-y-6">
      <PreviewHeader
        selectedCount={selectedRows.size}
        onCancel={onCancel}
        onConfirm={handleConfirm}
        isImporting={isImporting}
      />

      <PreviewTable
        data={currentData}
        selectedRows={selectedRows}
        startIndex={startIndex}
        errorsByRow={errorsByRow}
        onToggleRow={toggleRow}
        onToggleAll={toggleAll}
      />

      <PreviewPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </Card>
  );
}