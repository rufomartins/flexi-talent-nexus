import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Download, Search, ChevronDown, MoreVertical } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const statsCards = [
  { title: "Active Tasks", value: 12 },
  { title: "Completion Percentage", value: 45 },
  { title: "Upcoming Deadlines", value: 8 },
];

const statusColors = {
  script: {
    Approved: "bg-green-100 text-green-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Pending: "bg-gray-100 text-gray-800",
  },
  translation: {
    Approved: "bg-green-100 text-green-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Pending: "bg-gray-100 text-gray-800",
  },
  review: {
    "Internal Review": "bg-yellow-100 text-yellow-800",
    "Client Review": "bg-purple-100 text-purple-800",
    Approved: "bg-green-100 text-green-800",
  },
  talent: {
    Booked: "bg-blue-100 text-blue-800",
    Shooting: "bg-yellow-100 text-yellow-800",
    Delivered: "bg-green-100 text-green-800",
    Reshoot: "bg-amber-100 text-amber-800",
    Approved: "bg-green-100 text-green-800",
  },
  delivery: {
    Pending: "bg-gray-100 text-gray-800",
    Delivered: "bg-green-100 text-green-800",
    "R Pending": "bg-amber-100 text-amber-800",
  },
};

// Dummy data for preview
const dummyProjects = [
  {
    id: 1,
    name: "Global Marketing Campaign 2024",
    countries: [
      {
        id: 1,
        name: "United States",
        languages: [
          {
            id: 1,
            name: "English",
            tasks: [
              {
                id: 1,
                name: "Product Launch Video",
                script_status: "Approved",
                translation_status: "In Progress",
                review_status: "Internal Review",
                talent_status: "Booked",
                delivery_status: "Pending",
              },
              {
                id: 2,
                name: "Brand Story",
                script_status: "In Progress",
                translation_status: "Pending",
                review_status: "Internal Review",
                talent_status: "Booked",
                delivery_status: "Pending",
              },
            ],
          },
        ],
      },
      {
        id: 2,
        name: "Germany",
        languages: [
          {
            id: 2,
            name: "German",
            tasks: [
              {
                id: 3,
                name: "Product Launch Video",
                script_status: "Pending",
                translation_status: "Pending",
                review_status: "Internal Review",
                talent_status: "Booked",
                delivery_status: "Pending",
              },
            ],
          },
        ],
      },
    ],
  },
];

export default function Projects() {
  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      // For preview, return dummy data
      return dummyProjects;
    },
  });

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Projects</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {statsCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-lg border p-4 shadow-sm"
          >
            <div className="text-sm text-gray-500">{stat.title}</div>
            <div className="text-2xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm">
          Filters
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Project Tree */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
          <div className="col-span-3">Name</div>
          <div className="col-span-2">Script</div>
          <div className="col-span-2">Translation</div>
          <div className="col-span-1">Review</div>
          <div className="col-span-2">Talent</div>
          <div className="col-span-1">Delivery</div>
          <div className="col-span-1">Actions</div>
        </div>

        {/* Project Rows */}
        <div className="divide-y">
          {projects?.map((project) => (
            <div
              key={project.id}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-50"
            >
              <div className="col-span-3 font-medium">{project.name}</div>
              <div className="col-span-2">
                <span className={cn("px-2 py-1 rounded-full text-xs", statusColors.script.Pending)}>
                  Pending
                </span>
              </div>
              <div className="col-span-2">
                <span className={cn("px-2 py-1 rounded-full text-xs", statusColors.translation.Pending)}>
                  Pending
                </span>
              </div>
              <div className="col-span-1">
                <span className={cn("px-2 py-1 rounded-full text-xs", statusColors.review["Internal Review"])}>
                  Internal Review
                </span>
              </div>
              <div className="col-span-2">
                <span className={cn("px-2 py-1 rounded-full text-xs", statusColors.talent.Booked)}>
                  Booked
                </span>
              </div>
              <div className="col-span-1">
                <span className={cn("px-2 py-1 rounded-full text-xs", statusColors.delivery.Pending)}>
                  Pending
                </span>
              </div>
              <div className="col-span-1">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}