import { Header } from "@/components/layout/Header"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        {/* Fixed header container */}
        <Header />

        {/* Main layout container */}
        <div className="flex min-h-screen">
          {/* Sidebar - fixed position with proper top offset */}
          <aside className="fixed left-0 top-16 bottom-0 w-64 bg-background border-r overflow-y-auto">
            <AppSidebar />
          </aside>

          {/* Main content - with proper top padding and margin */}
          <main className="flex-1 ml-64 pt-16 p-6 bg-muted/50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}