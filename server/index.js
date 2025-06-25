const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const { processDocument } = require('./services/documentProcessor');
const { setupVectorStore } = require('./services/vectorStore');
const { generateSummary, answerQuestion } = require('./services/llmService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'text/plain',
      'text/markdown'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, Word, and text files are allowed.'), false);
    }
  }
});

// Initialize vector store
let vectorStore;

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Upload and process document
app.post('/api/upload', upload.single('document'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Processing file:', req.file.originalname);
    
    // Extract text from document
    const extractedText = await processDocument(req.file.path);
    
    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'Could not extract text from document' });
    }

    // Generate summary
    const summary = await generateSummary(extractedText);
    
    // Setup vector store and store document
    vectorStore = await setupVectorStore();
    const documentId = await vectorStore.addDocument({
      id: uuidv4(),
      filename: req.file.originalname,
      content: extractedText,
      summary: summary,
      uploadedAt: new Date().toISOString()
    });

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      documentId,
      filename: req.file.originalname,
      summary,
      message: 'Document processed successfully'
    });

  } catch (error) {
    console.error('Error processing document:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ 
      error: 'Error processing document',
      details: error.message 
    });
  }
});

// Ask question about uploaded documents
app.post('/api/ask', async (req, res) => {
  try {
    const { question } = req.body;
    
    if (!question || question.trim().length === 0) {
      return res.status(400).json({ error: 'Question is required' });
    }

    if (!vectorStore) {
      return res.status(400).json({ error: 'No documents uploaded yet' });
    }

    // Search for relevant content
    const relevantDocs = await vectorStore.search(question, 3);
    
    if (!relevantDocs || relevantDocs.length === 0) {
      return res.json({
        answer: "I couldn't find relevant information in the uploaded documents to answer your question.",
        sources: []
      });
    }

    // Generate answer using LLM
    const context = relevantDocs.map(doc => doc.content).join('\n\n');
    const answer = await answerQuestion(question, context);

    res.json({
      answer,
      sources: relevantDocs.map(doc => ({
        filename: doc.filename,
        content: doc.content.substring(0, 200) + '...'
      }))
    });

  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ 
      error: 'Error answering question',
      details: error.message 
    });
  }
});

// Get all uploaded documents
app.get('/api/documents', async (req, res) => {
  try {
    if (!vectorStore) {
      return res.json({ documents: [] });
    }

    const documents = await vectorStore.getAllDocuments();
    res.json({ documents });

  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ 
      error: 'Error fetching documents',
      details: error.message 
    });
  }
});

// Delete a document
app.delete('/api/documents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!vectorStore) {
      return res.status(404).json({ error: 'No documents found' });
    }

    await vectorStore.deleteDocument(id);
    res.json({ success: true, message: 'Document deleted successfully' });

  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ 
      error: 'Error deleting document',
      details: error.message 
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    details: error.message 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 