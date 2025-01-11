import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import { BookingProjectDetails } from "./sections/BookingProjectDetails";
import { BookingDateSelection } from "./sections/BookingDateSelection";
import { BookingFeeSection } from "./sections/BookingFeeSection";
import { FileUploadSection } from "./sections/FileUploadSection";
import { BookingDialogFooter } from "./BookingDialogFooter";
import { AvailabilityWarning } from "./AvailabilityWarning";
import { BookingFormData, BookingFile, bookingFormSchema } from "./types";
import { TalentAvailability } from "@/utils/availability";
import { useBookingMutation } from "@/hooks/useBookingMutation";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  talentId: string;
}

export function BookingDialog({ open, onOpenChange, talentId }: BookingDialogProps) {
  const [uploadedFiles, setUploadedFiles] = useState<BookingFile[]>([]);
  const [availability, setAvailability] = useState<TalentAvailability | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      talent_fee: 0,
      final_fee: 0,
    },
  });

  const { createBooking, isLoading } = useBookingMutation(talentId, () => onOpenChange(false));

  const handleAvailabilityChange = (newAvailability: TalentAvailability) => {
    setAvailability(newAvailability);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (availability && !availability.is_available && !showWarning) {
      setShowWarning(true);
      return;
    }
    
    const booking = await createBooking(data);

    if (uploadedFiles.length > 0) {
      for (const file of uploadedFiles) {
        const filePath = `bookings/${booking.id}/${file.file.name}`;
        const { error: uploadError } = await supabase.storage
          .from("booking-files")
          .upload(filePath, file.file);

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          continue;
        }

        await supabase.from("booking_files").insert({
          booking_id: booking.id,
          file_path: filePath,
          file_name: file.file.name,
          file_type: file.file.type,
          file_size: file.file.size,
          uploaded_by: (await supabase.auth.getUser()).data.user?.id,
        });
      }
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Create New Booking</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 overflow-y-auto">
              <BookingProjectDetails form={form} />
              <Separator />
              <BookingDateSelection 
                form={form} 
                talentId={talentId}
                onAvailabilityChange={handleAvailabilityChange}
              />
              <Separator />
              <BookingFeeSection form={form} />
              <Separator />
              <FileUploadSection
                files={uploadedFiles}
                onFilesChange={setUploadedFiles}
              />

              <BookingDialogFooter 
                onCancel={() => onOpenChange(false)}
                isSubmitting={isLoading}
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {availability && !availability.is_available && (
        <AvailabilityWarning
          conflicts={availability.conflicting_bookings || []}
          onProceed={() => {
            setShowWarning(false);
            form.handleSubmit(onSubmit)();
          }}
          onCancel={() => setShowWarning(false)}
          open={showWarning}
        />
      )}
    </>
  );
}