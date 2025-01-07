import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectStats } from "@/components/projects/ProjectStats";
import { ProjectSearch } from "@/components/projects/ProjectSearch";
import { ProjectTree } from "@/components/projects/ProjectTree";

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

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Search query:', query);
  };

  const handleFilterClick = () => {
    // TODO: Implement filter panel
    console.log('Filter clicked');
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <ProjectHeader />
      <ProjectStats stats={statsCards} />
      <ProjectSearch onSearch={handleSearch} onFilterClick={handleFilterClick} />
      <ProjectTree projects={projects || []} statusColors={statusColors} />
    </div>
  );
}