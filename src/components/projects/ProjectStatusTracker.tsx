import { useEffect, useState } from 'react';
import { useProjectStatus } from '@/modules/projects/hooks/useProjectStatus';
import { PROJECT_STATUS_COLORS } from '@/modules/projects/types';
import type { ProjectProgress } from '@/modules/projects/types';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2 } from 'lucide-react';

export const ProjectStatusTracker: React.FC<{ projectId: string }> = ({ projectId }) => {
  const { getProjectProgress } = useProjectStatus(projectId);
  const [progress, setProgress] = useState<ProjectProgress>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const data = await getProjectProgress();
        setProgress(data);
      } catch (error) {
        console.error('Error fetching progress:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
    const interval = setInterval(fetchProgress, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [getProjectProgress]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Project Progress</h3>
          {progress && (
            <div className={`px-2 py-1 rounded-full text-white text-sm ${PROJECT_STATUS_COLORS[progress.status]}`}>
              {progress.status}
            </div>
          )}
        </div>

        {progress && (
          <>
            <Progress 
              value={(progress.completedTasks / progress.totalTasks) * 100} 
              className="h-2"
            />
            <div className="text-sm text-muted-foreground">
              {progress.completedTasks} of {progress.totalTasks} tasks completed
            </div>
            <div className="text-xs text-muted-foreground">
              Last updated: {new Date(progress.lastUpdate).toLocaleString()}
            </div>
          </>
        )}
      </div>
    </Card>
  );
};