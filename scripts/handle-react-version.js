const fs = require('fs');
const path = require('path');

// Check if we're in an EAS build environment
const isEASBuild = process.env.EAS_BUILD === 'true';
const reactOverrideVersion = process.env.REACT_OVERRIDE_VERSION;

if (isEASBuild && reactOverrideVersion) {
  console.log(`EAS build detected, updating React version to ${reactOverrideVersion}`);
  
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = require(packageJsonPath);
  
  // Update React version for EAS build
  packageJson.dependencies.react = reactOverrideVersion;
  // Update react-dom to match
  if (packageJson.devDependencies['react-dom']) {
    packageJson.devDependencies['react-dom'] = reactOverrideVersion;
  }
  
  // Write back to package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  
  console.log('Updated package.json for EAS build with React ' + reactOverrideVersion);
  console.log('Also updated react-dom to match.');
} else {
  // For local development, ensure React Native and React versions match
  const packageJsonPath = path.join(__dirname, '..', 'package.json');
  const packageJson = require(packageJsonPath);
  
  // Get React Native version
  const rnVersion = packageJson.dependencies['react-native'];
  console.log('React Native version:', rnVersion);
  
  // Keep React at 19.0.0 for local development
  packageJson.dependencies.react = '19.0.0';
  if (packageJson.devDependencies['react-dom']) {
    packageJson.devDependencies['react-dom'] = '19.0.0';
  }
  
  // Write back to package.json
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log('Local development: Set React and react-dom to 19.0.0');
}