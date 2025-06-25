import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';

const Header = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white shadow-sm border-b border-gray-100"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Brain className="text-primary-600" size={32} />
              <Sparkles 
                className="absolute -top-1 -right-1 text-yellow-500" 
                size={16} 
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">LLMQA</h1>
              <p className="text-sm text-gray-600 -mt-1">AI Text Summarizer</p>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 