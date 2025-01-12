import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, Mail, Calendar, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InterviewScheduler } from "./InterviewScheduler";

interface CandidateActionsProps {
  candidateId: string;
  candidateName: string;
  onEmailClick?: () => void;
}

export function CandidateActions({ 
  candidateId,
  candidateName,
  onEmailClick,
}: CandidateActionsProps) {
  const navigate = useNavigate();
  const [showScheduler, setShowScheduler] = useState(false);

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
          <DropdownMenuItem onClick={onEmailClick}>
            <Mail className="mr-2 h-4 w-4" />
            Send Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowScheduler(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Interview
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <InterviewScheduler
        open={showScheduler}
        onOpenChange={setShowScheduler}
        candidateId={candidateId}
        candidateName={candidateName}
      />
    </>
  );
}