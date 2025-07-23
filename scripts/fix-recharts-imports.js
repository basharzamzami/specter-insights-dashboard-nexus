#!/usr/bin/env node

/**
 * Fix Recharts BarChart3 Imports Script
 * 
 * This script fixes the incorrect BarChart3 imports from recharts
 * (should be BarChart) while preserving BarChart3 from lucide-react
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

let filesFixed = 0;
let replacementsMade = 0;

/**
 * Check if file should be processed
 */
function shouldProcessFile(filePath) {
  return (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) && 
         !filePath.includes('node_modules') &&
         !filePath.includes('.git');
}

/**
 * Fix recharts BarChart3 imports in a file
 */
function fixRechartsImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix recharts import statements - replace BarChart3 with BarChart in recharts imports
    const rechartsImportRegex = /import\s*{([^}]+)}\s*from\s*['"]recharts['"];?/g;
    content = content.replace(rechartsImportRegex, (match, imports) => {
      if (imports.includes('BarChart3')) {
        const fixedImports = imports.replace(/\bBarChart3\b/g, 'BarChart');
        modified = true;
        replacementsMade++;
        console.log(`  ✓ Fixed recharts import: BarChart3 → BarChart`);
        return match.replace(imports, fixedImports);
      }
      return match;
    });
    
    // Fix JSX usage - replace <BarChart3> with <BarChart> but only in recharts context
    // Look for patterns where BarChart3 is used as a component (not as an icon)
    const jsxBarChart3Regex = /<BarChart3(\s+[^>]*)?>/g;
    content = content.replace(jsxBarChart3Regex, (match) => {
      // Check if this is likely a recharts component (has data prop)
      if (match.includes('data=')) {
        modified = true;
        replacementsMade++;
        console.log(`  ✓ Fixed JSX component: <BarChart3> → <BarChart>`);
        return match.replace('BarChart3', 'BarChart');
      }
      return match;
    });
    
    // Fix closing tags
    const closingTagRegex = /<\/BarChart3>/g;
    if (content.match(closingTagRegex)) {
      content = content.replace(closingTagRegex, '</BarChart>');
      modified = true;
      replacementsMade++;
      console.log(`  ✓ Fixed closing tag: </BarChart3> → </BarChart>`);
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      filesFixed++;
      console.log(`📝 Fixed: ${path.relative(rootDir, filePath)}`);
    }
    
  } catch (error) {
    console.warn(`⚠️  Warning: Could not process file ${filePath}: ${error.message}`);
  }
}

/**
 * Recursively process directory
 */
function processDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      
      // Skip irrelevant directories
      if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'build') {
        return;
      }
      
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        processDirectory(itemPath);
      } else if (stat.isFile() && shouldProcessFile(itemPath)) {
        fixRechartsImports(itemPath);
      }
    });
  } catch (error) {
    console.warn(`⚠️  Warning: Could not process directory ${dirPath}: ${error.message}`);
  }
}

/**
 * Main function
 */
function fixRechartsBarChart3() {
  console.log('🔧 Fixing recharts BarChart3 imports...\n');
  
  // Process src directory
  const srcDir = path.join(rootDir, 'src');
  processDirectory(srcDir);
  
  // Report results
  console.log('\n📊 Fix Results:');
  console.log(`   Files processed: ${filesFixed}`);
  console.log(`   Replacements made: ${replacementsMade}`);
  
  if (replacementsMade > 0) {
    console.log('\n✅ Recharts BarChart3 imports fixed!');
    console.log('🚀 Build should now work correctly');
  } else {
    console.log('\n✅ No recharts BarChart3 issues found');
  }
}

// Run the fix
fixRechartsBarChart3();
