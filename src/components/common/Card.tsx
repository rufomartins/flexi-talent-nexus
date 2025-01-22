import { forwardRef } from "react";
import {
  Card as ShadcnCard,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface CardProps {
  title?: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  loading?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, description, children, actions, className, loading }, ref) => {
    return (
      <ShadcnCard ref={ref} className={cn("w-full", className)}>
        {(title || description) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        )}
        <CardContent className={cn(loading && "opacity-50 pointer-events-none")}>
          {children}
        </CardContent>
        {actions && <CardFooter>{actions}</CardFooter>}
      </ShadcnCard>
    );
  }
);

Card.displayName = "Card";