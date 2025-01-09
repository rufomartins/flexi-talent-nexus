import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface RoleSelectorProps {
  roles: readonly ('translator' | 'reviewer' | 'ugc_talent')[];
  onSelectRole: (role: string) => void;
}

export function RoleSelector({ roles, onSelectRole }: RoleSelectorProps) {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-3">Select Role</h3>
      <div className="space-y-2">
        {Array.from(roles).map((role) => (
          <Button
            key={role}
            variant="outline"
            className="w-full justify-start"
            onClick={() => onSelectRole(role)}
          >
            {role}
          </Button>
        ))}
      </div>
    </Card>
  );
}