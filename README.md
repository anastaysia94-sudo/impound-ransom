# Impound Ransom

Your car is just gone. This app takes **city + plate + last parked block** and gives you:

1. Which official list or pound to check
2. The **legal fee cap** pattern in that state
3. Which invoice line items are usually junk
4. The **“I will pay the lawful amount only”** window script
5. A **card-dispute letter** if they already gouged you

Consumer prices in the product: **$19 lookup**, **$79 release pack**. Lawyer / clinic seat: **$179/mo**.

This is **not a law firm**. Official city find-my-car pages stay free and are linked in-product.

## Run the web app

```bash
cd impound-ransom
python3 -m http.server 4173
```

Open http://localhost:4173 — or just open `index.html` from a static host.

Try **Run the Chicago demo** or plate `DEMO`. Chicago plates also query the city’s public tow dataset.

## Install on a phone today (no store)

- **iPhone:** Safari → Share → Add to Home Screen
- **Android:** Chrome → menu → Install app / Add to Home Screen

That uses the PWA (`manifest.json` + service worker).

## Apple App Store + Google Play

Capacitor wrapper is pre-configured (`app.impoundransom.mobile`).

```bash
npm install
npx cap add ios
npx cap add android
npx cap sync
npx cap open ios      # needs a Mac
npx cap open android
```

Read `docs/APP_STORES.md` before you submit. Replace the demo checkout with StoreKit / Play Billing.

## What’s real vs demo

| Piece | Status |
|---|---|
| Chicago city tows (90-day open data) | Live plate search |
| NYC, LA, SF, Houston, Seattle, Philly, Miami, Boston, DC, Dallas, Atlanta, Denver, Phoenix, Austin, San Diego | Official links, phones, pound directory, state fee rules |
| Other US cities | State-level cap memo + 311 path |
| $19 / $79 checkout | Local demo unlock (wire Stripe / IAP) |
| Window script + chargeback letter | Generated from the plate + state pack |

## Stack

Static HTML / CSS / JS. No build step. Works offline for the fee tables after first load.

## Legal

`legal/TERMS.md` and `legal/PRIVACY.md` are ready for store listings.
