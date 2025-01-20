import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';

interface WelcomeVideoPageProps {
  candidateId: string;
  videoUrl: string;
}

const WelcomeVideoPage = ({ candidateId, videoUrl }: WelcomeVideoPageProps) => {
  const [progress, setProgress] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleTimeUpdate = async () => {
    if (!videoRef.current) return;

    const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(currentProgress);

    if (currentProgress >= 50 && !canProceed) {
      setCanProceed(true);
      try {
        await supabase
          .from('onboarding_candidates')
          .update({ 
            video_watched: true,
            video_progress: currentProgress 
          })
          .eq('id', candidateId);

        toast({
          title: "Progress saved",
          description: "You can now proceed to the next step",
        });
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  const handleNext = () => {
    navigate('/onboarding/chatbot');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome Video</h1>
        
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            onTimeUpdate={handleTimeUpdate}
            src={videoUrl}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="mt-8 space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-primary h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="w-full sm:w-auto"
            >
              {canProceed ? 'Continue to Next Step' : 'Please watch at least 50% of the video'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeVideoPage;