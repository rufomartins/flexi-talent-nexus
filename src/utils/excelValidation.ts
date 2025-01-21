import { z } from "zod";

// Define the schema for a single row of Excel data
export const excelRowSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  public_email: z.string().email("Invalid email format").optional().nullable(),
  public_phone: z.string().optional().nullable(),
  followers_count: z.string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), "Followers count must be a valid number")
    .optional()
    .nullable(),
  following_count: z.string()
    .transform((val) => parseInt(val))
    .refine((val) => !isNaN(val), "Following count must be a valid number")
    .optional()
    .nullable(),
  profile_url: z.string().url("Invalid profile URL").optional().nullable(),
  external_url: z.string().url("Invalid external URL").optional().nullable(),
  biography: z.string().optional().nullable(),
  username: z.string().min(1, "Username is required"),
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