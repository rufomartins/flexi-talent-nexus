import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Header } from "./Header"
import { AppSidebar } from "./AppSidebar"

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 mt-14 bg-white overflow-auto">
            {children}
          </main>
        </div>
      </div>
      <Toaster />
      <Sonner />
    </SidebarProvider>
  )
}