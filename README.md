# Medicine Search

This is my submission for the MediBuddy machine coding round. It's a small React app where you can search for a medicine and see its details, using the FDA drug label API.

## Running it

```bash
npm install
npm run dev
```

It'll give you a localhost link in the terminal, just open that.

## What it does right now

- You type a medicine's brand name (like "Advil") and hit search
- Shows the matching medicines as cards - brand name, generic name, manufacturer, product type
- Click on any card and it opens a detail page for that specific medicine
- If you refresh the detail page or paste its link directly, it still works because it fetches the medicine again using its id, doesn't depend on the search page at all
- If you go back from the detail page to search, your last search + results are still there (didn't want to make people search again every time they click back, so saved it in sessionStorage)

## What's left

- No results / error messages are just plain text right now, need to make them look better
- Search fires a request on literally every keystroke right now, need to add debounce
- No caching yet, so searching the same thing twice = 2 API calls
- If you type fast, an older slow response can overwrite a newer one, need to handle that
- Overall UI is pretty bare bones, focused on getting stuff working first before making it look nice

## Notes on some choices I made

- Using the `id` field from the FDA API for the detail page URL since every medicine label has one and it's unique, made the most sense for the "works on refresh" requirement
- Went with sessionStorage instead of some global state setup for remembering the last search, felt like overkill to add context/redux for just this one thing