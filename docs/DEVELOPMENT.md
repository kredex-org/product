# Development Guide

A step-by-step guide to running the Kredex web app locally, written for beginners. If something here is unclear or broken, please [open a docs issue](https://github.com/kredex-org/product/issues/new/choose). Fixing it is a great first PR!

## 1. Install the tools

| Tool | Check | Install |
| :-- | :-- | :-- |
| Node.js 20+ | `node -v` | <https://nodejs.org> |
| Git | `git --version` | <https://git-scm.com> |
| Freighter wallet | browser extension | <https://www.freighter.app> |

## 2. Get the code

```bash
git clone https://github.com/<your-username>/product.git
cd product
npm install
```

## 3. Create free accounts for the services

| Service | Why | What to copy |
| :-- | :-- | :-- |
| [Neon](https://neon.tech) | Postgres database | *Pooled* URL → `DATABASE_URL`, *Direct* URL → `DIRECT_URL` |
| [Upstash](https://upstash.com) | Redis cache | REST URL and token → `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |

## 4. Configure environment variables

```bash
cp .env.example .env.local      # Windows PowerShell: Copy-Item .env.example .env.local
```

Fill in at least:

- `DATABASE_URL`, `DIRECT_URL`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `JWT_SECRET`: any long random string, for example `openssl rand -hex 32`
- `CRON_SECRET`: any random string
- Contract IDs (`NEXT_PUBLIC_*_CONTRACT_ID`): use the Testnet IDs from the [contracts reference](https://github.com/kredex-org/contracts/blob/main/docs/CONTRACTS.md)
- `NEXT_PUBLIC_ADMIN_ADDRESS`: only needed to test admin features. Use your own Testnet account.

> 🔒 `.env.local` is git-ignored. **Never commit it.** Never use a mainnet key.

## 5. Prepare the database

```bash
npx prisma generate
npx prisma db push
```

Optional: `npx prisma studio` opens a UI to browse the data.

## 6. Run the app

```bash
npm run dev
```

Open <http://localhost:3000>.

## 7. Set up a Testnet wallet

1. Install Freighter and create a wallet.
2. Switch the network to **Testnet** (Settings → Network).
3. Fund it with free test XLM: <https://friendbot.stellar.org/?addr=YOUR_G_ADDRESS>.
4. Sign in on `/auth` and try the borrower and lender flows.

## Everyday commands

```bash
npm run dev          # dev server
npx tsc --noEmit     # type check
npm run lint         # lint
npm run build        # production build
```

## Troubleshooting

| Problem | Fix |
| :-- | :-- |
| `Prisma Client` not found | Run `npx prisma generate` |
| Database connection errors | Check `DATABASE_URL`/`DIRECT_URL` and that the URL includes `sslmode=require` |
| `429` / RPC errors | Testnet RPC is rate-limited. Wait a moment and retry. Redis caching reduces this. |
| Wallet doesn't connect | Ensure Freighter is unlocked and on **Testnet** |
| Transaction fails | Make sure the account is funded and the contract IDs in `.env.local` are correct |
| Port 3000 in use | `npm run dev -- -p 3001` |

## Working on the smart contracts too?

The contracts live in their own repo: [kredex-org/contracts](https://github.com/kredex-org/contracts). If you deploy your own, put the new IDs in `.env.local`.

## More docs

- [Architecture](ARCHITECTURE.md)
- [Security notes](SECURITY.md)
- [Testing guide](TESTING_GUIDE.md)
- [KYC setup](KYC_SETUP.md)
- [Business model](BUSNINESS_MODEL.md)
- [User feedback log](USER_FEEDBACK.md)
