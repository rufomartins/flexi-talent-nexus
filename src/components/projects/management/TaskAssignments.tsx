import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export function TaskAssignments() {
  const tasks = [
    {
      id: "1",
      name: "Product Demo Translation",
      assignee: "John Doe",
      status: "In Progress",
      priority: "High",
      dueDate: "2024-03-20",
    },
    {
      id: "2",
      name: "Marketing Video Review",
      assignee: "Jane Smith",
      status: "Pending Review",
      priority: "Medium",
      dueDate: "2024-03-22",
    },
    {
      id: "3",
      name: "Tutorial Voice-over",
      assignee: "Mike Johnson",
      status: "Completed",
      priority: "Low",
      dueDate: "2024-03-18",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Pending Review":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Task Name</TableHead>
            <TableHead>Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell className="font-medium">{task.name}</TableCell>
              <TableCell>{task.assignee}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(task.status)} variant="secondary">
                  {task.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(task.priority)} variant="secondary">
                  {task.priority}
                </Badge>
              </TableCell>
              <TableCell>{task.dueDate}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}