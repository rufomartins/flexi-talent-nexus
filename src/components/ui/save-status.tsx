import { formatDistanceToNow } from "date-fns";

interface SaveStatusProps {
  saving: boolean;
  lastSaved: Date | null;
  className?: string;
}

export const SaveStatus = ({ saving, lastSaved, className = "" }: SaveStatusProps) => {
  return (
    <div className={`text-sm text-gray-500 ${className}`}>
      {saving ? (
        'Saving...'
      ) : lastSaved ? (
        `Last saved ${formatDistanceToNow(lastSaved)} ago`
      ) : null}
    </div>
  );
};