import { Header } from "@/components/layout/Header"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="flex flex-col min-h-screen">
        {/* Fixed header container */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Header />
        </div>

        {/* Main layout container */}
        <div className="flex pt-16 min-h-screen">
          {/* Sidebar - fixed position aligned with header */}
          <aside className="fixed left-0 top-16 bottom-0 w-64 bg-background border-r overflow-y-auto">
            <AppSidebar />
          </aside>

          {/* Main content */}
          <main className="flex-1 ml-64 p-6 bg-muted/50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}