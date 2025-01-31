import { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { validateExcelData, type ValidationError, type ExcelRowData } from "@/utils/excelValidation";
import { DataPreview } from "./DataPreview";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useQueryClient } from "@tanstack/react-query";

interface ExcelParserProps {
  file: File;
  onValidDataReceived: (data: ExcelRowData[]) => void;
  onError: (error: string) => void;
}

export const ExcelParser = ({ file, onValidDataReceived, onError }: ExcelParserProps) => {
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [parsedData, setParsedData] = useState<ExcelRowData[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const parseExcel = async () => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const { validRows, errors } = validateExcelData(jsonData);
      setParsedData(validRows);
      
      if (errors.length > 0) {
        setValidationErrors(errors);
        toast({
          title: "Validation Warnings",
          description: `Found ${errors.length} rows with validation issues. You can still proceed with valid data.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Validation Success",
          description: "All rows passed validation successfully.",
          variant: "default",
        });
      }
      
      setShowPreview(true);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      onError("Failed to parse Excel file. Please ensure it's in the correct format.");
    }
  };

  const handleConfirmImport = async (selectedData: ExcelRowData[]) => {
    if (selectedData.length === 0) {
      toast({
        title: "No Data Selected",
        description: "Please select at least one row to import.",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      type CandidateInsert = Database["public"]["Tables"]["onboarding_candidates"]["Insert"];
      
      const candidatesToInsert: CandidateInsert[] = selectedData.map(row => ({
        name: `${row.first_name || ''} ${row.last_name || ''}`.trim(),
        first_name: row.first_name || null,
        last_name: row.last_name || null,
        email: row.email,
        phone: row.phone || null,
        language: row.language || null,
        source: row.source || 'excel_import',
        remarks: row.remarks || null,
        status: 'new',
        stage: 'ingest'
      }));

      const { error } = await supabase
        .from('onboarding_candidates')
        .insert(candidatesToInsert);

      if (error) throw error;

      // Invalidate the candidates query to refresh the listing
      await queryClient.invalidateQueries({ queryKey: ['onboarding-candidates'] });

      onValidDataReceived(selectedData);
      setShowPreview(false);
      toast({
        title: "Success",
        description: `Successfully imported ${selectedData.length} candidates.`,
      });
    } catch (error) {
      console.error('Error importing candidates:', error);
      toast({
        title: "Error",
        description: "Failed to import candidates. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
    }
  };

  const downloadErrorReport = () => {
    if (validationErrors.length === 0) {
      toast({
        title: "No Errors",
        description: "There are no validation errors to report.",
      });
      return;
    }

    const errorRows = validationErrors.map(({ row, errors, rawData }) => ({
      Row: row,
      ...rawData,
      Errors: Object.entries(errors)
        .map(([field, error]) => `${field}: ${error}`)
        .join("; "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(errorRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Validation Errors");
    
    XLSX.writeFile(workbook, "validation-errors.xlsx");
  };

  if (showPreview) {
    return (
      <DataPreview
        data={parsedData}
        errors={validationErrors}
        onConfirm={handleConfirmImport}
        onCancel={() => setShowPreview(false)}
        isImporting={isImporting}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Button onClick={() => parseExcel()}>
        Parse Excel File
      </Button>

      {validationErrors.length > 0 && (
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Validation Warnings</h3>
              <Button variant="outline" onClick={downloadErrorReport}>
                Download Warning Report
              </Button>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-2">
              {validationErrors.map(({ row, errors }, index) => (
                <div key={index} className="p-2 bg-yellow-50 rounded-md">
                  <p className="font-medium">Row {row}:</p>
                  <ul className="list-disc list-inside">
                    {Object.entries(errors).map(([field, error]) => (
                      <li key={field} className="text-sm text-yellow-700">
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