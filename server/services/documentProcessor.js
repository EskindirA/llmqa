const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

class DocumentProcessor {
  static async processDocument(filePath) {
    const fileExtension = path.extname(filePath).toLowerCase();
    
    try {
      switch (fileExtension) {
        case '.pdf':
          return await this.processPDF(filePath);
        case '.docx':
        case '.doc':
          return await this.processWord(filePath);
        case '.txt':
        case '.md':
          return await this.processText(filePath);
        default:
          throw new Error(`Unsupported file type: ${fileExtension}`);
      }
    } catch (error) {
      console.error(`Error processing document: ${error.message}`);
      throw error;
    }
  }

  static async processPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      
      // Try different PDF parsing options
      const options = {
        // Try to handle corrupted PDFs
        normalizeWhitespace: true,
        disableCombineTextItems: false
      };
      
      const data = await pdfParse(dataBuffer, options);
      
      if (!data.text || data.text.trim().length === 0) {
        throw new Error('No text content found in PDF');
      }
      
      return data.text.trim();
    } catch (error) {
      console.error('Error processing PDF:', error);
      
      // If PDF parsing fails, try to extract any readable text
      try {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdfParse(dataBuffer, { 
          normalizeWhitespace: true,
          disableCombineTextItems: true,
          verbosity: 0
        });
        
        if (data.text && data.text.trim().length > 0) {
          return data.text.trim();
        }
      } catch (fallbackError) {
        console.error('Fallback PDF processing also failed:', fallbackError);
      }
      
      throw new Error(`Failed to process PDF: ${error.message}`);
    }
  }

  static async processWord(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      
      if (!result.value || result.value.trim().length === 0) {
        throw new Error('No text content found in Word document');
      }
      
      return result.value.trim();
    } catch (error) {
      console.error('Error processing Word document:', error);
      throw new Error(`Failed to process Word document: ${error.message}`);
    }
  }

  static async processText(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      if (!content || content.trim().length === 0) {
        throw new Error('No content found in text file');
      }
      
      return content.trim();
    } catch (error) {
      console.error('Error processing text file:', error);
      throw new Error(`Failed to process text file: ${error.message}`);
    }
  }

  static cleanText(text) {
    if (!text) return '';
    
    return text
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
      .trim();
  }

  static splitIntoChunks(text, maxChunkSize = 1000, overlap = 200) {
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

module.exports = { processDocument: DocumentProcessor.processDocument.bind(DocumentProcessor) }; 