import { useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessagesErrorBoundary } from "./MessagesErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { MessagesProvider } from "@/contexts/MessagesContext";
import { ConversationsList } from "./ConversationsList";
import { ChatWindow } from "./ChatWindow";

interface MessagesLayoutProps {
  children?: React.ReactNode;
}

function LoadingState() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="space-y-4 w-full max-w-sm">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[80%]" />
      </div>
    </div>
  );
}

export function MessagesLayout({ children }: MessagesLayoutProps) {
  const isMobile = useIsMobile();
  const [showLeftSidebar, setShowLeftSidebar] = useState(!isMobile);
  const [showRightSidebar, setShowRightSidebar] = useState(!isMobile);

  return (
    <MessagesErrorBoundary>
      <MessagesProvider>
        <div className="flex h-screen bg-white">
          {/* Left Sidebar - Conversations List */}
          <div
            className={cn(
              "fixed left-0 top-16 bottom-0 w-[280px] border-r border-chat-input-border bg-white transition-transform duration-300 ease-in-out z-20",
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
              <Suspense fallback={<LoadingState />}>
                <ConversationsList />
              </Suspense>
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
            <Suspense fallback={<LoadingState />}>
              <ChatWindow participantName="John Doe" />
            </Suspense>
          </main>

          {/* Right Sidebar - Info Panel */}
          <div
            className={cn(
              "fixed right-0 top-16 bottom-0 w-[280px] border-l border-chat-input-border bg-white transition-transform duration-300 ease-in-out z-20",
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
              <div className="border-b border-chat-input-border p-4">
                {/* User/Group info will go here */}
              </div>
              <Suspense fallback={<LoadingState />}>
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Info panels will go here */}
                </div>
              </Suspense>
            </div>
          </div>
        </div>
      </MessagesProvider>
    </MessagesErrorBoundary>
  );
}