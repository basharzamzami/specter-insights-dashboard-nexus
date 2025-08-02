import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.51.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, postData, userId } = await req.json();
    
    console.log(`Social scheduler action: ${action}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    if (action === 'schedule_post') {
      const { platform, content, scheduledTime, mediaUrls } = postData;
      
      // Validate required fields
      if (!platform || !content || !scheduledTime) {
        throw new Error('Platform, content, and scheduled time are required');
      }

      // Schedule the post
      const { data, error } = await supabase
        .from('scheduled_posts')
        .insert({
          platform,
          content,
          media_urls: mediaUrls || [],
          scheduled_time: scheduledTime,
          status: 'scheduled',
          created_by: userId
        })
        .select()
        .single();

      if (error) throw error;

      // Log the operation
      await supabase.from('operation_history').insert({
        operation_type: 'social_post_scheduled',
        description: `Scheduled ${platform} post`,
        target: platform,
        result: 'success',
        metrics: {
          platform,
          contentLength: content.length,
          hasMedia: mediaUrls && mediaUrls.length > 0
        },
        user_id: userId
      });

      return new Response(JSON.stringify({ 
        success: true, 
        data: data,
        message: `Post scheduled successfully for ${platform}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'get_scheduled_posts') {
      const { data, error } = await supabase
        .from('scheduled_posts')
        .select('*')
        .eq('created_by', userId)
        .order('scheduled_time', { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify({ 
        success: true, 
        data: data || [] 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'update_post_status') {
      const { postId, status } = postData;
      
      const { data, error } = await supabase
        .from('scheduled_posts')
        .update({ status })
        .eq('id', postId)
        .eq('created_by', userId)
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ 
        success: true, 
        data: data,
        message: `Post status updated to ${status}` 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'generate_content') {
      const { platform, topic, tone } = postData;
      const generatedContent = await generateSocialContent(platform, topic, tone);
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: { content: generatedContent } 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'publish_now') {
      const { postId } = postData;
      
      // Simulate publishing (in real implementation, this would call platform APIs)
      const publishResult = await simulatePublishing(postId);
      
      // Update post status
      await supabase
        .from('scheduled_posts')
        .update({ 
          status: 'published',
          engagement_metrics: publishResult.metrics
        })
        .eq('id', postId);

      // Log the operation
      await supabase.from('operation_history').insert({
        operation_type: 'social_post_published',
        description: `Published post immediately`,
        target: postId,
        result: 'success',
        metrics: publishResult.metrics,
        user_id: userId
      });

      return new Response(JSON.stringify({ 
        success: true, 
        data: publishResult,
        message: 'Post published successfully' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    throw new Error('Invalid action');

  } catch (error) {
    console.error('Error in social scheduler:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function generateSocialContent(platform: string, topic: string, tone: string): Promise<string> {
  const contentTemplates = {
    linkedin: {
      professional: [
        `Excited to share insights on ${topic}. What's your experience with this? #${topic.replace(/\s+/g, '')}`,
        `Key learnings from our recent work on ${topic}. Would love to hear your thoughts! 💭`,
        `The future of ${topic} is here. Here's what we're seeing in the industry... 🚀`
      ],
      casual: [
        `Quick thoughts on ${topic} - game changer or overhype? Let me know! 🤔`,
        `Anyone else excited about ${topic}? The possibilities are endless! ✨`,
        `Been diving deep into ${topic} lately. Here's what caught my attention... 👀`
      ]
    },
    twitter: {
      professional: [
        `${topic} is reshaping the industry. Key insights: 🧵`,
        `Why ${topic} matters for businesses today 👇`,
        `The data on ${topic} is compelling. Thread: 📊`
      ],
      casual: [
        `Hot take on ${topic}: 🔥`,
        `${topic} thoughts? Drop them below! 💭`,
        `Quick ${topic} update that made my day! ⚡`
      ]
    },
    facebook: {
      professional: [
        `We're seeing incredible developments in ${topic}. Here's our take on where the industry is heading...`,
        `Sharing some insights on ${topic} from our recent analysis. What trends are you noticing?`,
        `The evolution of ${topic} continues to amaze us. Here's what we're tracking...`
      ],
      casual: [
        `Can we talk about ${topic} for a minute? This is pretty amazing! 🤩`,
        `${topic} update: things are getting interesting! What do you think?`,
        `Just discovered something cool about ${topic}. Had to share! 😍`
      ]
    },
    instagram: {
      professional: [
        `Behind the scenes: our take on ${topic} 📸 #${topic.replace(/\s+/g, '')} #innovation`,
        `${topic} insights from the team 💡 What questions do you have?`,
        `Exploring ${topic} today 🔍 Stay tuned for more updates!`
      ],
      casual: [
        `${topic} vibes today! ✨ Who else is excited about this?`,
        `Obsessed with ${topic} lately 💫 What's your favorite part?`,
        `${topic} mood 🎯 Tell me your thoughts in the comments!`
      ]
    }
  };

  const platformTemplates = contentTemplates[platform as keyof typeof contentTemplates];
  if (!platformTemplates) {
    return `Exciting developments in ${topic}! What's your take on this?`;
  }

  const toneTemplates = platformTemplates[tone as keyof typeof platformTemplates];
  if (!toneTemplates) {
    return `Great insights on ${topic}. Looking forward to hearing your thoughts!`;
  }

  return toneTemplates[Math.floor(Math.random() * toneTemplates.length)];
}

async function simulatePublishing(postId: string) {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate realistic engagement metrics
  const metrics = {
    postId,
    publishedAt: new Date().toISOString(),
    initialReach: Math.floor(Math.random() * 1000) + 100,
    likes: Math.floor(Math.random() * 50) + 5,
    comments: Math.floor(Math.random() * 20) + 1,
    shares: Math.floor(Math.random() * 10) + 1,
    clickThroughRate: parseFloat((Math.random() * 5 + 1).toFixed(2))
  };
  
  return {
    status: 'published',
    metrics,
    platformResponse: {
      success: true,
      platformPostId: `platform_${Math.random().toString(36).substr(2, 9)}`,
      url: `https://platform.com/post/${postId}`
    }
  };
}