import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

import { BookingProjectDetails } from "./sections/BookingProjectDetails";
import { BookingDateSelection } from "./sections/BookingDateSelection";
import { BookingFeeSection } from "./sections/BookingFeeSection";
import { FileUploadSection } from "./sections/FileUploadSection";
import { AvailabilityWarning } from "./AvailabilityWarning";
import { BookingFormData, BookingFile, bookingFormSchema } from "./types";
import { TalentAvailability } from "@/utils/availability";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  talentId: string;
}

export function BookingDialog({ open, onOpenChange, talentId }: BookingDialogProps) {
  const [uploadedFiles, setUploadedFiles] = useState<BookingFile[]>([]);
  const [availability, setAvailability] = useState<TalentAvailability | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      talent_fee: 0,
      final_fee: 0,
    },
  });

  const createBooking = useMutation({
    mutationFn: async (data: BookingFormData) => {
      const bookingData = {
        status: 'pending' as const,
        start_date: format(data.start_date, "yyyy-MM-dd"),
        end_date: format(data.end_date, "yyyy-MM-dd"),
        talent_fee: data.talent_fee,
        final_fee: data.final_fee,
        details: data.project_details,
        created_by: (await supabase.auth.getUser()).data.user?.id,
        talent_id: talentId,
      };

      const { data: booking, error } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;

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

      return booking;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Booking created successfully",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Error creating booking:", error);
      toast({
        title: "Error",
        description: "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  const handleAvailabilityChange = (newAvailability: TalentAvailability) => {
    setAvailability(newAvailability);
  };

  const onSubmit = async (data: BookingFormData) => {
    if (availability && !availability.is_available && !showWarning) {
      setShowWarning(true);
      return;
    }
    
    await createBooking.mutateAsync(data);
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

              <div className="flex justify-end space-x-2 sticky bottom-0 bg-white p-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createBooking.isPending}
                >
                  {createBooking.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Booking"
                  )}
                </Button>
              </div>
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