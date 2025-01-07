import { useState, useEffect } from "react";
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VideoCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channelName: string;
  talentName: string;
}

export function VideoCallDialog({ open, onOpenChange, channelName, talentName }: VideoCallDialogProps) {
  const [client, setClient] = useState<IAgoraRTCClient | null>(null);
  const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null);
  const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      initializeAgora();
    } else {
      leaveChannel();
    }
  }, [open]);

  const initializeAgora = async () => {
    try {
      setIsLoading(true);
      const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      setClient(agoraClient);

      // Initialize tracks
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
      ]);

      setLocalAudioTrack(audioTrack);
      setLocalVideoTrack(videoTrack);

      // Join channel
      await agoraClient.join(
        process.env.AGORA_APP_ID || "", // We'll need to set this up
        channelName,
        null,
        null
      );

      // Publish tracks
      await agoraClient.publish([audioTrack, videoTrack]);

      setIsLoading(false);
    } catch (error) {
      console.error("Error initializing Agora:", error);
      toast({
        title: "Error",
        description: "Failed to initialize video call",
        variant: "destructive",
      });
      onOpenChange(false);
    }
  };

  const leaveChannel = async () => {
    if (client) {
      localAudioTrack?.close();
      localVideoTrack?.close();
      await client.leave();
      setClient(null);
      setLocalAudioTrack(null);
      setLocalVideoTrack(null);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrack) {
      if (isVideoEnabled) {
        await localVideoTrack.setEnabled(false);
      } else {
        await localVideoTrack.setEnabled(true);
      }
      setIsVideoEnabled(!isVideoEnabled);
    }
  };

  const toggleAudio = async () => {
    if (localAudioTrack) {
      if (isAudioEnabled) {
        await localAudioTrack.setEnabled(false);
      } else {
        await localAudioTrack.setEnabled(true);
      }
      setIsAudioEnabled(!isAudioEnabled);
    }
  };

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