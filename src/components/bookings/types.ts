export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingFile {
  file: File;
  progress?: number;
}

export interface BookingFormData {
  project_details: string;
  start_date: Date;
  end_date: Date;
  talent_fee: number;
  final_fee: number;
  email_template_id?: string;
}

export const bookingFormSchema = z.object({
  project_details: z.string().min(1, "Project details are required"),
  start_date: z.date(),
  end_date: z.date(),
  talent_fee: z.number().min(0),
  final_fee: z.number().min(0),
  email_template_id: z.string().optional(),
});