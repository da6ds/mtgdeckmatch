import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { matches, userPreferences, pathType } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context about user's choices
    let userContext = '';
    if (pathType === 'vibes') {
      const vibeMap: Record<string, string> = {
        cute: "cute & cuddly",
        creepy: "creepy & dark",
        whimsical: "whimsical & magical",
        chaotic: "chaotic & funny",
        epic: "epic & heroic",
        nature: "nature & primal",
      };
      
      if (userPreferences.vibe) {
        userContext += `They want ${vibeMap[userPreferences.vibe] || userPreferences.vibe} vibes. `;
      }
      if (userPreferences.creatureType && userPreferences.creatureType !== "Skip this question") {
        userContext += `They specifically requested ${userPreferences.creatureType}. `;
      }
    } else if (pathType === 'power') {
      if (userPreferences.archetype) {
        userContext += `They prefer ${userPreferences.archetype} playstyle. `;
      }
      if (userPreferences.powerLevelRange) {
        const [min, max] = userPreferences.powerLevelRange;
        userContext += `They want power level ${min}-${max}. `;
      }
    }

    // Create prompt for AI
    const systemPrompt = `You are a Magic: The Gathering deck recommendation expert. 
Generate concise, personalized one-liner explanations for why each deck matches the user's preferences.
Each reason should be natural, enthusiastic, and specific to both the user's input and the deck's unique features.
Keep each reason under 15 words.
Focus on what makes this deck exciting and personally relevant to the user.`;

    const matchDescriptions = matches.map((match: any, index: number) => {
      const { precon } = match;
      return `
Deck ${index + 1}: ${precon.name}
- Commander: ${precon.commander}
- Themes: ${precon.tags?.themes?.primary?.join(', ') || 'N/A'}
- Creature types: ${precon.tags?.creature_types?.primary?.join(', ') || 'N/A'}
- Aesthetic: ${precon.tags?.aesthetic_vibe?.primary?.join(', ') || 'N/A'}
- Complexity: ${precon.tags?.complexity || 'moderate'}
- IP: ${precon.ip}
- Archetype: ${precon.tags?.archetype?.primary?.join(', ') || 'N/A'}
      `.trim();
    }).join('\n\n');

    const userPrompt = `User preferences: ${userContext}

Here are the top ${matches.length} matching decks:

${matchDescriptions}

Generate a personalized match reason for each deck that explains why it fits the user.
Return ONLY a JSON array with ${matches.length} strings, one reason per deck, in order.
Example format: ["reason for deck 1", "reason for deck 2", "reason for deck 3"]

Keep each reason concise (under 15 words), natural, and personalized.`;

    console.log('Calling AI with prompt:', userPrompt);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('AI response:', content);

    // Parse the JSON array from the response
    let reasons: string[];
    try {
      // Try to extract JSON array from the response
      const jsonMatch = content.match(/\[.*\]/s);
      if (jsonMatch) {
        reasons = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback: split by lines and clean up
        reasons = content
          .split('\n')
          .filter((line: string) => line.trim().startsWith('"') || line.trim().startsWith('-'))
          .map((line: string) => line.replace(/^[-"]\s*/, '').replace(/".*$/, '').trim())
          .filter((line: string) => line.length > 0)
          .slice(0, matches.length);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Fallback to generic reasons
      reasons = matches.map(() => "This deck matches your preferences!");
    }

    // Ensure we have the right number of reasons
    while (reasons.length < matches.length) {
      reasons.push("Great match for your playstyle!");
    }
    reasons = reasons.slice(0, matches.length);

    return new Response(
      JSON.stringify({ reasons }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-match-reasons:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        // Provide fallback reasons on error
        reasons: []
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});