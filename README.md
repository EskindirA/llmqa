# LLMQA - AI Text Summarizer

A powerful AI-powered text summarizer with document upload capabilities and intelligent question answering using a simple text-based search system with Supabase storage.

## 🚀 Features

- **Document Upload**: Support for PDF, Word (DOCX/DOC), and text files
- **AI Summarization**: Automatic text extraction and AI-powered summarization
- **Question Answering**: Ask questions about uploaded documents using text-based similarity search
- **Document Storage**: Persistent document storage using Supabase
- **Modern UI**: Beautiful, responsive React frontend with animations
- **Simple & Fast**: No external LLM dependencies required for basic functionality

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express
- **Simple Text Processing** for summarization and Q&A
- **Supabase** for document storage
- **Multer** for file uploads
- **pdf-parse** & **mammoth** for document processing

### Frontend
- **React** with modern hooks
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons
- **React Dropzone** for file uploads

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd llmqa
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Return to root
cd ..
```

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to your project dashboard
3. Navigate to **Settings → API** to get your credentials
4. Copy the **Project URL** and **API keys**

### 4. Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Server Configuration
PORT=3001
NODE_ENV=development
```

**Important**: Make sure your `SUPABASE_URL` uses the correct format: `https://your-project-id.supabase.co` (not the dashboard URL).

### 5. Start the Application

```bash
# Start both server and client
npm run dev

# Or start them separately:
# Terminal 1 - Start server
npm run server

# Terminal 2 - Start client
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## 📖 Usage

### 1. Upload Documents
- Navigate to the "Upload Document" tab
- Drag and drop or click to select a file
- Supported formats: PDF, DOCX, DOC, TXT, MD
- Maximum file size: 10MB

### 2. View Documents
- Go to the "Documents" tab to see all uploaded files
- Click "Show" to view AI-generated summaries
- Delete documents using the trash icon

### 3. Ask Questions
- Switch to the "Ask Questions" tab
- Type your question about the uploaded documents
- Get answers based on text similarity matching

## 🔧 Current Implementation

### Text Processing
The application currently uses a simple text-based approach:
- **Summarization**: Extracts key sentences and creates a summary
- **Question Answering**: Uses word overlap similarity to find relevant content
- **No External LLM**: Works without requiring OpenAI or Llama models

### Document Storage
- Documents are stored in Supabase database
- Content is indexed for text-based search
- Persistent storage across server restarts

### File Processing
- **PDF**: Uses pdf-parse for text extraction (some PDFs may have parsing issues)
- **Word**: Uses mammoth for DOCX/DOC processing
- **Text**: Direct file reading for TXT/MD files

## 🏗️ Project Structure

```
llmqa/
├── server/                 # Backend application
│   ├── services/          # Business logic
│   │   ├── documentProcessor.js
│   │   ├── vectorStore.js
│   │   └── llmService.js
│   ├── uploads/           # Temporary file storage
│   ├── index.js           # Express server
│   └── package.json
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🔒 Security Considerations

- File upload validation and sanitization
- Environment variable protection
- CORS configuration
- File size limits
- Temporary file cleanup

## 🚀 Deployment

### Backend Deployment

1. Set up environment variables on your hosting platform
2. Install dependencies: `npm install`
3. Start the server: `npm start`

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Update the API endpoint in production

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

1. **Supabase connection error**: 
   - Check that your `SUPABASE_URL` is in the correct format: `https://your-project-id.supabase.co`
   - Verify your API keys are correct
   - Ensure your Supabase project is active

2. **File upload fails**: 
   - Verify file type and size limits
   - Check that the file field name is `document` (not `file`)

3. **PDF parsing errors**: 
   - Some PDFs may have compatibility issues
   - Try converting to text format for better results

4. **Search not finding results**: 
   - The current implementation uses simple word overlap
   - Try using keywords that appear in your documents
   - Results are ranked by similarity score

### Getting Help

- Check the console for error messages
- Verify all environment variables are set correctly
- Ensure all dependencies are installed
- Check Supabase dashboard for database issues

## 🎯 Future Enhancements

- [ ] Integration with real LLM models (Llama, OpenAI)
- [ ] Vector embeddings for better semantic search
- [ ] User authentication and document sharing
- [ ] Batch document processing
- [ ] Advanced search filters
- [ ] Export functionality
- [ ] Mobile app
- [ ] API rate limiting
- [ ] Document versioning
- [ ] Collaborative features

## 📊 Current Limitations

- **Simple Search**: Uses basic word overlap instead of semantic search
- **No LLM Integration**: Currently uses text processing instead of AI models
- **PDF Compatibility**: Some PDFs may not parse correctly
- **Memory-based**: Vector store is not persistent across server restarts (documents are stored in database)

## 🔄 Recent Updates

- Fixed Supabase URL configuration issue
- Updated server port to 3001 to avoid conflicts
- Improved text-based search functionality
- Added better error handling for file uploads
- Simplified LLM service to work without external dependencies 