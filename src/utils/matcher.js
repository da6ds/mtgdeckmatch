export function matchPrecons(precons, userPreferences, pathType = "vibes") {
  const scoredPrecons = precons.map(precon => {
    let score = 0;
    const tags = precon.tags || {};
    
    if (pathType === "vibes") {
      // VIBES PATH SCORING
      
      // VIBE MATCHING (high weight)
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
      
      // CREATURE TYPE MATCHING
      if (userPreferences.creatureType) {
        const type = userPreferences.creatureType.toLowerCase();
        const primaryTypes = (tags.creature_types?.primary || []).map(t => t.toLowerCase());
        const secondaryTypes = (tags.creature_types?.secondary || []).map(t => t.toLowerCase());
        
        if (primaryTypes.includes(type)) {
          score += 10;
        } else if (secondaryTypes.includes(type)) {
          score += 5;
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
        const type = userPreferences.creatureType.toLowerCase();
        if ((tags.creature_types?.primary || []).map(t => t.toLowerCase()).includes(type)) {
          reasons.push(`Focuses on ${type}s`);
        }
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
    
    return { precon, score, reasons };
  });
  
  // Sort by score descending
  scoredPrecons.sort((a, b) => b.score - a.score);
  
  // Return top 3
  return scoredPrecons.slice(0, 3);
}
