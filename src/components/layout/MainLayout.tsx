import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Fixed header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>

        {/* Main layout container */}
        <div className="flex min-h-screen pt-16"> {/* Added pt-16 for header height */}
          {/* Sidebar - fixed position with proper top offset */}
          <div className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border">
            <AppSidebar />
          </div>

          {/* Main content - adjusted padding */}
          <main className="flex-1 pl-64 bg-muted/50">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};