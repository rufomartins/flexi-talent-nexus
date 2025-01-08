import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { TableBody } from "@/components/ui/table";
import { Shot } from "@/types/shot-list";
import { ShotTableRow } from "./ShotTableRow";

interface ShotListProps {
  shots: Shot[];
  onDragEnd: (result: any) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  isDeleting: boolean;
}

export function ShotList({ shots, onDragEnd, onEdit, onDelete, isDeleting }: ShotListProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="shots">
        {(provided) => (
          <TableBody
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {shots?.map((shot, index) => (
              <Draggable
                key={shot.id}
                draggableId={shot.id}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ShotTableRow
                      shot={shot}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      isDeleting={isDeleting}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            {!shots?.length && (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground p-4">
                  No shots added yet
                </td>
              </tr>
            )}
          </TableBody>
        )}
      </Droppable>
    </DragDropContext>
  );
}