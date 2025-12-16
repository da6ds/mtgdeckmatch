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
    const { matches, searchQuery } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    console.log('Generating match reasons for query:', searchQuery);
    console.log('Number of matches:', matches.length);

    if (!matches || matches.length === 0) {
      return new Response(
        JSON.stringify({ reasons: [] }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Define match structure
    interface DeckMatch {
      precon: {
        name: string;
        commander: string;
        tags?: {
          themes?: { primary?: string[] };
          creature_types?: { primary?: string[] };
          aesthetic_vibe?: { primary?: string[] };
          intellectual_property?: string;
        };
      };
    }

    // Build deck descriptions
    const deckDescriptions = matches.map((match: DeckMatch, index: number) => {
      const precon = match.precon;
      const tags = precon.tags || {};
      
      return `Deck ${index + 1}: ${precon.name}
- Commander: ${precon.commander}
- Themes: ${tags.themes?.primary?.join(", ") || "N/A"}
- Creature types: ${tags.creature_types?.primary?.join(", ") || "N/A"}
- Vibe: ${tags.aesthetic_vibe?.primary?.join(", ") || "N/A"}
- IP: ${tags.intellectual_property || "magic_original"}`;
    }).join("\n\n");

    const prompt = `The user searched for: "${searchQuery}"

Here are the top 3 matching MTG decks:

${deckDescriptions}

For EACH deck, generate a 1-2 sentence explanation of WHY it matched their search "${searchQuery}". 

Start each reason with: You searched "${searchQuery}" -

Examples:
- You searched "aliens" - this deck features Eldrazi, cosmic alien creatures from the void with ${matches[0]?.precon?.commander}.
- You searched "Walking Dead" - this is the official Walking Dead crossover deck featuring ${matches[0]?.precon?.commander}.
- You searched "robots" - this deck is built around artifact creatures and Transformers with ${matches[0]?.precon?.commander} leading the charge.
- You searched "cute cats" - this deck focuses on adorable feline creatures led by ${matches[0]?.precon?.commander}.

Be specific, friendly, and conversational. Connect their search to what makes the deck special.

Return ONLY a JSON array with 3 strings (one reason per deck, in order).
Format: ["reason for deck 1", "reason for deck 2", "reason for deck 3"]`;

    console.log('Calling AI for match reasons...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You generate friendly explanations for why MTG decks match user searches. Always return valid JSON arrays.' },
          { role: 'user', content: prompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI API returned ${response.status}`);
    }

    const data = await response.json();
    let content = data.choices?.[0]?.message?.content?.trim() || '[]';

    console.log('AI response:', content);

    // Extract JSON from response (handle markdown code blocks)
    if (content.includes('```json')) {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        content = jsonMatch[1];
      }
    } else if (content.includes('```')) {
      const jsonMatch = content.match(/```\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        content = jsonMatch[1];
      }
    }

    const reasons = JSON.parse(content);

    console.log('Generated reasons:', reasons);

    return new Response(
      JSON.stringify({ reasons }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-match-reasons:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
