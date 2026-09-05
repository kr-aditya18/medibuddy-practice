# Medicine Search

My submission for the MediBuddy machine coding round. Search a medicine, see its details, using the FDA drug label API.

## Running it

```bash
npm install
npm run dev
```

Opens on localhost, terminal will give you the link.

## What it does

- Search medicines by brand name, auto-searches after you stop typing (debounced, 500ms)
- Results shown as cards with tags (product type, route), generic name, manufacturer
- Results header shows how many formulations were found
- "No results found" message if search returns nothing (handles FDA API's 404 for unknown brands as a normal empty state, not an error)
- Click a card or "View Details" to see a styled detail page for that medicine
- Detail page works on direct link/refresh too, fetches by the medicine's own `id`, not from search page state
- Back to search keeps your last search + results (sessionStorage)
- Repeated searches for the same term don't hit the API again (in-memory cache)
- If you type a new search before an old one finishes loading, the old request gets cancelled so it can't overwrite the newer result
- Responsive down to mobile (cards stack to 1 column)

## React bits used

- `useState` for query, results, loading, error, hasSearched
- `useEffect` on the detail page to fetch when the id in the url changes, and on the search page to trigger search when the debounced query changes
- `useRef` for the search cache and the AbortController, since neither should cause a re-render when they change
- Custom `useDebounce` hook, delays updating a value until the user stops typing for 500ms
- `React.memo` on `ResultsGrid` — typing in the search box re-renders SearchPage on every keystroke (query state), but the actual results list shouldn't re-render until new results actually arrive. Wrapping it in memo skips that re-render since the `medicines` prop hasn't changed yet.
- `react-router-dom` (`Routes`, `Route`, `Link`, `useParams`) for search page / detail page navigation

## Notes / trade-offs

- Didn't memoize everything, only `ResultsGrid`, since it's the one place a real wasted re-render was happening. Wrapping small stuff like the search input or a single card in memo/useMemo would've been overhead without a real problem to solve.
- Using sessionStorage instead of context/redux for remembering the last search. Simpler for what's needed, though it means results are per-tab and reset if the tab closes.
- UI is inspired by the reference app's patterns (tags, result count, view details button) but not copied — different color scheme, typography, and card layout, since the brief asks for an original implementation.