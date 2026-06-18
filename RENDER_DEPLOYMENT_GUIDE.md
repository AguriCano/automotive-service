# Render Deployment Guide for CSE 341 Automotive Service API

## Overview

This guide provides step-by-step instructions for deploying the Automotive Service API to Render, a modern cloud platform for hosting applications.

---

## Prerequisites

Before deploying, ensure you have:

1. **GitHub Repository**: Code pushed to a public GitHub repository
2. **MongoDB Atlas Account**: Active MongoDB database with connection string
3. **Render Account**: Free account at https://render.com
4. **Environment Variables**: JWT secret and MongoDB URI ready

---

## Step 1: Prepare Your GitHub Repository

### Ensure .gitignore is Configured

```
node_modules/
.env
.DS_Store
```

### Push Code to GitHub

```bash
git add .
git commit -m "CSE341 Week 06 Final Project - Add Appointments and Mechanics collections"
git push origin main
```

---

## Step 2: Create Render Account & Connect GitHub

1. Go to https://render.com
2. Click **"Sign Up"** and select **"Sign up with GitHub"**
3. Authorize Render to access your GitHub account
4. You're now logged in to Render

---

## Step 3: Create Web Service

1. In Render dashboard, click **"+ New"** → **"Web Service"**
2. Select your **GitHub repository** (`automotive-service`)
3. Configure the service:
   - **Name**: `automotive-service` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free (sufficient for development)

---

## Step 4: Configure Environment Variables

1. Scroll down to **"Environment Variables"** section
2. Add the following variables:

| Key          | Value                                                        | Description                                          |
| ------------ | ------------------------------------------------------------ | ---------------------------------------------------- |
| `MONGO_URI`  | `mongodb+srv://user:password@cluster.mongodb.net/automotive` | Your MongoDB connection string                       |
| `JWT_SECRET` | `your-secure-secret-key-2026`                                | Your JWT secret (use something secure in production) |
| `PORT`       | `3000`                                                       | Port number (optional, Render assigns automatically) |

### How to Get MongoDB URI

1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Select your cluster
3. Click "Connect" → "Connect with MongoDB URI"
4. Copy the connection string
5. Replace `<password>` with your database password

---

## Step 5: Deploy

1. Click **"Create Web Service"**
2. Render will automatically:
   - Clone your repository
   - Install dependencies (`npm install`)
   - Start the application (`npm start`)
3. Monitor logs for any errors
4. Once deployed, you'll see a URL like: `https://automotive-service.onrender.com`

---

## Step 6: Verify Deployment

### Test the API

```bash
# Replace with your Render URL
RENDER_URL="https://automotive-service.onrender.com"

# Test API is running
curl $RENDER_URL/

# Test authentication
curl -X POST $RENDER_URL/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@automotive.com","password":"admin123"}'

# Access Swagger documentation
curl $RENDER_URL/api-docs
```

### Check Logs

1. Go to your service on Render
2. Click **"Logs"** tab
3. Review for any errors or warnings

---

## Step 7: Configure Custom Domain (Optional)

1. In your Render service dashboard
2. Click **"Settings"** → **"Custom Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

---

## Troubleshooting

### "Cannot find module" Errors

- Solution: Ensure `npm install` ran successfully in build logs
- Delete `node_modules` locally and commit fresh package-lock.json

### MongoDB Connection Failed

- Verify `MONGO_URI` is correct
- Check MongoDB Atlas IP whitelist includes Render's IP (usually set to `0.0.0.0/0`)
- Test connection string locally before deploying

### Port Binding Error

- Render automatically assigns a port
- Remove hardcoded port from `server.js` if present
- Use `process.env.PORT || 3000`

### Application Crashes

- Check logs for error messages
- Ensure all environment variables are set
- Verify package.json has all required dependencies

---

## Monitoring & Maintenance

### View Live Logs

- Render dashboard → Service → "Logs"

### Redeploy with New Changes

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Render will automatically redeploy on push (if auto-deploy is enabled)

### Manual Redeploy

- Render dashboard → Service → "Deployments" → "Deploy latest"

### Update Environment Variables

1. Render dashboard → Service → "Environment"
2. Edit variables and save
3. Service will automatically redeploy

---

## Production Best Practices

### Security

✅ Never commit `.env` file
✅ Use strong JWT_SECRET in production
✅ Enable HTTPS (Render does this automatically)
✅ Validate all inputs
✅ Use MongoDB connection string with strong password

### Performance

✅ Monitor database query performance
✅ Set up appropriate indexes in MongoDB
✅ Use connection pooling (MongoDB driver handles this)
✅ Cache frequently accessed data if needed

### Monitoring

✅ Review logs regularly for errors
✅ Set up alerts for deployment failures
✅ Monitor response times
✅ Track database usage

---

## Common Deployment Issues & Solutions

### Issue: "MONGO_URI is not defined"

**Cause**: Environment variable not set
**Solution**:

1. Go to Render dashboard → Service → Environment
2. Verify `MONGO_URI` is listed
3. Click redeploy

### Issue: "Cannot POST /auth/login"

**Cause**: Routes not properly defined
**Solution**:

1. Check that all route files are updated
2. Verify `routes/index.js` includes all endpoints
3. Test locally before deploying

### Issue: "Timeout" errors in logs

**Cause**: Slow database queries or long startup
**Solution**:

1. Verify MongoDB connection
2. Check network latency
3. Consider upgrading from free plan

### Issue: "CORS errors" in browser

**Cause**: CORS configuration issue
**Solution**: Already configured in `server.js`:

```javascript
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Z-Key",
      "Authorization",
    ],
  }),
);
```

---

## Running Tests on Deployment

To verify all endpoints work in production:

```bash
# Use your Render URL
RENDER_URL="https://your-app.onrender.com"

# Run test suite against production
# (Requires modifying test to use environment variable for base URL)
npm test -- --grep "Appointments"
```

---

## Render Dashboard Overview

### Key Areas

1. **Dashboard**: Overview of all services
2. **Service Page**: Logs, environment, settings, deployments
3. **Environment**: Manage environment variables
4. **Settings**: Custom domain, region, instance type
5. **Logs**: Real-time application logs

---

## After Deployment Checklist

- [x] Service is deployed and running
- [x] Environment variables are set
- [x] API responds to requests
- [x] Swagger documentation is accessible
- [x] Authentication works properly
- [x] Database connection is stable
- [x] Logs show no errors
- [x] Custom domain configured (optional)

---

## Quick Reference URLs

Once deployed, your endpoints will be:

- **API Root**: `https://automotive-service.onrender.com`
- **Swagger Docs**: `https://automotive-service.onrender.com/api-docs`
- **Login**: `POST https://automotive-service.onrender.com/auth/login`
- **Appointments**: `https://automotive-service.onrender.com/appointments`
- **Mechanics**: `https://automotive-service.onrender.com/mechanics`
- **Clients**: `https://automotive-service.onrender.com/clients`
- **Services**: `https://automotive-service.onrender.com/services`

---

## Support

For issues:

1. Check Render logs for error messages
2. Verify environment variables are set correctly
3. Test endpoints locally before diagnosing production issues
4. Review MongoDB Atlas logs for database errors
