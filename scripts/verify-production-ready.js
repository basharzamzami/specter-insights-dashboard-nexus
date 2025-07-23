#!/usr/bin/env node

/**
 * Production Readiness Verification Script
 * 
 * This script verifies that all demo data has been removed and the application
 * is ready for production deployment.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Demo data patterns to check for (excluding legitimate placeholders)
const DEMO_PATTERNS = [
  /demo@/gi,
  /john\.doe/gi,
  /jane\.smith/gi,
  /test@example\.com/gi,
  /populateWithDemoData/gi,
  /demoTasks/gi,
  /demoSocialPosts/gi,
  /demoAppointments/gi,
  /demoEmailCampaigns/gi,
  /mockMessages/gi,
  /mockCampaigns/gi,
  /fake.*user/gi
];

// Files to exclude from checking
const EXCLUDE_FILES = [
  'node_modules',
  '.git',
  'dist',
  'build',
  '.env.production.example',
  'PRODUCTION_DEPLOYMENT.md',
  'README.md',
  'verify-production-ready.js',
  'package-lock.json',
  'yarn.lock',
  'supabase/migrations', // Old migrations may contain demo data references
  'MIGRATION_SUMMARY.md'
];

// File extensions to check
const CHECK_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx', '.sql', '.json'];

let issues = [];
let filesChecked = 0;

/**
 * Check if file should be excluded
 */
function shouldExcludeFile(filePath) {
  return EXCLUDE_FILES.some(exclude => filePath.includes(exclude));
}

/**
 * Check if file extension should be checked
 */
function shouldCheckFile(filePath) {
  return CHECK_EXTENSIONS.some(ext => filePath.endsWith(ext));
}

/**
 * Scan file for demo patterns
 */
function scanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach((line, lineNumber) => {
      DEMO_PATTERNS.forEach(pattern => {
        if (pattern.test(line)) {
          issues.push({
            file: filePath,
            line: lineNumber + 1,
            content: line.trim(),
            pattern: pattern.source
          });
        }
      });
    });
    
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
      
      if (shouldExcludeFile(itemPath)) {
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
 * Check for required production files
 */
function checkRequiredFiles() {
  const requiredFiles = [
    'PRODUCTION_DEPLOYMENT.md',
    '.env.production.example',
    'src/services/competitorAnalysis.ts',
    'src/services/onboardingProcessor.ts',
    'src/services/analyticsService.ts',
    'src/services/apiIntegrations.ts',
    'src/services/realTimeDataCollector.ts',
    'src/utils/dataUtils.ts',
    'supabase/migrations/20250723000000-remove-demo-data.sql'
  ];
  
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(file);
    }
  });
  
  return missingFiles;
}

/**
 * Check package.json for production readiness
 */
function checkPackageJson() {
  const packageJsonPath = path.join(rootDir, 'package.json');
  const packageIssues = [];
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    // Check for production build script
    if (!packageJson.scripts || !packageJson.scripts['build:production']) {
      packageIssues.push('Missing build:production script in package.json');
    }
    
    // Check for proper name
    if (packageJson.name === 'vite_react_shadcn_ts') {
      packageIssues.push('Package name still uses template default');
    }
    
    // Check version
    if (packageJson.version === '0.0.0') {
      packageIssues.push('Package version should be updated for production');
    }
    
  } catch (error) {
    packageIssues.push(`Could not read package.json: ${error.message}`);
  }
  
  return packageIssues;
}

/**
 * Main verification function
 */
function verifyProductionReadiness() {
  console.log('🔍 Verifying production readiness...\n');
  
  // Check for demo patterns in code
  console.log('📁 Scanning files for demo data patterns...');
  scanDirectory(rootDir);
  
  // Check for required files
  console.log('📋 Checking for required production files...');
  const missingFiles = checkRequiredFiles();
  
  // Check package.json
  console.log('📦 Checking package.json configuration...');
  const packageIssues = checkPackageJson();
  
  // Report results
  console.log(`\n📊 Verification Results:`);
  console.log(`   Files checked: ${filesChecked}`);
  console.log(`   Demo patterns found: ${issues.length}`);
  console.log(`   Missing required files: ${missingFiles.length}`);
  console.log(`   Package.json issues: ${packageIssues.length}`);
  
  // Report issues
  if (issues.length > 0) {
    console.log('\n❌ Demo Data Issues Found:');
    issues.forEach(issue => {
      console.log(`   ${issue.file}:${issue.line} - ${issue.content}`);
    });
  }
  
  if (missingFiles.length > 0) {
    console.log('\n❌ Missing Required Files:');
    missingFiles.forEach(file => {
      console.log(`   ${file}`);
    });
  }
  
  if (packageIssues.length > 0) {
    console.log('\n❌ Package.json Issues:');
    packageIssues.forEach(issue => {
      console.log(`   ${issue}`);
    });
  }
  
  // Final verdict
  const totalIssues = issues.length + missingFiles.length + packageIssues.length;
  
  if (totalIssues === 0) {
    console.log('\n✅ Production Ready!');
    console.log('🚀 All demo data removed and production files in place.');
    console.log('📋 Ready for deployment to Vercel.');
    process.exit(0);
  } else {
    console.log(`\n❌ Production Not Ready (${totalIssues} issues found)`);
    console.log('🔧 Please fix the issues above before deploying to production.');
    process.exit(1);
  }
}

// Run verification
verifyProductionReadiness();
