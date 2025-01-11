import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Download, Eye } from "lucide-react";
import { format } from "date-fns";

interface FileSectionProps {
  bookingId: string;
  files: {
    id: string;
    file_name: string;
    file_type: string;
    file_path: string;
    created_at: string;
  }[];
}

export function FileSection({ bookingId, files }: FileSectionProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Files & Documents</CardTitle>
        <Button size="sm">
          <FileUp className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      </CardHeader>
      <CardContent>
        {files.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No files uploaded yet
          </p>
        ) : (
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 rounded-lg border"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.file_name}</p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {format(new Date(file.created_at), "MMM d, yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}