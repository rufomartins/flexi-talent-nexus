
import { useState } from "react";
import { TalentProfileData } from "@/types/talent-profile";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, AlertCircle, FileText, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatDate } from "@/lib/utils";

interface GDPRTabProps {
  talent: TalentProfileData;
}

export const GDPRTab = ({ talent }: GDPRTabProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Simulate GDPR status - this would come from your database
  const gdprStatus = {
    agreed: Math.random() > 0.5, // Randomly show agreed or not for demo
    agreementDate: Math.random() > 0.5 ? new Date().toISOString() : null,
  };

  const handleSendGDPRAgreement = async () => {
    setLoading(true);
    try {
      // Send GDPR agreement email
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      
      toast({
        title: "GDPR Agreement sent",
        description: "The GDPR agreement has been sent to the talent's email.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send GDPR agreement",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">GDPR Compliance</h2>
        <Button 
          variant="outline" 
          disabled={loading} 
          onClick={handleSendGDPRAgreement}
        >
          Send Agreement
        </Button>
      </div>
      
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-6">
          {gdprStatus.agreed ? (
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-medium">
              {gdprStatus.agreed ? "GDPR Agreement Signed" : "GDPR Agreement Required"}
            </h3>
            <p className="text-muted-foreground">
              {gdprStatus.agreed 
                ? `Signed on ${gdprStatus.agreementDate ? formatDate(gdprStatus.agreementDate) : "N/A"}` 
                : "The talent has not yet agreed to the GDPR terms"}
            </p>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Agreement Documents
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
              <span>GDPR Consent Form</span>
              <Button variant="ghost" size="sm" className="gap-1">
                <Download className="h-3 w-3" /> Download
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-2 bg-muted/30 rounded">
              <span>Privacy Policy</span>
              <Button variant="ghost" size="sm" className="gap-1">
                <Download className="h-3 w-3" /> Download
              </Button>
            </div>
          </div>
        </div>
      </Card>
      
      <div className="bg-muted/30 p-4 rounded text-sm">
        <h4 className="font-medium mb-2">About GDPR Compliance</h4>
        <p className="text-muted-foreground">
          The General Data Protection Regulation (GDPR) is a regulation in EU law on data protection 
          and privacy. Talents must agree to our GDPR terms before their information can be used in 
          castings and projects.
        </p>
      </div>
    </div>
  );
};
