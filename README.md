# Dastoor Storefront

A responsive React storefront homepage for the existing Django e-commerce project. The design uses a warm light palette, Playfair Display headings, and DM Sans interface text.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

Other checks: `npm run typecheck` and `npm run build`.

## Current scope

This first slice is a frontend preview. It uses local sample product records and bundled photos; sample PKR prices are not live catalogue prices. Search, category filters, favorites, and the bag are local to the current page session. Newsletter submissions are not stored, and checkout is disabled.

The existing Django backend remains separate in [E-Commerce](https://github.com/Muhammad-Faizullah/E-Commerce). The product and category list endpoints identified for the next integration step are `/content/Product/List/` and `/content/Category/list/`; this homepage does not call them yet.
