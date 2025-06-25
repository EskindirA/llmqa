import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, FileText, MessageSquare, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import DocumentUpload from './components/DocumentUpload';
import DocumentList from './components/DocumentList';
import QuestionAnswer from './components/QuestionAnswer';
import Header from './components/Header';

function App() {
  const [activeTab, setActiveTab] = useState('upload');
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents');
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Error fetching documents:', error);
      showNotification('Error fetching documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleDocumentUploaded = (newDocument) => {
    setDocuments(prev => [newDocument, ...prev]);
    showNotification('Document uploaded successfully!');
    setActiveTab('documents');
  };

  const handleDocumentDeleted = (documentId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== documentId));
    showNotification('Document deleted successfully!');
  };

  const tabs = [
    { id: 'upload', label: 'Upload Document', icon: Upload },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'qa', label: 'Ask Questions', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
              notification.type === 'error' 
                ? 'bg-red-500 text-white' 
                : 'bg-green-500 text-white'
            }`}
          >
            {notification.type === 'error' ? (
              <AlertCircle size={20} />
            ) : (
              <CheckCircle size={20} />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 hover:opacity-70"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="flex bg-white rounded-xl shadow-lg p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {activeTab === 'upload' && (
            <DocumentUpload 
              onDocumentUploaded={handleDocumentUploaded}
              showNotification={showNotification}
            />
          )}
          
          {activeTab === 'documents' && (
            <DocumentList 
              documents={documents}
              loading={loading}
              onDocumentDeleted={handleDocumentDeleted}
              showNotification={showNotification}
            />
          )}
          
          {activeTab === 'qa' && (
            <QuestionAnswer 
              documents={documents}
              showNotification={showNotification}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default App; 