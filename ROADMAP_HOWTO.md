# How to Update the Roadmap

The roadmap lives in one file: `public/roadmap.json`

Editing this file updates:
- The public roadmap at discoveringmagic.com/roadmap
- The portfolio (fetches from discoveringmagic.com/roadmap.json)

## File Location

public/roadmap.json

## Status Options

| Status | Meaning |
|--------|---------|
| complete | Shipped and live |
| in-progress | Currently being built |
| planned | On the roadmap, not started |

## How to Update

1. Open public/roadmap.json
2. Change the status or description of any phase
3. Update lastUpdated to today's date (YYYY-MM-DD format)
4. Save, commit, push

Example commit message: "Update roadmap: Card Matching complete"

## Related Linear Tickets

- SKU-201: Roadmap living document
- SKU-202: Future admin UI for roadmap updates
- SKU-203: Add public roadmap page (completed)
