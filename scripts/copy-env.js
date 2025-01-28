const fs = require('fs');
const path = require('path');

// Path to root .env.local
const rootEnvPath = path.join(__dirname, '..', '.env.local');

// Paths to app .env.local files
const appEnvPaths = [
  path.join(__dirname, '..', 'apps', 'e-services', '.env.local'),
  path.join(__dirname, '..', 'apps', 'theme', '.env.local')
];

try {
  // Read root .env.local
  const rootEnv = fs.readFileSync(rootEnvPath, 'utf8');
  
  // Copy to each app
  appEnvPaths.forEach(envPath => {
    fs.writeFileSync(envPath, rootEnv);
    console.log(`Copied .env.local to ${envPath}`);
  });

  console.log('Environment files synchronized successfully!');
} catch (error) {
  console.error('Error copying environment files:', error);
  process.exit(1);
}