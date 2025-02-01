import { z } from "zod";
import { SUPPORTED_LANGUAGES } from "./languages";

export const excelRowSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  language: z.string().optional(),
  source: z.string().optional(),
  remarks: z.string().optional(),
}).transform(data => {
  const transformedData = { ...data };
  
  // Handle "Full Name" column if it exists
  const rawData = data as Record<string, any>;
  if (rawData["Full Name"] && (!transformedData.first_name || !transformedData.last_name)) {
    const nameParts = rawData["Full Name"].trim().split(/\s+/);
    if (nameParts.length > 0) {
      if (!transformedData.first_name) {
        transformedData.first_name = nameParts[0];
      }
      if (!transformedData.last_name && nameParts.length > 1) {
        transformedData.last_name = nameParts.slice(1).join(' ');
      }
    }
  }
  
  return transformedData;
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
    // Map common variations of field names
    const normalizedRow = {
      first_name: row["First Name"] || row["FirstName"] || row["first_name"],
      last_name: row["Last Name"] || row["LastName"] || row["last_name"],
      email: row["Email"] || row["email"],
      phone: row["Phone"] || row["Phone Number"] || row["phone"],
      language: row["Language"] || row["language"],
      source: row["Source"] || row["source"],
      remarks: row["Remarks"] || row["remarks"],
      "Full Name": row["Full Name"] || row["FullName"] || row["full_name"],
    };

    const result = excelRowSchema.safeParse(normalizedRow);
    
    if (result.success) {
      validRows.push(result.data);
    } else {
      // Only include actual validation errors, not missing optional fields
      const validationErrors = result.error.errors.reduce((acc, err) => {
        // Only include required field errors or format errors
        if (err.message !== "Required") {
          acc[err.path[0]] = err.message;
        }
        return acc;
      }, {} as Record<string, string>);

      if (Object.keys(validationErrors).length > 0) {
        errors.push({
          row: index + 2, // Add 2 to account for header row and 0-based index
          errors: validationErrors,
          rawData: row,
        });
      } else {
        // If there are no actual validation errors, include the row as valid
        validRows.push(normalizedRow as ExcelRowData);
      }
    }
  });

  return { validRows, errors };
};