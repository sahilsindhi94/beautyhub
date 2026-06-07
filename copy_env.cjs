const { execSync } = require('child_process');
const fs = require('fs');

try {
  console.log("Getting JWKS from dev...");
  const jwks = execSync('npx.cmd convex env get JWKS', { encoding: 'utf8' }).trim();
  
  console.log("Getting JWT_PRIVATE_KEY from dev...");
  const jwtKey = execSync('npx.cmd convex env get JWT_PRIVATE_KEY', { encoding: 'utf8' }).trim();
  
  const envContent = `JWKS='${jwks}'\nJWT_PRIVATE_KEY="${jwtKey.replace(/\r?\n/g, '\\n')}"\nSITE_URL='https://beautyhub-bay.vercel.app'\n`;
  fs.writeFileSync('prod.env', envContent);
  
  console.log("Setting env in prod...");
  execSync('npx.cmd convex env set --from-file prod.env --prod', { stdio: 'inherit' });
  
  console.log("All env vars copied successfully!");
} catch (error) {
  console.error("Error copying env vars:", error);
}
