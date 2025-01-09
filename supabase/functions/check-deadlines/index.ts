import { createClient } from '@supabase/supabase-js';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  try {
    // Call the database function to check deadlines
    const { error } = await supabase.rpc('check_assignment_deadlines');
    
    if (error) {
      console.error('Error checking deadlines:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to check deadlines' }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: 'Deadline check completed successfully' }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in deadline check function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
});