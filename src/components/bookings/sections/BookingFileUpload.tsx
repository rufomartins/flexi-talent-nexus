import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileUp, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BookingFile } from "../types";

interface BookingFileUploadProps {
  files: BookingFile[];
  onFilesChange: (files: BookingFile[]) => void;
}

export function BookingFileUpload({ files, onFilesChange }: BookingFileUploadProps) {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles) return;

    const validFiles = Array.from(newFiles).filter(file => {
      const isValidType = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/png'
      ].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB
      
      if (!isValidType || !isValidSize) {
        toast({
          title: "Invalid file",
          description: `${file.name} is not a valid file. Please upload PDF, DOC, DOCX, JPG, or PNG files under 10MB.`,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    onFilesChange([...files, ...validFiles.map(file => ({ file, progress: 0 }))]);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Files & Documents</h3>
      <div className="border-2 border-dashed rounded-lg p-4">
        <Input
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileUpload}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          <FileUp className="h-8 w-8 text-gray-400" />
          <span className="mt-2 text-sm text-gray-500">
            Click to upload files (PDF, DOC, DOCX, JPG, PNG)
          </span>
        </label>
      </div>
      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li key={index} className="flex items-center justify-between">
              <span className="text-sm">{file.file.name}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  onFilesChange(files.filter((_, i) => i !== index));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}