import { useState, useCallback } from 'react';
import { Plus, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useProjectStatus } from '@/modules/projects/hooks/useProjectStatus';
import { PROJECT_STATUS_COLORS } from '@/modules/projects/types';
import type { ProjectStatusType } from '@/modules/projects/types';

interface ShotList {
  id: string;
  name: string;
  status: ProjectStatusType;
  created_at: string;
}

export const ShotListManagement: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [shotLists, setShotLists] = useState<ShotList[]>([]);
  const { updateTaskStatus } = useProjectStatus(projectId);

  const handleShare = useCallback((shotListId: string) => {
    // Implement sharing functionality
    console.log('Sharing shot list:', shotListId);
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Shot Lists</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Shot List
        </Button>
      </div>

      <div className="space-y-4">
        {shotLists.map(shotList => (
          <Card key={shotList.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{shotList.name}</h3>
                <span className="text-sm text-muted-foreground">
                  Created {new Date(shotList.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`px-2 py-1 rounded-full text-white text-sm ${PROJECT_STATUS_COLORS[shotList.status]}`}>
                  {shotList.status}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleShare(shotList.id)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};