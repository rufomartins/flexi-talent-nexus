import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ExcelRowData, ValidationError } from "@/utils/excelValidation";

interface PreviewTableProps {
  data: ExcelRowData[];
  selectedRows: Set<number>;
  startIndex: number;
  errorsByRow: Record<number, Record<string, string>>;
  onToggleRow: (index: number) => void;
  onToggleAll: () => void;
}

export function PreviewTable({
  data,
  selectedRows,
  startIndex,
  errorsByRow,
  onToggleRow,
  onToggleAll,
}: PreviewTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={data.length > 0 && data.every((_, i) => selectedRows.has(startIndex + i))}
                onCheckedChange={onToggleAll}
              />
            </TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Native Language</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => {
            const actualIndex = startIndex + index;
            const rowErrors = errorsByRow[actualIndex];
            const hasErrors = !!rowErrors;

            return (
              <TableRow key={index} className={hasErrors ? "bg-destructive/10" : undefined}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(actualIndex)}
                    onCheckedChange={() => onToggleRow(index)}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <span>{row.first_name}</span>
                    {rowErrors?.first_name && (
                      <p className="text-xs text-destructive">{rowErrors.first_name}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <span>{row.last_name}</span>
                    {rowErrors?.last_name && (
                      <p className="text-xs text-destructive">{rowErrors.last_name}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <span>{row.email}</span>
                    {rowErrors?.email && (
                      <p className="text-xs text-destructive">{rowErrors.email}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{row.phone}</TableCell>
                <TableCell>{row.language}</TableCell>
                <TableCell>{row.native_language}</TableCell>
                <TableCell>{row.source}</TableCell>
                <TableCell>{row.remarks}</TableCell>
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
  );
}