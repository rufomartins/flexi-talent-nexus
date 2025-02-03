import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { InterviewSchedulerDialog } from "./interview/InterviewSchedulerDialog";
import { EmailAndSmsComposer } from "./communication/EmailAndSmsComposer";
import type { CandidateActionsProps } from "@/types/onboarding";

export function CandidateActions({ 
  candidateId,
  candidateName,
  email,
  phone,
  stage,
}: CandidateActionsProps) {
  const navigate = useNavigate();
  const [showScheduler, setShowScheduler] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);

  const getStageActions = () => {
    switch (stage) {
      case 'ingest':
        return [
          <DropdownMenuItem key="move" onClick={() => console.log('Move to Process')}>
            Move to Process
          </DropdownMenuItem>,
          <DropdownMenuItem key="remove" onClick={() => console.log('Remove')}>
            Remove
          </DropdownMenuItem>
        ];
      case 'process':
        return [
          <DropdownMenuItem key="update" onClick={() => console.log('Update')}>
            Update
          </DropdownMenuItem>,
          <DropdownMenuItem key="contact" onClick={() => setShowCommunication(true)}>
            Contact
          </DropdownMenuItem>,
          <DropdownMenuItem key="remove" onClick={() => console.log('Remove')}>
            Remove
          </DropdownMenuItem>
        ];
      case 'screening':
        return [
          <DropdownMenuItem key="archive" onClick={() => console.log('Move to Archive')}>
            Move to Archive
          </DropdownMenuItem>,
          <DropdownMenuItem key="remove" onClick={() => console.log('Remove')}>
            Remove
          </DropdownMenuItem>
        ];
      case 'results':
        return [
          <DropdownMenuItem key="talents" onClick={() => console.log('Move to Talents')}>
            Move to Talents
          </DropdownMenuItem>,
          <DropdownMenuItem key="archive" onClick={() => console.log('Move to Archive')}>
            Move to Archive
          </DropdownMenuItem>,
          <DropdownMenuItem key="remove" onClick={() => console.log('Remove')}>
            Remove
          </DropdownMenuItem>
        ];
      default:
        return [];
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => navigate(`/onboarding/${candidateId}`)}>
            <Eye className="mr-2 h-4 w-4" />
            View Profile
          </DropdownMenuItem>
          {getStageActions()}
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
        selectedCandidates={[{
          id: candidateId,
          name: candidateName,
          email,
          phone
        }]}
        candidateId={candidateId}
        candidateName={candidateName}
        email={email}
        phone={phone}
      />
    </>
  );
}
