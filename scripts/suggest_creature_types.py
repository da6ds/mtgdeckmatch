#!/usr/bin/env python3
import json
import re

# Load the precons data
with open('src/data/precons-data.json', 'r') as f:
    decks = json.load(f)

# Common creature type keywords to look for in commander names
creature_keywords = {
    'dragon': 'dragon',
    'elf': 'elf',
    'elves': 'elf',
    'goblin': 'goblin',
    'zombie': 'zombie',
    'vampire': 'vampire',
    'angel': 'angel',
    'demon': 'demon',
    'wizard': 'wizard',
    'knight': 'knight',
    'soldier': 'soldier',
    'cat': 'cat',
    'dog': 'dog',
    'bird': 'bird',
    'beast': 'beast',
    'elemental': 'elemental',
    'spirit': 'spirit',
    'human': 'human',
    'merfolk': 'merfolk',
    'sliver': 'sliver',
    'dinosaur': 'dinosaur',
    'phoenix': 'phoenix',
    'hydra': 'hydra',
    'artifact': 'artifact creature',
    'spider': 'spider',
    'insect': 'insect',
    'snake': 'snake',
    'wurm': 'wurm',
    'fox': 'fox',
    'otter': 'otter',
    'mouse': 'mouse',
    'raccoon': 'raccoon',
    'badger': 'badger',
    'squirrel': 'squirrel',
    'rat': 'rat',
}

suggestions = []

for deck in decks:
    commander = deck.get('commander', '').lower()
    name = deck.get('name', '').lower()
    current_primary = deck.get('tags', {}).get('creature_types', {}).get('primary', [])
    current_secondary = deck.get('tags', {}).get('creature_types', {}).get('secondary', [])

    # Find potential creature types
    found_types = set()
    for keyword, creature_type in creature_keywords.items():
        if keyword in commander or keyword in name:
            found_types.add(creature_type)

    # Check if we have suggestions not already in the deck
    all_current = set(current_primary + current_secondary)
    new_suggestions = found_types - all_current

    if new_suggestions:
        suggestions.append({
            'deck': deck.get('name'),
            'commander': deck.get('commander'),
            'current': list(all_current),
            'suggested': list(new_suggestions)
        })

print(f"Found {len(suggestions)} decks with potential creature type additions:\n")
for s in suggestions[:20]:
    print(f"{s['deck']}")
    print(f"  Commander: {s['commander']}")
    print(f"  Current: {s['current']}")
    print(f"  Suggested: {s['suggested']}")
    print()
