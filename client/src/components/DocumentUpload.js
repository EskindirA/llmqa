import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, FileText, File, AlertCircle, CheckCircle, Loader } from 'lucide-react';

const DocumentUpload = ({ onDocumentUploaded, showNotification }) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    const formData = new FormData();
    formData.append('document', file);

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      
      // Add the new document to the list
      const newDocument = {
        id: data.documentId,
        filename: data.filename,
        summary: data.summary,
        uploaded_at: new Date().toISOString(),
      };

      onDocumentUploaded(newDocument);
      showNotification('Document processed successfully!');

    } catch (error) {
      console.error('Upload error:', error);
      showNotification(error.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  }, [onDocumentUploaded, showNotification]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
    },
    multiple: false,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="text-red-500" size={24} />;
      case 'docx':
      case 'doc':
        return <FileText className="text-blue-500" size={24} />;
      case 'txt':
      case 'md':
        return <FileText className="text-gray-500" size={24} />;
      default:
        return <File className="text-gray-400" size={24} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Your Document
          </h2>
          <p className="text-gray-600">
            Upload PDF, Word, or text files to analyze and summarize
          </p>
        </div>

        <div
          {...getRootProps()}
          className={`dropzone ${
            isDragActive ? 'dropzone-active' : ''
          } ${uploading ? 'pointer-events-none opacity-50' : ''}`}
        >
          <input {...getInputProps()} />
          
          {uploading ? (
            <div className="space-y-4">
              <Loader className="mx-auto animate-spin text-primary-600" size={48} />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">
                  Processing your document...
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">
                  {uploadProgress}% complete
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload className="mx-auto text-gray-400" size={48} />
              <div>
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                </p>
                <p className="text-gray-600 mb-4">
                  or click to browse
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
                  <span className="px-3 py-1 bg-gray-100 rounded-full">PDF</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">DOCX</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">DOC</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">TXT</span>
                  <span className="px-3 py-1 bg-gray-100 rounded-full">MD</span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Maximum file size: 10MB
                </p>
              </div>
            </div>
          )}
        </div>

        {isDragReject && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="text-red-500" size={20} />
            <span className="text-red-700">
              Invalid file type. Please upload PDF, Word, or text files only.
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <FileText className="text-primary-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Smart Processing</h3>
          <p className="text-gray-600 text-sm">
            Automatically extracts and processes text from various document formats
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Summarization</h3>
          <p className="text-gray-600 text-sm">
            Uses advanced AI to generate concise summaries of your documents
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card text-center"
        >
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Upload className="text-purple-600" size={24} />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Vector Storage</h3>
          <p className="text-gray-600 text-sm">
            Stores documents securely with semantic search capabilities
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default DocumentUpload; 