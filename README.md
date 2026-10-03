# Dastoor Storefront

A responsive South Asian menswear category preview built with React and Vite.

## Run locally

```sh
npm install
npm run dev
```

Run `npm run typecheck` and `npm run build` for the project checks.

## Add or update a garment category

Edit `src/data/categories.ts`. The homepage navigation, category filters, search, cards, and footer links are generated from this typed list. Each entry includes its name, copy, image path, alt text, and image caption. Put new editorial images in `public/collections/` and reference them from a category entry.

## Image and catalogue status

The editorial category photographs in `public/collections/` were generated specifically for this preview; they were not copied from the Django backend or another brand's campaign. They illustrate garment categories only and do not represent confirmed products, stock, prices, or a live catalogue.

The Django backend remains separate and unchanged. This frontend does not call its product or media endpoints and does not offer checkout.