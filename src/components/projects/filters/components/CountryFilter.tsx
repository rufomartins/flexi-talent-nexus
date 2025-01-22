import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterContext } from "../context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function CountryFilter({ className }: { className?: string }) {
  const { filters, updateFilter } = useFilterContext();

  const { data: countries = [] } = useQuery({
    queryKey: ["project-countries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_countries")
        .select("country_name");

      if (error) throw error;
      
      // Remove duplicates
      const uniqueCountries = Array.from(new Set(data?.map(c => c.country_name)));
      return uniqueCountries.map(country_name => ({ country_name }));
    },
  });

  return (
    <div className={className}>
      <Select
        value={filters.countries[0] || ""}
        onValueChange={(value) => updateFilter("countries", [value])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select country" />
        </SelectTrigger>
        <SelectContent>
          {countries.map((country) => (
            <SelectItem key={country.country_name} value={country.country_name}>
              {country.country_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}