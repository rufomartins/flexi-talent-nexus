import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ShotTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[100px]">Shot #</TableHead>
        <TableHead>Location</TableHead>
        <TableHead>Description</TableHead>
        <TableHead>Frame Type</TableHead>
        <TableHead>Status</TableHead>
        <TableHead>Notes</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}