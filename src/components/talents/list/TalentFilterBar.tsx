
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { countries } from "@/lib/countries";

export type TalentFilter = {
  searchTerm: string;
  categories: string[];
  status: string | null;
  countries: string[];
};

interface TalentFilterBarProps {
  onFilterChange: (filters: TalentFilter) => void;
  initialFilters?: TalentFilter;
}

export const TalentFilterBar = ({
  onFilterChange,
  initialFilters = {
    searchTerm: "",
    categories: [],
    status: null,
    countries: [],
  },
}: TalentFilterBarProps) => {
  const [searchTerm, setSearchTerm] = useState(initialFilters.searchTerm);
  const [filters, setFilters] = useState<TalentFilter>(initialFilters);
  const [isFiltersSheetOpen, setIsFiltersSheetOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...filters, searchTerm };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFilterChange = (key: keyof TalentFilter, value: any) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value };
      return newFilters;
    });
  };

  const handleArrayFilterToggle = (key: keyof TalentFilter, value: string) => {
    setFilters((prev) => {
      const currentValues = prev[key] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((v) => v !== value)
        : [...currentValues, value];
      return { ...prev, [key]: newValues };
    });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
    setIsFiltersSheetOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      searchTerm,
      categories: [],
      status: null,
      countries: [],
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
    setIsFiltersSheetOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.categories.length > 0) count += 1;
    if (filters.status) count += 1;
    if (filters.countries.length > 0) count += 1;
    return count;
  };

  const renderFilterBadges = () => {
    const badges = [];

    // Category badges
    filters.categories.forEach((category) => {
      badges.push(
        <Badge
          key={`category-${category}`}
          variant="outline"
          className="gap-1 cursor-pointer hover:bg-muted"
          onClick={() => handleArrayFilterToggle("categories", category)}
        >
          {category}
          <X className="h-3 w-3" />
        </Badge>
      );
    });

    // Status badge
    if (filters.status) {
      badges.push(
        <Badge
          key="status"
          variant="outline"
          className="gap-1 cursor-pointer hover:bg-muted"
          onClick={() => handleFilterChange("status", null)}
        >
          {filters.status}
          <X className="h-3 w-3" />
        </Badge>
      );
    }

    // Country badges (limit to prevent overflowing)
    if (filters.countries.length > 0) {
      const countryBadges = filters.countries.slice(0, 2).map((country) => (
        <Badge
          key={`country-${country}`}
          variant="outline"
          className="gap-1 cursor-pointer hover:bg-muted"
          onClick={() => handleArrayFilterToggle("countries", country)}
        >
          {country}
          <X className="h-3 w-3" />
        </Badge>
      ));
      badges.push(...countryBadges);

      // Add count badge if more than 2 countries
      if (filters.countries.length > 2) {
        badges.push(
          <Badge key="more-countries" variant="secondary">
            +{filters.countries.length - 2} more
          </Badge>
        );
      }
    }

    return badges;
  };

  return (
    <div className="mb-4 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search talents..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <Sheet open={isFiltersSheetOpen} onOpenChange={setIsFiltersSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary">{getActiveFilterCount()}</Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Talents</SheetTitle>
              <SheetDescription>
                Apply filters to narrow down the talents list
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-6 py-6">
              <div className="space-y-2">
                <Label>Talent Category</Label>
                <div className="flex flex-wrap gap-2">
                  {["UGC", "TRANSLATOR", "REVIEWER", "VOICE_OVER"].map(
                    (category) => (
                      <Badge
                        key={category}
                        variant={
                          filters.categories.includes(category)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() =>
                          handleArrayFilterToggle("categories", category)
                        }
                      >
                        {category}
                      </Badge>
                    )
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.status || ""}
                  onValueChange={(value) =>
                    handleFilterChange("status", value || null)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any status</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="under_evaluation">
                      Under Evaluation
                    </SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Country</Label>
                <Select
                  value=""
                  onValueChange={(value) =>
                    handleArrayFilterToggle("countries", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select countries" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.code} value={country.name}>
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.countries.map((country) => (
                    <Badge
                      key={country}
                      variant="outline"
                      className="gap-1 cursor-pointer"
                      onClick={() => handleArrayFilterToggle("countries", country)}
                    >
                      {country}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <SheetFooter>
              <Button variant="outline" onClick={handleResetFilters}>
                Reset
              </Button>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>

      {/* Filter badges */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2">{renderFilterBadges()}</div>
      )}
    </div>
  );
};
