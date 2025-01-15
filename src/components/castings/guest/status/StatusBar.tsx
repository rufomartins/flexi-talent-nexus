import { Card, CardHeader, CardTitle } from "@/components/ui/card";

interface StatusBarProps {
  status: {
    total: number;
    selected: number;
    favorites: number;
  };
}

export const StatusBar: React.FC<StatusBarProps> = ({ status }) => {
  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Total Talents</CardTitle>
          <div className="text-2xl font-bold">{status.total}</div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Selected</CardTitle>
          <div className="text-2xl font-bold">{status.selected}</div>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Favorites</CardTitle>
          <div className="text-2xl font-bold">{status.favorites}</div>
        </CardHeader>
      </Card>
    </div>
  );
};