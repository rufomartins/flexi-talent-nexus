import { z } from "zod";

// Define the schema for a single row of Excel data
export const excelRowSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
  phone: z.string().optional(),
  language: z.string().optional(),
  native_language: z.string().optional(),
  source: z.string().optional(),
  remarks: z.string().optional(),
}).transform(data => {
  // If full_name is provided, split it into first_name and last_name
  if (data.full_name) {
    const [firstName, ...lastNameParts] = data.full_name.split(' ');
    if (!data.first_name) data.first_name = firstName;
    if (!data.last_name) data.last_name = lastNameParts.join(' ');
  }
  return data;
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
    // Handle potential "Full Name" column
    if (row["Full Name"] && !row["First Name"]) {
      const [firstName, ...lastNameParts] = row["Full Name"].split(' ');
      row["First Name"] = firstName;
      row["Last Name"] = lastNameParts.join(' ');
    }

    // Map common variations of field names
    const normalizedRow = {
      first_name: row["First Name"] || row["FirstName"] || row["first_name"],
      last_name: row["Last Name"] || row["LastName"] || row["last_name"],
      email: row["Email"] || row["email"],
      phone: row["Phone"] || row["Phone Number"] || row["phone"],
      language: row["Language"] || row["language"],
      native_language: row["Native Language"] || row["native_language"],
      source: row["Source"] || row["source"],
      remarks: row["Remarks"] || row["remarks"],
    };

    const result = excelRowSchema.safeParse(normalizedRow);
    
    if (result.success) {
      validRows.push(result.data);
    } else {
      // Only include actual validation errors, not missing optional fields
      const validationErrors = result.error.errors.reduce((acc, err) => {
        // Only include required field errors
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