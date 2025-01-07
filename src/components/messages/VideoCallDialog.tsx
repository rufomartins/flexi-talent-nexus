import { useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useAgoraClient } from "@/hooks/useAgoraClient";

interface VideoCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelName: string;
  talentName: string;
}

export function VideoCallDialog({ 
  open, 
  onOpenChange, 
  channelName, 
  talentName 
}: VideoCallDialogProps) {
  const {
    isLoading,
    isVideoEnabled,
    isAudioEnabled,
    initializeAgora,
    toggleVideo,
    toggleAudio,
    leaveChannel
  } = useAgoraClient(channelName);

  useEffect(() => {
    if (open) {
      initializeAgora();
    } else {
      leaveChannel();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] h-[600px]">
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Call with {talentName}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleAudio}
                >
                  {isAudioEnabled ? (
                    <Mic className="h-4 w-4" />
                  ) : (
                    <MicOff className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleVideo}
                >
                  {isVideoEnabled ? (
                    <Video className="h-4 w-4" />
                  ) : (
                    <VideoOff className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
              <div id="local-video" className="w-full h-full" />
              <div id="remote-video" className="absolute top-4 right-4 w-1/4 h-1/4 bg-gray-800 rounded-lg overflow-hidden" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}