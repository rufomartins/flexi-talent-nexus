import { Card } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";

interface BasicInformationProps {
  email: string;
  phone?: string;
  scout?: {
    full_name: string;
  };
}

export function BasicInformation({ email, phone, scout }: BasicInformationProps) {
  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">Basic Information</h2>
      
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span>{email}</span>
        </div>
        {phone && (
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{phone}</span>
          </div>
        )}
        {scout && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Scout:</span>
            <span>{scout.full_name}</span>
          </div>
        )}
      </div>
    </Card>
  );
}