import { supabase } from "@/integrations/supabase/client";

export const runAuthDiagnostics = async () => {
  console.group('🔍 Auth Diagnostics');
  
  // 1. Session Status
  try {
    const { data: { session } } = await supabase.auth.getSession();
    console.log('Session Check:', {
      exists: !!session,
      userId: session?.user?.id,
      expiresAt: session?.expires_at,
      tokenDetails: {
        accessTokenPresent: !!session?.access_token,
        refreshTokenPresent: !!session?.refresh_token
      }
    });
  } catch (error) {
    console.error('Session Check Failed:', error);
  }

  // 2. Local Storage
  try {
    const authKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase.auth') || 
      key.includes('sb-')
    );
    console.log('LocalStorage Auth Keys:', authKeys);
  } catch (error) {
    console.error('LocalStorage Check Failed:', error);
  }

  // 3. WebSocket Status
  try {
    const channels = supabase.realtime.getChannels();
    console.log('Realtime Channels:', channels.map(channel => ({
      name: channel.topic,
      state: channel.state
    })));
  } catch (error) {
    console.error('WebSocket Check Failed:', error);
  }

  console.groupEnd();
};