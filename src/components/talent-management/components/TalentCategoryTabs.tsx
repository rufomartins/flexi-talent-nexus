import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TalentCategory } from "@/types/talent-management";

interface TalentCategoryTabsProps {
  activeCategory: TalentCategory;
  onCategoryChange: (category: TalentCategory) => void;
}

export function TalentCategoryTabs({ 
  activeCategory, 
  onCategoryChange 
}: TalentCategoryTabsProps) {
  return (
    <Tabs
      value={activeCategory}
      onValueChange={(value) => onCategoryChange(value as TalentCategory)}
      className="space-y-4"
    >
      <TabsList>
        <TabsTrigger value={TalentCategory.UGC}>UGC Talents</TabsTrigger>
        <TabsTrigger value={TalentCategory.TRANSLATOR}>Translators</TabsTrigger>
        <TabsTrigger value={TalentCategory.REVIEWER}>Reviewers</TabsTrigger>
        <TabsTrigger value={TalentCategory.VOICE_OVER}>Voice Over</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}