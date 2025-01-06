import { Search, Bell, ChevronDown, Menu } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const stats = [
    {
      title: "New registrations",
      value: "2",
      subtext: "last 30 days",
      trend: "+200%",
    },
    {
      title: "Number of active castings",
      value: "2",
      subtext: "active castings",
      trend: "0%",
    },
    {
      title: "Recent talent activities",
      value: "3",
      subtext: "last 30 days",
      trend: "+300%",
    },
    {
      title: "Birthdays",
      value: "0",
      subtext: "this month",
    },
    {
      title: "New auditions",
      value: "0",
      subtext: "this month",
    },
    {
      title: "Unreviewed audition tapes",
      value: "0",
      subtext: "",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Top Bar */}
      <header className="bg-white border-b">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <span className="text-xl font-semibold">GTMD.studio</span>
            </div>
            
            <div className="flex-1 max-w-xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Quickfind..."
                  className="w-full pl-10 pr-4 py-2 bg-[#F8F9FA] rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage src="https://ui-avatars.com/api/?name=Carlos+Martins" />
                  <AvatarFallback>CM</AvatarFallback>
                </Avatar>
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <span>Carlos Martins</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`w-64 bg-white border-r ${isSidebarOpen ? '' : 'hidden'}`}>
          <nav className="p-4 space-y-2">
            {['Dashboard', 'Talents', 'Search', 'Groups', 'Add new talent', 'Castings', 'Calendar', 'Contacts', 'Settings'].map((item) => (
              <a
                key={item}
                href="#"
                className={`flex items-center px-4 py-2 rounded-md ${
                  item === 'Dashboard' ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item}
              </a>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat) => (
              <Card key={stat.title} className="p-6">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-600">{stat.title}</span>
                  <div className="flex items-baseline mt-2">
                    <span className="text-3xl font-semibold">{stat.value}</span>
                    {stat.trend && (
                      <span className="ml-2 text-sm text-green-500">{stat.trend}</span>
                    )}
                  </div>
                  {stat.subtext && (
                    <span className="text-sm text-gray-500 mt-1">{stat.subtext}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Updates */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent updates</h2>
              <select className="px-4 py-2 border rounded-md bg-white">
                <option>Filter</option>
                <option>All updates</option>
                <option>Profiles</option>
                <option>Castings</option>
                <option>Auditions</option>
              </select>
            </div>
            
            <div className="space-y-6">
              {/* Example update item */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://ui-avatars.com/api/?name=Chuck+No" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Chuck No</div>
                    <div className="text-sm text-gray-500">Profile updated by talent</div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">1 days ago</span>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;