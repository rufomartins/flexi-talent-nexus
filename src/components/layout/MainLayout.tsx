import { Header } from "@/components/layout/Header"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Fixed header */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>

        {/* Main layout container */}
        <div className="flex min-h-screen">
          {/* Sidebar - fixed position with proper top offset */}
          <div className="fixed left-0 top-16 bottom-0 w-64 bg-white">
            <AppSidebar />
          </div>

          {/* Main content - with proper left margin and top padding */}
          <main className="flex-1 ml-64 pt-16 p-6 bg-muted/50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}