
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from "lucide-react";

interface WelcomeVideoSettings {
  url: string;
}

const WelcomeVideoPage = () => {
  const { candidateId } = useParams();
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
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

        // Type guard to ensure settings.value has the correct shape
        if (settings?.value && typeof settings.value === 'object' && !Array.isArray(settings.value) && 'url' in settings.value) {
          const videoSettings = settings.value as WelcomeVideoSettings;
          setVideoUrl(videoSettings.url);
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

  const handleNext = async () => {
    try {
      // Mark video as watched in the database
      await supabase
        .from('onboarding_candidates')
        .update({ video_watched: true })
        .eq('id', candidateId);
      
      // Navigate to the next step
      navigate(`/onboarding/chatbot/${candidateId}`);
    } catch (error) {
      console.error('Error updating candidate status:', error);
      toast({
        title: "Error",
        description: "Could not update your progress. Please try again.",
        variant: "destructive"
      });
    }
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
        
        <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg bg-black">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`${videoUrl}?autoplay=1&control=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            onClick={handleNext}
            className="w-full sm:w-auto"
          >
            Continue to Next Step
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeVideoPage;
