const fs = require('fs');
const path = require('path');

console.log('🧪 Testing LLMQA Setup');
console.log('======================');

const tests = [
  {
    name: 'Check package.json files',
    test: () => {
      const files = ['package.json', 'server/package.json', 'client/package.json'];
      return files.every(file => fs.existsSync(file));
    }
  },
  {
    name: 'Check server files',
    test: () => {
      const files = [
        'server/index.js',
        'server/services/documentProcessor.js',
        'server/services/vectorStore.js',
        'server/services/llmService.js',
        'server/supabase-setup.sql',
        'server/env.example'
      ];
      return files.every(file => fs.existsSync(file));
    }
  },
  {
    name: 'Check client files',
    test: () => {
      const files = [
        'client/package.json',
        'client/src/App.js',
        'client/src/index.js',
        'client/src/index.css',
        'client/src/components/Header.js',
        'client/src/components/DocumentUpload.js',
        'client/src/components/DocumentList.js',
        'client/src/components/QuestionAnswer.js',
        'client/tailwind.config.js',
        'client/postcss.config.js',
        'client/public/index.html'
      ];
      return files.every(file => fs.existsSync(file));
    }
  },
  {
    name: 'Check Node.js version',
    test: () => {
      const version = process.version;
      const majorVersion = parseInt(version.slice(1).split('.')[0]);
      return majorVersion >= 16;
    }
  },
  {
    name: 'Check directories exist',
    test: () => {
      const dirs = ['server', 'client', 'server/services', 'client/src', 'client/src/components'];
      return dirs.every(dir => fs.existsSync(dir) && fs.statSync(dir).isDirectory());
    }
  }
];

let passed = 0;
let failed = 0;

tests.forEach(({ name, test }) => {
  try {
    const result = test();
    if (result) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  } catch (error) {
    console.log(`❌ ${name} - Error: ${error.message}`);
    failed++;
  }
});

console.log('\n📊 Test Results');
console.log('===============');
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${tests.length}`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Your setup looks good.');
  console.log('\n📋 Next steps:');
  console.log('1. Run: ./setup.sh (or npm install in each directory)');
  console.log('2. Set up Supabase and configure .env');
  console.log('3. Start the app with: npm run dev');
} else {
  console.log('\n⚠️  Some tests failed. Please check the missing files.');
}

console.log('\n🔗 Useful commands:');
console.log('- npm run dev          # Start both server and client');
console.log('- npm run server       # Start only the server');
console.log('- npm run client       # Start only the client');
console.log('- npm run build        # Build the client for production'); 