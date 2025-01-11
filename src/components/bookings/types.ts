import { z } from "zod";

export const bookingFormSchema = z.object({
  project_name: z.string().min(1, "Project name is required"),
  project_details: z.string().min(1, "Project details are required"),
  start_date: z.date(),
  end_date: z.date(),
  talent_fee: z.number().min(0, "Fee must be a positive number"),
  final_fee: z.number().min(0, "Final fee must be a positive number"),
  email_template_id: z.string().min(1, "Email template is required"),
  preview: z.boolean().default(false),
  talent_email: z.string().email("Invalid email address"),
  talent_name: z.string().min(1, "Talent name is required"),
});

export type BookingFormData = z.infer<typeof bookingFormSchema>;

export interface BookingFile {
  file: File;
  progress: number;
}