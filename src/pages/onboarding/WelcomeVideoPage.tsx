
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from "lucide-react";

interface WelcomeVideoSettings {
  url: string;
  min_watch_percentage: number;
}

const WelcomeVideoPage = () => {
  const { candidateId } = useParams();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [canProceed, setCanProceed] = useState(false);
  const [minWatchPercentage, setMinWatchPercentage] = useState(50);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const validateCandidateAndFetchVideo = async () => {
      try {
        // Validate candidate exists
        const { data: candidate, error: candidateError } = await supabase
          .from('onboarding_candidates')
          .select('id')
          .eq('id', candidateId)
          .single();

        if (candidateError || !candidate) {
          toast({
            title: "Error",
            description: "Invalid candidate ID. Please use the link sent to your email.",
            variant: "destructive"
          });
          navigate('/onboarding/welcome');
          return;
        }

        // Fetch video settings
        const { data: settings, error: settingsError } = await supabase
          .from('onboarding_settings')
          .select('value')
          .eq('feature_key', 'welcome_video')
          .single();

        if (settingsError) throw settingsError;

        const videoSettings = settings?.value as WelcomeVideoSettings;
        if (videoSettings?.url) {
          setVideoUrl(videoSettings.url);
          setMinWatchPercentage(videoSettings.min_watch_percentage || 50);
        }
      } catch (error) {
        console.error('Error fetching welcome video URL:', error);
        toast({
          title: "Error",
          description: "Could not load welcome video settings",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    validateCandidateAndFetchVideo();
  }, [candidateId, navigate, toast]);

  const handleTimeUpdate = async () => {
    if (!videoRef.current || !candidateId) return;

    const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(currentProgress);

    if (currentProgress >= minWatchPercentage && !canProceed) {
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
    if (!canProceed) {
      toast({
        title: "Cannot proceed",
        description: `Please watch at least ${minWatchPercentage}% of the video before continuing`,
        variant: "destructive",
      });
      return;
    }
    navigate(`/onboarding/chatbot/${candidateId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!videoUrl) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome Video Not Found</h1>
          <p className="text-muted-foreground">The welcome video is not available at this time.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-center mb-8">Welcome Video</h1>
        
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
          <iframe
            className="w-full h-full"
            src={videoUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
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
              {canProceed ? 'Continue to Next Step' : `Please watch at least ${minWatchPercentage}% of the video`}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeVideoPage;
