# TrustLend Testing Guide

This document explains how to test the complete TrustLend project as:
- Borrower
- Lender
- Admin

It includes manual UI checks, API checks, database verification, and automated E2E validation.

## 1. Test Goal

Confirm that:
- Authentication and role-based access are correct
- Borrower loan lifecycle works (apply -> repay)
- Lender pool lifecycle works (deposit -> withdraw)
- Admin dashboards and KYC pages load and show data
- Data is persisted correctly in Supabase
- Guard rails reject invalid or unauthorized actions

## 2. Prerequisites

1. Environment
- Node.js 18+
- Supabase project configured
- Valid `.env.local`

2. Required env values
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SOROBAN_RPC_URL`
- All 4 `NEXT_PUBLIC_*_CONTRACT_ID` values
- `NEXT_PUBLIC_ADMIN_ADDRESS`

3. Admin allowlist
- `TRADE_VAULT_ADMIN_EMAILS` must contain your admin email.

4. Start app
```bash
npm install
npm run dev
```

## 3. Test Accounts

Use three accounts with distinct roles in `profiles.role` and auth metadata:
- Borrower: `borrower`
- Lender: `lender`
- Admin: `admin` (plus allowlisted email)

Important:
- Admin pages use `requireTradeVaultAdmin()`, so role alone is not enough.
- The admin email must match `TRADE_VAULT_ADMIN_EMAILS` or trusted admin claim metadata.

## 4. Manual End-to-End Test (UI)

## 4.1 Borrower Flow

1. Login as borrower.
2. Open `/dashboard/borrower`.
3. Apply loan with valid payload:
- amount > 0
- durationDays in `[30, 60, 90]`
4. Expected result:
- Request succeeds
- New row in `loans` with status `requested`

5. Repay loan partially from borrower flow.
6. Repay again until total due is covered.
7. Expected result:
- `loan_repayments` rows created
- `loans.repaid_amount` increases
- `loans.status` becomes `repaid` when total due is met
- `reputation_events` row created for repayment

Validation checks:
- Invalid amount (0 or negative) should fail
- Invalid duration (not 30/60/90) should fail
- Borrower cannot use lender-only APIs

## 4.2 Lender Flow

1. Login as lender.
2. Open `/dashboard/lender`.
3. Deposit into active pool.
4. Expected result:
- `pool_positions` created or updated
- `lending_pools.total_liquidity` and `available_liquidity` increase
- `ledger_transactions` gets category `deposit`

5. Withdraw from same position.
6. Expected result:
- `pool_positions.principal_amount` decreases
- `withdrawn_amount` increases
- If principal reaches 0, status becomes `closed`
- `lending_pools` liquidity decreases
- `ledger_transactions` gets category `withdrawal`

Validation checks:
- Withdraw > principal should fail
- Withdraw > pool available liquidity should fail
- Lender cannot call borrower-only APIs

## 4.3 Admin Flow

1. Login as admin (allowlisted email).
2. Open `/dashboard/admin`.
3. Verify cards and metrics render (users, loans, tx flow, flags).
4. Open `/dashboard/admin/kyc`.
5. Expected result:
- Pending docs list loads
- KYC review controls render

6. Open `/dashboard/admin/users` and `/dashboard/admin/loans`.
7. Expected result:
- Pages render without unauthorized redirects

Validation checks:
- Non-admin user should be redirected away from admin routes.

## 5. API Smoke Test Matrix

Run against `http://localhost:3000` while logged in with the correct role.

Borrower APIs:
- `POST /api/loans/apply`
- `POST /api/loans/repay`

Lender APIs:
- `POST /api/pools/deposit`
- `POST /api/pools/withdraw`

Expected status codes:
- Success: `200` or `201`
- Validation errors: `400`
- Missing records: `404`
- Role mismatch: redirect behavior (`307`) from auth guard
- No endpoint should produce unexpected `500` for normal user mistakes

## 6. Database Verification (Supabase SQL)

Use Supabase SQL editor after running manual flows.

Check recent loans:
```sql
select id, borrower_id, principal_amount, apr_bps, duration_days, status, repaid_amount, requested_at
from loans
order by requested_at desc
limit 20;
```

Check repayments:
```sql
select id, loan_id, payer_id, amount, paid_at
from loan_repayments
order by paid_at desc
limit 20;
```

Check lender position updates:
```sql
select id, pool_id, lender_id, principal_amount, withdrawn_amount, status, closed_at
from pool_positions
order by created_at desc
limit 20;
```

Check ledger transactions:
```sql
select id, user_id, category, amount, status, created_at
from ledger_transactions
order by created_at desc
limit 50;
```

Check reputation events from repayments:
```sql
select id, user_id, source_type, source_id, points_delta, reason, created_at
from reputation_events
order by created_at desc
limit 50;
```

## 7. Automated E2E Verification

TrustLend includes a seeded E2E runner:
- `scripts/e2e-seed-and-run.mjs`
- npm command: `npm run e2e:seed`

What it verifies:
- Borrower, lender, admin dashboards
- Borrower apply + repay flow
- Lender deposit + withdraw flow
- Admin KYC/users pages
- DB persistence in `loans`, `pool_positions`, `ledger_transactions`
- Role mismatch guard and input validation guard

Run:
```bash
npm run dev
npm run e2e:seed
```

Expected output:
- `Passed: 15/15` (or all checks pass)

## 8. Smart Contract Admin Verification

To verify each deployed contract is tied to the expected admin address:
```bash
stellar contract invoke --network testnet --source-account trustlend-admin --id <CONTRACT_ID> -- get_admin
```

Expected admin:
- Must match your `NEXT_PUBLIC_ADMIN_ADDRESS`

Important behavior:
- Changing `.env.local` admin address does not change deployed contract IDs.
- Contract ID changes only on redeploy.
- Admin value is set at `initialize(...)` during deployment.

## 9. Pass Criteria (Release Ready)

Mark the build healthy when all are true:
- Borrower flow passes end-to-end
- Lender flow passes end-to-end
- Admin dashboards/pages load with proper access control
- Validation and role guards reject bad requests
- Supabase tables show correct persisted changes
- `npm run build` succeeds
- `npm run e2e:seed` passes all checks

## 10. Common Failures and Fixes

1. Admin page redirects unexpectedly
- Ensure email is in `TRADE_VAULT_ADMIN_EMAILS`
- Confirm admin metadata/claims

2. Borrower cannot apply
- Ensure `reputation_snapshots.score_total` exists and supports requested amount
- Ensure at least one active `lending_pools` row exists

3. Lender withdraw fails
- Check position principal and pool available liquidity

4. E2E fails with auth issues
- Confirm dev bypass usage is local-only and headers are set by script
- Ensure required env keys are present

5. Unexpected 500
- Check server logs
- Re-test with valid payload shape and role
- Confirm Supabase tables and RLS are correctly configured

## 11. Suggested Test Routine Before Submission

1. `npm run build`
2. Manual borrower, lender, admin smoke checks
3. `npm run e2e:seed`
4. Re-check DB tables with SQL queries above
5. Capture screenshots for:
- Borrower dashboard and loan states
- Lender pool actions
- Admin dashboard and KYC panel
- E2E pass summary
