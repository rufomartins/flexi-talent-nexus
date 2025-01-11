import { FileUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { validateFile } from "@/services/fileValidation";
import { BookingFile } from "../types";
import { FileList } from "./FileList";

interface FileUploadSectionProps {
  files: BookingFile[];
  onFilesChange: (files: BookingFile[]) => void;
}

export function FileUploadSection({ files, onFilesChange }: FileUploadSectionProps) {
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = event.target.files;
    if (!newFiles) return;

    const validFiles = Array.from(newFiles).filter(file => {
      const validation = validateFile(file);
      
      if (!validation.isValid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        return false;
      }
      return true;
    });

    onFilesChange([...files, ...validFiles.map(file => ({ file, progress: 0 }))]);
  };

  const handleRemoveFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index));
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
        <FileList files={files} onRemove={handleRemoveFile} />
      )}
    </div>
  );
}