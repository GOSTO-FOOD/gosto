# GOSTO FOOD

GOSTO FOOD is a restaurant ordering website with a protected menu-control dashboard.

## Run & Operate

- `pnpm --filter @workspace/gosto-food run dev` — run the public website and dashboard (port 23853)
- `pnpm --filter @workspace/api-server run dev` — run the JSONBin proxy API (port 8080)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- The API requires the Replit Secrets `JSONBIN_MASTER_KEY`, `SESSION_SECRET`, and `DASHBOARD_PASSWORD`.

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- Persistence: JSONBin through the server-side API proxy
- Validation: Zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/gosto-food/public/assets` — preserved published GOSTO homepage bundle
- `artifacts/gosto-food/src/main.tsx` — selects the published homepage or protected dashboard
- `artifacts/gosto-food/src/pages/dashboard.tsx` — menu editor with price, product, and category management
- `artifacts/gosto-food/src/pages/dashboard-login.tsx` — dashboard password gate
- `artifacts/api-server/src/routes/gosto-menu.ts` — JSONBin menu proxy
- `artifacts/api-server/src/routes/dashboard-auth.ts` — dashboard sessions and password authentication
- `artifacts/api-server/src/data/gosto-menu.json` — published-menu seed data
- `lib/api-spec/openapi.yaml` — source API contract

## Architecture decisions

- The public homepage keeps the published bundle as its visual source of truth; React is used for `/dashboard`.
- The dashboard reads and writes menu data through the API server so JSONBin credentials never reach the browser.
- Menu edits are protected by an HttpOnly, signed session cookie; the public menu read endpoint remains available for homepage price synchronization.
- GitHub Pages can host the static homepage, but the dashboard and JSONBin proxy require a separately hosted API with the three server secrets.

## Product

- Browse the GOSTO FOOD menu and place orders from the public homepage.
- Manage categories, products, size prices, notes, and popular-product flags from `/dashboard`.
- Add or delete products and add categories, then save the complete menu to JSONBin.

## Gotchas

- Dashboard changes are drafts until `Enregistrer le menu` is clicked.
- The public homepage displays a continuous 10:00–22:00 schedule, while online ordering remains available only from 10:00–15:00 and 17:00–22:00; Friday is closed.
- Do not commit secret values or replace Replit Secrets with `.env` files.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
