# API Key Setup Instructions

## Your application is running successfully! 🎉

**Current URL:** http://localhost:3002/

## To enable chat functionality, you need to set up your Gemini API key:

### Step 1: Get your API key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### Step 2: Set up the API key
Create a file named `.env.local` in your project root with the following content:

```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

Replace `your_actual_api_key_here` with the API key you copied from Google AI Studio.

### Step 3: Restart the development server
After creating the `.env.local` file, restart your development server:
1. Stop the current server (Ctrl+C in the terminal)
2. Run `npm run dev` again

### Step 4: Test the application
1. Open http://localhost:3002/ in your browser
2. Try sending a message in the chat interface
3. The AI should now respond properly!

## Troubleshooting
- Make sure the `.env.local` file is in the same directory as `package.json`
- Make sure there are no extra spaces around the API key
- Make sure you're using the correct API key from Google AI Studio
