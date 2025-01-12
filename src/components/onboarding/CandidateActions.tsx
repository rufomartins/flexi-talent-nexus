import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Mail, Calendar, MoreHorizontal, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InterviewSchedulerDialog } from "./interview/InterviewSchedulerDialog";
import { EmailAndSmsComposer } from "./communication/EmailAndSmsComposer";

interface CandidateActionsProps {
  candidateId: string;
  candidateName: string;
  email?: string;
  phone?: string;
}

export function CandidateActions({ 
  candidateId,
  candidateName,
  email,
  phone,
}: CandidateActionsProps) {
  const navigate = useNavigate();
  const [showScheduler, setShowScheduler] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => navigate(`/onboarding/${candidateId}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowCommunication(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Send Email/SMS
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowScheduler(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Interview
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InterviewSchedulerDialog
        open={showScheduler}
        onOpenChange={setShowScheduler}
        candidateId={candidateId}
        candidateName={candidateName}
      />

      <EmailAndSmsComposer
        open={showCommunication}
        onOpenChange={setShowCommunication}
        candidateId={candidateId}
        candidateName={candidateName}
        email={email}
        phone={phone}
      />
    </>
  );
}