# GOSTO FOOD

Restaurant ordering website and protected menu-control dashboard.

## Workspace

- Public website: `artifacts/gosto-food`
- API server: `artifacts/api-server`
- API contract and generated clients: `lib/api-spec`, `lib/api-zod`, `lib/api-client-react`

## Run locally

```bash
pnpm install
pnpm --filter @workspace/api-server run dev
pnpm --filter @workspace/gosto-food run dev
```

The API server needs these secrets in the runtime environment:

- `JSONBIN_MASTER_KEY`
- `SESSION_SECRET`
- `DASHBOARD_PASSWORD`

Never commit their values.

## Dashboard

Open `/dashboard` and enter the configured dashboard password. Menu changes are saved to JSONBin only after clicking **Enregistrer le menu**.

## Publishing

The public homepage is a static published bundle and can be hosted on GitHub Pages. The dashboard and live price synchronization require the Express API server to remain hosted separately with the required secrets; GitHub Pages alone cannot run that server.

For the GitHub Pages dashboard to authenticate and save menu changes, configure the GitHub repository variable `GOSTO_API_BASE_URL` with the public URL of the deployed API (without a trailing slash), and configure the API runtime variable `GOSTO_FRONTEND_ORIGIN` as `https://gosto-food.github.io`. Then rerun the Pages workflow.