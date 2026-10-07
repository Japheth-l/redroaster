# Red Rooster website

A one-page website for **Red Rooster** (East Legon, Accra). Customers can browse the menu, build an order and send it to the restaurant on WhatsApp.

## Features

- **Menu** built from the October menu PDF, with category tabs, search and quick filters (spicy, grilled, under GH₵70, drink included, for sharing).
- **Order basket → WhatsApp.** Customers pick options (rice type, wing sauce, fries or rice), choose pickup, dine-in or delivery, and tap one button. WhatsApp opens with the whole order already typed out. No payment system or server is needed.
- **Ask Rooster**, a menu helper that suggests items by budget, mood or group size and answers questions about hours, location and delivery. It runs in the browser using keyword rules. It is not a real AI model yet (see below).
- **Smart dates.** The 5-shawarma deal hides itself after its end date. Weekend-only deals can only be ordered Friday to Sunday (Accra time).
- Open/closed badge, map, directions, tap-to-call and the original flyers.
- Works well on phones, which is where most customers will open it.

## Editing content

Everything the restaurant changes lives in **`assets/js/menu.js`**: prices, items, hours, phone numbers and promos. Images are in `assets/img/`.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Live preview

Every push to `main` deploys to GitHub Pages via `.github/workflows/pages.yml`: https://japheth-l.github.io/redroaster/

The page carries a `noindex` tag so search engines skip it until the owner approves. Remove that line from `index.html` at launch.

## Before launch (confirm with the owner)

- [ ] **Hours.** On WhatsApp they replied "12:30", but the flyer says "From 1 PM". Closing time is unknown. Set `hours` in `menu.js`.
- [ ] Which **drinks** are included, and do any drinks cost extra?
- [ ] **Delivery:** do they deliver themselves, which areas, and what fee?
- [ ] **Payment:** MoMo number or cash on pickup?
- [ ] Permission to use their logo and food photos, plus any higher-resolution originals.
- [ ] A domain name (e.g. `redroostergh.com`) and where to host it (GitHub Pages, Netlify and Vercel are all free for a static site).

## Upgrading "Ask Rooster" to a real AI

The helper is in `assets/js/assistant.js`. To connect a real language model (such as Claude), you need a small **server** (for example a serverless function) that keeps the API key secret. The browser calls your server, and your server calls the AI with the menu as context. Never put an API key in these public files.
