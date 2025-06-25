class LLMService {
  constructor() {
    this.initialized = true;
    console.log('Simple LLM service initialized (no external dependencies)');
  }

  async generateSummary(text) {
    try {
      // Simple text summarization using basic NLP techniques
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = text.toLowerCase().split(/\s+/).filter(w => w.length > 3);
      
      // Count word frequency
      const wordFreq = {};
      words.forEach(word => {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      });
      
      // Get top sentences based on word frequency
      const sentenceScores = sentences.map(sentence => {
        const sentenceWords = sentence.toLowerCase().split(/\s+/);
        const score = sentenceWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0);
        return { sentence: sentence.trim(), score };
      });
      
      // Sort by score and take top 2-3 sentences
      const topSentences = sentenceScores
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(3, sentences.length))
        .map(item => item.sentence);
      
      return topSentences.join('. ') + '.';
    } catch (error) {
      console.error('Error generating summary:', error);
      return 'Summary generation failed.';
    }
  }

  async answerQuestion(question, context) {
    try {
      // Simple question answering using keyword matching
      const questionWords = question.toLowerCase().split(/\s+/);
      const contextSentences = context.split(/[.!?]+/).filter(s => s.trim().length > 0);
      
      // Find sentences that contain question words
      const relevantSentences = contextSentences.filter(sentence => {
        const sentenceLower = sentence.toLowerCase();
        return questionWords.some(word => 
          word.length > 3 && sentenceLower.includes(word)
        );
      });
      
      if (relevantSentences.length === 0) {
        return "I couldn't find specific information in the documents to answer your question.";
      }
      
      // Return the most relevant sentence(s)
      return relevantSentences.slice(0, 2).join(' ');
    } catch (error) {
      console.error('Error answering question:', error);
      return 'Error processing your question.';
    }
  }

  async testModel() {
    return { 
      available: true, 
      model: 'Simple Text Processor',
      response: 'Hello, I am working correctly with basic text processing.'
    };
  }
}

// Create singleton instance
const llmService = new LLMService();

// Export functions that use the singleton
async function generateSummary(text) {
  return await llmService.generateSummary(text);
}

async function answerQuestion(question, context) {
  return await llmService.answerQuestion(question, context);
}

async function testModel() {
  return await llmService.testModel();
}

module.exports = { 
  generateSummary, 
  answerQuestion, 
  testModel 
}; 