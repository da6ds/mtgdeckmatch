import { parseCustomInput } from './customInputParser';
import {
  doCreatureTypesMatch,
  doVibesMatch,
  doArchetypesMatch
} from './synonymMapper';

/**
 * SCORING WEIGHTS:
 * - Primary match: 10 points (deck strongly focuses on this)
 * - Secondary match: 7 points (deck has this as a theme, increased from 5)
 * - Both primary + secondary match: +3 bonus (20 total)
 *
 * RATIONALE: Secondary tags were undervalued at 5 points (50% of primary).
 * Many great decks have the user's preference as a secondary theme.
 * New scoring: 7 points (70% of primary) + bonus for comprehensive coverage.
 */

/**
 * VIBE FIELD MAPPINGS:
 * Maps each vibe to multiple deck fields for comprehensive matching
 * A deck matches if ANY field matches the vibe criteria
 */
const VIBE_FIELD_MAPPINGS = {
  'dark-mysterious': {
    aesthetic_vibes: ['dark', 'mysterious', 'creepy'],
    flavor_settings: ['horror', 'gothic', 'dark'],
    creature_types: ['vampire', 'zombie', 'demon', 'horror', 'spirit'],
    themes: ['graveyard', 'sacrifice'],
  },
  'epic-powerful': {
    aesthetic_vibes: ['epic', 'powerful', 'brutal', 'chaotic'],
    flavor_settings: ['ancient', 'cosmic'],
    creature_types: ['dragon', 'demon', 'giant', 'god'],
    archetypes: ['aggro', 'midrange'],
    themes: ['combat'],
  },
  'playful-whimsical': {
    aesthetic_vibes: ['playful', 'whimsical', 'cute'],
    creature_types: ['squirrel', 'cat', 'dog', 'mouse', 'faerie'],
    ips: ['monty_python'],
  },
  'fantasy-adventure': {
    aesthetic_vibes: ['elegant', 'heroic'],
    flavor_settings: ['fantasy', 'medieval', 'magical', 'mystical'],
    creature_types: ['knight', 'elf', 'wizard', 'human'],
    ips: ['princess_bride', 'lord_of_the_rings'],
  },
  'sci-fi-tech': {
    aesthetic_vibes: ['technological'],
    flavor_settings: ['sci-fi', 'steampunk', 'post-apocalyptic'],
    archetypes: ['artifacts'],
    themes: ['artifacts'],
    ips: ['warhammer_40k', 'fallout', 'transformers'],
  },
  'nature-primal': {
    aesthetic_vibes: ['nature'],
    flavor_settings: ['nature', 'forest', 'primal'],
    creature_types: ['dinosaur', 'beast', 'elemental', 'hydra', 'wolf'],
    themes: ['ramp', '+1/+1 counters'],
    ips: ['jurassic_world'],
  },
};

/**
 * ARCHETYPE MAPPING:
 * Maps simplified 3-option archetypes to underlying deck archetypes
 * User selects beginner-friendly option, we match to multiple deck archetypes
 */
const ARCHETYPE_MAPPING = {
  'go-fast': ['aggro'],
  'take-control': ['control', 'combo'],
  'play-long-game': ['midrange', 'tribal', 'political', 'aristocrats', 'ramp'],
};

/**
 * THEME MAPPING:
 * Maps theme/mechanic options to deck themes and archetypes
 * Replaces color preference question with strategic themes
 */
const THEME_MAPPING = {
  'swarm': {
    themes: ['tokens', 'tribal'],
    archetypes: ['tribal'],
  },
  'death-sacrifice': {
    themes: ['sacrifice', 'graveyard'],
    archetypes: ['aristocrats'],
  },
  'artifacts': {
    themes: ['artifacts', 'equipment'],
    archetypes: ['artifacts', 'voltron'],
  },
  'grow': {
    themes: ['+1/+1 counters'],
    archetypes: ['voltron'],
  },
  'ramp': {
    themes: ['ramp'],
    archetypes: ['ramp', 'midrange'],
  },
  'spells': {
    themes: ['card draw'],
    archetypes: ['control', 'combo'],
  },
};

