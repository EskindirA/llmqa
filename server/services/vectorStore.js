const { createClient } = require('@supabase/supabase-js');

class VectorStore {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }

  async setupVectorStore() {
    try {
      // Create the documents table if it doesn't exist
      const { error: tableError } = await this.supabase.rpc('create_documents_table');
      
      if (tableError && !tableError.message.includes('already exists')) {
        console.error('Error creating documents table:', tableError);
      }

      return this;
    } catch (error) {
      console.error('Error setting up vector store:', error);
      throw error;
    }
  }

  // Simple text similarity function
  calculateSimilarity(text1, text2) {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    const intersection = words1.filter(word => words2.includes(word));
    const union = [...new Set([...words1, ...words2])];
    return intersection.length / union.length;
  }

  async addDocument(document) {
    try {
      // For now, we'll store documents without embeddings
      // We'll implement a simple text-based search
      const { data: docData, error: docError } = await this.supabase
        .from('documents')
        .insert({
          id: document.id,
          filename: document.filename,
          content: document.content,
          summary: document.summary,
          uploaded_at: document.uploadedAt,
          content_embedding: null // We'll handle this differently
        })
        .select()
        .single();

      if (docError) {
        console.error('Error storing document:', docError);
        throw docError;
      }

      return document.id;
    } catch (error) {
      console.error('Error adding document to vector store:', error);
      throw error;
    }
  }

  async search(query, limit = 3) {
    try {
      // Get all documents
      const { data: documents, error: docError } = await this.supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (docError) {
        console.error('Error fetching documents:', docError);
        throw docError;
      }

      if (!documents || documents.length === 0) {
        return [];
      }

      // Calculate similarity for each document
      const results = documents.map(doc => ({
        id: doc.id,
        filename: doc.filename,
        content: doc.content,
        summary: doc.summary,
        uploadedAt: doc.uploaded_at,
        similarity: this.calculateSimilarity(query, doc.content)
      }));

      // Sort by similarity and limit results
      return results
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit); // No threshold filter, always return top N

    } catch (error) {
      console.error('Error searching vector store:', error);
      throw error;
    }
  }

  async getAllDocuments() {
    try {
      const { data, error } = await this.supabase
        .from('documents')
        .select('*')
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching all documents:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error getting all documents:', error);
      throw error;
    }
  }

  async deleteDocument(documentId) {
    try {
      // Delete document
      const { error: docError } = await this.supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (docError) {
        console.error('Error deleting document:', docError);
        throw docError;
      }

      return true;
    } catch (error) {
      console.error('Error deleting document from vector store:', error);
      throw error;
    }
  }

  splitIntoChunks(text, maxChunkSize = 1000, overlap = 200) {
    if (!text || text.length <= maxChunkSize) {
      return [text];
    }

    const chunks = [];
    let start = 0;

    while (start < text.length) {
      let end = start + maxChunkSize;
      
      // Try to break at a sentence boundary
      if (end < text.length) {
        const lastPeriod = text.lastIndexOf('.', end);
        const lastNewline = text.lastIndexOf('\n', end);
        const breakPoint = Math.max(lastPeriod, lastNewline);
        
        if (breakPoint > start + maxChunkSize * 0.7) {
          end = breakPoint + 1;
        }
      }

      chunks.push(text.substring(start, end).trim());
      start = end - overlap;
    }

    return chunks.filter(chunk => chunk.length > 0);
  }
}

let vectorStoreInstance = null;

async function setupVectorStore() {
  if (!vectorStoreInstance) {
    vectorStoreInstance = new VectorStore();
    await vectorStoreInstance.setupVectorStore();
  }
  return vectorStoreInstance;
}

module.exports = { setupVectorStore }; 