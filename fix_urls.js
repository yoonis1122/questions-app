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
    
    // Replace 'http://localhost:5000...' with `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}...`
    // We also need to change surrounding single quotes to backticks
    content = content.replace(/'http:\/\/localhost:5000(.*?)'/g, "`\\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");
    
    // For already backticked ones (like with section id)
    content = content.replace(/`http:\/\/localhost:5000(.*?)`/g, "`\\${import.meta.env.VITE_API_URL || 'http://localhost:5000'}$1`");

    fs.writeFileSync(fullPath, content);
    console.log(`Updated ${file}`);
  } else {
    console.log(`Failed to find ${file}`);
  }
});
