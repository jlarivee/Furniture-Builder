# Replit Setup Guide for Furniture Plan Generator

This guide will help you get the Furniture Plan Generator running on Replit in just a few minutes.

## Step-by-Step Setup

### Step 1: Get Your API Keys

Before starting, you'll need API keys from two services:

#### Anthropic API Key (Claude)
1. Go to [https://console.anthropic.com/](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** in the dashboard
4. Click **Create Key**
5. Copy the key (it starts with `sk-ant-`)

#### OpenAI API Key (DALL-E)
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Sign up or log in to your account
3. Click **Create new secret key**
4. Copy the key (it starts with `sk-`)

**Important**: Keep these keys safe and never share them publicly!

### Step 2: Add API Keys to Replit Secrets

1. In your Replit workspace, look at the left sidebar
2. Click the **Secrets** tab (🔒 lock icon)
3. Add your first secret:
   - Click **New Secret**
   - Key: `ANTHROPIC_API_KEY`
   - Value: Paste your Anthropic API key
   - Click **Add Secret**

4. Add your second secret:
   - Click **New Secret** again
   - Key: `OPENAI_API_KEY`
   - Value: Paste your OpenAI API key
   - Click **Add Secret**

### Step 3: Run the Application

1. Click the big green **Run** button ▶️ at the top of the Replit interface
2. Wait for the installation to complete (first run takes 1-2 minutes)
3. You'll see logs indicating both servers are starting:
   ```
   🚀 Server running on http://0.0.0.0:3001
   ✅ Ready to accept connections from Replit
   ```

4. The application will automatically open in the Replit webview

### Step 4: Use the Application

Once running, you can:

1. **Use the embedded webview** in Replit (right side panel)
2. **Open in a new tab** by clicking the "Open in new tab" icon at the top of the webview
3. **Share your Repl** with others (they won't see your API keys)

## Using the Furniture Plan Generator

### 1. Input Phase
- Enter a description of the furniture you want to build
- Example: "A modern coffee table, 48 inches long, 24 inches wide, made from walnut with hairpin legs"
- Optionally upload a reference image
- Click "Generate Design"

### 2. Design Phase
- View the AI-generated preview image
- Chat with Claude to refine the design
- Request modifications: "Make it taller", "Change the material to oak"
- When satisfied, click "Lock Design"

### 3. Documentation Phase
- View complete build documentation:
  - Cut List: All parts with exact measurements
  - Materials List: Shopping list with costs
  - Build Instructions: Step-by-step guide
  - Multiple Views: Professional renderings
- Download all as ZIP or individual PDFs

## Troubleshooting

### "API Key not found" Error
- Make sure you added both secrets in Replit Secrets
- Check that the secret names are exactly: `ANTHROPIC_API_KEY` and `OPENAI_API_KEY`
- Try stopping and restarting your Repl

### "Failed to generate design" Error
- Verify your API keys are valid and active
- Check that you have credits/quota remaining on both APIs
- Try with a simpler description first

### Application won't start
- Check the Console tab for error messages
- Make sure all dependencies installed successfully
- Try clicking "Run" again

### Slow image generation
- DALL-E image generation takes 10-30 seconds per image
- The app generates multiple images, so be patient
- This is normal and expected behavior

## Cost Considerations

Each furniture plan generation costs approximately **$0.50-$2.00** in API usage:

- **Claude API**: ~$0.01-$0.10 per design (text generation)
- **DALL-E API**: ~$0.04 per image × 4-7 images = ~$0.16-$0.28

Make sure you have sufficient credits in both API accounts.

## Replit-Specific Features

### Always-On
If you have a paid Replit plan, you can enable "Always On" to keep your app running 24/7.

### Custom Domain
With Replit paid plans, you can add a custom domain to your furniture planner.

### Collaboration
You can invite others to collaborate on the code in Replit.

## Security Notes

- API keys are stored securely in Replit Secrets
- Never commit API keys to version control
- Don't share your Repl with untrusted users if you have API keys configured
- Replit Secrets are encrypted and not visible to viewers of your Repl

## Getting Help

If you encounter issues:

1. Check the Console tab in Replit for error messages
2. Review the main README.md for additional documentation
3. Verify your API keys are correct and have sufficient quota
4. Try stopping the Repl completely and running again

## API Links

- Anthropic Console: [https://console.anthropic.com/](https://console.anthropic.com/)
- OpenAI Platform: [https://platform.openai.com/](https://platform.openai.com/)
- Replit Documentation: [https://docs.replit.com/](https://docs.replit.com/)

---

**Ready to build some furniture!** 🔨🪚

Click the Run button to get started!
