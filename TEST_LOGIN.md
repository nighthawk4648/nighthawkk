# 🧪 Test Your Patreon Login

## Check if You're Currently Logged In

### Method 1: Browser Console
1. Press **F12** to open Developer Tools
2. Go to **Console** tab
3. Type: `localStorage.getItem('patreon_token')`
4. If you see a long string → You're logged in ✅
5. If you see `null` → You're not logged in ❌

### Method 2: Check the Page
Look at the top of `/pro/[assetName]` page:

**Logged In + Active Patron:**
```
✓ Active Patron - [Your Name]
[Membership Tier] Tier Member
```
- Buttons show: "⬇️ Download"

**Logged In + NOT Patron:**
```
⚠️ Logged in as [email] - Patron subscription required
```
- Buttons show: "🔒 Get Access"

**Not Logged In:**
```
🔒 Patreon Members Only - Please login to access premium content
```
- Buttons show: "🔒 Get Access"

---

## Test Persistent Login

### Step 1: Verify You're Logged In
- Check localStorage has token (see above)
- Check you see green/yellow banner

### Step 2: Close Browser Tab
- Close the tab completely
- Or close entire browser

### Step 3: Reopen Site
- Go to `http://localhost:3000/pro/Mountain`
- Wait for page to load

### Step 4: Check Status
- Should see the same banner (green or yellow)
- Should NOT ask you to login again
- Token is still in localStorage

---

## Manual Logout Test

### To Logout Manually:
Open browser console and run:
```javascript
localStorage.removeItem('patreon_token')
location.reload()
```

This will:
1. Remove your token
2. Reload the page
3. Show "Not logged in" state
4. Ask you to login again

---

## Check Your Patron Status

### In Browser Console:
```javascript
// Check if token exists
console.log('Token:', localStorage.getItem('patreon_token') ? 'EXISTS' : 'NONE');

// Check user data (if you're on the page)
// This will be in React DevTools under PatreonAuthContext
```

### Expected Behavior:

**If you're a patron of YOUR campaign:**
- Green banner
- Can download assets
- See your membership tier

**If you're NOT a patron:**
- Yellow banner (if logged in)
- Blue banner (if not logged in)
- Cannot download - shows subscription modal

---

## Token Expiry

Your JWT token expires after **7 days**. After that:

1. Token becomes invalid
2. API calls return 401 Unauthorized
3. App automatically logs you out
4. Clears localStorage
5. Shows "Not logged in" state

To test token expiry (don't do this in production):
- Manually delete token: `localStorage.removeItem('patreon_token')`
- Reload page
- Should show logged out state

---

## Troubleshooting

### "I'm logged in but see yellow banner"
- You're authenticated but NOT an active patron of your campaign
- Check your Patreon subscription status
- Verify `PATREON_CAMPAIGN_ID` in backend matches your campaign

### "Token exists but I'm logged out"
- Token might be expired or invalid
- Check backend logs for errors
- Try manual logout and login again

### "Page keeps asking me to login"
- Check if token is being saved: `localStorage.getItem('patreon_token')`
- Check browser console for errors
- Verify backend callback is returning token correctly

---

## Quick Commands

```javascript
// Check token
localStorage.getItem('patreon_token')

// Manual logout
localStorage.removeItem('patreon_token'); location.reload()

// Check all localStorage
console.log(localStorage)
```
