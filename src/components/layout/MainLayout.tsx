import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "./Header"
import { AppSidebar } from "./AppSidebar"

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen">
        {/* Header - fixed with highest z-index */}
        <Header />

        {/* Main Layout */}
        <div className="flex pt-14 min-h-screen">
          {/* Sidebar - fixed below header */}
          <AppSidebar />

          {/* Main Content - with proper margin */}
          <main className="flex-1 ml-64 p-6 bg-white overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
      <Sonner />
    </SidebarProvider>
  )
}