import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { validateExcelData, type ValidationError, type ExcelRowData } from "@/utils/excelValidation";

interface ExcelParserProps {
  file: File;
  onValidDataReceived: (data: ExcelRowData[]) => void;
  onError: (error: string) => void;
}

export const ExcelParser = ({ file, onValidDataReceived, onError }: ExcelParserProps) => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const { toast } = useToast();

  const parseExcel = async () => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const { validRows, errors } = validateExcelData(jsonData);

      if (errors.length > 0) {
        setValidationErrors(errors);
        toast({
          title: "Validation Errors",
          description: `Found ${errors.length} rows with errors. Please review and fix the issues.`,
          variant: "destructive",
        });
      } else {
        onValidDataReceived(validRows);
        toast({
          title: "Success",
          description: `Successfully parsed ${validRows.length} rows of data.`,
        });
      }
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      onError("Failed to parse Excel file. Please ensure it's in the correct format.");
    }
  };

  const downloadErrorReport = () => {
    if (validationErrors.length === 0) return;

    const errorRows = validationErrors.map(({ row, errors, rawData }) => ({
      Row: row,
      ...rawData,
      Errors: Object.values(errors).join("; "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(errorRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Validation Errors");
    
    XLSX.writeFile(workbook, "validation-errors.xlsx");
  };

  return (
    <div className="space-y-4">
      <Button onClick={() => parseExcel()}>
        Parse Excel File
      </Button>

      {validationErrors.length > 0 && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Validation Errors</h3>
              <Button variant="outline" onClick={downloadErrorReport}>
                Download Error Report
              </Button>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {validationErrors.map(({ row, errors }, index) => (
                <div key={index} className="p-2 bg-destructive/10 rounded-md">
                  <p className="font-medium">Row {row}:</p>
                  <ul className="list-disc list-inside">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field} className="text-sm text-destructive">
                        {field}: {error}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};