/**
 * DIFFICULTY MAPPING:
 * Maps difficulty options to deck complexity tags
 * Replaces power level with strategic complexity
 */
const DIFFICULTY_MAPPING = {
  'easy': ['beginner', 'simple', 'easy'],
  'medium': ['moderate', 'medium'],
  'complex': ['complex', 'high', 'very high'],
};

/**
 * Check if a deck matches a vibe across multiple fields
 * Returns: { matched: boolean, score: number, matchedField: string|null }
 */
function matchVibeMultiField(vibe, tags) {
  const vibeMapping = VIBE_FIELD_MAPPINGS[vibe];
  if (!vibeMapping) {
    // Fallback to legacy vibe matching for backward compatibility
    return matchVibeLegacy(vibe, tags);
  }

  let primaryMatched = false;
  let secondaryMatched = false;
  let totalScore = 0;
  let matchedField = null;

  // Check aesthetic_vibes
  if (vibeMapping.aesthetic_vibes) {
    const primaryVibes = (tags.aesthetic_vibe?.primary || []);
    const secondaryVibes = (tags.aesthetic_vibe?.secondary || []);

    for (const targetVibe of vibeMapping.aesthetic_vibes) {
      if (primaryVibes.some(v => doVibesMatch(targetVibe, v))) {
        totalScore += 10;
        primaryMatched = true;
        matchedField = matchedField || 'aesthetic_vibe';
      }
      if (secondaryVibes.some(v => doVibesMatch(targetVibe, v))) {
        totalScore += 7;
        secondaryMatched = true;
        matchedField = matchedField || 'aesthetic_vibe';
      }
    }
  }

  // Check flavor_settings
  if (vibeMapping.flavor_settings) {
    const primarySettings = (tags.flavor_setting?.primary || []);
    const secondarySettings = (tags.flavor_setting?.secondary || []);

    for (const targetSetting of vibeMapping.flavor_settings) {
      if (primarySettings.some(s => s.toLowerCase() === targetSetting.toLowerCase())) {
        totalScore += 10;
        primaryMatched = true;
        matchedField = matchedField || 'flavor_setting';
      }
      if (secondarySettings.some(s => s.toLowerCase() === targetSetting.toLowerCase())) {
        totalScore += 7;
        secondaryMatched = true;
        matchedField = matchedField || 'flavor_setting';
      }
    }
  }

  // Check creature_types
  if (vibeMapping.creature_types) {
    const primaryTypes = (tags.creature_types?.primary || []);
    const secondaryTypes = (tags.creature_types?.secondary || []);

    for (const targetType of vibeMapping.creature_types) {
      if (primaryTypes.some(t => doCreatureTypesMatch(targetType, t))) {
        totalScore += 10;
        primaryMatched = true;
        matchedField = matchedField || 'creature_types';
      }
      if (secondaryTypes.some(t => doCreatureTypesMatch(targetType, t))) {
        totalScore += 7;
        secondaryMatched = true;
        matchedField = matchedField || 'creature_types';
      }
    }
  }

  // Check archetypes
  if (vibeMapping.archetypes) {
    const primaryArchetypes = (tags.archetype?.primary || []);
    const secondaryArchetypes = (tags.archetype?.secondary || []);

    for (const targetArchetype of vibeMapping.archetypes) {
      if (primaryArchetypes.some(a => doArchetypesMatch(targetArchetype, a))) {
        totalScore += 10;
        primaryMatched = true;
        matchedField = matchedField || 'archetype';
      }
      if (secondaryArchetypes.some(a => doArchetypesMatch(targetArchetype, a))) {
        totalScore += 7;
        secondaryMatched = true;
        matchedField = matchedField || 'archetype';
      }
    }
  }

  // Check themes (partial matching)
  if (vibeMapping.themes) {
    const deckThemes = (tags.themes?.primary || []).concat(tags.themes?.secondary || []);

    for (const targetTheme of vibeMapping.themes) {
      const matched = deckThemes.some(dt =>
        dt.toLowerCase().includes(targetTheme.toLowerCase()) ||
        targetTheme.toLowerCase().includes(dt.toLowerCase())
      );
      if (matched) {
        totalScore += 5;
        matchedField = matchedField || 'themes';
      }
    }
  }

  // Check IPs (exact match on deck.ip)
  if (vibeMapping.ips) {
    // Note: precon.ip is at deck level, not in tags
    // This will be checked separately in the main matching logic
  }

  // Bonus if matched in both primary AND secondary of same field
  if (primaryMatched && secondaryMatched) {
    totalScore += 3;
  }

  return {
    matched: totalScore > 0,
    score: totalScore,
    matchedField
  };
}

