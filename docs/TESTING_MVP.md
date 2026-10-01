# 🧪 TrustLend MVP — Complete Testing Guide

> This guide walks through every feature of TrustLend end-to-end.
> Written for **5 manual testers** covering Admin, Borrower, and Lender roles.
> Follow each section in order — some steps depend on previous ones.

---

## 📋 Table of Contents

1. [Pre-Requisites](#-pre-requisites)
2. [Account Setup](#-account-setup)
3. [🔴 Admin Flow](#-admin-flow)
4. [🔵 Borrower Flow](#-borrower-flow)
5. [🟢 Lender Flow](#-lender-flow)
6. [🔄 End-to-End Scenario (Full Lifecycle)](#-end-to-end-scenario-full-lifecycle)
7. [✅ Testing Checklist](#-testing-checklist)
8. [🐛 Known Issues & Workarounds](#-known-issues--workarounds)
9. [📝 Feedback Template](#-feedback-template)

---

## 🛠 Pre-Requisites

Before testing, every tester needs the following:

### 1. Browser Extension — Freighter Wallet

| Step | Action |
|------|--------|
| 1️⃣ | Go to [freighter.app](https://www.freighter.app) |
| 2️⃣ | Install the Chrome/Brave/Firefox extension |
| 3️⃣ | Create a new wallet — **write down your seed phrase** |
| 4️⃣ | Switch network to **Testnet** (Settings → Network → Testnet) |

> ⚠️ **Must be on Testnet** — the app runs on Stellar Testnet, not Mainnet.

---

### 2. Fund Your Testnet Wallet (Free XLM)

Once Freighter is set to Testnet, get free test XLM:

```
https://friendbot.stellar.org?addr=YOUR_FREIGHTER_ADDRESS
```

Replace `YOUR_FREIGHTER_ADDRESS` with the public key from Freighter (starts with `G...`).

You should receive **10,000 XLM** instantly for testing.

> 💡 You can also go to **[Stellar Laboratory](https://lab.stellar.org/account/fund)** and paste your address to fund it.

---

### 3. App URL

Open the TrustLend app at:
```
http://localhost:3000
```
*(or the deployed URL if testing on Vercel)*

---

## 👤 Account Setup

### Tester Roles

| Tester | Role | What they test |
|--------|------|----------------|
| **Tester 1** | Admin | Pool creation, KYC approval, loan sanction |
| **Tester 2** | Borrower A | Full happy-path loan lifecycle |
| **Tester 3** | Borrower B | Apply + edge cases |
| **Tester 4** | Lender A | Deposit to pool, view earnings |
| **Tester 5** | Lender B | Deposit to second pool |

---

## 🔴 Admin Flow

> **Login:** Use the admin account. The admin email must be in `TRADE_VAULT_ADMIN_EMAILS` env variable.

### Step A1 — Login to Admin Dashboard

1. Go to `/auth`
2. Sign in with the admin email
3. You should land at `/dashboard/admin`

**✅ Expected:** See the admin control panel with metrics (Total Users, Total Loans, Active Loans, High Risk Users)

---

### Step A2 — Create Lending Pools

1. Click **"Pool Management"** in the left sidebar → `/dashboard/admin/pools`
2. Click **"+ Create New Pool"**
3. Fill in:

| Field | Pool 1 | Pool 2 |
|-------|--------|--------|
| Pool Name | `TrustLend Alpha Pool` | `TrustLend Beta Pool` |
| Description | `First test pool for MVP` | `Second test pool — lower APR` |
| APR (basis points) | `1500` (= 15%) | `1200` (= 12%) |

4. Click **"Create Pool"** for each

**✅ Expected:** Both pools appear in the table with status `ACTIVE`, correct APR, and `0.00 XLM` available

---

### Step A3 — Review & Approve KYC

> ⏸️ Wait for testers 2–5 to complete Steps B4 and L2 before continuing.

1. Click **"KYC Review"** in the sidebar
2. You should see all submitted KYC documents listed
3. Click on a user's name to view their document
4. Click **"✅ Approve"**

**✅ Expected:**
- User's KYC status → `VERIFIED`
- Their reputation snapshot is automatically seeded with a real score computed from profile completeness (50–110 points)
- Their borrower dashboard now shows a real trust score

> ❌ To test rejection: Provide a reason and click **"❌ Reject"** — borrower will see `REJECTED` status

---

### Step A4 — Approve a Pending Loan

> ⏸️ Wait for Tester 2 (Borrower A) to complete Step B6 — Apply for Loan.

1. Go to **"Pool Management"** → scroll to **"Pending Loan Approvals"**
2. Tester 2's loan appears with amount, APR, and duration
3. Select `TrustLend Alpha Pool` from the pool dropdown
4. Click **"Approve"**

**✅ Expected:**
- Loan status → `APPROVED`
- Pool's Available Liquidity decreases by the loan amount
- Borrower's dashboard shows `APPROVED` badge on the loan row

---

### Step A5 — Run Auto-Match

1. Have Tester 3 (Borrower B) submit a loan application (Step B6)
2. At the top of Pool Management, click **"Run Auto-Match"**

**✅ Expected:**
- Banner shows: `✅ X matched, Y skipped`
- Matched loans are automatically approved and assigned to best-fit pools
- Pool liquidity updates

---

### Step A6 — Platform Overview Check

Go to **Overview** (`/dashboard/admin`) and verify all metrics updated:

| Metric | What to check |
|--------|--------------|
| Total Users | All testers who signed up |
| Loans sanctioned | Both approved loans |
| Active Loans | Non-zero |
| KYC incomplete | Decreases after approvals |

---

## 🔵 Borrower Flow

> **Role:** Tester 2 (Borrower A) — testing the full happy-path

### Step B1 — Sign Up as Borrower

1. Go to `/auth` → **"Sign Up"**
2. Fill in:

| Field | Value |
|-------|-------|
| Full Name | `Alice Borrower` |
| Email | *(your test email)* |
| Password | *(strong password)* |
| Role | **Borrower** |

3. Check your email and click the verification link
4. Log back in

**✅ Expected:** Redirected to `/dashboard/borrower`

---

### Step B2 — Complete Your Profile

1. Click **"Profile & Settings"** in the sidebar
2. Add:
   - Phone number (e.g. `+91 9876543210`)
   - Country code
3. Save

**✅ Expected:** Profile completion bar increases

---

### Step B3 — Connect Freighter Wallet

1. On the borrower dashboard, find the **Wallet Card** in the top-right header
2. Click **"Connect Wallet"**
3. Approve the connection in the Freighter popup

**✅ Expected:** Your wallet address (`G...`) appears in the top-right header card

---

### Step B4 — Submit KYC Document

1. Click **"Profile & Settings"** → find the KYC upload section
2. Upload any image as your government ID (for testing)
3. Click **"Submit for Review"**

**✅ Expected:** KYC status shows `SUBMITTED — Under Admin Review`

---

### Step B5 — Wait for Admin KYC Approval

> ⏸️ **Pause** — ask Admin (Tester 1) to approve your KYC in the KYC Review page.

Refresh your dashboard after approval.

**✅ Expected:**
- KYC Badge: ✅ `VERIFIED`
- **Trust Score** shows a real number (e.g., `110`)
- **Credit Score** card shows your actual score
- **Max Loan** shows `score × 10` XLM (e.g., `1,100 XLM`)
- Verification Progress: **100%**

---

### Step B6 — Apply for a Loan

1. Scroll down to the **"Apply for a New Loan"** form
2. Fill in:

| Field | Value |
|-------|-------|
| Loan Amount (XLM) | `200` |
| Duration | `30 days (15% interest)` |

3. Click **"Submit Application"**

**✅ Expected:**
- Success message ✅
- Scroll up — **"Your Loans"** table shows:

| Column | Value |
|--------|-------|
| Loan ID | First 8 chars of UUID |
| Amount | $200.00 |
| Status | 🟡 `REQUESTED` |
| Due | `Pending` |
| Actions | `Awaiting approval` |

---

### Step B7 — Wait for Loan Approval

> ⏸️ **Pause** — ask Admin (Tester 1) to approve your loan in Pool Management.

Refresh after approval.

**✅ Expected:**
- Loan status badge changes to 🔵 `APPROVED`
- "My Loans" page (`/dashboard/borrower/loans`) also reflects this

---

### Step B8 — Check Stellar Profile Card

On the borrower dashboard, scroll to the **Stellar Profile Active** card.

**✅ Expected:**
> 🛡️ **Stellar Profile Active**
> "Your borrower reputation is now being tracked on the Stellar network. Repay loans on time to build your score."

---

## 🟢 Lender Flow

> **Role:** Tester 4 (Lender A) — depositing to a pool via Freighter

### Step L1 — Sign Up as Lender

1. Go to `/auth` → **"Sign Up"**
2. Fill in:

| Field | Value |
|-------|-------|
| Full Name | `Bob Lender` |
| Email | *(your test email)* |
| Role | **Lender** |

3. Verify email → log in

**✅ Expected:** Redirected to `/dashboard/lender`

---

### Step L2 — Complete Profile & Submit KYC

1. Go to **Profile & Settings**
2. Add phone number and country
3. Upload a government ID image
4. Submit for KYC review

> ⏸️ Tell Admin (Tester 1) to approve your KYC.

---

### Step L3 — Connect Freighter Wallet

1. Connect Freighter from the lender dashboard header
2. Make sure your Freighter wallet has:
   - Network: **Testnet** ✅
   - Balance: at least **600 XLM** (500 deposit + fees)

**✅ Expected:** Your address appears in the wallet card

---

### Step L4 — View Available Lending Pools

1. Scroll to **"Available Lending Pools"** table on the dashboard
2. Admin must have created pools (Step A2)

**✅ Expected:** Pool table shows Active pools with APR and available liquidity

---

### Step L5 — Deposit to Pool (Real Stellar Transaction)

1. Scroll to **"Manage Your Deposits"** → **"Deposit to Pool"**
2. Select `TrustLend Alpha Pool`
3. Enter amount: `500`
4. Click **"Deposit Now"**

**5-step real transaction flow begins:**

```
1️⃣ Checking Freighter connection...
2️⃣ Building Stellar payment transaction...
3️⃣ Freighter wallet popup opens
4️⃣ Submitting to Stellar Testnet...
5️⃣ Recording on TrustLend backend...
```

5. In the **Freighter popup** — click **"Approve"** ✅

**✅ Expected:**
- Deposit succeeds — no error
- Pool Available Liquidity increases by 500 XLM
- Your position appears in the dashboard
- **Capital Deployed** metric shows `$500.00`

> 💡 **Verify on Stellar:** Go to `https://stellar.expert/explorer/testnet` → search your wallet address → see the payment transaction with memo `TL-DEPOSIT:...`

---

### Step L6 — View Portfolio & Earnings

1. Click **"Portfolio"** in the lender sidebar
2. See your active position

**✅ Expected:**
- Position shows your principal amount
- Earned interest starts at `$0.00` (increases as borrowers repay)

---

## 🔄 End-to-End Scenario (Full Lifecycle)

Use this timeline to coordinate all 5 testers:

```
Timeline (do in this order):

[T=0min]  🔴 Admin creates 2 lending pools (Pool Management)
[T=2min]  🟢 Lender A & B sign up → complete profiles
[T=3min]  🔵 Borrower A & B sign up → complete profiles
[T=5min]  All 4 users submit KYC documents
[T=6min]  🔴 Admin approves all 4 KYC (KYC Review page)
[T=8min]  🟢 Lender A deposits 500 XLM to Alpha Pool (Freighter signs)
[T=9min]  🟢 Lender B deposits 1000 XLM to Beta Pool (Freighter signs)
[T=10min] 🔵 Borrower A applies → 200 XLM / 30 days
[T=11min] 🔵 Borrower B applies → 500 XLM / 60 days
[T=12min] 🔴 Admin approves Borrower A manually (Pool Management)
[T=13min] 🔴 Admin runs Auto-Match → Borrower B matched to Beta Pool
[T=14min] 🔵 Both borrowers see APPROVED status on dashboard ✅
[T=15min] 🔴 Admin Overview → all metrics updated ✅
```

---

## ✅ Testing Checklist

### 🔴 Admin
- [ ] Login to admin dashboard
- [ ] View user count, loan count metrics
- [ ] Create a lending pool with name + APR
- [ ] Pool appears in Pool Management table
- [ ] Toggle pool: Active → Paused → Active
- [ ] See pending KYC submissions
- [ ] Approve a KYC document
- [ ] Reject a KYC with a reason
- [ ] Approved KYC reflects in borrower's dashboard
- [ ] See pending loans in Pool Management
- [ ] Approve a loan by selecting a pool
- [ ] Pool available liquidity decreases on approval
- [ ] Run Auto-Match → see matched/skipped count
- [ ] Blockchain verification stream shows TX links

### 🔵 Borrower
- [ ] Sign up with role = Borrower
- [ ] Email verification works
- [ ] Fill in profile (name, phone, country)
- [ ] Upload government ID for KYC
- [ ] KYC status shows SUBMITTED
- [ ] After admin approval: KYC shows VERIFIED ✅
- [ ] After admin approval: Trust Score shows real number
- [ ] Max Loan credit reflects trust score × 10
- [ ] Connect Freighter wallet
- [ ] Apply for loan (amount + duration)
- [ ] Loan appears in "Your Loans" with 🟡 REQUESTED
- [ ] After admin approval: loan shows 🔵 APPROVED
- [ ] Active Loans count increments
- [ ] Stellar Profile card shows "Active"
- [ ] "My Loans" nav page shows the loan with correct data

### 🟢 Lender
- [ ] Sign up with role = Lender
- [ ] Complete profile + submit KYC
- [ ] After admin approval: view Available Pools table
- [ ] Connect Freighter wallet (set to Testnet)
- [ ] Freighter has testnet XLM funded via Friendbot
- [ ] Deposit opens Freighter popup ✅
- [ ] After signing in Freighter: deposit succeeds
- [ ] Pool liquidity increases after deposit
- [ ] Position appears in dashboard metrics
- [ ] Capital Deployed metric updates
- [ ] Portfolio page shows the position
- [ ] Can verify TX on Stellar Explorer

---

## 🐛 Known Issues & Workarounds

| # | Issue | Workaround |
|---|-------|-----------|
| 1 | **Freighter popup doesn't appear** | Ensure Freighter is unlocked and set to Testnet. Refresh. |
| 2 | **"Account not found on Stellar"** | Fund via `https://friendbot.stellar.org?addr=YOUR_ADDR` |
| 3 | **Soroban sync warning in console** | Non-critical — the DB record is saved. Soroban RPC timeout is expected on testnet. |
| 4 | **Dashboard shows 0 trust score** | KYC not approved yet. Ask Admin to approve in KYC Review. |
| 5 | **"No active lending pools"** | Admin must create pools first in Pool Management. |
| 6 | **Loan stays at REQUESTED** | Admin must approve in Pool Management → Pending Loan Approvals. |
| 7 | **Deposit fails — "Platform wallet not configured"** | Set `NEXT_PUBLIC_PLATFORM_STELLAR_ADDRESS` in `.env.local`. |
| 8 | **Dashboard slow to load (11+ seconds)** | Soroban RPC timeout — expected on testnet congestion. Dashboard still loads. |

---

## 📝 Feedback Template

Ask each tester to fill this in after testing — send as a form or copy-paste:

```
═══════════════════════════════════════
TrustLend MVP Beta — Tester Feedback
═══════════════════════════════════════

Tester Name: ___________________________
Role Tested: [ ] Admin  [ ] Borrower  [ ] Lender
Date: __________________________________

1. Did you complete all steps in your flow?
   [ ] Yes — completed everything
   [ ] Partial — got stuck at: _______________
   [ ] No — reason: ________________________

2. What worked really well?
   _______________________________________________
   _______________________________________________

3. What did NOT work or confused you?
   _______________________________________________
   _______________________________________________

4. How smooth was the Freighter signing experience? (1–5)
   [ ] 1 (Very confusing)
   [ ] 2
   [ ] 3 (Okay)
   [ ] 4
   [ ] 5 (Very smooth)

5. Was the dashboard easy to understand? (1–5)
   [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5

6. Any important features you expected but didn't find?
   _______________________________________________

7. How trustworthy does the platform feel? (1–5)
   [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5

8. Overall experience rating (1–5):
   [ ] 1  [ ] 2  [ ] 3  [ ] 4  [ ] 5

9. Would you use this with real money?
   [ ] Yes  [ ] Maybe  [ ] No
   Why: __________________________________________

═══════════════════════════════════════
Thank you for testing TrustLend! 🙏
═══════════════════════════════════════
```

---

## 🔑 Quick Reference — Key URLs

| Page | URL |
|------|-----|
| Auth (login / signup) | `/auth` |
| Borrower Dashboard | `/dashboard/borrower` |
| Borrower — My Loans | `/dashboard/borrower/loans` |
| Borrower — Profile | `/dashboard/borrower/profile` |
| Lender Dashboard | `/dashboard/lender` |
| Lender — Portfolio | `/dashboard/lender/portfolio` |
| Lender — Risk | `/dashboard/lender/risk` |
| Admin — Overview | `/dashboard/admin` |
| Admin — KYC Review | `/dashboard/admin/kyc` |
| Admin — Pool Management | `/dashboard/admin/pools` |
| Admin — Loans & Sanctions | `/dashboard/admin/loans` |
| Admin — Users & Segments | `/dashboard/admin/users` |

---

## 🌐 Useful External Links

| Tool | URL | Purpose |
|------|-----|---------|
| Freighter Wallet | https://freighter.app | Browser wallet for Stellar |
| Friendbot (fund testnet) | https://friendbot.stellar.org?addr=YOUR_ADDR | Get 10,000 free testnet XLM |
| Stellar Explorer (Testnet) | https://stellar.expert/explorer/testnet | Verify transactions on-chain |
| Stellar Laboratory | https://lab.stellar.org | Debug Stellar transactions |

---

*TrustLend MVP Testing Guide — v1.0 | Built for 5-tester beta*
