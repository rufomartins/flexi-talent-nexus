import { useState, useEffect } from 'react';
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from 'agora-rtc-sdk-ng';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface AgoraClientState {
  client: IAgoraRTCClient | null;
  localVideoTrack: ICameraVideoTrack | null;
  localAudioTrack: IMicrophoneAudioTrack | null;
  isVideoEnabled: boolean;
  isAudioEnabled: boolean;
  isLoading: boolean;
}

export function useAgoraClient(channelName: string) {
  const [state, setState] = useState<AgoraClientState>({
    client: null,
    localVideoTrack: null,
    localAudioTrack: null,
    isVideoEnabled: true,
    isAudioEnabled: true,
    isLoading: true
  });
  const { toast } = useToast();

  const initializeAgora = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      // Get Agora App ID from Supabase
      const { data: { AGORA_APP_ID } } = await supabase.functions.invoke('get-agora-credentials');
      if (!AGORA_APP_ID) {
        throw new Error('Agora App ID not configured');
      }

      const agoraClient = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      
      // Initialize tracks
      const [audioTrack, videoTrack] = await Promise.all([
        AgoraRTC.createMicrophoneAudioTrack(),
        AgoraRTC.createCameraVideoTrack()
      ]);

      // Join channel
      await agoraClient.join(AGORA_APP_ID, channelName, null, null);
      await agoraClient.publish([audioTrack, videoTrack]);

      setState({
        client: agoraClient,
        localAudioTrack: audioTrack,
        localVideoTrack: videoTrack,
        isVideoEnabled: true,
        isAudioEnabled: true,
        isLoading: false
      });
    } catch (error) {
      console.error("Error initializing Agora:", error);
      toast({
        title: "Error",
        description: "Failed to initialize video call",
        variant: "destructive",
      });
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const toggleVideo = async () => {
    if (state.localVideoTrack) {
      await state.localVideoTrack.setEnabled(!state.isVideoEnabled);
      setState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
    }
  };

  const toggleAudio = async () => {
    if (state.localAudioTrack) {
      await state.localAudioTrack.setEnabled(!state.isAudioEnabled);
      setState(prev => ({ ...prev, isAudioEnabled: !prev.isAudioEnabled }));
    }
  };

  const leaveChannel = async () => {
    if (state.client) {
      state.localAudioTrack?.close();
      state.localVideoTrack?.close();
      await state.client.leave();
      setState({
        client: null,
        localAudioTrack: null,
        localVideoTrack: null,
        isVideoEnabled: true,
        isAudioEnabled: true,
        isLoading: false
      });
    }
  };

  return {
    ...state,
    initializeAgora,
    toggleVideo,
    toggleAudio,
    leaveChannel
  };
}