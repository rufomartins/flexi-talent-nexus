import { Search, Bell, ChevronDown } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-muted">
      {/* Top Bar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-gray-900">GTMD.studio</div>
            
            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Quickfind..."
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              
              <div className="flex items-center space-x-2">
                <img
                  src="https://ui-avatars.com/api/?name=Admin+User"
                  alt="User avatar"
                  className="h-8 w-8 rounded-full"
                />
                <button className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900">
                  <span>Admin User</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Statistics Cards */}
          {[
            "New registrations",
            "Active castings",
            "Recent activities",
            "Birthdays",
            "New auditions",
            "Unreviewed",
          ].map((title) => (
            <div
              key={title}
              className="bg-white rounded-lg shadow-card p-6 hover:shadow-card-hover transition-shadow duration-300"
            >
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-3xl font-bold text-primary">0</p>
              <p className="mt-1 text-sm text-muted-foreground">Last 30 days</p>
            </div>
          ))}
        </div>

        {/* Recent Updates */}
        <div className="mt-8 bg-white rounded-lg shadow-card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Updates</h2>
            <select className="form-input max-w-xs">
              <option>All updates</option>
              <option>Profiles</option>
              <option>Castings</option>
              <option>Auditions</option>
            </select>
          </div>
          
          <div className="text-center text-muted-foreground py-8">
            No recent updates to display
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;