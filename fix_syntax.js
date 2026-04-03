const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'frontend/src/pages/Home.jsx',
  'frontend/src/pages/Quiz.jsx',
  'frontend/src/pages/Result.jsx',
  'admin/src/pages/Dashboard.jsx'
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Fix the escaped $ from previous script error
    content = content.replace(/\\\$\{import\.meta\.env\.VITE_API_URL/g, "${import.meta.env.VITE_API_URL");
    
    fs.writeFileSync(fullPath, content);
  }
});
