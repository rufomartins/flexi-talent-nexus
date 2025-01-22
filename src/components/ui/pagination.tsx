import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import { ButtonProps, buttonVariants } from "@/components/ui/button"

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

const Pagination = React.forwardRef<HTMLDivElement, PaginationProps>(
  ({ currentPage, totalPages, onPageChange, isLoading, ...props }, ref) => {
    const pages = React.useMemo(() => {
      const items: (number | string)[] = []
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          items.push(i)
        }
      } else {
        items.push(1)
        if (currentPage > 3) {
          items.push('...')
        }
        const start = Math.max(2, currentPage - 2)
        const end = Math.min(totalPages - 1, currentPage + 2)
        for (let i = start; i <= end; i++) {
          items.push(i)
        }
        if (currentPage < totalPages - 2) {
          items.push('...')
        }
        items.push(totalPages)
      }
      return items
    }, [currentPage, totalPages])

    return (
      <nav
        ref={ref}
        className="mx-auto flex w-full justify-center"
        {...props}
      >
        <ul className="flex flex-row items-center gap-1">
          <PaginationItem
            disabled={currentPage === 1 || isLoading}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </PaginationItem>
          
          {pages.map((page, i) => (
            <PaginationItem
              key={i}
              isActive={page === currentPage}
              disabled={isLoading || page === '...'}
              onClick={() => typeof page === 'number' && onPageChange(page)}
            >
              {page === '...' ? (
                <MoreHorizontal className="h-4 w-4" />
              ) : (
                page
              )}
            </PaginationItem>
          ))}

          <PaginationItem
            disabled={currentPage === totalPages || isLoading}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </PaginationItem>
        </ul>
      </nav>
    )
  }
)

Pagination.displayName = "Pagination"

interface PaginationItemProps extends ButtonProps {
  isActive?: boolean
}

const PaginationItem = React.forwardRef<HTMLButtonElement, PaginationItemProps>(
  ({ className, isActive, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        buttonVariants({
          variant: isActive ? "default" : "outline",
          size: "icon",
        }),
        className
      )}
      {...props}
    />
  )
)

PaginationItem.displayName = "PaginationItem"

export { Pagination, PaginationItem }