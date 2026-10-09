import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const {getSql}=await import('../src/lib/db');
const sql=getSql();
if(process.argv[2]==='backup') {
 const fs=await import('node:fs'); fs.mkdirSync('backups',{recursive:true});
 const filename=`backups/tomorrow-${new Date().toISOString().replace(/[:.]/g,'-')}.sqlite`;
 await sql.backup(filename); console.log(`Consistent database backup saved to ${filename}`);
} else console.log('Migrations and idempotent curated seed complete.');
sql.close();
