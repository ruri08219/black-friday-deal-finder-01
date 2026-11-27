# Deal Lantern — Black Friday deal finder

A static deal finder for Black Friday & Cyber Monday 2026: 28 real deals from
13 stores, each with its product, store, sale price, usual price, discount,
store link, check time and source — plus a search box and filters by category,
store and discount, sorting by deal score, and a same-product comparison
across stores (AirPods Pro 3: Amazon $149 vs Best Buy $179.99).

Every price was checked on 27 November 2026, reading the price at the store
or in a deals source that names the store: Tom's Guide's Black Friday roundup
and Hunt4Freebies' live list (prices verified 26 Nov 2026). Each deal carries
an honest verdict — NEW LOW (lowest price the source has seen), STRONG (a deep
verified discount of 40% or more), or ROUTINE (a real but ordinary discount).

## Run it

Serve `app/` with any static server and open `index.html` — no build step,
no network requests, no framework:

```
python3 -m http.server --directory app 8080
```

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/`
to `/output` and writes `/output/dossier.json` with the vendored
`vendor/makefun-frontend.ts`:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Files

- `app/index.html` — the shell
- `app/style.css` — all styles
- `app/data.js` — the 28 checked deals
- `app/score.js` — discount, savings, deal score, verdict
- `app/filters.js` — search / filter / sort state
- `app/render.js` — list cards and the single-deal view
- `app/main.js` — bootstrap and hash routing
- `screenshots/` — 4 renders of the site (cover first)
- `vendor/makefun-frontend.ts` — the kit's dossier library, unchanged

License: MIT.