/**
 * Legacy vibe matching for backward compatibility
 */
function matchVibeLegacy(vibe, tags) {
  const primaryVibes = (tags.aesthetic_vibe?.primary || []);
  const secondaryVibes = (tags.aesthetic_vibe?.secondary || []);

  let primaryMatched = false;
  let secondaryMatched = false;
  let totalScore = 0;

  if (primaryVibes.some(v => doVibesMatch(vibe, v))) {
    totalScore += 10;
    primaryMatched = true;
  }

  if (secondaryVibes.some(v => doVibesMatch(vibe, v))) {
    totalScore += 7;
    secondaryMatched = true;
  }

  if (primaryMatched && secondaryMatched) {
    totalScore += 3;
  }

  return {
    matched: totalScore > 0,
    score: totalScore,
    matchedField: totalScore > 0 ? 'aesthetic_vibe' : null
  };
}

export function matchPrecons(precons, userPreferences, pathType = "vibes") {
  // PART 1: Filter by IP if coming from Pop Culture path
  let filteredPrecons = precons;
  
  if (pathType === "pop_culture" && userPreferences.selectedIP) {
    const selectedIP = userPreferences.selectedIP;
    
    // Filter to only decks matching the selected IP
    if (selectedIP !== "magic_original" && selectedIP !== "skip") {
      filteredPrecons = precons.filter(precon => precon.ip === selectedIP);
      console.log(`Found ${filteredPrecons.length} decks for IP: ${selectedIP}`);
    } else {
      // "Magic Original" or "Skip" - show diverse magic_original decks
      filteredPrecons = precons.filter(precon => precon.ip === "magic_original");
    }
  }
  
  const scoredPrecons = filteredPrecons.map(precon => {
    let score = 0;
    const tags = precon.tags || {};
    
    // Handle custom text input
    let parsedInput = null;
    let isCustomInput = false;
    
    if (userPreferences.customText) {
      parsedInput = parseCustomInput(userPreferences.customText);
      isCustomInput = true;
    }
    
    if (pathType === "vibes") {
      // VIBES PATH SCORING
      
      // CUSTOM TEXT MATCHING
      if (isCustomInput && parsedInput) {
        // Match vibes from custom text - WITH SYNONYM SUPPORT
        parsedInput.vibes.forEach(vibe => {
          const primaryVibes = (tags.aesthetic_vibe?.primary || []);
          const secondaryVibes = (tags.aesthetic_vibe?.secondary || []);
          
          let primaryMatched = false;
          let secondaryMatched = false;
          
          // Check primary vibes with synonym matching
          if (primaryVibes.some(v => doVibesMatch(vibe, v))) {
            score += 10;
            primaryMatched = true;
          }
          
          // Check secondary vibes with synonym matching
          if (secondaryVibes.some(v => doVibesMatch(vibe, v))) {
            score += 7; // Increased from 5 to 7
            secondaryMatched = true;
          }
          
          // Bonus: Deck has this vibe in BOTH primary AND secondary
          if (primaryMatched && secondaryMatched) {
            score += 3; // Total: 10 + 7 + 3 = 20 points
          }
        });
        
        // Match creature types from custom text - WITH SYNONYM SUPPORT
        parsedInput.creatureTypes.forEach(type => {
          const primaryTypes = (tags.creature_types?.primary || []);
          const secondaryTypes = (tags.creature_types?.secondary || []);
          
          let primaryMatched = false;
          let secondaryMatched = false;
          
          // Check primary types with synonym matching
          if (primaryTypes.some(t => doCreatureTypesMatch(type, t))) {
            score += 10;
            primaryMatched = true;
          }
          
          // Check secondary types with synonym matching
          if (secondaryTypes.some(t => doCreatureTypesMatch(type, t))) {
            score += 7; // Increased from 5 to 7
            secondaryMatched = true;
          }
          
          // Bonus: Deck has this creature type in BOTH primary AND secondary
          if (primaryMatched && secondaryMatched) {
            score += 3; // Total: 10 + 7 + 3 = 20 points
          }
        });
        
        // Match themes from custom text
        parsedInput.themes.forEach(theme => {
          const deckThemes = (tags.themes || []).map(t => t.toLowerCase());
          if (deckThemes.some(dt => dt.includes(theme.toLowerCase()) || theme.toLowerCase().includes(dt))) {
            score += 5;
          }
        });
        
        // Match IPs from custom text
        parsedInput.ips.forEach(ip => {
          if (tags.intellectual_property?.toLowerCase() === ip.toLowerCase()) {
            score += 8;
          }
        });
      } else {
        // VIBE MATCHING (high weight) - button selections WITH MULTI-FIELD SUPPORT
        if (userPreferences.vibe) {
          const vibe = userPreferences.vibe;
          const vibeMatch = matchVibeMultiField(vibe, tags);

          if (vibeMatch.matched) {
            score += vibeMatch.score;
          }

          // Check IP matching for vibes that have IP criteria
          const vibeMapping = VIBE_FIELD_MAPPINGS[vibe];
          if (vibeMapping?.ips && vibeMapping.ips.includes(precon.ip)) {
            score += 8; // IP match bonus
          }
        }
        
        // CREATURE TYPE MATCHING - handle multiple selections (array) WITH SYNONYM SUPPORT
        if (userPreferences.creatureType) {
          const creatureTypes = Array.isArray(userPreferences.creatureType) 
            ? userPreferences.creatureType 
            : [userPreferences.creatureType];
          
          let matchCount = 0;
          creatureTypes.forEach(type => {
            const primaryTypes = (tags.creature_types?.primary || []);
            const secondaryTypes = (tags.creature_types?.secondary || []);
            
            let primaryMatched = false;
            let secondaryMatched = false;
            
            // Check primary types with synonym matching
            if (primaryTypes.some(t => doCreatureTypesMatch(type, t))) {
              score += 10;
              matchCount++;
              primaryMatched = true;
            }
            
            // Check secondary types with synonym matching
            if (secondaryTypes.some(t => doCreatureTypesMatch(type, t))) {
              score += 7; // Increased from 5 to 7
              matchCount++;
              secondaryMatched = true;
            }
            
            // Bonus: Deck has this creature type in BOTH primary AND secondary
            if (primaryMatched && secondaryMatched) {
              score += 3;
            }
          });
          
          // Fuzzy matching fallback after exact + synonym matching
          // Only apply if we got zero matches
          if (matchCount === 0) {
            creatureTypes.forEach(type => {
              const primaryTypes = (tags.creature_types?.primary || []);
              const secondaryTypes = (tags.creature_types?.secondary || []);
              
              // Fuzzy string matching with 80% similarity threshold
              primaryTypes.forEach(deckType => {
                if (calculateStringSimilarity(type, deckType) >= 0.8) {
                  score += 5; // Lower score for fuzzy match
                  matchCount++;
                }
              });
              
              secondaryTypes.forEach(deckType => {
                if (calculateStringSimilarity(type, deckType) >= 0.8) {
                  score += 3;
                  matchCount++;
                }
              });
            });
          }
          
          // Bonus for matching multiple creature types
          if (matchCount >= 2) {
            score += 5; // 1.5x equivalent bonus
          }
          if (matchCount >= 3) {
            score += 10; // 2x equivalent bonus
          }
        }
      }
      
    } else if (pathType === "power") {
      // POWER PATH SCORING
      
      // ARCHETYPE MATCHING WITH MULTI-ARCHETYPE SUPPORT
      if (userPreferences.archetype) {
        const selectedArchetype = userPreferences.archetype;
        const primaryArchetypes = (tags.archetype?.primary || []);
        const secondaryArchetypes = (tags.archetype?.secondary || []);

        // Check if user selected a simplified 3-option archetype
        const archetypesToMatch = ARCHETYPE_MAPPING[selectedArchetype] || [selectedArchetype];

        let primaryMatched = false;
        let secondaryMatched = false;

        // Check if deck matches ANY of the mapped archetypes
        for (const archetypeToMatch of archetypesToMatch) {
          // Check primary archetypes with synonym matching
          if (primaryArchetypes.some(a => doArchetypesMatch(archetypeToMatch, a))) {
            score += 10; // Primary match
            primaryMatched = true;
          }

          // Check secondary archetypes with synonym matching
          if (secondaryArchetypes.some(a => doArchetypesMatch(archetypeToMatch, a))) {
            score += 7; // Secondary match (increased from 5)
            secondaryMatched = true;
          }
        }

        // Bonus: Deck has this archetype in BOTH primary AND secondary
        if (primaryMatched && secondaryMatched) {
          score += 3;
        }

        // Fuzzy matching fallback for archetypes (only if no matches yet)
        if (!primaryMatched && !secondaryMatched) {
          for (const archetypeToMatch of archetypesToMatch) {
            [...primaryArchetypes, ...secondaryArchetypes].forEach(deckArchetype => {
              if (calculateStringSimilarity(archetypeToMatch, deckArchetype) >= 0.8) {
                score += 4; // Lower score for fuzzy match
              }
            });
          }
        }
      }
      
      // DIFFICULTY MATCHING (replaces power level)
      if (userPreferences.difficulty) {
        const selectedDifficulty = userPreferences.difficulty;
        const complexitiesToMatch = DIFFICULTY_MAPPING[selectedDifficulty] || [selectedDifficulty];
        const deckComplexity = tags.complexity || 'moderate';

        // Check if deck complexity matches any of the mapped complexities
        const matched = complexitiesToMatch.some(complexity =>
          complexity.toLowerCase() === deckComplexity.toLowerCase()
        );

        if (matched) {
          score += 8; // Same weight as power level had
        }
      }
      
      // THEME MATCHING (replaces color preference)
      if (userPreferences.theme) {
        const selectedTheme = userPreferences.theme;
        const themeMapping = THEME_MAPPING[selectedTheme];

        if (themeMapping) {
          let primaryMatched = false;
          let secondaryMatched = false;

          // Check themes
          if (themeMapping.themes) {
            const primaryThemes = (tags.themes?.primary || []);
            const secondaryThemes = (tags.themes?.secondary || []);

            for (const targetTheme of themeMapping.themes) {
              // Partial matching for themes
              if (primaryThemes.some(dt =>
                dt.toLowerCase().includes(targetTheme.toLowerCase()) ||
                targetTheme.toLowerCase().includes(dt.toLowerCase())
              )) {
                score += 10;
                primaryMatched = true;
              }

              if (secondaryThemes.some(dt =>
                dt.toLowerCase().includes(targetTheme.toLowerCase()) ||
                targetTheme.toLowerCase().includes(dt.toLowerCase())
              )) {
                score += 7;
                secondaryMatched = true;
              }
            }
          }

          // Check archetypes
          if (themeMapping.archetypes) {
            const primaryArchetypes = (tags.archetype?.primary || []);
            const secondaryArchetypes = (tags.archetype?.secondary || []);

            for (const targetArchetype of themeMapping.archetypes) {
              if (primaryArchetypes.some(a => doArchetypesMatch(targetArchetype, a))) {
                score += 10;
                primaryMatched = true;
              }

              if (secondaryArchetypes.some(a => doArchetypesMatch(targetArchetype, a))) {
                score += 7;
                secondaryMatched = true;
              }
            }
          }

          // Bonus for both primary and secondary matches
          if (primaryMatched && secondaryMatched) {
            score += 3;
          }
        }
      }
    }
    
    // For pop_culture path, prefer power level 6-7
    if (pathType === "pop_culture") {
      const powerLevel = tags.power_level || 5;
      if (powerLevel >= 6 && powerLevel <= 7) {
        score += 5; // Bonus for ideal power level
      }
    }
    
    // Generate match reasons (using normalized comparisons)
    const reasons = [];

    if (pathType === "vibes") {
      if (userPreferences.vibe) {
        const vibe = userPreferences.vibe;
        const vibeMatch = matchVibeMultiField(vibe, tags);
        if (vibeMatch.matched) {
          // Generate a readable vibe name for the reason
          const vibeDisplayName = vibe.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' & ');
          reasons.push(`Perfect ${vibeDisplayName} vibe`);
        }
      }
      if (userPreferences.creatureType) {
        const creatureTypes = Array.isArray(userPreferences.creatureType) 
          ? userPreferences.creatureType 
          : [userPreferences.creatureType];
        
        creatureTypes.forEach(type => {
          const primaryTypes = (tags.creature_types?.primary || []);
          if (primaryTypes.some(t => doCreatureTypesMatch(type, t))) {
            reasons.push(`Focuses on ${type}s`);
          }
        });
      }
    } else if (pathType === "power") {
      if (userPreferences.archetype) {
        const selectedArchetype = userPreferences.archetype;
        const archetypesToMatch = ARCHETYPE_MAPPING[selectedArchetype] || [selectedArchetype];
        const primaryArchetypes = (tags.archetype?.primary || []);

        // Check if deck matches any of the archetypes
        const matched = archetypesToMatch.some(arch =>
          primaryArchetypes.some(a => doArchetypesMatch(arch, a))
        );

        if (matched) {
          // Generate friendly display name
          const displayNames = {
            'go-fast': 'Go Fast',
            'take-control': 'Take Control',
            'play-long-game': 'Play the Long Game'
          };
          const displayName = displayNames[selectedArchetype] || selectedArchetype;
          reasons.push(`${displayName} strategy`);
        }
      }
      if (userPreferences.difficulty) {
        const deckComplexity = tags.complexity || 'moderate';
        reasons.push(`${deckComplexity.charAt(0).toUpperCase() + deckComplexity.slice(1)} complexity - matches your preference`);
      }
      if (userPreferences.theme) {
        const themeDisplayNames = {
          'swarm': 'Swarm the Board',
          'death-sacrifice': 'Death & Sacrifice',
          'artifacts': 'Artifacts & Machines',
          'grow': 'Grow & Dominate',
          'ramp': 'Ramp & Big Stuff',
          'spells': 'Spells & Control'
        };
        const displayName = themeDisplayNames[userPreferences.theme] || userPreferences.theme;
        reasons.push(`${displayName} theme`);
      }
    }

    if (!reasons.some(r => r.includes('complexity') || r.includes('difficulty'))) {
      reasons.push(`${tags.complexity || 'moderate'} difficulty to play`);
    }
    
    // Keep raw match score separate from tiebreakers
    const rawScore = score;
    
    // Add tiebreaker factors ONLY for sorting (not for percentage calculation)
    let tiebreakerScore = 0;
    
    // 1. Variety bonus - decks with more diverse tags get slight bonus
    const tagCount = Object.keys(tags).length;
    tiebreakerScore += tagCount * 0.5;
    
    // 2. Recency factor - newer decks get tiny bonus
    if (precon.year) {
      tiebreakerScore += (precon.year - 2010) * 0.1;
    }
    
    // 3. Randomization tiebreaker - add 0-2 random points to break exact ties
    tiebreakerScore += Math.random() * 2;
    
    const finalScore = rawScore + tiebreakerScore;
    
    return { 
      precon, 
      rawScore,        // For percentage calculation
      score: finalScore, // For sorting only
      reasons,
      customText: parsedInput?.rawText || null,
      isCustomInput 
    };
  });
  
  // Sort by score descending
  scoredPrecons.sort((a, b) => b.score - a.score);
  
  // Return top 15 results for better replacement options
  return scoredPrecons.slice(0, 15);
}

/**
 * Calculate string similarity (Levenshtein distance based)
 * Returns value between 0 and 1 (1 = exact match)
 */
function calculateStringSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer.toLowerCase(), shorter.toLowerCase());
  return (longer.length - editDistance) / longer.length;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}
