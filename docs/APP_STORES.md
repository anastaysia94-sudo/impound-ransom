# Shipping Impound Ransom to Apple and Google

The web app in this folder is a PWA. iPhone and Android users can already **Add to Home Screen**. Native store listings use Capacitor around the same files.

## 0. Product IDs
| Product | Price | Store SKU |
|---|---|---|
| Lookup | $19 | `lookup_19` |
| Release pack | $79 | `release_pack_79` |
| Pro seat (web) | $179/mo | bill on Stripe, not IAP |

Apple requires digital goods sold *in* the iOS app to use IAP. Wire `@capacitor-community/in-app-purchases` or RevenueCat before review. Do not keep the demo “Unlock” button in the TestFlight build.

## 1. One-time setup
```bash
cd impound-ransom
npm install
npx cap add ios
npx cap add android
npx cap sync
```

- Apple: bundle id `app.impoundransom.mobile`, team signing, privacy nutrition labels.
- Google: applicationId `app.impoundransom.mobile`, Play App Signing.

## 2. Review notes to paste

**What the app does.** Helps a driver find which impound lot likely has their car and generates a consumer letter that tenders only the lawful tow/storage amount.

**Sensitive data.** License plate. Used solely to query public tow lists and to personalize documents. Not used for tracking other people.

**Location.** Optional last-parked block, typed by the user. No background location.

**Chicago live search.** Public Socrata dataset `ygr5-vcbg` (vehicles towed in the last 90 days).

**Not a towing company.** We do not dispatch trucks.

## 3. Privacy nutrition (Apple)
- Contact Info: email, if they create an account
- User Content: plate / location text they type
- Purchases: IAP
- Identifiers: none beyond store account

## 4. Screenshots
Use the in-app Chicago demo (`plate DEMO`) for store shots: Home, Lookup, Result, Fee cap, Script.

## 5. Why reviewers reject this category
- Claiming “we will get your car back”
- Undisclosed legal advice
- Charging for a public record without also linking the free official page

This build always surfaces the official city URL and 311.

## 6. Web
Serve the folder over HTTPS. `manifest.json` + `sw.js` make it installable. Set
`Cache-Control: no-cache` on `index.html` so fee tables update.
