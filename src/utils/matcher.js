import { parseCustomInput } from './customInputParser';

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
        // Match vibes from custom text
        parsedInput.vibes.forEach(vibe => {
          const primaryVibes = (tags.aesthetic_vibe?.primary || []).map(v => v.toLowerCase());
          const secondaryVibes = (tags.aesthetic_vibe?.secondary || []).map(v => v.toLowerCase());
          
          if (primaryVibes.includes(vibe.toLowerCase())) {
            score += 10;
          } else if (secondaryVibes.includes(vibe.toLowerCase())) {
            score += 5;
          }
        });
        
        // Match creature types from custom text
        parsedInput.creatureTypes.forEach(type => {
          const primaryTypes = (tags.creature_types?.primary || []).map(t => t.toLowerCase());
          const secondaryTypes = (tags.creature_types?.secondary || []).map(t => t.toLowerCase());
          
          if (primaryTypes.includes(type.toLowerCase())) {
            score += 10;
          } else if (secondaryTypes.includes(type.toLowerCase())) {
            score += 5;
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
        // VIBE MATCHING (high weight) - button selections
        if (userPreferences.vibe) {
          const vibe = userPreferences.vibe.toLowerCase();
          const primaryVibes = (tags.aesthetic_vibe?.primary || []).map(v => v.toLowerCase());
          const secondaryVibes = (tags.aesthetic_vibe?.secondary || []).map(v => v.toLowerCase());
          
          if (primaryVibes.includes(vibe)) {
            score += 10; // Primary match
          } else if (secondaryVibes.includes(vibe)) {
            score += 5; // Secondary match
          }
        }
        
        // CREATURE TYPE MATCHING - handle multiple selections (array)
        if (userPreferences.creatureType) {
          const creatureTypes = Array.isArray(userPreferences.creatureType) 
            ? userPreferences.creatureType 
            : [userPreferences.creatureType];
          
          let matchCount = 0;
          creatureTypes.forEach(type => {
            const normalizedType = type.toLowerCase();
            const primaryTypes = (tags.creature_types?.primary || []).map(t => t.toLowerCase());
            const secondaryTypes = (tags.creature_types?.secondary || []).map(t => t.toLowerCase());
            
            if (primaryTypes.includes(normalizedType)) {
              score += 10;
              matchCount++;
            } else if (secondaryTypes.includes(normalizedType)) {
              score += 5;
              matchCount++;
            }
          });
          
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
      
      // ARCHETYPE MATCHING
      if (userPreferences.archetype) {
        const archetype = userPreferences.archetype.toLowerCase();
        const primaryArchetypes = (tags.archetype?.primary || []).map(a => a.toLowerCase());
        const secondaryArchetypes = (tags.archetype?.secondary || []).map(a => a.toLowerCase());
        
        if (primaryArchetypes.includes(archetype)) {
          score += 10; // Primary match
        } else if (secondaryArchetypes.includes(archetype)) {
          score += 5; // Secondary match
        }
      }
      
      // POWER LEVEL MATCHING
      if (userPreferences.powerLevelRange) {
        const preconPower = tags.power_level || 5;
        const [minPower, maxPower] = userPreferences.powerLevelRange;
        
        // Exact match within range
        if (preconPower >= minPower && preconPower <= maxPower) {
          score += 8;
        } 
        // Within 1 of range
        else if (preconPower === minPower - 1 || preconPower === maxPower + 1) {
          score += 4;
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
    
    // Generate match reasons
    const reasons = [];
    
    if (pathType === "vibes") {
      if (userPreferences.vibe) {
        const vibe = userPreferences.vibe.toLowerCase();
        if ((tags.aesthetic_vibe?.primary || []).map(v => v.toLowerCase()).includes(vibe)) {
          reasons.push(`Perfect ${vibe} vibe`);
        }
      }
      if (userPreferences.creatureType) {
        const creatureTypes = Array.isArray(userPreferences.creatureType) 
          ? userPreferences.creatureType 
          : [userPreferences.creatureType];
        
        creatureTypes.forEach(type => {
          const normalizedType = type.toLowerCase();
          if ((tags.creature_types?.primary || []).map(t => t.toLowerCase()).includes(normalizedType)) {
            reasons.push(`Focuses on ${type}s`);
          }
        });
      }
    } else if (pathType === "power") {
      if (userPreferences.archetype) {
        const archetype = userPreferences.archetype.toLowerCase();
        if ((tags.archetype?.primary || []).map(a => a.toLowerCase()).includes(archetype)) {
          reasons.push(`${archetype.charAt(0).toUpperCase() + archetype.slice(1)} strategy`);
        }
      }
      if (userPreferences.powerLevelRange) {
        const preconPower = tags.power_level || 5;
        reasons.push(`Rated ${preconPower}/10 competitive - Perfect for your skill level`);
      }
    }
    
    reasons.push(`${tags.complexity || 'moderate'} difficulty to play`);
    
    return { 
      precon, 
      score, 
      reasons,
      customText: parsedInput?.rawText || null,
      isCustomInput 
    };
  });
  
  // Sort by score descending
  scoredPrecons.sort((a, b) => b.score - a.score);
  
  // Return top 3
  return scoredPrecons.slice(0, 3);
}
