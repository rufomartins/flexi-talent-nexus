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
                    <span>{row.full_name}</span>
                    {rowErrors?.full_name && (
                      <p className="text-xs text-destructive">{rowErrors.full_name}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <span>{row.public_email}</span>
                    {rowErrors?.public_email && (
                      <p className="text-xs text-destructive">{rowErrors.public_email}</p>
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
                      <p className="text-xs text-destructive">{rowErrors.profile_url}</p>
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
  );
}