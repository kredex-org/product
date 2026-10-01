# KYC Identity Verification - Setup Guide

## Overview
This system implements real-time, immutable identity verification using **Supabase Storage + Database**.

- **Files are stored in Supabase Storage** (secure, organized by user, RLS-protected)
- **References stored in PostgreSQL** (queryable, with admin-only access)
- **Admin approval workflow** (frontend dashboard for verification)
- **No external dependencies** (everything in Supabase)

---

## 🔧 Setup Steps

### 1. **Create KYC Documents Bucket in Supabase**

1. Open Supabase Dashboard → Your Project
2. Go to **Storage** → **New Bucket**
3. Create bucket named: `kyc-documents`
4. Set **Visibility**: Private (documents only accessible to authenticated users)
5. Click **Create Bucket**

### 2. **Update Supabase Schema**
Run the SQL migrations in `docs/KYC_SCHEMA.sql`:

1. Open Supabase Dashboard → **SQL Editor** → **New Query**
2. Copy the entire contents of `docs/KYC_SCHEMA.sql`
3. Paste and click **Run**

This will:
- ✅ Add 5 new columns to `profiles` table
- ✅ Create indexes for fast queries
- ✅ Set up RLS policies (admin-only document access)
- ✅ Create admin view for the KYC dashboard

### 3. **Set Up Storage RLS Policies**

Go to **Storage** → **kyc-documents** → **Policies**

Create these policies:

**Policy 1: Users can upload their own documents**
```sql
CREATE POLICY "Users can upload their own KYC"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'kyc-documents' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 2: Admins can view all documents**
```sql
CREATE POLICY "Admins can view all KYC documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'kyc-documents'
    AND EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

**Policy 3: Users can view their own documents**
```sql
CREATE POLICY "Users can view own KYC documents"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'kyc-documents'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );
```

**Policy 4: Prevent document deletion** (immutability)
```sql
CREATE POLICY "Documents cannot be deleted"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (false);  -- Deny all deletes
```

### 4. **Ensure Your Admins Have role='admin'**
Check that admin users in your `profiles` table have:
```sql
SELECT id, full_name, email, role FROM profiles WHERE role = 'admin';
```

If not, update:
```sql
UPDATE profiles SET role = 'admin' WHERE email = 'admin@trustlend.com';
```

### 5. **Restart Dev Server**
```bash
npm run dev
```

---

## 📋 How It Works

### User Flow: Upload Government ID

1. **User goes to**: `/dashboard/lender/profile`
2. **Fills form** with: Full Name, Phone, Country Code, Government ID file
3. **Clicks "Save & Verify Identity"**
4. **Backend processes**:
   - Validates user + file type + size
   - Creates/verifies `kyc-documents` storage bucket
   - Uploads file to `kyc-documents/{userId}/government_id_{timestamp}`
   - Gets public URL from Supabase Storage
   - Stores URL + path in `profiles` table
   - Sets `kyc_status = "submitted"`
5. **User sees**: Upload progress bar → "Document uploaded. Awaiting admin review."

### Admin Flow: Review & Approve

1. **Admin goes to**: `/dashboard/admin/kyc`
2. **Sees list of** pending documents (status = "submitted")
3. **Clicks a document** to view it
4. **Document loads from Supabase Storage** (authorized by RLS)
5. **Either**:
   - ✅ **Approve**: Sets `kyc_status = "verified"` + timestamp
   - ❌ **Reject**: Sets `kyc_status = "rejected"` + rejection reason
6. **Lender sees** "✅ Verified" badge next on KYC Status

### Lender Profile Display

Once verified, the lender's profile shows:
```
KYC Status: VERIFIED ✅
```

This badge appears on:
- `/dashboard/lender/profile` (their own view)
- Admin dashboard (future enhancement)
- User listings (for trust display)

---

## 🔐 Security & Privacy

### What's Immutable (in Security Bucket)?
- ✅ The actual government ID image/PDF
- ✅ Cannot be deleted (RLS policy prevents it)
- ✅ Owned by user (path includes userId)
- ✅ Only accessible via public URL (authenticated download)

