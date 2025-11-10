#!/usr/bin/env python3
import json

# Load the precons data
with open('src/data/precons-data.json', 'r') as f:
    decks = json.load(f)

empty_primary = []
empty_secondary = []
total_decks = len(decks)

for deck in decks:
    creature_types = deck.get('tags', {}).get('creature_types', {})
    primary = creature_types.get('primary', [])
    secondary = creature_types.get('secondary', [])

    if not primary:
        empty_primary.append({
            'name': deck.get('name'),
            'commander': deck.get('commander'),
            'id': deck.get('id')
        })

    if not secondary:
        empty_secondary.append({
            'name': deck.get('name'),
            'commander': deck.get('commander'),
            'id': deck.get('id')
        })

print(f"Total decks: {total_decks}")
print(f"\nDecks with empty primary creature_types: {len(empty_primary)}")
print(f"Decks with empty secondary creature_types: {len(empty_secondary)}")

print("\n\nFirst 10 decks with empty primary creature types:")
for deck in empty_primary[:10]:
    print(f"  - {deck['name']} ({deck['commander']})")
