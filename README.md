# Family Hub

A shared household app for schedules, dinner planning, shopping, and a “look into later” inbox. Built for phones first, with a household PIN so kids don’t need email accounts.

## What’s in it

- **Today** — what’s happening, dinner, shopping left, research waiting
- **Schedule** — week strip, day list, color-coded people, optional Apple Calendar
- **Dinner** — protein + starch + vegetable plates, 20–35 minutes
- **Shop** — shared purchase list you can check off at the store
- **Look into** — park ideas, products, and questions to research later

## Run it on this computer

```bash
npm install
npm run dev
```

Local: [http://localhost:3000](http://localhost:3000)

On phones on the same Wi-Fi: `http://YOUR-COMPUTER-IP:3000`

First visit: household name, 4–6 digit PIN, family members. On iPhone/Android use **Add to Home Screen**.

Local data is stored in `data/family.json`.

## GitHub

Repo: [https://github.com/ecgillis-lab/family-hub](https://github.com/ecgillis-lab/family-hub)

## Deploy on Cloudflare

The live site uses Cloudflare Workers plus KV so phones can open it from anywhere (grocery store, school pickup) without this computer staying on.

1. Install [Node.js](https://nodejs.org/) and log in:
   ```bash
   npx wrangler login
   ```
2. Create the KV store and paste the id into `wrangler.jsonc` under `kv_namespaces[0].id`:
   ```bash
   npx wrangler kv namespace create FAMILY_KV
   ```
3. Set a session secret:
   ```bash
   npx wrangler secret put SESSION_SECRET
   ```
   Use a long random string.
4. Deploy:
   ```bash
   npm run deploy
   ```

Wrangler prints a `*.workers.dev` URL. Open that on phones, then **Add to Home Screen**.

You can also connect the GitHub repo in the Cloudflare dashboard (**Workers & Pages** → **Create** → **Connect to Git**) so every push to `main` deploys automatically. Build command: `npx opennextjs-cloudflare build`.
