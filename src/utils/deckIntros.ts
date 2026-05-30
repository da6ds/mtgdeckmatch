// Static, deterministic deck-intro generator.
//
// Replaces the former AI-backed `generate-deck-intros` Supabase edge function
// with templated one-liners built from each deck's own tags. No network call,
// no API key, no external service — runs entirely client-side.

interface DeckTags {
  themes?: { primary?: string[] };
  creature_types?: { primary?: string[] };
  aesthetic_vibe?: { primary?: string[] };
}

interface IntroMatch {
  precon?: {
    tags?: DeckTags;
  };
}

interface IntroOptions {
  customText?: string;
  isCustomInput?: boolean;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Build a short, personalized-feeling intro for a single deck match. */
export function generateDeckIntro(match: IntroMatch, options: IntroOptions = {}): string {
  const { customText, isCustomInput } = options;
  const tags = match?.precon?.tags ?? {};
  const theme = tags.themes?.primary?.[0];
  const creature = tags.creature_types?.primary?.[0];
  const vibe = tags.aesthetic_vibe?.primary?.[0];
  const facet = theme || vibe || creature;

  if (isCustomInput && customText && facet) {
    return `Your "${customText}" pick leans right into ${facet}.`;
  }
  if (theme && creature) {
    return `${cap(theme)} built around ${creature} — give it a shot.`;
  }
  if (theme && vibe) {
    return `${cap(theme)} with a ${vibe} feel.`;
  }
  if (facet) {
    return `Leans into ${facet} — right up your alley.`;
  }
  return "A strong match for your style.";
}

/** Build intros for an ordered list of deck matches. */
export function generateDeckIntros(matches: IntroMatch[], options: IntroOptions = {}): string[] {
  return matches.map((m) => generateDeckIntro(m, options));
}
