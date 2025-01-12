import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CandidateProfileHeaderProps {
  name: string;
}

export function CandidateProfileHeader({ name }: CandidateProfileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
        <p className="text-sm text-muted-foreground">
          Added {new Date().toLocaleDateString()}
        </p>
      </div>
      <Button variant="outline" onClick={() => navigate("/onboarding")}>
        Back to List
      </Button>
    </div>
  );
}