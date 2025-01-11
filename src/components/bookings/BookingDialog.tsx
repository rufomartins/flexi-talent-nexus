import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2, Mail } from "lucide-react";
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
import { BookingFileUpload } from "./sections/BookingFileUpload";
import { BookingEmailPreview } from "./sections/BookingEmailPreview";
import { BookingFormData, BookingFile, bookingFormSchema } from "./types";

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  talentId: string;
}

export function BookingDialog({ open, onOpenChange, talentId }: BookingDialogProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<BookingFile[]>([]);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      preview: false,
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
        email_template_id: data.email_template_id,
        created_by: (await supabase.auth.getUser()).data.user?.id,
      };

      const { data: booking, error } = await supabase
        .from("bookings")
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;

      // Send confirmation email
      const { error: emailError } = await supabase.functions.invoke('handle-booking-email', {
        body: {
          emailData: {
            template_id: data.email_template_id,
            recipient: {
              email: data.talent_email,
              name: data.talent_name,
            },
            booking: {
              projectName: data.project_name,
              startDate: format(data.start_date, "yyyy-MM-dd"),
              endDate: format(data.end_date, "yyyy-MM-dd"),
              details: data.project_details,
              fee: data.talent_fee,
            },
          },
        },
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        toast({
          title: "Warning",
          description: "Booking created but email notification failed",
          variant: "destructive",
        });
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

  const onSubmit = async (data: BookingFormData) => {
    if (isPreviewMode) {
      setIsPreviewMode(false);
      return;
    }

    await createBooking.mutateAsync(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Create New Booking</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1 overflow-y-auto">
            <BookingProjectDetails form={form} />
            <Separator />
            <BookingDateSelection form={form} />
            <Separator />
            <BookingFeeSection form={form} />
            <Separator />
            <BookingFileUpload
              files={uploadedFiles}
              onFilesChange={setUploadedFiles}
            />
            <Separator />
            <BookingEmailPreview form={form} />

            <div className="flex justify-end space-x-2 sticky bottom-0 bg-white p-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPreviewMode(true)}
                disabled={createBooking.isPending}
              >
                <Mail className="mr-2 h-4 w-4" />
                Preview Email
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
  );
}