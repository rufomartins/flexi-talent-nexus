import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PreviewPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PreviewPagination({
  currentPage,
  totalPages,
  onPageChange,
}: PreviewPaginationProps) {
  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    if (start > 1) {
      items.push(
        <Button 
          key="start"
          variant="outline" 
          size="icon"
          onClick={() => onPageChange(1)}
          className="h-9 w-9"
        >
          1
        </Button>
      );
      if (start > 2) {
        items.push(
          <span key="start-ellipsis" className="px-4">...</span>
        );
      }
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <Button
          key={i}
          variant={currentPage === i ? "default" : "outline"}
          size="icon"
          onClick={() => onPageChange(i)}
          className="h-9 w-9"
        >
          {i}
        </Button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        items.push(
          <span key="end-ellipsis" className="px-4">...</span>
        );
      }
      items.push(
        <Button
          key="end"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          className="h-9 w-9"
        >
          {totalPages}
        </Button>
      );
    }

    return items;
  };

  return (
    <div className="flex justify-center mt-4">
      <Pagination>
        <PaginationContent>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="h-9 w-9"
          >
            <PaginationPrevious className="h-4 w-4" />
          </Button>
          {renderPaginationItems()}
          <Button 
            variant="outline"
            size="icon"
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="h-9 w-9"
          >
            <PaginationNext className="h-4 w-4" />
          </Button>
        </PaginationContent>
      </Pagination>
    </div>
  );
}