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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SUPPORTED_LANGUAGES } from "@/utils/languages";

interface PreviewTableProps {
  data: ExcelRowData[];
  selectedRows: Set<number>;
  startIndex: number;
  errorsByRow: Record<number, Record<string, string>>;
  onToggleRow: (index: number) => void;
  onToggleAll: () => void;
  onUpdateRow?: (index: number, field: string, value: string) => void;
  isEditable?: boolean;
}

export function PreviewTable({
  data,
  selectedRows,
  startIndex,
  errorsByRow,
  onToggleRow,
  onToggleAll,
  onUpdateRow,
  isEditable = false,
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
                    {isEditable ? (
                      <Input
                        value={row.first_name || ''}
                        onChange={(e) => onUpdateRow?.(index, 'first_name', e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <span>{row.first_name}</span>
                    )}
                    {rowErrors?.first_name && (
                      <p className="text-xs text-destructive">{rowErrors.first_name}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {isEditable ? (
                      <Input
                        value={row.last_name || ''}
                        onChange={(e) => onUpdateRow?.(index, 'last_name', e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <span>{row.last_name}</span>
                    )}
                    {rowErrors?.last_name && (
                      <p className="text-xs text-destructive">{rowErrors.last_name}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    {isEditable ? (
                      <Input
                        value={row.email || ''}
                        onChange={(e) => onUpdateRow?.(index, 'email', e.target.value)}
                        className="w-full"
                      />
                    ) : (
                      <span>{row.email}</span>
                    )}
                    {rowErrors?.email && (
                      <p className="text-xs text-destructive">{rowErrors.email}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {isEditable ? (
                    <Input
                      value={row.phone || ''}
                      onChange={(e) => onUpdateRow?.(index, 'phone', e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <span>{row.phone}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditable ? (
                    <Select
                      value={row.language || ''}
                      onValueChange={(value) => onUpdateRow?.(index, 'language', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_LANGUAGES.map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {lang}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span>{row.language}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditable ? (
                    <Input
                      value={row.source || ''}
                      onChange={(e) => onUpdateRow?.(index, 'source', e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <span>{row.source}</span>
                  )}
                </TableCell>
                <TableCell>
                  {isEditable ? (
                    <Input
                      value={row.remarks || ''}
                      onChange={(e) => onUpdateRow?.(index, 'remarks', e.target.value)}
                      className="w-full"
                    />
                  ) : (
                    <span>{row.remarks}</span>
                  )}
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