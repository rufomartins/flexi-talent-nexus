import { ProjectItem } from "@/components/projects/types";
import { ItemCard } from "./ItemCard";

interface ItemListProps {
  items: ProjectItem[];
  groupBy: 'status' | 'country' | 'language' | 'type';
  onItemClick: (itemId: string) => void;
}

export function ItemList({ items, groupBy, onItemClick }: ItemListProps) {
  const groupedItems = items.reduce((acc, item) => {
    const key = item[groupBy] || 'Unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item);
    return acc;
  }, {} as Record<string, ProjectItem[]>);

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([group, groupItems]) => (
        <div key={group} className="space-y-4">
          <h3 className="font-medium text-lg capitalize">{group}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupItems.map((item) => (
              <div key={item.id} onClick={() => onItemClick(item.id)}>
                <ItemCard
                  item={item}
                  onStatusChange={() => {}}
                  onAssignTalent={() => {}}
                  onAssignReviewer={() => {}}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}