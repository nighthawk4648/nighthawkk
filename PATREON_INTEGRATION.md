# Patreon Integration - Frontend Setup Guide

## 🎯 Overview

This frontend integrates with your Patreon-enabled backend to provide:
- OAuth authentication with Patreon
- Patron status verification
- Download access control for premium assets
- User session management

---

## 📁 Files Created/Modified

### New Files Created:
1. **`src/contexts/PatreonAuthContext.js`** - Authentication context provider
2. **`src/components/Providers.jsx`** - Client-side providers wrapper
3. **`src/app/auth/patreon/callback/page.jsx`** - OAuth callback handler
4. **`.env.example`** - Environment variables template

### Modified Files:
1. **`src/app/layout.js`** - Added Providers wrapper
2. **`src/app/pro/[assetName]/page.jsx`** - Integrated Patreon authentication and download verification

---

## ⚙️ Configuration

### 1. Environment Variables

Your `.env` file should contain:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

**For Production:**
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### 2. Backend Requirements

Ensure your backend is running with these endpoints:
- `GET /api/patreon/auth?intent=login` - Get OAuth URL
- `GET /api/patreon/callback?code=xxx` - OAuth callback
- `GET /api/patreon/me` - Get current user (requires JWT)
- `GET /api/patreon/verify` - Verify patron status (requires JWT)
- `GET /api/patreon/check-download/:assetId` - Check download eligibility (requires JWT)

---

## 🔄 Authentication Flow

### Step 1: User Clicks "Login with Patreon"
```
User clicks button → Redirects to backend /api/patreon/auth
```

### Step 2: Patreon OAuth
```
Backend redirects to Patreon → User authorizes → Patreon redirects back
```

### Step 3: Token Exchange
```
Backend receives code → Exchanges for access token → Creates JWT → Redirects to frontend
```

### Step 4: Frontend Callback
```
Frontend receives JWT → Stores in localStorage → Fetches user data → Redirects to /pro
```

### Step 5: Download Verification
```
User clicks download → Verifies patron status → Allows/denies download
```

---

## 🎨 UI Components

### Patron Status Banner
Shows at the top of the page when authenticated:
- ✅ **Green** - Active patron with membership tier
- ⚠️ **Yellow** - Logged in but not an active patron
- 🔒 **Blue** - Not authenticated

### Download Buttons
- **Active Patron**: "⬇️ Download" (blue button)
- **Not Patron**: "🔒 Get Access" (blue button)

### Modal
Shows when user needs to authenticate or subscribe:
- Lists benefits of becoming a patron
- Single "Login with Patreon" button
- Patreon branding color (#FF424D)

---

## 🔐 Security Features

### Token Storage
- JWT tokens stored in `localStorage`
- Automatically cleared on logout or invalid token
- Token sent as `Authorization: Bearer {token}` header

### Protected Routes
The `/pro/[assetName]` page checks:
1. Is user authenticated?
2. Is user an active patron?
3. Can user download this specific asset?

### Error Handling
- Invalid tokens → Auto logout
- Failed API calls → User-friendly error messages
- Network errors → Graceful degradation

---

## 🧪 Testing the Integration

### 1. Start Backend
```bash
cd nighthawk-server
npm start
# Should run on http://localhost:5000
```

### 2. Start Frontend
```bash
cd nighthawkk
npm run dev
# Should run on http://localhost:3000
```

### 3. Test Flow
1. Navigate to `/pro/Mountain` (or any asset name)
2. Click "🔒 Get Access" button
3. Click "Login with Patreon"
4. Authorize on Patreon
5. Should redirect back with green success banner
6. Click "⬇️ Download" to test download

---

## 📊 User States

### State 1: Not Authenticated
- Shows blue banner: "Patreon Members Only"
- Buttons show: "🔒 Get Access"
- Clicking button → Opens login modal

### State 2: Authenticated but Not Patron
- Shows yellow banner: "Patron subscription required"
- Buttons show: "🔒 Get Access"
- Clicking button → Opens subscription modal

### State 3: Active Patron
- Shows green banner with name and tier
- Buttons show: "⬇️ Download"
- Clicking button → Initiates download

---

## 🛠️ Customization

### Change API URL
Edit `src/contexts/PatreonAuthContext.js`:
```javascript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

### Customize Asset IDs
Edit `src/app/pro/[assetName]/page.jsx`:
```javascript
const assets = [
    {
        id: "your_asset_id", // Used for backend verification
        name: "Asset Name",
        downloadUrl: "https://your-cdn.com/file.zip"
    }
];
```

### Modify Redirect After Login
Edit `src/app/auth/patreon/callback/page.jsx`:
```javascript
setTimeout(() => {
    router.push('/your-custom-route'); // Change this
}, 1500);
```

---

## 🐛 Troubleshooting

### "Failed to fetch user data"
- ✅ Check backend is running
- ✅ Verify `NEXT_PUBLIC_API_URL` is correct
- ✅ Check browser console for CORS errors

### "Token expired" or auto-logout
- JWT tokens expire after 7 days (backend setting)
- User needs to login again
- Consider implementing refresh token logic

### Modal doesn't show
- Check React DevTools for state
- Verify `showModal` state is being set
- Check z-index conflicts

### Download doesn't work
- Verify asset ID matches backend
- Check patron status in backend logs
- Ensure user has active Patreon subscription

---

## 🚀 Production Deployment

### 1. Update Environment Variables
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

### 2. Update Backend CORS
Allow your production frontend domain in backend CORS settings.

### 3. Update Backend Redirect URI
In your backend `.env`:
```env
FRONTEND_URL=https://yourdomain.com
```

### 4. Test OAuth Flow
Ensure Patreon OAuth redirect URI matches:
```
https://api.yourdomain.com/api/patreon/callback
```

---

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs for API errors
3. Verify all environment variables are set
4. Test with Patreon sandbox/test account first

---

## ✅ Integration Checklist

- [x] Created PatreonAuthContext
- [x] Created Providers wrapper
- [x] Created OAuth callback page
- [x] Updated root layout
- [x] Integrated into asset download page
- [x] Added patron status verification
- [x] Added download eligibility checks
- [x] Configured environment variables
- [ ] Test with real Patreon account
- [ ] Deploy to production
- [ ] Update Patreon OAuth redirect URIs

---

## 🎉 You're All Set!

The Patreon integration is now complete. Users can:
1. Login with Patreon
2. Verify their patron status
3. Download premium assets if they're active patrons

Happy coding! 🚀
