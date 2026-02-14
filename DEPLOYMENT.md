# Vercel Deployment Checklist

## Pre-Deployment Setup

### 1. Get Gemini API Key
- [ ] Visit https://aistudio.google.com/app/apikey
- [ ] Create a new API key
- [ ] Copy the key for later use

### 2. Prepare Repository
- [ ] Create a GitHub repository
- [ ] Push your code to GitHub
```bash
git init
git add .
git commit -m "Initial commit - AuraHealth Medicare App"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Vercel Deployment

### 3. Import Project to Vercel
- [ ] Go to https://vercel.com
- [ ] Sign in with GitHub
- [ ] Click "Add New Project"
- [ ] Import your repository
- [ ] Framework Preset: **Vite** (auto-detected)
- [ ] Root Directory: `./`
- [ ] Build Command: `npm run build` (auto-detected)
- [ ] Output Directory: `dist` (auto-detected)

### 4. Configure Environment Variables
- [ ] In Vercel project settings, go to **Environment Variables**
- [ ] Add the following variable:
  - **Name**: `VITE_GEMINI_API_KEY`
  - **Value**: (paste your Gemini API key)
  - **Environment**: Select all (Production, Preview, Development)
- [ ] Click **Save**

### 5. Deploy
- [ ] Click **Deploy**
- [ ] Wait for deployment to complete (usually 1-2 minutes)
- [ ] Your app will be live at: `https://your-project-name.vercel.app`

## Post-Deployment

### 6. Test the Deployed App
- [ ] Visit your deployed URL
- [ ] Verify the landing page loads
- [ ] Check if "Use Configured API Key" button appears (it should!)
- [ ] Click the button to proceed to dashboard
- [ ] Test key features:
  - [ ] AI Nurse Chat
  - [ ] Vitals Tracker
  - [ ] Appointments Hub (verify nearby hospitals load)
  - [ ] Diet Plan (verify Indian cuisine recommendations)
  - [ ] Hospital Locator

### 7. Custom Domain (Optional)
- [ ] Go to Vercel project settings → **Domains**
- [ ] Add your custom domain
- [ ] Follow DNS configuration instructions

## Troubleshooting

### App shows "API key not configured"
- ✓ Check Environment Variables are set correctly
- ✓ Ensure variable name is **exactly** `VITE_GEMINI_API_KEY`
- ✓ Redeploy the project after adding environment variables

### Build fails
- ✓ Check build logs in Vercel dashboard
- ✓ Ensure all dependencies are in `package.json`
- ✓ Run `npm install` and `npm run build` locally first

### Features not working
- ✓ Check browser console for errors (F12)
- ✓ Verify API key has correct permissions
- ✓ Check Gemini API quota hasn't been exceeded

## Environment Variable Modes

Your app supports two modes:

### Mode 1: With Environment Variable (Recommended for Vercel)
- Users see "Use Configured API Key" button on landing page
- Seamless experience, no API key entry needed
- Best for public deployments

### Mode 2: User-Provided Key
- Users can still enter their own API key
- User keys take priority over environment variables
- Best for privacy-conscious users

## Security Notes

- ⚠️ Never expose API keys in client-side code
- ✅ Environment variables are safe (bundled at build time)
- ✅ User-entered keys are stored locally only
- 🔒 Keys never sent to any server except Google Gemini

## Monitoring & Maintenance

### Check Usage
- Monitor Gemini API usage: https://console.cloud.google.com/
- Check Vercel analytics: Vercel Dashboard → Analytics

### Update Deployment
```bash
# Make changes locally
git add .
git commit -m "Your update message"
git push

# Vercel auto-deploys on every push to main branch
```

### Manual Redeploy
- Go to Vercel Dashboard → Deployments
- Click ⋯ on latest deployment → Redeploy

## Success! 🎉

Your AuraHealth Medicare Assistant is now live and accessible worldwide!

Share your deployment URL and help people manage their health with AI.
