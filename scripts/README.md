# Scripts

Utility scripts for maintaining and analyzing the MTG Deck Match data.

## Creature Type Analysis

### `analyze_creature_types.py`
Analyzes the precons-data.json file to find decks with empty or missing creature type information.

Usage:
```bash
python3 scripts/analyze_creature_types.py
```

### `suggest_creature_types.py`
Suggests potential creature types for decks based on commander names and deck names. Useful for identifying decks that might be missing relevant creature type tags.

Usage:
```bash
python3 scripts/suggest_creature_types.py
```

**Note:** This script may produce false positives (e.g., detecting "rat" in "Strategist"), so manual review of suggestions is recommended.
