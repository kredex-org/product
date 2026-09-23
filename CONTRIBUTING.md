# Contributing to Kredex Product

Thank you for helping build Kredex! 💙 This guide covers what's specific to the web app. For the general flow (fork → branch → PR), read the **[org-wide Contributing Guide](https://github.com/kredex-org/.github/blob/main/CONTRIBUTING.md)** first.

> **First time contributing?** Welcome! Pick a [`good first issue`](https://github.com/kredex-org/product/labels/good%20first%20issue), comment that you'd like to take it, and ask questions freely in [Discussions](https://github.com/orgs/kredex-org/discussions).

## Setup

Full instructions with troubleshooting: **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)**. The short version:

```bash
git clone https://github.com/<you>/product.git
cd product
git remote add upstream https://github.com/kredex-org/product.git
npm install
cp .env.example .env.local   # fill in your own values
npx prisma generate && npx prisma db push
npm run dev
```

You'll need your own free [Neon](https://neon.tech) database and [Upstash](https://upstash.com) Redis, plus the [Freighter](https://www.freighter.app) wallet set to **Testnet**.

## Before you open a PR

Run all of these. CI runs the same checks:

```bash
npx tsc --noEmit    # type check
npm run lint        # ESLint
npm run build       # production build
```

## Coding guidelines

- **TypeScript** everywhere, with no `any` unless justified in a comment.
- **Components:** small, typed, reusable. Put dashboard widgets in `components/dashboard`, generic ones in `components/ui`.
- **Styling:** Tailwind CSS 4 utility classes. Match the existing look and keep layouts responsive (check mobile).
- **Accessibility:** semantic HTML, labels for inputs, keyboard focus, sufficient contrast, `alt` text on images.
- **Server vs client:** keep secrets and DB access on the server (server actions, route handlers). Never expose server-only env vars to the client (`NEXT_PUBLIC_*` is public!).
- **Blockchain code:** all contract calls go through [`lib/stellar/soroban.ts`](lib/stellar/soroban.ts) and the typed clients in `lib/contracts/`. Don't hand-roll transactions elsewhere.
- **Database changes:** edit `prisma/schema.prisma`, explain the migration in your PR, and keep changes backwards compatible where possible.
- **Errors:** show friendly messages (toasts), never raw stack traces or secrets.
- **Security:** validate all inputs on the server; check authorization on every API route and action.

## Secrets and environment variables

- Only `.env.example` is tracked. **Never commit** `.env`, `.env.local`, keys, or Stellar secret keys (`S…`).
- Add new variables to `.env.example` with a safe placeholder and a comment.
- Use **Testnet** only. Never put real funds or mainnet keys in a PR, issue or screenshot.

## UI changes

Include before/after screenshots (desktop and mobile when relevant) in your PR.

## Where to start

| Level | Ideas |
| :-- | :-- |
| 🌱 Beginner | Copy/UX text fixes, accessibility fixes, tooltips explaining the trust score, empty states, FAQ improvements |
| 🔧 Intermediate | Items from [docs/USER_FEEDBACK.md](docs/USER_FEEDBACK.md) (light/dark mode, clearer KYC, better analytics), unit/integration tests, loading skeletons |
| 🏗️ Advanced | Auth/KYC hardening, RPC caching and rate-limit strategy, indexer for contract events, mainnet-readiness |

## Pull request checklist

- [ ] `tsc`, `lint` and `build` pass
- [ ] Screenshots attached for UI changes
- [ ] No secrets or `.env` files included
- [ ] `.env.example` and docs updated if config or behavior changed
- [ ] PR title follows [Conventional Commits](https://www.conventionalcommits.org/), e.g. `fix(dashboard): add copy button to wallet card`

## Security

Never report vulnerabilities publicly. See the [Security Policy](https://github.com/kredex-org/.github/blob/main/SECURITY.md).

## Need help?

[Discussions](https://github.com/orgs/kredex-org/discussions) · [@kredexweb3](https://x.com/kredexweb3)
