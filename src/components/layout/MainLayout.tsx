import { Header } from "@/components/layout/Header"
import { AppSidebar } from "@/components/layout/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <div className="flex flex-1 pt-16">
          {/* Left Sidebar - fixed position */}
          <aside className="fixed left-0 top-16 bottom-0 w-64 bg-background border-r z-40">
            <AppSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 ml-64 p-6 bg-muted/50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}