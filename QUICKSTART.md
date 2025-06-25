# 🚀 Quick Start Guide

Get LLMQA running in 5 minutes!

## Prerequisites

- Node.js 16+ installed
- A Supabase account (free at [supabase.com](https://supabase.com))

## 1. Install Dependencies

```bash
# Run the automated setup
./setup.sh

# Or manually:
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

## 2. Set Up Supabase (2 minutes)

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to SQL Editor and run this command:
   ```sql
   CREATE EXTENSION IF NOT EXISTS vector;
   ```
4. Copy the contents of `server/supabase-setup.sql` and run it in the SQL Editor
5. Go to Settings > API and copy your:
   - Project URL
   - Anon public key
   - Service role key

## 3. Configure Environment

```bash
cd server
cp env.example .env
```

Edit `server/.env` with your Supabase credentials:

```env
SUPABASE_URL=your_project_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_key_optional
```

## 4. Start the Application

```bash
# Start both server and client
npm run dev
```

Visit http://localhost:3000 and start uploading documents!

## 🎯 What You Can Do

1. **Upload Documents**: PDF, Word, or text files
2. **Get AI Summaries**: Automatic summarization of your documents
3. **Ask Questions**: Query your documents with natural language
4. **View Sources**: See which parts of documents were used for answers

## 🔧 Optional: Add Llama Support

For local AI processing (no API costs):

1. Download a Llama model (e.g., llama-2-7b-chat.gguf)
2. Place it in `server/models/`
3. Add to your `.env`:
   ```env
   LLAMA_MODEL_PATH=./models/llama-2-7b-chat.gguf
   ```

## 🆘 Need Help?

- Check the console for error messages
- Verify your Supabase setup
- Ensure all environment variables are set
- Run `node test-setup.js` to verify installation

## 📱 Features

- ✅ Drag & drop file upload
- ✅ PDF, Word, and text support
- ✅ AI-powered summarization
- ✅ Question answering
- ✅ Vector search
- ✅ Beautiful responsive UI
- ✅ Real-time notifications
- ✅ Document management

Happy document processing! 🎉 