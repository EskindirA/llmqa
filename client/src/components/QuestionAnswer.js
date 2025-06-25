import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, FileText, Loader, Bot, User, Copy, Check } from 'lucide-react';

const QuestionAnswer = ({ documents, showNotification }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      showNotification('Please enter a question', 'error');
      return;
    }

    if (documents.length === 0) {
      showNotification('Please upload at least one document first', 'error');
      return;
    }

    setLoading(true);
    setAnswer('');
    setSources([]);

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: question.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get answer');
      }

      const data = await response.json();
      setAnswer(data.answer);
      setSources(data.sources || []);

    } catch (error) {
      console.error('Error asking question:', error);
      showNotification(error.message || 'Error getting answer', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      showNotification('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      showNotification('Failed to copy to clipboard', 'error');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Ask Questions About Your Documents
        </h2>
        <p className="text-gray-600">
          Use AI to get intelligent answers based on your uploaded documents
        </p>
      </div>

      {/* Question Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
              Your Question
            </label>
            <div className="relative">
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask any question about your uploaded documents..."
                className="input-field resize-none h-24"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !question.trim()}
                className="absolute bottom-3 right-3 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <Loader size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>

      {/* Answer Section */}
      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* AI Answer */}
            <div className="card">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Bot className="text-primary-600" size={16} />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">AI Answer</h3>
                    <button
                      onClick={() => copyToClipboard(answer)}
                      className="flex items-center space-x-1 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check size={16} />
                          <span className="text-sm">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={16} />
                          <span className="text-sm">Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4 text-gray-700 leading-relaxed">
                    {answer}
                  </div>
                </div>
              </div>
            </div>

            {/* Sources */}
            {sources.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <FileText size={20} />
                  <span>Sources</span>
                </h3>
                <div className="space-y-3">
                  {sources.map((source, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <FileText className="text-gray-400" size={16} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {source.filename}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {source.content}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!answer && !loading && documents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card text-center py-12"
        >
          <MessageSquare className="mx-auto text-gray-400" size={64} />
          <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
            No documents to ask about
          </h3>
          <p className="text-gray-600">
            Upload some documents first to start asking questions
          </p>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-12"
        >
          <Loader className="mx-auto animate-spin text-primary-600" size={48} />
          <p className="text-gray-600 mt-4">Analyzing your documents...</p>
        </motion.div>
      )}

      {/* Document Count */}
      {documents.length > 0 && (
        <div className="text-center text-sm text-gray-500">
          <p>
            {documents.length} document{documents.length !== 1 ? 's' : ''} available for questions
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionAnswer; 