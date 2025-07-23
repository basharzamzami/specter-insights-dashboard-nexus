#!/usr/bin/env node

/**
 * Icon Import Verification Script
 * 
 * This script verifies that all lucide-react icon imports are valid
 * to prevent build failures due to non-existent icons.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Critical build-breaking icons that must be avoided
const CRITICAL_INVALID_ICONS = [
  'Scope', // Known to cause build failures
  'Aim', // Non-existent
  'Sniper', // Non-existent
  'Weapon', // Non-existent
  'Attack', // Non-existent
];

let issues = [];
let filesChecked = 0;

/**
 * Check if file should be scanned
 */
function shouldCheckFile(filePath) {
  return filePath.endsWith('.tsx') || filePath.endsWith('.ts');
}

/**
 * Extract lucide-react imports from file content
 */
function extractLucideImports(content, filePath) {
  const importRegex = /import\s*{([^}]+)}\s*from\s*['"]lucide-react['"];?/g;
  const matches = [...content.matchAll(importRegex)];
  
  const imports = [];
  matches.forEach(match => {
    const importList = match[1];
    const icons = importList
      .split(',')
      .map(icon => icon.trim())
      .filter(icon => icon.length > 0);
    
    imports.push(...icons);
  });
  
  return imports;
}

/**
 * Scan file for invalid lucide-react imports
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const imports = extractLucideImports(content, filePath);
    
    if (imports.length > 0) {
      const criticalInvalidImports = imports.filter(icon => CRITICAL_INVALID_ICONS.includes(icon));

      if (criticalInvalidImports.length > 0) {
        issues.push({
          file: filePath,
          invalidIcons: criticalInvalidImports,
          allIcons: imports
        });
      }
    }
    
    filesChecked++;
  } catch (error) {
    console.warn(`Warning: Could not read file ${filePath}: ${error.message}`);
  }
}

/**
 * Recursively scan directory
 */
function scanDirectory(dirPath) {
  try {
    const items = fs.readdirSync(dirPath);
    
    items.forEach(item => {
      const itemPath = path.join(dirPath, item);
      
      // Skip node_modules and other irrelevant directories
      if (item === 'node_modules' || item === '.git' || item === 'dist' || item === 'build') {
        return;
      }
      
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory()) {
        scanDirectory(itemPath);
      } else if (stat.isFile() && shouldCheckFile(itemPath)) {
        scanFile(itemPath);
      }
    });
  } catch (error) {
    console.warn(`Warning: Could not scan directory ${dirPath}: ${error.message}`);
  }
}

/**
 * Main verification function
 */
function verifyIconImports() {
  console.log('🔍 Verifying lucide-react icon imports...\n');
  
  // Scan src directory
  const srcDir = path.join(rootDir, 'src');
  scanDirectory(srcDir);
  
  // Report results
  console.log(`📊 Verification Results:`);
  console.log(`   Files checked: ${filesChecked}`);
  console.log(`   Critical invalid icon imports: ${issues.length}`);
  
  if (issues.length > 0) {
    console.log('\n❌ Critical Invalid Icon Imports Found:');
    issues.forEach(issue => {
      console.log(`\n   File: ${issue.file}`);
      console.log(`   Invalid icons: ${issue.invalidIcons.join(', ')}`);
      console.log(`   All icons: ${issue.allIcons.join(', ')}`);
      console.log(`   Suggestion: Replace invalid icons with valid alternatives`);
    });
    
    console.log('\n💡 Common valid alternatives:');
    console.log('   Scope → Focus, Target, Crosshair');
    console.log('   Aim → Target, Crosshair, Focus');
    console.log('   Sniper → Target, Focus, Eye');
    
    console.log('\n❌ Icon verification failed');
    console.log('🔧 Please fix the invalid icon imports before deploying');
    process.exit(1);
  } else {
    console.log('\n✅ All icon imports are valid!');
    console.log('🚀 Ready for deployment');
    process.exit(0);
  }
}

// Run verification
verifyIconImports();
