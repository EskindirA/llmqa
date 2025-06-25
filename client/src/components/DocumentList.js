import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Trash2, Calendar, Eye, EyeOff, Loader } from 'lucide-react';

const DocumentList = ({ documents, loading, onDocumentDeleted, showNotification }) => {
  const [expandedDocs, setExpandedDocs] = useState(new Set());
  const [deletingDocs, setDeletingDocs] = useState(new Set());

  const toggleExpanded = (docId) => {
    const newExpanded = new Set(expandedDocs);
    if (newExpanded.has(docId)) {
      newExpanded.delete(docId);
    } else {
      newExpanded.add(docId);
    }
    setExpandedDocs(newExpanded);
  };

  const handleDelete = async (docId) => {
    if (deletingDocs.has(docId)) return;

    setDeletingDocs(prev => new Set(prev).add(docId));

    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete document');
      }

      onDocumentDeleted(docId);
      showNotification('Document deleted successfully!');

    } catch (error) {
      console.error('Error deleting document:', error);
      showNotification('Error deleting document', 'error');
    } finally {
      setDeletingDocs(prev => {
        const newSet = new Set(prev);
        newSet.delete(docId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="text-red-500" size={20} />;
      case 'docx':
      case 'doc':
        return <FileText className="text-blue-500" size={20} />;
      case 'txt':
      case 'md':
        return <FileText className="text-gray-500" size={20} />;
      default:
        return <FileText className="text-gray-400" size={20} />;
    }
  };

  if (loading) {
    return (
      <div className="card text-center py-12">
        <Loader className="mx-auto animate-spin text-primary-600" size={48} />
        <p className="text-gray-600 mt-4">Loading documents...</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card text-center py-12"
      >
        <FileText className="mx-auto text-gray-400" size={64} />
        <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
          No documents uploaded yet
        </h3>
        <p className="text-gray-600">
          Upload your first document to get started with AI-powered summarization
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Your Documents
        </h2>
        <p className="text-gray-600">
          {documents.length} document{documents.length !== 1 ? 's' : ''} uploaded
        </p>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {documents.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="card hover:shadow-xl transition-shadow duration-200"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getFileIcon(doc.filename)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {doc.filename}
                      </h3>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Calendar size={16} />
                        <span>{formatDate(doc.uploaded_at)}</span>
                      </div>
                    </div>

                    {doc.summary && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900">Summary</h4>
                          <button
                            onClick={() => toggleExpanded(doc.id)}
                            className="flex items-center space-x-1 text-primary-600 hover:text-primary-700 transition-colors"
                          >
                            {expandedDocs.has(doc.id) ? (
                              <>
                                <EyeOff size={16} />
                                <span className="text-sm">Hide</span>
                              </>
                            ) : (
                              <>
                                <Eye size={16} />
                                <span className="text-sm">Show</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        <AnimatePresence>
                          {expandedDocs.has(doc.id) && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="bg-gray-50 rounded-lg p-4 text-gray-700 text-sm leading-relaxed"
                            >
                              {doc.summary}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0 ml-4">
                  <button
                    onClick={() => handleDelete(doc.id)}
                    disabled={deletingDocs.has(doc.id)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Delete document"
                  >
                    {deletingDocs.has(doc.id) ? (
                      <Loader size={20} className="animate-spin" />
                    ) : (
                      <Trash2 size={20} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DocumentList; 