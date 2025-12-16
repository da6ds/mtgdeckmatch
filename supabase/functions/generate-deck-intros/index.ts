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
    const { matches, userPreferences, pathType, customText, isCustomInput } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    // Build context about user preferences
    let userContext = "";
    
    if (isCustomInput && customText) {
      userContext = `The user entered custom text: "${customText}"`;
    } else if (pathType === "vibes") {
      if (userPreferences.vibe) {
        userContext += `Vibe: ${userPreferences.vibe}. `;
      }
      if (userPreferences.creatureType) {
        userContext += `Creature type: ${userPreferences.creatureType}. `;
      }
    } else if (pathType === "power") {
      if (userPreferences.archetype) {
        userContext += `Archetype: ${userPreferences.archetype}. `;
      }
      if (userPreferences.powerLevelRange) {
        userContext += `Power level: ${userPreferences.powerLevelRange[0]}-${userPreferences.powerLevelRange[1]}. `;
      }
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
- Aesthetic: ${tags.aesthetic_vibe?.primary?.join(", ") || "N/A"}
- IP: ${tags.intellectual_property || "magic_original"}`;
    }).join("\n\n");

    const prompt = `${userContext}

Here are the top 3 matching MTG decks:

${deckDescriptions}

Generate a personalized one-liner intro for each deck (under 15 words) that explains why it matches what the user wants. Be fun, specific, and enthusiastic!

${isCustomInput && customText ? `
Examples for custom text:
- For "rick and morty meets redwall" + Bloomburrow deck: "Chaotic woodland creatures = Rick's energy + Redwall vibes!"
- For "kitties, furbies, puppies" + squirrel deck: "Squirrels are basically fuzzy critters - close enough to furbies!"
- For "spooky but cute" + ghost deck: "Ghosts are spooky, and these ones are adorably ethereal!"
` : `
Examples for button selections:
- User picked cute + squirrels: "You wanted cute squirrels - this is THE deck!"
- User picked creepy + vampires: "Classic creepy vampires, just like you asked!"
- User picked chaos archetype: "Maximum chaos, exactly what you're looking for!"
`}

Return ONLY a JSON array with 3 strings, one intro per deck, in order.
Format: ["intro for deck 1", "intro for deck 2", "intro for deck 3"]`;

    console.log('Calling AI for deck intros with context:', userContext);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You generate fun, personalized one-liner connections between user preferences and MTG decks. Always return valid JSON arrays.' },
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

    const intros = JSON.parse(content);

    console.log('Generated intros:', intros);

    return new Response(
      JSON.stringify({ intros }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-deck-intros:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
