import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ShareLinksList } from "../share/ShareLinksList";
import type { ShareSectionProps } from "@/types/guest-content";

export const ShareSection: React.FC<ShareSectionProps> = ({ castingId }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Links</CardTitle>
        <CardDescription>
          Manage active share links for this selection
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ShareLinksList castingId={castingId} />
      </CardContent>
    </Card>
  );
};