import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  onAddTalent: () => void;
}

export const DashboardHeader = ({ onAddTalent }: DashboardHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Button onClick={onAddTalent}>
        Add new talent
      </Button>
    </div>
  );
};