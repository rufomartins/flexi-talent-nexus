import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  isLoading = false 
}: PaginationProps) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className="mx-auto flex w-full justify-center"
    >
      <ul className="flex flex-row items-center gap-1">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
          />
        </PaginationItem>
        
        <PaginationContent>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={currentPage === page}
                disabled={isLoading}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
        </PaginationContent>

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
          />
        </PaginationItem>
      </ul>
    </nav>
  );
}

export const PaginationContent = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-row items-center gap-1", className)}>
      {children}
    </div>
  );
};

export const PaginationItem = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <li className={cn("", className)}>
      {children}
    </li>
  );
};

export const PaginationLink = ({
  children,
  isActive,
  disabled,
  className,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <Button
      variant={isActive ? "default" : "outline"}
      size="icon"
      className={cn("h-9 w-9", className)}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export const PaginationPrevious = ({
  className,
  disabled,
  onClick,
}: {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-9 w-9", className)}
      disabled={disabled}
      onClick={onClick}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  );
};

export const PaginationNext = ({
  className,
  disabled,
  onClick,
}: {
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className={cn("h-9 w-9", className)}
      disabled={disabled}
      onClick={onClick}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
};

export const PaginationEllipsis = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div className={cn("flex h-9 w-9 items-center justify-center", className)}>
      <MoreHorizontal className="h-4 w-4" />
    </div>
  );
};