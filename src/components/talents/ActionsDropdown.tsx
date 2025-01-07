import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Plus, Mail, Pause, Trash2 } from "lucide-react";

interface Action {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  onClick: () => void;
  disabled?: boolean;
  requiresSelection?: boolean;
}

interface ActionsDropdownProps {
  selectedItems: string[];
  onAction: (actionId: string) => void;
}

const actions: Action[] = [
  {
    id: 'add-to-casting',
    label: 'Add to Casting',
    icon: Plus,
    onClick: () => {},
    requiresSelection: true
  },
  {
    id: 'email-talents',
    label: 'Email Talents',
    icon: Mail,
    onClick: () => {},
    requiresSelection: true
  },
  {
    id: 'on-hold',
    label: 'On Hold',
    icon: Pause,
    onClick: () => {},
    requiresSelection: true
  },
  {
    id: 'delete',
    label: 'Delete',
    icon: Trash2,
    onClick: () => {},
    requiresSelection: true
  }
];

export const ActionsDropdown = ({ selectedItems, onAction }: ActionsDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          Actions
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {actions.map((action) => (
          <DropdownMenuItem
            key={action.id}
            onClick={() => onAction(action.id)}
            disabled={action.requiresSelection && selectedItems.length === 0}
            className="gap-2"
          >
            <action.icon className="h-4 w-4" />
            {action.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};