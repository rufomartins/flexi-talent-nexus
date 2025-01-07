import { TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function TalentNoteTableHeader() {
  return (
    <TableHeader>
      <TableRow>
        <TableHead>Shot Reference</TableHead>
        <TableHead>Instructions</TableHead>
        <TableHead>Required Props</TableHead>
        <TableHead>Additional Notes</TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}