const fs = require('fs');
const path = require('path');

// List of files to process
const filesToProcess = [
  'src/app/api/restaurants/[restaurantId]/route.ts',
  'src/app/api/restaurants/[restaurantId]/menu-items/route.ts',
  'src/app/api/menu-items/[itemId]/route.ts',
  'src/app/api/orders/[orderId]/route.ts'
];

// Function to process each file
function processFile(filePath) {
  const fullPath = path.join(process.cwd(), filePath);
  
  // Check if file exists
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`);
    return;
  }
  
  // Read file content
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace all instances of extracting params without awaiting
  const regex = /const\s*\{\s*(\w+)\s*\}\s*=\s*params\s*;/g;
  const replacement = 'const { $1 } = await Promise.resolve(params);';
  
  // Apply the replacement
  const newContent = content.replace(regex, replacement);
  
  // Write the updated content back to the file
  if (content !== newContent) {
    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
  } else {
    console.log(`No changes needed for: ${filePath}`);
  }
}

// Process all files
filesToProcess.forEach(processFile);

console.log('Dynamic route handler fixes completed!');
