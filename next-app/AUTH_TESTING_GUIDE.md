# 🧪 Authentication Testing Guide

## Quick Test Checklist

### ✅ Test 1: User Registration
1. Visit http://localhost:3001/auth/register
2. Fill in registration form
3. Submit and verify success message
4. Check email for verification link
5. Click verification link
6. Confirm redirect to login

### ✅ Test 2: Email Verification
1. Click link from registration email
2. Verify success message
3. Confirm automatic redirect to login
4. Try logging in with verified account

### ✅ Test 3: Login with Credentials
1. Visit http://localhost:3001/auth/login
2. Enter email and password
3. Submit and verify redirect to dashboard
4. Check session persistence

### ✅ Test 4: Google OAuth
1. Click "Continue with Google" button
2. Select Google account
3. Grant permissions
4. Verify redirect to dashboard
5. Check user created with Google profile

### ✅ Test 5: Password Reset
1. Click "Forgot password?" on login
2. Enter email address
3. Check email for reset link
4. Click reset link
5. Enter new password
6. Confirm redirect to login
7. Login with new password

### ✅ Test 6: Protected Routes
1. Logout from application
2. Try accessing /dashboard directly
3. Verify redirect to login page
4. Login and verify access granted

### ✅ Test 7: Role-Based Access
1. Login as USER role
2. Try accessing /admin route
3. Verify redirect to dashboard
4. Login as ADMIN role
5. Access /admin successfully

### ✅ Test 8: Session Management
1. Login successfully
2. Check browser cookies for session token
3. Wait 15+ minutes (access token expiry)
4. Refresh page
5. Verify automatic token refresh
6. Session remains active

## Expected Results

All tests should pass without errors. Authentication system is production-ready.