### What's Private (in PostgreSQL)?
- ✅ Document URL (stored in database)
- ✅ Storage path (stored in database)
- ✅ Metadata (kyc_status, timestamps, rejection reasons)
- ✅ User cannot delete their own document reference
- ✅ Only admins can approve/reject

### Admin Access Control (RLS)
- Only users with `role = 'admin'` can:
  - See the KYC admin dashboard
  - View document URLs
  - Access storage objects
  - Approve/reject documents
- Regular users cannot see other users' documents
- Public URL requires authentication to view

---

## 🧪 Testing

### Test File Upload
1. Go to `/dashboard/lender/profile`
2. Upload a test image (JPG/PNG)
3. Click "Save & Verify Identity"
4. Watch browser console for upload logs
5. Should see: `✅ KYC document uploaded for user {userId}`

### Test Admin Review
1. Log in as an admin user (role = 'admin' in database)
2. Go to `/dashboard/admin/kyc`
3. You should see pending documents
4. Click one to view (should load from Supabase Storage)
5. Try approving - should show success message

### Common Issues

**❌ "Bucket kyc-documents not found"**
- Go to Supabase Storage and manually create bucket named `kyc-documents`
- System will auto-create on first upload if bucket doesn't exist

**❌ Document not loading from Supabase**
- Check RLS policies are set up correctly
- Verify user (admin) has `role = 'admin'`
- Check browser console for exact error

**❌ Admin can't see KYC documents**
- Verify user has `role = 'admin'` in profiles table
- Check storage RLS policies were created
- Refresh admin page

**❌ File upload fails**
- Check file format (JPG, PNG, WebP, PDF only)
- Check file size (max 10MB)
- Check Storage bucket exists and is configured

---

## 📊 Database Schema

```
profiles table (existing + new columns):
├── id (UUID) ✅ existing
├── email (VARCHAR) ✅ existing
├── full_name (VARCHAR) ✅ existing
├── phone (VARCHAR) ✅ existing
├── country_code (VARCHAR) ✅ existing
├── role (VARCHAR) ✅ existing
├── kyc_status (VARCHAR: pending/submitted/verified/rejected) ✅ existing
│
├── government_id_ipfs_hash (VARCHAR) 🆕 NEW
├── government_id_url (TEXT) 🆕 NEW
├── kyc_submitted_at (TIMESTAMP) 🆕 NEW
├── kyc_verified_at (TIMESTAMP) 🆕 NEW
└── kyc_rejection_reason (TEXT) 🆕 NEW
```

---

## 🚀 API Endpoints

### Client-Side Actions

**Upload KYC Document** (from `app/actions/kyc-upload.ts`):
```typescript
const result = await uploadKYCDocument(formData);
// Returns: { success: bool, hash?: string, error?: string }
```

### Admin Actions (from `app/actions/admin-kyc.ts`)

**Get Pending Documents**:
```typescript
const docs = await getPendingKYCDocuments();
// Returns: Array of {id, email, full_name, kyc_status, government_id_url, submitted_at}
```

**Verify Document**:
```typescript
await verifyKYCDocument(userId, approved: bool, rejectionReason?: string);
// approved=true → kyc_status = "verified"
// approved=false → kyc_status = "rejected"
```

---

## ✅ Verification Checklist

- [ ] Web3.storage token added to `.env.local`
- [ ] SQL migrations run in Supabase
- [ ] At least one admin user has `role = 'admin'` in profiles table
- [ ] `npm install` completed (web3.storage installed)
- [ ] Dev server restarted
- [ ] Profile page loads (`/dashboard/lender/profile`)
- [ ] Admin KYC page accessible (`/dashboard/admin/kyc`)
- [ ] Test file upload & approval workflow

---

## 🔗 Resources

- **Web3.storage**: https://web3.storage (free IPFS hosting)
- **Supabase RLS**: https://supabase.com/docs/guides/auth/row-level-security
- **IPFS**: https://ipfs.io (distributed file storage)

