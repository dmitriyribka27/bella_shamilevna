// Run locally: node scripts/create-admin-password.mjs
// Prompts for password without printing it; outputs only the PBKDF2 verifier for Cloudflare secrets.
import {createInterface} from 'node:readline';
import {randomBytes,pbkdf2Sync} from 'node:crypto';
const rl=createInterface({input:process.stdin,output:process.stdout});
const password=await new Promise(resolve=>rl.question('Choose admin password (at least 16 characters): ',resolve));
rl.close();
if(password.length<16){console.error('Password too short.');process.exitCode=1;}
else {const salt=randomBytes(16);const hash=pbkdf2Sync(password,salt,310000,32,'sha256');console.log('\nADMIN_PASSWORD_HASH=pbkdf2-sha256$310000$'+salt.toString('hex')+'$'+hash.toString('hex'));console.log('Store this value as an encrypted Cloudflare secret. Never commit it.');}
