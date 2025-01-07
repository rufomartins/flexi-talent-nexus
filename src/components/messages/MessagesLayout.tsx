import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MessagesLayoutProps {
  children?: React.ReactNode;
}

export function MessagesLayout({ children }: MessagesLayoutProps) {
  const isMobile = useIsMobile();
  const [showLeftSidebar, setShowLeftSidebar] = useState(!isMobile);
  const [showRightSidebar, setShowRightSidebar] = useState(!isMobile);

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      {/* Left Sidebar - Conversations List */}
      <div
        className={cn(
          "fixed left-0 top-16 bottom-0 w-[280px] border-r border-border bg-white transition-transform duration-300 ease-in-out",
          !showLeftSidebar && "-translate-x-full"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-10 top-4"
          onClick={() => setShowLeftSidebar(!showLeftSidebar)}
        >
          {showLeftSidebar ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-4">
            <input
              type="search"
              placeholder="Search conversations..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {/* Conversation list will go here */}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 ease-in-out",
          showLeftSidebar && "ml-[280px]",
          showRightSidebar && "mr-[280px]"
        )}
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-4">
            {/* Chat header will go here */}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {/* Messages will go here */}
            {children}
          </div>
          <div className="border-t border-border p-4">
            {/* Message input will go here */}
          </div>
        </div>
      </main>

      {/* Right Sidebar - Info Panel */}
      <div
        className={cn(
          "fixed right-0 top-16 bottom-0 w-[280px] border-l border-border bg-white transition-transform duration-300 ease-in-out",
          !showRightSidebar && "translate-x-full"
        )}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute -left-10 top-4"
          onClick={() => setShowRightSidebar(!showRightSidebar)}
        >
          {showRightSidebar ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
        <div className="flex h-full flex-col">
          <div className="border-b border-border p-4">
            {/* User/Group info will go here */}
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            {/* Info panels will go here */}
          </div>
        </div>
      </div>
    </div>
  );
}