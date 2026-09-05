# Medicine Search

My submission for the MediBuddy machine coding round. Search a medicine, see its details, using the FDA drug label API.

## Running it

```bash
npm install
npm run dev
```

Opens on localhost, terminal will give you the link.

## What it does

- Search medicines by brand name, shows results as cards (brand, generic name, manufacturer, product type)
- "No results found" message if search returns nothing
- Click a card to see its detail page (works on refresh/direct link too, fetches by id)
- Back to search keeps your last search + results (sessionStorage)

## What's left

- Debounce search input
- Cache repeated searches
- Cancel stale requests
- UI polish (bare bones right now on purpose)

## React bits used

- `useState` for query, results, loading, error, hasSearched
- `useEffect` on the detail page to fetch data when the id in the url changes
- `react-router-dom` (`Routes`, `Route`, `Link`, `useParams`) for the search page / detail page navigation

## Notes

- Detail page uses the medicine's `id` from the FDA API in the url, not any index-based id
- sessionStorage instead of context/redux for remembering last search, simpler for what's needed here