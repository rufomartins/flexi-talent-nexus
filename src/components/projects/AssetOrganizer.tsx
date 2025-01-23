import { useState, useCallback } from 'react';
import { Upload, Download, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ProjectAsset } from '@/modules/projects/types';

export const AssetOrganizer: React.FC<{ projectId: string }> = ({ projectId }) => {
  const [assets, setAssets] = useState<ProjectAsset[]>([]);

  const handleUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Implement file upload logic
    console.log('Uploading file:', file.name);
  }, []);

  const handleDownload = useCallback((asset: ProjectAsset) => {
    // Implement download logic
    console.log('Downloading asset:', asset.file_name);
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Project Assets</h2>
        <Button size="sm">
          <Upload className="h-4 w-4 mr-2" />
          Upload Assets
          <input
            type="file"
            className="hidden"
            onChange={handleUpload}
          />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assets.map(asset => (
          <Card key={asset.id} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{asset.file_name}</h3>
                <span className="text-sm text-muted-foreground">
                  Version {asset.version}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(asset)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Update Version</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
};