import { z } from "zod";

// Define the schema for a single row of Excel data
export const excelRowSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional().nullable(),
  language: z.string().min(1, "Language is required"),
  native_language: z.string().min(1, "Native language is required"),
  source: z.string().optional().nullable(),
  remarks: z.string().optional().nullable(),
});

export type ExcelRowData = z.infer<typeof excelRowSchema>;

export interface ValidationError {
  row: number;
  errors: Record<string, string>;
  rawData: Record<string, any>;
}

export const validateExcelData = (
  data: Record<string, any>[],
): { validRows: ExcelRowData[]; errors: ValidationError[] } => {
  const validRows: ExcelRowData[] = [];
  const errors: ValidationError[] = [];

  data.forEach((row, index) => {
    const result = excelRowSchema.safeParse(row);
    
    if (result.success) {
      validRows.push(result.data);
    } else {
      errors.push({
        row: index + 2, // Add 2 to account for header row and 0-based index
        errors: result.error.errors.reduce((acc, err) => ({
          ...acc,
          [err.path[0]]: err.message,
        }), {}),
        rawData: row,
      });
    }
  });

  return { validRows, errors };
};