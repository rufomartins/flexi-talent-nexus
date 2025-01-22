import { cn } from "@/lib/utils";

interface FilterSectionProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

export function FilterSection({ label, children, className }: FilterSectionProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}