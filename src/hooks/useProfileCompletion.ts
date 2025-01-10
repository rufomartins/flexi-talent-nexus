import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useProfileCompletion = (userId: string) => {
  return useQuery({
    queryKey: ["profile-completion", userId],
    queryFn: async () => {
      // Fetch media count
      const { data: media } = await supabase
        .from("talent_media")
        .select("id")
        .eq("talent_id", userId);

      // Fetch experience entries
      const { data: experience } = await supabase
        .from("talent_jobs")
        .select("id")
        .eq("talent_id", userId);

      // Fetch social media links
      const { data: socialMedia } = await supabase
        .from("talent_social_media")
        .select("id")
        .eq("talent_id", userId);

      // Fetch user profile data
      const { data: profile } = await supabase
        .from("talent_profiles")
        .select(`
          user_id,
          whatsapp_number,
          phone_number,
          country,
          users!inner (
            id,
            first_name,
            last_name,
            mobile_phone,
            nationality,
            gender
          )
        `)
        .eq("user_id", userId)
        .single();

      // Calculate percentages
      const mediaScore = Math.min((media?.length || 0) * 10, 30);
      const experienceScore = Math.min((experience?.length || 0) * 15, 30);
      const socialMediaScore = Math.min((socialMedia?.length || 0) * 5, 15);

      // Calculate basic profile completion
      let basicProfileScore = 0;
      if (profile) {
        const fields = [
          profile.users?.first_name,
          profile.users?.last_name,
          profile.users?.mobile_phone || profile.whatsapp_number || profile.phone_number,
          profile.country,
          profile.users?.nationality,
          profile.users?.gender
        ];
        
        basicProfileScore = Math.round((fields.filter(Boolean).length / fields.length) * 25);
      }

      const totalScore = mediaScore + experienceScore + socialMediaScore + basicProfileScore;

      return {
        total: totalScore,
        breakdown: {
          media: mediaScore,
          experience: experienceScore,
          basicProfile: basicProfileScore,
          socialMedia: socialMediaScore
        }
      };
    }
  });
};