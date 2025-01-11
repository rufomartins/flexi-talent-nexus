import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingFile } from "../types";

interface FileListProps {
  files: BookingFile[];
  onRemove: (index: number) => void;
}

export function FileList({ files, onRemove }: FileListProps) {
  return (
    <ul className="space-y-2">
      {files.map((file, index) => (
        <li key={index} className="flex items-center justify-between">
          <span className="text-sm">{file.file.name}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        </li>
      ))}
    </ul>
  );
}