import { Badge } from "@/components/ui/badge";

interface CandidateStageIndicatorProps {
  stage: 'ingest' | 'process' | 'screening' | 'results';
}

export function CandidateStageIndicator({ stage }: CandidateStageIndicatorProps) {
  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'ingest':
        return 'bg-blue-100 text-blue-800';
      case 'process':
        return 'bg-yellow-100 text-yellow-800';
      case 'screening':
        return 'bg-purple-100 text-purple-800';
      case 'results':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Badge className={`${getStageColor(stage)} capitalize`}>
      {stage}
    </Badge>
  );
}