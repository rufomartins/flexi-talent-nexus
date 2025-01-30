import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { RtcTokenBuilder, RtcRole } from 'npm:agora-token'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { channelName, uid } = await req.json()
    
    if (!channelName) {
      throw new Error('Channel name is required')
    }

    const appId = Deno.env.get('AGORA_APP_ID')
    const appCertificate = Deno.env.get('AGORA_PRIMARY_CERTIFICATE')
    
    if (!appId || !appCertificate) {
      throw new Error('Agora credentials not configured')
    }

    // Token expires in 24 hours
    const expirationTimeInSeconds = 86400
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    // Build token with channel name
    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid || 0,
      RtcRole.PUBLISHER,
      privilegeExpiredTs
    )

    console.log('Generated Agora token for channel:', channelName)

    return new Response(
      JSON.stringify({ token }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        } 
      }
    )
  } catch (error) {
    console.error('Error generating token:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    )
  }
})