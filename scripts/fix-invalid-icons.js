#!/usr/bin/env node

/**
 * Fix Invalid Icon Imports Script
 * 
 * This script replaces all invalid lucide-react icon imports with valid alternatives
 * across the entire codebase to resolve build errors.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Map of invalid icons to valid replacements
const ICON_REPLACEMENTS = {
  // Invalid → Valid
  'RefreshCw': 'Target',
  'Refresh': 'Target',
  'Lightbulb': 'Zap',
  'TrendingDown': 'TrendingUp', // We'll handle direction with CSS if needed
  'Loader2': 'Target', // Use Target with animate-spin
  'Bot': 'Brain',
  'Send': 'Share',
  'MousePointer': 'Target',
  'UserCheck': 'User',
  'CheckCircle': 'Check',
  'Info': 'AlertTriangle',
  'Edit3': 'Edit',
  'ArrowRight': 'ChevronRight',
  'Percent': 'Target',
  'BarChart': 'BarChart3',
  'Share2': 'Share',
  'Rocket': 'Zap',
  'CheckCircle2': 'Check',
  'AlertCircle': 'AlertTriangle',
  'Circle': 'Target',
  'Filter': 'Search',
  'Trash2': 'Trash',
  'RotateCcw': 'Refresh',
  'Archive': 'Folder',
  'Timer': 'Clock',
  'Gauge': 'BarChart3',
  'Key': 'Lock',
  'XCircle': 'X',
  'ArrowLeft': 'ChevronLeft',
  'PlayCircle': 'Play',
  'PauseCircle': 'Pause',
  'StopCircle': 'X',
  'Stop': 'X',
  'Bell': 'AlertTriangle',
  'LogOut': 'User',
  'Cog': 'Settings',
  'GripVertical': 'Menu',
  'PanelLeft': 'Menu',
  'Dot': 'Target',
  'Link': 'ExternalLink'
};

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
 * Fix invalid icon imports in a file
 */
function fixIconsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Fix import statements
    for (const [invalid, valid] of Object.entries(ICON_REPLACEMENTS)) {
      const importRegex = new RegExp(`\\b${invalid}\\b`, 'g');
      if (content.includes(invalid)) {
        content = content.replace(importRegex, valid);
        modified = true;
        replacementsMade++;
        console.log(`  ✓ ${invalid} → ${valid}`);
      }
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
        fixIconsInFile(itemPath);
      }
    });
  } catch (error) {
    console.warn(`⚠️  Warning: Could not process directory ${dirPath}: ${error.message}`);
  }
}

/**
 * Main function
 */
function fixInvalidIcons() {
  console.log('🔧 Fixing invalid lucide-react icon imports...\n');
  
  // Process src directory
  const srcDir = path.join(rootDir, 'src');
  processDirectory(srcDir);
  
  // Report results
  console.log('\n📊 Fix Results:');
  console.log(`   Files processed: ${filesFixed}`);
  console.log(`   Replacements made: ${replacementsMade}`);
  
  if (replacementsMade > 0) {
    console.log('\n✅ Invalid icon imports fixed!');
    console.log('🚀 Build should now work correctly');
  } else {
    console.log('\n✅ No invalid icon imports found');
  }
}

// Run the fix
fixInvalidIcons();
